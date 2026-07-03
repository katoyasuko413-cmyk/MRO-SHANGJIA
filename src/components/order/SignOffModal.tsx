import React, { useState, useEffect } from 'react';
import { X, ClipboardCheck, UploadCloud, FileText, User, Calendar, CheckCircle2, AlertCircle, Image, Trash2 } from 'lucide-react';
import { Order } from '../../models/order';

interface ViewSignOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onUploadClick: () => void;
}

export function ViewSignOffModal({ isOpen, onClose, order, onUploadClick }: ViewSignOffModalProps) {
  if (!isOpen || !order) return null;

  const hasSignOff = !!order.signOffSheetUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-slate-800">查看签收单</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 bg-slate-50/50">
          {hasSignOff ? (
            <div className="space-y-6">
              {/* Status Header */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500 rounded-lg text-white">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-800 text-sm">签收单已上传且确认无误</h4>
                    <p className="text-xs text-emerald-600 mt-0.5">该订单已被正常签收归档</p>
                  </div>
                </div>
                <div className="text-xs font-mono text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-md">
                  已签收
                </div>
              </div>

              {/* Info Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 border border-slate-100 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
                    <User size={14} />
                    <span>签收人</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">{order.signBy}</div>
                </div>
                <div className="bg-white p-4 border border-slate-100 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
                    <Calendar size={14} />
                    <span>签收时间</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 font-mono">{order.signOffTime}</div>
                </div>
                <div className="bg-white p-4 border border-slate-100 rounded-xl shadow-sm">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1 font-medium">
                    <FileText size={14} />
                    <span>单据类型</span>
                  </div>
                  <div className="text-sm font-bold text-slate-800">纸质签收件扫描件</div>
                </div>
              </div>

              {/* Document Visualizer */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8 overflow-hidden relative">
                {/* Simulated Stamp and Paper Layout */}
                <div className="max-w-xl mx-auto border-2 border-dashed border-slate-200 rounded-lg p-6 bg-amber-50/10 relative shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                  {/* Watermark Logo */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
                    <ClipboardCheck size={280} className="text-slate-900" />
                  </div>

                  <div className="text-center border-b border-slate-200 pb-4 mb-6">
                    <h2 className="text-lg font-bold text-slate-800 tracking-wider">客户货物签收凭证</h2>
                    <p className="text-xxs text-slate-400 font-mono mt-1">GOODS RECEIPT CONFIRMATION</p>
                  </div>

                  {/* Metadata Fields */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-slate-600 mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <span className="text-slate-400 font-medium">销售订单号:</span>{' '}
                      <span className="font-mono text-slate-800 font-bold">{order.salesOrderNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium">配送方式:</span>{' '}
                      <span className="text-slate-800">{order.deliveryMethod || '自配送'}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 font-medium">采购方名称:</span>{' '}
                      <span className="text-slate-800 font-medium">{order.purchaserName}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-slate-400 font-medium">收货地址:</span>{' '}
                      <span className="text-slate-800">{order.recipientAddress}</span>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="border border-slate-100 rounded-lg overflow-hidden mb-6 text-xs bg-white">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-3 py-2">商品名称</th>
                          <th className="px-3 py-2 w-24 text-center">规格/型号</th>
                          <th className="px-3 py-2 w-20 text-center">签收数量</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {order.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-3 py-2 font-medium">{item.name}</td>
                            <td className="px-3 py-2 text-center text-slate-500">{item.specification || item.model}</td>
                            <td className="px-3 py-2 text-center font-bold text-slate-800">{item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Clear separation signature and official stamp */}
                  <div className="flex justify-between items-end mt-12 relative px-2">
                    <div className="text-xs text-slate-600 space-y-1">
                      <div>
                        <span className="text-slate-400">送货人签字:</span> <span className="font-mono italic text-slate-500">张师傅</span>
                      </div>
                      <div>
                        <span className="text-slate-400">签收日期:</span> <span className="font-mono text-slate-800">{order.signOffTime?.slice(0, 10)}</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 text-right space-y-1 relative pr-10">
                      <div>
                        <span className="text-slate-400">收货人(签字):</span>{' '}
                        <span className="font-serif italic font-bold text-lg text-blue-900 border-b border-slate-300 pb-0.5 ml-1">
                          {order.signBy}
                        </span>
                      </div>
                      <div className="text-xxs text-slate-400 font-mono mt-1">RECIPIENT SIGNATURE SECURE</div>

                      {/* Red Client Seal */}
                      <div className="absolute -top-16 -right-6 pointer-events-none select-none transform rotate-12 opacity-85">
                        <svg width="84" height="84" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="54" stroke="#dc2626" strokeWidth="2.5" fill="none" />
                          <circle cx="60" cy="60" r="50" stroke="#dc2626" strokeWidth="0.8" fill="none" strokeDasharray="3,1" />
                          <polygon points="60,45 63,55 74,55 65,61 68,71 60,65 52,71 55,61 46,55 57,55" fill="#dc2626" />
                          <text fill="#dc2626" fontSize="7" fontWeight="black" textAnchor="middle">
                            <textPath href="#modal-seal-text-path" startOffset="50%" textAnchor="middle">
                              {order.purchaserName.slice(0, 12)}...
                            </textPath>
                          </text>
                          <defs>
                            <path id="modal-seal-text-path" d="M 16 60 A 44 44 0 1 1 104 60" fill="none" />
                          </defs>
                          <text x="60" y="82" fill="#dc2626" fontSize="7.5" fontWeight="bold" textAnchor="middle" letterSpacing="1">
                            收货专用章
                          </text>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 bg-white border border-slate-100 rounded-2xl">
              <div className="p-4 bg-amber-50 text-amber-500 rounded-full mb-4">
                <AlertCircle size={32} />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">未上传签收单</h4>
              <p className="text-slate-500 text-sm text-center max-w-sm mb-6">
                该订单状态已收货，但尚未上传纸质回单或电子签收凭证。您可以立即在此上传。
              </p>
              <button
                onClick={onUploadClick}
                className="px-5 py-2.5 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-2"
              >
                <UploadCloud size={16} />
                立即上传签收单
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            关闭
          </button>
          {hasSignOff && (
            <button
              onClick={onUploadClick}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-1.5"
            >
              <Trash2 size={15} />
              重新上传
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface UploadSignOffModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSubmit: (orderId: string, signOffData: { signOffSheetUrl: string; signBy: string; signOffTime: string }) => void;
}

export function UploadSignOffModal({ isOpen, onClose, order, onSubmit }: UploadSignOffModalProps) {
  const [signBy, setSignBy] = useState('');
  const [signOffTime, setSignOffTime] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; preview: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (order && isOpen) {
      setSignBy(order.recipientName || order.signBy || '');
      
      // Default signOffTime to current local date and time in YYYY-MM-DD HH:mm:ss format
      const now = new Date();
      const pad = (num: number) => num.toString().padStart(2, '0');
      const formattedTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setSignOffTime(order.signOffTime || formattedTime);

      if (order.signOffSheetUrl) {
        setUploadedFile({
          name: '纸质货物签收单扫描件.png',
          size: '342 KB',
          preview: 'mock_uploaded_sign_off.png'
        });
      } else {
        setUploadedFile(null);
      }
      setErrorMsg('');
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setErrorMsg('请上传图片(JPEG/PNG)或PDF格式的文件');
      return;
    }
    
    setErrorMsg('');
    const sizeKB = (file.size / 1024).toFixed(0);
    setUploadedFile({
      name: file.name,
      size: `${sizeKB} KB`,
      preview: URL.createObjectURL(file)
    });
  };

  const clearFile = () => {
    setUploadedFile(null);
  };

  const handleSave = () => {
    if (!uploadedFile) {
      setErrorMsg('请上传签收回单扫描件或现场合照证明');
      return;
    }

    const finalSignBy = signBy.trim() || order.recipientName || order.signBy || '收件员';
    const finalSignOffTime = signOffTime.trim() || order.signOffTime || (() => {
      const now = new Date();
      const pad = (num: number) => num.toString().padStart(2, '0');
      return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    })();

    onSubmit(order.id, {
      signOffSheetUrl: uploadedFile.preview,
      signBy: finalSignBy,
      signOffTime: finalSignOffTime
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 flex-shrink-0">
          <div className="flex items-center gap-2">
            <UploadCloud className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-slate-800">上传签收单</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2 font-medium">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              签收单附件 <span className="text-red-500">*</span>
            </label>
            
            {!uploadedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200
                  ${isDragging 
                    ? 'border-blue-500 bg-blue-50/50' 
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }
                `}
                onClick={() => document.getElementById('sign-off-file-input')?.click()}
              >
                <input 
                  id="sign-off-file-input"
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="p-4 bg-blue-50 text-blue-500 rounded-full mb-4">
                  <UploadCloud size={28} />
                </div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">
                  拖拽签收单文件到此处，或 <span className="text-blue-500">点击浏览</span>
                </h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed mt-1">
                  支持 JPG、PNG、JPEG 或 PDF 格式，单张大小不超过 10MB。请保证单章底纹清晰，附带红色公章或清晰亲笔签名。
                </p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <div className="w-14 h-14 bg-white border border-slate-100 rounded-xl flex items-center justify-center p-1 overflow-hidden shrink-0">
                    {uploadedFile.preview.includes('mock_uploaded_sign_off') ? (
                      <div className="p-1 px-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-500 flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                    ) : (
                      <img 
                        src={uploadedFile.preview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 truncate max-w-md">{uploadedFile.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{uploadedFile.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all shadow-md shadow-blue-200 flex items-center gap-1.5"
          >
            确认提交
          </button>
        </div>

      </div>
    </div>
  );
}
