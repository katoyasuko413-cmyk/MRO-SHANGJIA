import React, { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Product } from '../../models/product';

interface BindSPUModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (productId: string, spuId: string) => void;
}

export function BindSPUModal({ isOpen, onClose, product, onConfirm }: BindSPUModalProps) {
  const [spu, setSpu] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSpu('');
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleSave = () => {
    onConfirm(product.id, spu);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">绑定SPU</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <label className="block text-sm font-medium text-slate-700">
            选择SPU：
          </label>
          <div className="relative">
            <select 
              value={spu}
              onChange={(e) => setSpu(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none text-slate-700 font-medium"
            >
              <option value="" disabled className="text-slate-400">请选择SPU</option>
              <option value="SPU001">SPU001 (Apple iPhone 15 Pro, 白色)</option>
              <option value="SPU002">SPU002 (Huawei Mate 60 Pro, 雅丹黑)</option>
              <option value="SPU003">SPU003 (Xiaomi 14 Ultra, 陶瓷黑)</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
          <button 
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            disabled={!spu}
            className="px-5 py-2 text-sm font-bold text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
}
