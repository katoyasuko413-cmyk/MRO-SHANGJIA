import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, FileText, Loader2, Sparkles, Send } from 'lucide-react';
import { SettlementOrder, InvoiceRecognitionResult } from '../../models/settlement';

interface UploadRedInvoiceModalProps {
  order: SettlementOrder;
  onClose: () => void;
  onSuccess: () => void;
  onSubmit: (data: { invoiceNo: string; invoiceImage?: string }) => Promise<{ success: boolean; error?: string }>;
}

export function UploadRedInvoiceModal({ order, onClose, onSuccess, onSubmit }: UploadRedInvoiceModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recognizedData, setRecognizedData] = useState<InvoiceRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTotalAmount = order.totalAmount;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      recognizeInvoice(e.target.files[0]);
    }
  };

  const recognizeInvoice = async (file: File) => {
    setIsRecognizing(true);
    setError(null);
    setRecognizedData(null);

    // Simulate network delay for OCR
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      // Mock result based on the provided image
      const mockResult: InvoiceRecognitionResult = {
        invoiceNo: '26112000001672557316-RED', // Mock red invoice no
        invoiceDate: new Date().toISOString().split('T')[0],
        buyerName: order.invoiceTitle,
        buyerTaxNo: order.taxNo,
        sellerName: '红旗智行科技（北京）有限公司北京分公司',
        sellerTaxNo: '91110302MA01FW664K',
        amount: -order.netAmount,
        taxAmount: -order.taxAmount,
        totalAmount: -order.totalAmount
      };
      
      setRecognizedData(mockResult);
    } catch (err) {
      console.error(err);
      setError('识别失败，请重试');
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleSubmit = async () => {
    if (!recognizedData) {
      setError('请先上传红票进行识别');
      return;
    }

    if (Math.abs(Math.abs(recognizedData.totalAmount) - Math.abs(selectedTotalAmount)) > 0.01) {
      setError(`金额校验失败：红票金额与原发票金额不一致`);
      return;
    }

    setIsSubmitting(true);
    // Mock image URL from local file object using URL.createObjectURL for demonstration
    const invoiceImage = file ? URL.createObjectURL(file) : undefined;
    const result = await onSubmit({ invoiceNo: recognizedData.invoiceNo, invoiceImage });
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || '提交失败');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
              <Upload size={18} />
            </div>
            <h3 className="font-bold text-slate-800">上传红冲发票</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[85vh]">
          {/* Amount Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-xl border border-red-100 p-4">
              <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider mb-1">原发票金额</div>
              <div className="text-xl font-black text-red-600">¥{selectedTotalAmount.toFixed(2)}</div>
            </div>
            <div className={`rounded-xl border p-4 transition-all duration-500 ${
              recognizedData 
                ? (Math.abs(Math.abs(recognizedData.totalAmount) - Math.abs(selectedTotalAmount)) <= 0.01 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100')
                : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">红票识别金额</div>
              <div className={`text-xl font-black ${
                recognizedData 
                  ? (Math.abs(Math.abs(recognizedData.totalAmount) - Math.abs(selectedTotalAmount)) <= 0.01 ? 'text-emerald-600' : 'text-red-500')
                  : 'text-slate-300'
              }`}>
                {recognizedData ? `¥${recognizedData.totalAmount.toFixed(2)}` : '待识别'}
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div 
            onClick={() => !isRecognizing && fileInputRef.current?.click()}
            className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 transition-all flex flex-col items-center justify-center gap-3 ${
              file ? 'border-red-200 bg-red-50/30' : 'border-slate-200 hover:border-red-400 hover:bg-slate-50'
            }`}
          >
            {isRecognizing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-red-500" size={32} />
                <div className="text-sm font-medium text-slate-600">正在识别红票信息...</div>
              </div>
            ) : file ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div className="text-sm font-bold text-slate-700">{file.name}</div>
                <div className="text-xs text-slate-500">点击更换红票</div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload size={32} />
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold text-slate-700">点击或拖拽上传红票</div>
                  <div className="text-xs text-slate-500 mt-1">支持 JPG, PNG, PDF 格式</div>
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
          />

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-sm animate-in shake duration-500">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <div>
                <div className="font-bold">操作提示</div>
                <div className="text-xs mt-0.5 leading-relaxed opacity-90">{error}</div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button 
            disabled={isSubmitting}
            onClick={onClose} 
            className="px-6 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded-xl transition-all"
          >
            取消
          </button>
          <button 
            disabled={isSubmitting || isRecognizing || !recognizedData}
            onClick={handleSubmit}
            className={`px-10 flex h-10 items-center justify-center text-sm font-black text-white rounded-xl transition-all gap-2 shadow-lg ${
              !recognizedData 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 shadow-red-100'
            }`}
          >
            {isSubmitting ? <><Loader2 className="animate-spin" size={16} /> 提交中...</> : '确认红冲'}
          </button>
        </div>
      </div>
    </div>
  );
}
