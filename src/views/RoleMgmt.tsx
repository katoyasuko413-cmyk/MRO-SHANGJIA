import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useRoles } from '../hooks/useSystem';
import { DataTable, Column } from '../components/common/DataTable';
import { Role } from '../models/system';
import { RoleModal } from '../components/system/RoleModal';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { RolePermissionModal } from '../components/system/RolePermissionModal';
import { Pagination } from '../components/common/Pagination';

export default function RoleMgmt() {
  const { data, loading, refetch } = useRoles();
  const [filters, setFilters] = useState({ keyword: '', status: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Role | null>(null);

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionRole, setPermissionRole] = useState<Role | null>(null);

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

  const handleEdit = (record: Role) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleConfigPermissions = (record: Role) => {
    setPermissionRole(record);
    setIsPermissionModalOpen(true);
  };

  const handlePermissionSuccess = (roleId: string, perms: string[]) => {
    setIsPermissionModalOpen(false);
    showToastMsg(`成功更新角色权限`);
  };

  const handleDelete = (record: Role) => {
    setConfirmState({
      isOpen: true,
      title: '删除确认',
      message: <>确定要删除角色 <strong>{record.name}</strong> 吗？删除后绑定此角色的用户将失去相应权限。</>,
      type: 'danger',
      onConfirm: () => {
        closeConfirm();
        showToastMsg(`删除角色 ${record.name} 成功`);
        refetch();
      }
    });
  };

  const handleToggleStatus = (record: Role) => {
    const isNormal = record.status === '正常';
    setConfirmState({
      isOpen: true,
      title: isNormal ? '禁用确认' : '启用确认',
      message: <>确定要{isNormal ? '禁用' : '启用'}角色 <strong>{record.name}</strong> 吗？</>,
      type: 'warning',
      onConfirm: () => {
        closeConfirm();
        showToastMsg(`${isNormal ? '禁用' : '启用'}角色 ${record.name} 成功`);
        refetch();
      }
    });
  };

  const handleModalSuccess = (formData: Partial<Role>) => {
    setIsModalOpen(false);
    showToastMsg(editingRecord ? `编辑角色 ${formData.name} 成功` : `新建角色 ${formData.name} 成功`);
    refetch(); // In real app, we would wait for API then refetch
  };

  const getStatusBadge = (status: string) => {
    return status === '正常' 
      ? <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium">正常</span>
      : <span className="px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-xs font-medium">停用</span>;
  };

  const columns: Column<Role>[] = [
    { title: '角色名称', key: 'name', dataIndex: 'name', className: 'font-medium text-slate-900' },
    { title: '角色编码', key: 'code', dataIndex: 'code', className: 'text-slate-600 font-mono text-xs' },
    { title: '描述', key: 'description', dataIndex: 'description', className: 'text-slate-600 truncate max-w-xs' },
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
      width: 220,
      className: 'text-right',
      headerClassName: 'text-right',
      render: (_, record: Role) => (
        <div className="flex items-center justify-end gap-3 text-xs font-bold">
          <button 
            onClick={() => handleConfigPermissions(record)}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            配置权限
          </button>
          <button 
            onClick={() => handleEdit(record)}
            className="text-slate-600 hover:text-slate-900 transition-colors"
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
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">角色管理</h1>
          <p className="text-sm text-slate-500 mt-1">管理系统角色及对应菜单和操作权限</p>
        </div>
        
        <button 
          onClick={handleAdd}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm shadow-blue-200"
        >
          <Plus size={16} />
          新建角色
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input 
            type="text" 
            placeholder="搜索角色名称/编码" 
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
            <option value="正常">正常</option>
            <option value="停用">停用</option>
          </select>
          <div className="flex items-center justify-end gap-3">
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
          data={data}
          loading={loading}
          rowKey="id"
          emptyText="暂无角色数据"
          minWidth="800px"
        />
        
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
            itemName="条记录"
          />
        )}
      </div>

      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg border border-slate-700 font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300">
          {toastMessage}
        </div>
      )}

      <RoleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleModalSuccess}
        editData={editingRecord}
      />

      <RolePermissionModal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        onSuccess={handlePermissionSuccess}
        role={permissionRole}
      />
      
      <ConfirmModal
        {...confirmState}
        onCancel={closeConfirm}
      />
    </div>
  );
}
