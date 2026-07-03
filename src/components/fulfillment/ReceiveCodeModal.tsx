import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { FulfillmentOrder } from '../../models/fulfillment';

interface ReceiveCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, code: string) => Promise<{ success: boolean; error?: string }>;
  order: FulfillmentOrder | null;
}

export function ReceiveCodeModal({ isOpen, onClose, onSubmit, order }: ReceiveCodeModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCode('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('请输入收货码');
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setError('收货码必须为6位纯数字');
      return;
    }

    setIsSubmitting(true);
    const result = await onSubmit(order.id, code);
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error || '验证失败');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">填写收货码</h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-slate-500 mb-1">销售订单号: {order.salesOrderNo}</p>
            <p className="text-sm text-slate-500">物流单号: {order.trackingNo}</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">收货码 <span className="text-red-500">*</span></label>
            <input
              type="text"
              maxLength={6}
              placeholder="请输入6位纯数字收货码"
              value={code}
              onChange={e => {
                const val = e.target.value;
                if (val === '' || /^\d*$/.test(val)) {
                  setCode(val);
                }
              }}
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all font-mono tracking-widest text-lg"
            />
          </div>

          {error && (
            <div className="mt-4 text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
          <button 
            disabled={isSubmitting}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            取消
          </button>
          <button 
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-70"
          >
            {isSubmitting ? '验证中...' : (
              <>
                <Check size={16} />
                确认收货
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
