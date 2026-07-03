import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { SettlementOrder } from '../../models/settlement';

interface UploadExchangeRedInvoiceModalProps {
  order: SettlementOrder;
  onClose: () => void;
  onSuccess: () => void;
  onSubmit: (data: { redTargetInvoiceNo: string; redInvoiceNo: string; redInvoiceImage?: string }) => Promise<{ success: boolean; error?: string }>;
}

export function UploadExchangeRedInvoiceModal({ order, onClose, onSuccess, onSubmit }: UploadExchangeRedInvoiceModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [redInvoiceNo, setRedInvoiceNo] = useState('');
  const [redTargetInvoiceNo, setRedTargetInvoiceNo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available invoice numbers to choose from
  const originalNo = order.exchangeDetail?.originalInvoiceNo || '';
  const newNo = order.exchangeDetail?.newInvoiceNo || order.invoiceNo || '';

  // Initialize selected target invoice
  React.useEffect(() => {
    if (newNo) {
      setRedTargetInvoiceNo(newNo);
    } else if (originalNo) {
      setRedTargetInvoiceNo(originalNo);
    }
  }, [originalNo, newNo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redTargetInvoiceNo) {
      setError('请选择红冲的发票号');
      return;
    }
    if (!redInvoiceNo.trim()) {
      setError('请输入红字特殊/发票号');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const redInvoiceImage = file ? URL.createObjectURL(file) : undefined;
      const result = await onSubmit({
        redTargetInvoiceNo,
        redInvoiceNo: redInvoiceNo.trim(),
        redInvoiceImage
      });

      if (result.success) {
        onSuccess();
      } else {
        setError(result.error || '提交失败');
      }
    } catch (err: any) {
      setError(err.message || '操作发生异常');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="upload-exchange-red-invoice-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <Upload size={18} />
            </div>
            <h3 className="font-bold text-slate-800">上传换票红票</h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Target Invoice Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              请选择红冲的发票号 <span className="text-rose-500">*</span>
            </label>
            <select
              value={redTargetInvoiceNo}
              onChange={(e) => setRedTargetInvoiceNo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
              required
            >
              {originalNo && <option value={originalNo}>原发票号码: {originalNo}</option>}
              {newNo && <option value={newNo}>新发票号码: {newNo}</option>}
            </select>
          </div>

          {/* Red Invoice Number Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              红字发票号码 <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="请输入红字发票号码"
              value={redInvoiceNo}
              onChange={(e) => setRedInvoiceNo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-white"
              required
            />
          </div>

          {/* Simple Upload Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              上传红票影像 (可选)
            </label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-2 ${
                file ? 'border-red-200 bg-red-50/30' : 'border-slate-200 hover:border-red-400 hover:bg-slate-50'
              }`}
            >
              {file ? (
                <div className="flex flex-col items-center gap-1.5">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div className="text-xs font-bold text-slate-700">{file.name}</div>
                  <div className="text-[10px] text-slate-500">点击更换红票影像</div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center">
                    <Upload size={20} />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-700">点击上传发票文件</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">支持图片或 PDF 格式</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/*,.pdf" 
            onChange={handleFileChange}
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm animate-in shake duration-500">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-bold">提示</div>
                <div className="text-xs mt-0.5 leading-relaxed opacity-90">{error}</div>
              </div>
            </div>
          )}
        </form>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={onClose} 
            className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
          >
            取消
          </button>
          <button 
            type="button"
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="px-8 flex h-10 items-center justify-center text-sm font-black text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all gap-2 shadow-lg shadow-red-100"
          >
            {isSubmitting ? <><Loader2 className="animate-spin" size={16} /> 提交中...</> : '确认上传'}
          </button>
        </div>
      </div>
    </div>
  );
}
