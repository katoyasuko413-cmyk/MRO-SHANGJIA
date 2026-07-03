import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { AfterSalesOrder, AfterSalesType, AfterSalesStatus } from '../../models/afterSales';

interface LogisticsModalProps {
  isOpen: boolean;
  order: AfterSalesOrder | null;
  onClose: () => void;
  onSubmit: (id: string, expressCompany: string, expressNumber: string) => void;
}

export function LogisticsModal({
  isOpen,
  order,
  onClose,
  onSubmit
}: LogisticsModalProps) {
  const [expressCompany, setExpressCompany] = useState('');
  const [expressNumber, setExpressNumber] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (order) {
      setExpressCompany(order.expressCompany || '');
      setExpressNumber(order.expressNumber || '');
    }
    // Reset photos and errors on open/change
    setPhotos([]);
    setError(null);
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const isReturnRepairProcessing = 
    order.type === AfterSalesType.RETURN_REPAIR && 
    order.status === AfterSalesStatus.PROCESSING;

  const handleAddPhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotoUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const url = URL.createObjectURL(file);
        newPhotoUrls.push(url);
      }
      setPhotos((prev) => {
        const updated = [...prev, ...newPhotoUrls];
        if (updated.length >= 2) {
          setError(null);
        }
        return updated;
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isReturnRepairProcessing && photos.length < 2) {
      setError('点击维修完成时必须上传至少 2 张维修材料或交付结果凭证照片。');
      return;
    }

    if (!expressCompany.trim()) {
      setError('请填写物流公司');
      return;
    }

    if (!expressNumber.trim()) {
      setError('请填写物流单号');
      return;
    }

    setError(null);
    onSubmit(order.id, expressCompany, expressNumber);
  };

  const handleModalClose = () => {
    setPhotos([]);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleModalClose}
      />
      
      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[500px] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-100/80">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            {isReturnRepairProcessing ? '确认维修完成' : '填写物流单号'}
          </h3>
          <button 
            type="button"
            onClick={handleModalClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content & Form */}
        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Conditional Photo Upload Block (only for return repair processing) */}
            {isReturnRepairProcessing && (
              <div className="space-y-4">
                <div className="flex items-start text-[14px]">
                  <span className="text-red-500 font-bold mr-1">*</span>
                  <span className="font-bold text-slate-800">
                    上传维修交付材料/完工照片 (多个必传，至少2张)：
                  </span>
                </div>

                {/* Photo List & Add Box */}
                <div className="flex flex-wrap gap-4 items-center">
                  {/* Uploaded photo previews */}
                  {photos.map((url, index) => (
                    <div 
                      key={index} 
                      className="relative w-24 h-24 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden group shadow-sm transition-all hover:border-slate-300"
                    >
                      <img 
                        src={url} 
                        alt={`完工照片 ${index + 1}`} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(index)}
                          className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 hover:scale-110 transition-all shadow-md"
                          title="删除照片"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1 py-0.5 rounded font-mono font-bold">
                        {index + 1}
                      </span>
                    </div>
                  ))}

                  {/* Add Box */}
                  <button
                    type="button"
                    onClick={() => {
                      if (fileInputRef.current) {
                        fileInputRef.current.click();
                      }
                    }}
                    className="w-24 h-24 border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/10 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 cursor-pointer transition-all duration-200"
                  >
                    <Plus size={24} className="mb-1" />
                    <span className="text-[12px] font-medium">添加照片</span>
                  </button>

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    multiple 
                    accept="image/*" 
                    onChange={handleAddPhotos}
                  />

                  {/* Developer Auto-Populate Helper for preview ease */}
                  <button
                    type="button"
                    onClick={() => {
                      const mockUrls = [
                        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
                        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80'
                      ];
                      setPhotos(mockUrls);
                      setError(null);
                    }}
                    className="text-[10px] text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 px-2 py-1.5 rounded-lg border border-blue-100 transition-all font-bold self-end mb-1"
                    title="模拟上传系统照片"
                  >
                    自动选择
                  </button>
                </div>
              </div>
            )}

            {/* Standard logistics fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  售后申请单号
                </label>
                <div className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 font-mono text-sm font-semibold">
                  {order.id}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>物流公司
                </label>
                <input 
                  type="text"
                  value={expressCompany}
                  onChange={(e) => {
                    setExpressCompany(e.target.value);
                    if (e.target.value.trim() && (!isReturnRepairProcessing || photos.length >= 2)) setError(null);
                  }}
                  placeholder="请输入物流/快递公司（如：顺丰、德邦等）"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">
                  <span className="text-red-500 mr-1">*</span>物流单号 / 运输单号
                </label>
                <input 
                  type="text"
                  value={expressNumber}
                  onChange={(e) => {
                    setExpressNumber(e.target.value);
                    if (e.target.value.trim() && (!isReturnRepairProcessing || photos.length >= 2)) setError(null);
                  }}
                  placeholder="请输入物流快递单号"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-semibold font-mono"
                />
              </div>
            </div>

            {/* Error alerts */}
            {error && (
              <div className="flex gap-2 bg-red-50 border border-red-100 text-red-700 rounded-xl p-3.5 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Footer actions with matching classes */}
          <div className="px-6 py-5 border-t border-slate-50 bg-slate-50/30 flex justify-end items-center gap-3">
            <button
              type="button"
              onClick={handleModalClose}
              className="px-6 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all active:scale-[0.98]"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-bold text-white bg-[#0f52ba] hover:bg-[#0d47a1] active:bg-[#0a3980] rounded-xl transition-all shadow-md shadow-blue-100/50 active:scale-[0.98]"
            >
              {isReturnRepairProcessing ? '维修完成' : '确认提交'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
