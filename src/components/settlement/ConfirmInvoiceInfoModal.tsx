import React from 'react';
import { X, CheckCircle2, FileText, Loader2, Info, AlertCircle } from 'lucide-react';
import { SettlementOrder } from '../../models/settlement';

interface ConfirmInvoiceInfoModalProps {
  orders: SettlementOrder[];
  onClose: () => void;
  onSuccess: () => void;
  onConfirm: () => Promise<{ success: boolean; error?: string }>;
  onReject: (reason: string) => Promise<{ success: boolean; error?: string }>;
}

export function ConfirmInvoiceInfoModal({ orders, onClose, onSuccess, onConfirm, onReject }: ConfirmInvoiceInfoModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isRejecting, setIsRejecting] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const firstOrder = orders[0];
  const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    const result = await onConfirm();
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || '确认失败');
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      setError('请输入驳回原因');
      return;
    }
    setIsSubmitting(true);
    const result = await onReject(rejectReason.trim());
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || '驳回失败');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <Info size={18} />
            </div>
            <h3 className="font-bold text-slate-800">{isRejecting ? '驳回开票信息' : '开票信息确认'}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {isRejecting ? (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3 italic text-xs text-rose-700">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p>确认驳回开票信息？驳回后订单将返回“待确认”或相应状态，请填写原因。</p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">驳回原因</label>
                <textarea 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="请输入驳回原因..."
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 bg-white min-h-[120px] transition-all"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 italic text-xs text-blue-700">
                <Info size={16} className="shrink-0 mt-0.5" />
                <p>请仔细核对以下开票信息，确认无误后将进入“开票中”状态。</p>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400 text-xs mb-1">发票抬头</p>
                    <p className="font-bold text-slate-900">{firstOrder.invoiceTitle}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">纳税人识别号</p>
                    <p className="font-mono font-bold text-slate-900">{firstOrder.taxNo}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">发票类型</p>
                    <p className="font-medium text-slate-700">{firstOrder.invoiceType}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs mb-1">交票总额 (含税)</p>
                    <p className="text-xl font-bold text-blue-600">¥{totalAmount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-shake">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button 
            disabled={isSubmitting}
            onClick={() => isRejecting ? setIsRejecting(false) : onClose()} 
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
          >
            {isRejecting ? '返回核对' : '取消'}
          </button>
          <div className="flex items-center gap-3">
            {!isRejecting && (
              <button 
                disabled={isSubmitting}
                onClick={() => setIsRejecting(true)}
                className="px-6 py-2 text-sm font-medium text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-lg transition-all"
              >
                驳回
              </button>
            )}
            <button 
              disabled={isSubmitting}
              onClick={isRejecting ? handleReject : handleConfirm}
              className={`px-8 py-2 text-sm font-bold text-white rounded-lg transition-all flex items-center gap-2 shadow-lg ${
                isRejecting 
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-100' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
              }`}
            >
              {isSubmitting ? <><Loader2 className="animate-spin" size={16} /> 处理中...</> : (isRejecting ? '确认驳回' : '核对无误，确认开票')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
