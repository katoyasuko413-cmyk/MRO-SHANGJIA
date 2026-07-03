import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { Account, Role, Organization } from '../../models/system';
import { useRoles, useOrgs } from '../../hooks/useSystem';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: Partial<Account> & { password?: string }) => void;
  editData?: Account | null;
}

const AVAILABLE_CUSTOMERS = ['客户A', '客户B', '客户C'];

export function AccountModal({ isOpen, onClose, onSuccess, editData }: AccountModalProps) {
  const { data: roles } = useRoles();
  const { data: orgs } = useOrgs();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    roleId: '',
    orgId: '',
    serviceCustomer: '',
    status: '正常'
  });

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsDropdownOpen(false);
      setShowError(false);
      if (editData) {
        setFormData({
          name: editData.name,
          phone: editData.phone,
          password: '',
          roleId: editData.roleId,
          orgId: editData.orgId,
          serviceCustomer: editData.serviceCustomer || '',
          status: editData.status
        });
      } else {
        setFormData({
          name: '',
          phone: '',
          password: '',
          roleId: '',
          orgId: '',
          serviceCustomer: '',
          status: '正常'
        });
      }
    }
  }, [isOpen, editData]);

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.customer-select-container')) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isDropdownOpen]);

  if (!isOpen) return null;

  const selectedCustomers = formData.serviceCustomer
    ? formData.serviceCustomer.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const toggleCustomer = (customer: string) => {
    let newList: string[];
    if (selectedCustomers.includes(customer)) {
      newList = selectedCustomers.filter(c => c !== customer);
    } else {
      newList = [...selectedCustomers, customer];
    }
    const customerStr = newList.join(',');
    setFormData({ ...formData, serviceCustomer: customerStr });
    if (customerStr) {
      setShowError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceCustomer) {
      setShowError(true);
      return;
    }
    onSuccess(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            {editData ? '编辑账号' : '新建账号'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">姓名 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="请输入真实姓名"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">手机号 <span className="text-red-500">*</span></label>
              <input 
                type="tel" 
                required
                pattern="^1[3-9]\d{9}$"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                placeholder="请输入11位手机号"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {!editData && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">初始密码 <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="请输入初始登录密码"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">所属角色 <span className="text-red-500">*</span></label>
              <select 
                required
                value={formData.roleId}
                onChange={e => setFormData({...formData, roleId: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">请选择角色</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">所属组织 <span className="text-red-500">*</span></label>
              <select 
                required
                value={formData.orgId}
                onChange={e => setFormData({...formData, orgId: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">请选择组织</option>
                {orgs.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div className="relative customer-select-container">
              <label className="block text-sm font-medium text-slate-700 mb-1">服务客户 <span className="text-red-500">*</span></label>
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full min-h-[38px] px-3 py-1.5 flex flex-wrap items-center gap-1.5 text-sm bg-white border rounded-lg cursor-pointer ${
                  showError 
                    ? 'border-red-500 ring-1 ring-red-500' 
                    : isDropdownOpen 
                      ? 'border-blue-500 ring-1 ring-blue-500' 
                      : 'border-slate-200'
                } relative pr-8 select-none`}
              >
                {selectedCustomers.length === 0 ? (
                  <span className="text-slate-400">请选择服务客户</span>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCustomers.map((c) => (
                      <span 
                        key={c} 
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold"
                      >
                        {c}
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCustomer(c);
                          }}
                          className="hover:bg-blue-100 p-0.5 rounded-full text-blue-500 hover:text-blue-700 transition-colors"
                        >
                          <X size={10} className="stroke-[3]" />
                        </span>
                      </span>
                    ))}
                  </div>
                )}
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                  <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
                </div>
              </div>

              {showError && (
                <p className="absolute text-[11px] text-red-500 mt-0.5 font-medium">请至少选择一个服务客户</p>
              )}

              {isDropdownOpen && (
                <div className="absolute left-0 right-0 z-50 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100">
                  {AVAILABLE_CUSTOMERS.map((customer) => {
                    const isSelected = selectedCustomers.includes(customer);
                    return (
                      <div 
                        key={customer}
                        onClick={() => toggleCustomer(customer)}
                        className={`px-3 py-2 text-sm flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-blue-50/50 text-blue-700 font-medium' 
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{customer}</span>
                        {isSelected && <Check size={16} className="text-blue-600" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">状态 <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="正常"
                    checked={formData.status === '正常'}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">正常</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="status" 
                    value="停用"
                    checked={formData.status === '停用'}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-700">停用</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              取消
            </button>
            <button 
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200"
            >
              确定
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
