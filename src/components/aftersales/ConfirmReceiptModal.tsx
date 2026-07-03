import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { AfterSalesOrder, AfterSalesType } from '../../models/afterSales';

interface ConfirmReceiptModalProps {
  isOpen: boolean;
  order: AfterSalesOrder | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmReceiptModal({
  isOpen,
  order,
  onClose,
  onConfirm
}: ConfirmReceiptModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">
            确认收货
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-amber-800">
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold block mb-1">请核对实物货品</span>
              {(order.type === AfterSalesType.REPAIR || order.type === AfterSalesType.RETURN_REPAIR) ? (
                <span>提示：此操作不可逆，确认收货后，代表您已收到客户寄回的维修商品。系统将直接把该售后单的状态变更为<strong>“处理中”</strong>。</span>
              ) : (
                <span>提示：此操作不可逆，确认收货后，代表您已收到客户寄回的退货商品。系统将直接把该售后单的状态变更为<strong>“已完成”</strong>。</span>
              )}
            </div>
          </div>

          <div className="space-y-2.5">
            <div>
              <span className="text-xs text-slate-400 font-bold block mb-1">售后单号</span>
              <span className="text-sm font-mono font-bold text-slate-800">{order.id}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block mb-1">关联订单号</span>
              <span className="text-sm font-mono text-slate-700">{order.salesOrderNo}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block mb-1">客户名称</span>
              <span className="text-sm font-bold text-slate-800">{order.customerName}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-bold block mb-1">退回商品</span>
              <span className="text-sm font-medium text-slate-800">{order.productName}</span>
            </div>
            {order.expressNumber && (
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs space-y-1 text-slate-600">
                <div>寄回物流公司：<span className="font-semibold text-slate-800">{order.expressCompany || '自主寄回'}</span></div>
                <div>寄回运单单号：<span className="font-mono font-semibold text-slate-800">{order.expressNumber}</span></div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all"
            >
              取消
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2 text-sm font-bold text-white bg-emerald-500 hover:bg-emerald-600 border border-transparent rounded-xl transition-all shadow-sm shadow-emerald-100"
            >
              确认收货
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
