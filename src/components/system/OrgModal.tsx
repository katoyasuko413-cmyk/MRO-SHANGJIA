import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Organization } from '../../models/system';
import { useOrgs } from '../../hooks/useSystem';

interface OrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: Partial<Organization>) => void;
  editData?: Organization | null;
}

export function OrgModal({ isOpen, onClose, onSuccess, editData }: OrgModalProps) {
  const { data: orgs } = useOrgs();
  
  const [formData, setFormData] = useState({
    name: '',
    parentId: '',
    status: '启用',
    order: 0
  });

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          name: editData.name,
          parentId: editData.parentId || '',
          status: editData.status || '启用',
          order: editData.order || 0
        });
      } else {
        setFormData({
          name: '',
          parentId: '',
          status: '启用',
          order: 0
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
            {editData ? '编辑组织' : '新建组织'}
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
              <label className="block text-sm font-medium text-slate-700 mb-1">上级组织</label>
              <select 
                value={formData.parentId}
                onChange={e => setFormData({...formData, parentId: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">-- 无上级（顶级组织） --</option>
                {orgs.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">组织名称 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="请输入组织名称"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">排序</label>
                <input 
                  type="number" 
                  value={formData.order}
                  onChange={e => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      setFormData({...formData, order: val});
                    }
                  }}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
                <div className="flex items-center h-[38px] gap-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setFormData({...formData, status: formData.status === '启用' ? '停用' : '启用'});
                    }}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${formData.status === '启用' ? 'bg-blue-500' : 'bg-slate-200'}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute left-0.5 top-0.5 h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.status === '启用' ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                  <span className={`text-sm ${formData.status === '启用' ? 'text-green-600 font-medium' : 'text-slate-500'}`}>
                    {formData.status}
                  </span>
                </div>
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
