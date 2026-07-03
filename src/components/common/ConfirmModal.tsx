import React from 'react';
import { AlertCircle, X, AlertTriangle, Info } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = '确定',
  cancelText = '取消',
  type = 'danger',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="text-red-500" size={24} />;
      case 'warning':
        return <AlertTriangle className="text-blue-500" size={24} />;
      case 'info':
      default:
        return <Info className="text-blue-500" size={24} />;
    }
  };

  const getConfirmButtonClasses = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 shadow-red-200 text-white';
      case 'warning':
        return 'bg-blue-500 hover:bg-blue-600 shadow-blue-200 text-white';
      case 'info':
      default:
        return 'bg-blue-500 hover:bg-blue-600 shadow-blue-200 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col animate-in zoom-in-95 duration-200">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full shrink-0 ${
              type === 'danger' ? 'bg-red-50' : type === 'warning' ? 'bg-blue-50' : 'bg-blue-50'
            }`}>
              {getIcon()}
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl flex justify-end gap-3">
          <button 
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button 
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${getConfirmButtonClasses()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
