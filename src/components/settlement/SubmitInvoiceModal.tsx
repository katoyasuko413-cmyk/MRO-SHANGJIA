import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, FileText, Loader2, Sparkles } from 'lucide-react';
import { SettlementOrder } from '../../models/settlement';
import { GoogleGenAI, Type } from "@google/genai";

interface SubmitInvoiceModalProps {
  orders: SettlementOrder[];
  onClose: () => void;
  onSuccess: () => void;
  onSubmit: (invoiceData: { amount: number, invoiceTitle: string, taxNo: string }) => Promise<{ success: boolean; error?: string }>;
}

export function SubmitInvoiceModal({ orders, onClose, onSuccess, onSubmit }: SubmitInvoiceModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recognizedData, setRecognizedData] = useState<{ amount: number, invoiceTitle: string, taxNo: string } | null>(null);
  const [validationResult, setValidationResult] = useState<{ isValid: boolean; mistakes: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const firstOrder = orders[0];
  const totalTargetAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalTargetNetAmount = orders.reduce((sum, o) => sum + o.netAmount, 0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      recognizeInvoice(e.target.files[0]);
    }
  };

  const recognizeInvoice = async (file: File) => {
    setIsRecognizing(true);
    setRecognizedData(null);
    setValidationResult(null);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { text: "你是一个专业的财务发票OCR识别系统。请识别该发票中的：总金额 (amount)、发票抬头 (invoiceTitle)、纳税人识别号 (taxNo)。" },
          { text: `上下文：当前正在处理的结算订单金额合计为 ${totalTargetAmount.toFixed(2)}。请返回JSON格式。` }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              amount: { type: Type.NUMBER },
              invoiceTitle: { type: Type.STRING },
              taxNo: { type: Type.STRING }
            },
            required: ["amount", "invoiceTitle", "taxNo"]
          }
        }
      });

      const data = JSON.parse(response.text);
      setRecognizedData(data);

      const mistakes: string[] = [];
      if (Math.abs(data.amount - totalTargetAmount) > 0.01) {
        mistakes.push(`金额不匹配：发票金额为 ¥${data.amount.toFixed(2)}，订单合计金额为 ¥${totalTargetAmount.toFixed(2)}`);
      }
      if (data.invoiceTitle !== firstOrder.invoiceTitle) {
        mistakes.push(`抬头不匹配：发票抬头为 "${data.invoiceTitle}"，应为 "${firstOrder.invoiceTitle}"`);
      }
      if (data.taxNo !== firstOrder.taxNo) {
        mistakes.push(`税号不匹配：发票税号为 "${data.taxNo}"，应为 "${firstOrder.taxNo}"`);
      }

      setValidationResult({
        isValid: mistakes.length === 0,
        mistakes
      });

    } catch (err) {
      console.error(err);
      setError('发票识别失败，请重试或检查网络');
    } finally {
      setIsRecognizing(false);
    }
  };

  const handleConfirmSubmit = async () => {
    if (!recognizedData || !validationResult?.isValid) return;

    setIsSubmitting(true);
    const result = await onSubmit(recognizedData);
    setIsSubmitting(false);

    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || '提交失败');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <FileText size={18} />
            </div>
            <h3 className="font-bold text-slate-800">交票确认 {orders.length > 1 && `(合并 ${orders.length} 笔订单)`}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Detailed Invoice Info for Verification */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">系统预设开票信息</h4>
             <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xs">
                <div className="col-span-2">
                   <p className="text-slate-400 mb-1">发票抬头</p>
                   <p className="font-bold text-slate-900">{firstOrder.invoiceTitle}</p>
                </div>
                <div>
                   <p className="text-slate-400 mb-1">纳税人识别号</p>
                   <p className="font-mono font-bold text-slate-900">{firstOrder.taxNo}</p>
                </div>
                <div>
                   <p className="text-slate-400 mb-1">发票类型</p>
                   <p className="font-bold text-slate-900">{firstOrder.invoiceType}</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200 mt-2 space-y-2">
                   <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">总计金额 (未税)</span>
                      <span className="text-sm font-bold text-slate-600">¥{totalTargetNetAmount.toFixed(2)}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">总计金额 (含税)</span>
                      <span className="text-lg font-bold text-blue-600">¥{totalTargetAmount.toFixed(2)}</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Orders Breakdown */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
             <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">所选开票清单明细</h4>
             <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                {orders.map(settlement => (
                   <div key={settlement.id} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-100 group hover:border-blue-200 transition-colors">
                      <div className="flex flex-col">
                         <span className="text-slate-400 scale-90 origin-left">结算编号</span>
                         <span className="font-mono font-bold text-slate-900">{settlement.settlementNo}</span>
                      </div>
                      <div className="text-right flex items-center gap-4">
                         <div className="flex flex-col">
                            <span className="text-slate-400 scale-90 origin-right">未税金额</span>
                            <span className="font-medium text-slate-600">¥{settlement.netAmount.toFixed(2)}</span>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-slate-400 scale-90 origin-right">含税金额</span>
                            <span className="font-bold text-slate-900">¥{settlement.totalAmount.toFixed(2)}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Upload Area */}
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                <Upload size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-700">点击或拖拽上传发票扫描件</p>
                <p className="text-xs text-slate-400 mt-1">支持 PDF, JPG, PNG 格式</p>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept="image/*,.pdf" 
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-blue-600 shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div className="text-sm">
                    <p className="font-bold text-slate-700 truncate max-w-[200px]">{file.name}</p>
                    <p className="text-slate-400 text-xs">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                {!isRecognizing && (
                  <button 
                    onClick={() => { setFile(null); setRecognizedData(null); setValidationResult(null); }}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    重传
                  </button>
                )}
              </div>

              {isRecognizing && (
                <div className="flex flex-col items-center justify-center py-6 gap-3 text-blue-600">
                  <div className="relative">
                    <Loader2 className="animate-spin" size={32} />
                    <Sparkles className="absolute -top-1 -right-1 text-amber-400" size={16} />
                  </div>
                  <p className="text-sm font-medium animate-pulse">AI 正在智能识别发票信息...</p>
                </div>
              )}

              {recognizedData && validationResult && (
                <div className={`p-4 rounded-xl border ${validationResult.isValid ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    {validationResult.isValid ? (
                      <>
                        <CheckCircle2 className="text-emerald-500" size={20} />
                        <span className="font-bold text-emerald-700">验证通过</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="text-red-500" size={20} />
                        <span className="font-bold text-red-700">验证失败</span>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">识别金额:</span>
                      <span className="font-mono font-bold">¥{recognizedData.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">识别抬头:</span>
                      <span className="font-bold truncate max-w-[200px]">{recognizedData.invoiceTitle}</span>
                    </div>
                    {validationResult.mistakes.map((mistake, idx) => (
                      <p key={idx} className="text-xs text-red-600 bg-red-100/50 p-2 rounded mt-1 border border-red-200">
                        {mistake}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button 
            disabled={isSubmitting}
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
          >
            取消
          </button>
          <button 
            disabled={!validationResult?.isValid || isSubmitting || isRecognizing}
            onClick={handleConfirmSubmit}
            className={`px-8 py-2 text-sm font-bold text-white rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-100 ${
              validationResult?.isValid && !isSubmitting ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-300 cursor-not-allowed shadow-none'
            }`}
          >
            {isSubmitting ? <><Loader2 className="animate-spin" size={16} /> 提交中...</> : '确认提交'}
          </button>
        </div>
      </div>
    </div>
  );
}
