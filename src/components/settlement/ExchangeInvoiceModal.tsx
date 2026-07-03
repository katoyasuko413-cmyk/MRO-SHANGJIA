import React, { useState, useRef } from 'react';
import { X, RefreshCw, CheckCircle2, AlertCircle, FileText, Loader2, Sparkles, Upload } from 'lucide-react';
import { SettlementOrder, InvoiceRecognitionResult } from '../../models/settlement';

interface ExchangeInvoiceModalProps {
  order: SettlementOrder;
  onClose: () => void;
  onSuccess: () => void;
  onSubmit: (data: { 
    newInvoiceNo: string; 
    reason: string; 
    newInvoiceImage?: string; 
  }) => Promise<{ success: boolean; error?: string }>;
}

export function ExchangeInvoiceModal({ order, onClose, onSuccess, onSubmit }: ExchangeInvoiceModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newInvoiceNo, setNewInvoiceNo] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      recognizeInvoice(e.target.files[0]);
    }
  };

  const recognizeInvoice = async (file: File) => {
    setIsRecognizing(true);
    setError(null);

    // Simulate network delay for OCR
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Mock recognized invoice no based on order or random values
      const randomSuffix = Math.floor(Math.random() * 9000) + 1000;
      const recognizedNo = `FP202409${randomSuffix}`;
      setNewInvoiceNo(recognizedNo);
    } catch (err) {
      console.error(err);
      setError('发票信息识别失败，请手动输入');
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('请上传新发票扫描件（必传）');
      return;
    }

    const finalInvoiceNo = newInvoiceNo.trim();
    if (!finalInvoiceNo) {
      setError('请输入或通过上传识别新发票号码');
      return;
    }

    if (finalInvoiceNo === order.invoiceNo) {
      setError('新发票号码不能与原发票号码相同');
      return;
    }

    setIsSubmitting(true);
    // Mock image URL from local file object using URL.createObjectURL for demonstration
    const newInvoiceImage = URL.createObjectURL(file);
    
    const result = await onSubmit({ 
      newInvoiceNo: finalInvoiceNo, 
      reason: '发票换票登记', 
      newInvoiceImage 
    });
    
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || '提交换票申请失败');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <RefreshCw size={18} />
            </div>
            <h3 className="font-bold text-slate-800">发票换票登记</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[85vh]">
          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex items-start gap-2.5 text-rose-700 animate-fade-in">
              <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
              <div className="text-sm font-medium">{error}</div>
            </div>
          )}

          {/* Core Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">原发票号码</span>
              <span className="text-base font-bold text-slate-700 font-mono italic">{order.invoiceNo || '暂无发票号码'}</span>
            </div>
            <div className="bg-blue-50/40 rounded-xl border border-blue-100 p-4">
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider block mb-1">应开票含税金额</span>
              <span className="text-base font-black text-blue-700 font-mono">¥{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 flex items-center">
                <span className="text-rose-500 mr-1">*</span> 新发票号码
              </label>
              <input 
                type="text" 
                placeholder="请输入或通过上传识别新发票号码"
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                value={newInvoiceNo}
                onChange={(e) => setNewInvoiceNo(e.target.value)}
              />
            </div>
          </div>

          {/* Upload and Intelligence Recognition */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span className="text-rose-500">*</span> 上传新发票扫描件（必传 · AI辨识）
              </label>
              {file && (
                <button 
                  type="button" 
                  onClick={() => { setFile(null); setNewInvoiceNo(''); }}
                  className="text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors"
                >
                  清空发票
                </button>
              )}
            </div>
            
            <div 
              onClick={() => !isRecognizing && fileInputRef.current?.click()}
              className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center gap-3 ${
                file ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              {isRecognizing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="animate-spin text-blue-500" size={32} />
                  <div className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                    <Sparkles size={16} className="text-yellow-500 animate-bounce" />
                    AI 正在识别新发票号码与结构数据...
                  </div>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div className="text-sm font-bold text-slate-700">{file.name}</div>
                  <div className="text-xs text-slate-500">点击更换新发票图片</div>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-slate-700">点击或把文件拖拽到这里上传新发票</div>
                    <div className="text-xs text-slate-400 mt-1">支持 JPG, PNG, PDF · 上传发票将自动触发 AI 智能提取发票号码</div>
                  </div>
                </>
              )}
            </div>

            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept="image/*,.pdf" 
              onChange={handleFileChange}
              disabled={isRecognizing}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-white hover:shadow-sm transition-all"
            disabled={isSubmitting || isRecognizing}
          >
            取消
          </button>
          <button 
            type="button" 
            onClick={handleSubmit}
            className="flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-100 transition-all"
            disabled={isSubmitting || isRecognizing}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                正在提交...
              </>
            ) : (
              <>
                确认换票
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
