import React, { useState, useMemo } from 'react';
import { Search, Plus, Building2, Save } from 'lucide-react';
import { useOrgs } from '../hooks/useSystem';
import { DataTable, Column } from '../components/common/DataTable';
import { Organization } from '../models/system';
import { OrgModal } from '../components/system/OrgModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { systemService } from '../services/systemService';

export default function OrgMgmt() {
  const { data, loading, refetch } = useOrgs();
  const [filters, setFilters] = useState({ keyword: '', status: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Organization | null>(null);
  
  const [localOrders, setLocalOrders] = useState<Record<string, number>>({});
  const [isSavingOrder, setIsSavingOrder] = useState(false);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    type?: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAdd = () => {
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Organization) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record: Organization) => {
    setConfirmState({
      isOpen: true,
      title: '删除确认',
      message: <>确定要删除组织 <strong>{record.name}</strong> 吗？删除后该组织下的子组织及成员账号将受到影响。</>,
      type: 'danger',
      onConfirm: () => {
        closeConfirm();
        showToastMsg(`删除组织 ${record.name} 成功`);
        refetch();
      }
    });
  };

  const handleModalSuccess = (formData: Partial<Organization>) => {
    setIsModalOpen(false);
    showToastMsg(editingRecord ? `编辑组织 ${formData.name} 成功` : `新建组织 ${formData.name} 成功`);
    refetch(); // In real app, we would wait for API then refetch
  };

  const handleSaveOrders = async () => {
    const ordersToSave = Object.keys(localOrders).map(id => ({
      id,
      order: localOrders[id]
    }));
    
    if (ordersToSave.length === 0) {
      showToastMsg('没有需要保存的排序修改');
      return;
    }
    
    setIsSavingOrder(true);
    try {
      await systemService.updateOrgsOrder(ordersToSave);
      showToastMsg('保存排序成功');
      setLocalOrders({});
      refetch();
    } catch (e) {
      showToastMsg('保存排序失败');
    } finally {
      setIsSavingOrder(false);
    }
  };

  // Process data to add depth for tree visualization
  const treeData = useMemo(() => {
    const buildTree = (parentId: string | null, depth: number): (Organization & { depth: number })[] => {
      let result: (Organization & { depth: number })[] = [];
      const children = data.filter(item => item.parentId === parentId);
      
      // Sort children by localOrder if available, otherwise by original order
      children.sort((a, b) => {
        const orderA = localOrders[a.id] ?? a.order ?? 0;
        const orderB = localOrders[b.id] ?? b.order ?? 0;
        return orderB - orderA;
      });
      
      for (const child of children) {
        result.push({ ...child, depth });
        result = result.concat(buildTree(child.id, depth + 1));
      }
      return result;
    };
    
    // Fallback search filter applies flatly
    if (filters.keyword || filters.status) {
      return data
        .filter(d => {
          const matchKeyword = !filters.keyword || d.name.includes(filters.keyword);
          const matchStatus = !filters.status || d.status === filters.status;
          return matchKeyword && matchStatus;
        })
        .map(d => ({...d, depth: 0}));
    }
    
    return buildTree(null, 0);
  }, [data, filters.keyword, filters.status, localOrders]);

  const columns: Column<Organization & { depth: number }>[] = [
    { 
      title: '组织名称', 
      key: 'name', 
      dataIndex: 'name', 
      className: 'font-medium text-slate-900',
      render: (name: string, record) => {
        return (
          <div 
            className="flex items-center gap-3" 
            style={{ paddingLeft: `${record.depth * 24}px` }}
          >
            {record.depth === 0 ? <Building2 size={16} className="text-blue-500" /> : <div className="w-4 border-b border-l border-slate-300 h-4 -mt-2 rounded-bl opacity-50" />}
            <span>{name}</span>
          </div>
        );
      }
    },
    { 
      title: '排序', 
      key: 'order', 
      dataIndex: 'order', 
      className: 'w-32',
      render: (_, record) => {
        const currentOrder = localOrders[record.id] ?? record.order ?? 0;
        return (
          <input 
            type="number" 
            value={currentOrder}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              if (!isNaN(val)) {
                setLocalOrders(prev => ({ ...prev, [record.id]: val }));
              }
            }}
            className="w-16 px-2 py-1 text-xs border border-slate-200 rounded text-center focus:outline-none focus:border-blue-500 transition-colors"
          />
        );
      }
    },
    { 
      title: '状态', 
      key: 'status', 
      dataIndex: 'status',
      render: (status: string, record) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={async () => {
              const newStatus = status === '启用' ? '停用' : '启用';
              await systemService.updateOrgStatus(record.id, newStatus);
              showToastMsg(`已${newStatus}该组织`);
              refetch();
            }}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${status === '启用' ? 'bg-blue-500' : 'bg-slate-200'}`}
          >
            <span className="sr-only">Toggle status</span>
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute left-0.5 top-0.5 h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${status === '启用' ? 'translate-x-4' : 'translate-x-0'}`}
            />
          </button>
          <span className={`text-xs ${status === '启用' ? 'text-green-600' : 'text-slate-500'}`}>{status}</span>
        </div>
      )
    },
    { title: '创建时间', key: 'createTime', dataIndex: 'createTime', className: 'text-slate-500 text-xs' },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 160,
      className: 'text-right',
      headerClassName: 'text-right',
      render: (_, record) => (
        <div className="flex items-center justify-end gap-3 text-xs font-bold">
          <button 
            onClick={() => {
              setEditingRecord({ name: '', parentId: record.id, id: '', createTime: '', status: '启用', order: 0 });
              setIsModalOpen(true);
            }}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            添加下级
          </button>
          <button 
            onClick={() => handleEdit(record as Organization)}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            编辑
          </button>
          <button 
            onClick={() => handleDelete(record as Organization)}
            className="text-red-600 hover:text-red-700 transition-colors"
          >
            删除
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">组织管理</h1>
          <p className="text-sm text-slate-500 mt-1">管理公司企业架构及部门层级</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveOrders}
            disabled={isSavingOrder || Object.keys(localOrders).length === 0}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSavingOrder ? (
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={16} />
            )}
            保存排序
          </button>
          <button 
            onClick={handleAdd}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-blue-200"
          >
            <Plus size={16} />
            新建组织
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="搜索组织名称" 
            value={filters.keyword}
            onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <select 
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">全部状态</option>
            <option value="启用">启用</option>
            <option value="停用">停用</option>
          </select>
          <div className="flex items-center gap-3 md:col-span-2">
            <button 
              onClick={() => setFilters({ keyword: '', status: '' })}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
            >
              重置
            </button>
            <button 
              className="px-4 py-2 text-sm font-bold text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600 transition-all shadow-sm shadow-blue-200 flex items-center gap-1.5"
            >
              <Search size={16} className="text-blue-100" />
              搜索
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <DataTable
          columns={columns}
          data={treeData}
          loading={loading}
          rowKey="id"
          emptyText="暂无组织数据"
          minWidth="800px"
        />
      </div>

      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg border border-slate-700 font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300">
          {toastMessage}
        </div>
      )}

      <OrgModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        editData={editingRecord}
      />
      
      <ConfirmModal
        {...confirmState}
        onCancel={closeConfirm}
      />
    </div>
  );
}
