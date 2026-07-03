import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Role } from '../../models/system';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: Partial<Role>) => void;
  editData?: Role | null;
}

export function RoleModal({ isOpen, onClose, onSuccess, editData }: RoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: '正常'
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          name: editData.name,
          code: editData.code,
          description: editData.description,
          status: editData.status
        });
      } else {
        setFormData({
          name: '',
          code: '',
          description: '',
          status: '正常'
        });
      }
    }
  }, [isOpen, editData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">
            {editData ? '编辑角色' : '新建角色'}
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">角色名称 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="请输入角色名称"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">角色编码 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.code}
                onChange={e => setFormData({...formData, code: e.target.value})}
                disabled={!!editData}
                placeholder="例如: OP_STAFF"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">描述</label>
              <textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="请输入角色描述"
                rows={3}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>

            <div>
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
