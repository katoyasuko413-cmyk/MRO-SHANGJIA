import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Order } from '../../models/order';

interface RejectOrderModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onSubmit: (orderId: string, reason: string) => void;
}

export function RejectOrderModal({ isOpen, order, onClose, onSubmit }: RejectOrderModalProps) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReason('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError('请输入拒单理由');
      return;
    }
    onSubmit(order.id, reason.trim());
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full shrink-0 bg-red-50">
              <AlertCircle className="text-red-500" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 mb-2">确认拒单</h3>
              <p className="text-sm text-slate-600 mb-4">
                您即将拒绝订单 <span className="font-medium text-slate-800">{order.salesOrderNo}</span>。请在下方填写拒单理由：
              </p>
              
              <div>
                <textarea
                  className={`w-full p-3 text-sm bg-white border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500'} rounded-lg focus:outline-none focus:ring-1 transition-all resize-none`}
                  rows={4}
                  placeholder="请输入拒单理由（必填）"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (e.target.value.trim()) setError('');
                  }}
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1.5">{error}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 rounded-b-2xl flex justify-end gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors bg-red-500 hover:bg-red-600 shadow-red-200 text-white"
          >
            确认拒单
          </button>
        </div>
      </div>
    </div>
  );
}
