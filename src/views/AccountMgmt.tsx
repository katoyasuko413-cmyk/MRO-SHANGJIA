import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useAccounts } from '../hooks/useSystem';
import { DataTable, Column } from '../components/common/DataTable';
import { Account } from '../models/system';
import { AccountModal } from '../components/system/AccountModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Pagination } from '../components/common/Pagination';

export default function AccountMgmt() {
  const { data, loading, refetch } = useAccounts();
  const [filters, setFilters] = useState({ keyword: '', role: '', status: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Account | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const handleEdit = (record: Account) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record: Account) => {
    setConfirmState({
      isOpen: true,
      title: '删除确认',
      message: <>确定要删除账号 <strong>{record.name}</strong> 吗？此操作不可恢复。</>,
      type: 'danger',
      onConfirm: () => {
        closeConfirm();
        showToastMsg(`删除账号 ${record.name} 成功`);
        refetch();
      }
    });
  };

  const handleToggleStatus = (record: Account) => {
    const isNormal = record.status === '正常';
    setConfirmState({
      isOpen: true,
      title: isNormal ? '禁用确认' : '启用确认',
      message: <>确定要{isNormal ? '禁用' : '启用'}账号 <strong>{record.name}</strong> 吗？</>,
      type: 'warning',
      onConfirm: () => {
        closeConfirm();
        showToastMsg(`${isNormal ? '禁用' : '启用'}账号 ${record.name} 成功`);
        refetch();
      }
    });
  };

  const handleModalSuccess = (formData: Partial<Account>) => {
    setIsModalOpen(false);
    showToastMsg(editingRecord ? `编辑账号 ${formData.name} 成功` : `新建账号 ${formData.name} 成功`);
    refetch(); // In real app, we would wait for API then refetch
  };

  const handleResetPassword = (record: Account) => {
    setConfirmState({
      isOpen: true,
      title: '重置密码确认',
      message: <>确定要重置账号 <strong>{record.name}</strong> 的密码吗？重置后将变为默认密码。</>,
      type: 'warning',
      onConfirm: () => {
        closeConfirm();
        showToastMsg(`重置账号 ${record.name} 的密码成功`);
        refetch();
      }
    });
  };

  const getStatusBadge = (status: string) => {
    return status === '正常' 
      ? <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium">正常</span>
      : <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-medium">停用</span>;
  };

  const columns: Column<Account>[] = [
    { title: '姓名', key: 'name', dataIndex: 'name', className: 'font-medium text-slate-900' },
    { title: '手机号', key: 'phone', dataIndex: 'phone', className: 'text-slate-600' },
    { title: '所属组织', key: 'orgName', dataIndex: 'orgName', className: 'text-slate-600' },
    { 
      title: '服务客户', 
      key: 'serviceCustomer', 
      dataIndex: 'serviceCustomer',
      render: (val?: string) => {
        if (!val) return <span className="text-slate-400 font-normal">-</span>;
        const customers = val.split(',').map(s => s.trim()).filter(Boolean);
        return (
          <div className="flex flex-wrap gap-1">
            {customers.map((c, idx) => (
              <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold">
                {c}
              </span>
            ))}
          </div>
        );
      }
    },
    { 
      title: '角色', 
      key: 'roleName', 
      dataIndex: 'roleName',
      render: (role: string) => <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs">{role}</span>
    },
    { 
      title: '状态', 
      key: 'status', 
      dataIndex: 'status',
      render: (status: string) => getStatusBadge(status)
    },
    { title: '创建时间', key: 'createTime', dataIndex: 'createTime', className: 'text-slate-500 text-xs' },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 180,
      className: 'text-right',
      headerClassName: 'text-right',
      render: (_, record: Account) => {
        const isSystemAdmin = record.roleName === '系统管理员' || record.roleName === '超级管理员';
        return (
          <div className="flex items-center justify-end gap-3 text-xs font-bold">
            <button 
              onClick={() => handleResetPassword(record)}
              className="text-blue-600 hover:text-blue-700 transition-colors"
            >
              重置密码
            </button>
            {!isSystemAdmin && (
              <>
                <button 
                  onClick={() => handleEdit(record)}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  编辑
                </button>
                <button 
                  onClick={() => handleToggleStatus(record)}
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {record.status === '正常' ? '禁用' : '启用'}
                </button>
                <button 
                  onClick={() => handleDelete(record)}
                  className="text-red-600 hover:text-red-700 transition-colors"
                >
                  删除
                </button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">账号管理</h1>
          <p className="text-sm text-slate-500 mt-1">管理系统后台登录账号及权限分配</p>
        </div>
        
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-blue-200"
        >
          <Plus size={16} />
          新建账号
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input 
            type="text" 
            placeholder="搜索姓名/手机号" 
            value={filters.keyword}
            onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <select 
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
            value={filters.role}
            onChange={(e) => setFilters({...filters, role: e.target.value})}
          >
            <option value="">全部角色</option>
            <option value="超级管理员">超级管理员</option>
            <option value="业务运营">业务运营</option>
            <option value="财务审批">财务审批</option>
          </select>
          <select 
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">全部状态</option>
            <option value="正常">正常</option>
            <option value="停用">停用</option>
          </select>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setFilters({ keyword: '', role: '', status: '' })}
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
          data={data}
          loading={loading}
          rowKey="id"
          emptyText="暂无账号数据"
          minWidth="1000px"
        />
        
        {/* Pagination placeholder */}
        {!loading && data.length > 0 && (
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={data.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            itemName="条数据"
          />
        )}
      </div>

      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg border border-slate-700 font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300">
          {toastMessage}
        </div>
      )}

      <AccountModal
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
