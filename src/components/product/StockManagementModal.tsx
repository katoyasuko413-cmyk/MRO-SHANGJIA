import React, { useState, useEffect } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { Product } from '../../models/product';

interface StockManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (productId: string, addAmount: number) => void;
}

export function StockManagementModal({ isOpen, onClose, product, onConfirm }: StockManagementModalProps) {
  const [amount, setAmount] = useState<number | string>(1);

  useEffect(() => {
    if (isOpen) {
      setAmount(1);
    }
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const handleConfirm = () => {
    const val = typeof amount === 'number' ? amount : parseInt(amount) || 0;
    onConfirm(product.id, val);
  };

  const handleMinus = () => {
    setAmount(prev => {
      const val = typeof prev === 'number' ? prev : parseInt(prev) || 0;
      return val - 1;
    });
  };

  const handlePlus = () => {
    setAmount(prev => {
      const val = typeof prev === 'number' ? prev : parseInt(prev) || 0;
      return val + 1;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">库存管理</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="text-sm font-bold text-slate-500 w-20 shrink-0 mt-0.5">商品名称：</div>
            <div className="text-sm text-slate-800 font-medium leading-relaxed">{product.name}</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-slate-500 w-20 shrink-0">当前库存：</div>
            <div className="text-sm text-slate-800 font-medium">{product.stock} 件</div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm font-bold text-slate-500 w-20 shrink-0">增加库存量</div>
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden h-10 w-48 shadow-sm">
              <button 
                onClick={handleMinus}
                className="w-10 h-full flex items-center justify-center bg-slate-50/80 text-slate-500 hover:bg-slate-100 border-r border-slate-200 transition-colors"
              >
                <Minus size={16} />
              </button>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 w-full h-full text-center text-sm font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 no-spinner"
              />
              <button 
                onClick={handlePlus}
                className="w-10 h-full flex items-center justify-center bg-slate-50/80 text-slate-500 hover:bg-slate-100 border-l border-slate-200 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            取消
          </button>
          <button 
            onClick={handleConfirm}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-500 border border-transparent rounded-xl hover:bg-blue-600 transition-all shadow-sm shadow-blue-200"
          >
            确认增加
          </button>
        </div>
      </div>
    </div>
  );
}
