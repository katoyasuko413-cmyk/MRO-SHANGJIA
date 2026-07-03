import React, { useState, useEffect, useRef } from 'react';
import { X, Check, AlertCircle, UploadCloud, FileText, Download, Trash2, Printer } from 'lucide-react';
import { Order } from '../../models/order';

interface OrderContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirmSigning?: (orderId: string, type: 'online' | 'offline', fileUrl?: string) => void;
}

export function OrderContractModal({
  isOpen,
  onClose,
  order,
  onConfirmSigning
}: OrderContractModalProps) {
  const [activeTab, setActiveTab] = useState<'online' | 'offline'>('online');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; preview: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSigning, setIsSigning] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveTab('online');
      setUploadedFile(null);
      setErrorMsg('');
      setIsSigning(false);
      setSignSuccess(false);
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const totalExcl = order.totalAmountExclTax || 0;
  const totalIncl = order.totalAmountInclTax || order.salesAmount || 0;

  // Detect appropriate units
  const detectUnit = (specification: string, name: string): string => {
    const text = (specification + name).toLowerCase();
    if (text.includes('盒')) return '盒';
    if (text.includes('支')) return '支';
    if (text.includes('套')) return '套';
    if (text.includes('个')) return '个';
    if (text.includes('件')) return '件';
    if (text.includes('把')) return '把';
    if (text.includes('双')) return '双';
    if (text.includes('台')) return '台';
    if (text.includes('箱')) return '箱';
    if (text.includes('包')) return '包';
    return '个';
  };

  // Trigger spreadsheet/contract download
  const handleDownloadContract = () => {
    const excelHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta charset="utf-8">
<!--[if gte mso 9]>
<xml>
 <x:ExcelWorkbook>
  <x:ExcelWorksheets>
   <x:ExcelWorksheet>
    <x:Name>订货合同</x:Name>
    <x:WorksheetOptions>
     <x:DisplayGridlines/>
    </x:WorksheetOptions>
   </x:ExcelWorksheet>
  </x:ExcelWorksheets>
 </x:ExcelWorkbook>
</xml>
<![endif]-->
<style>
  td { font-family: 'PingFang SC', Arial, sans-serif; font-size: 11pt; color: #000000; vertical-align: middle; }
  .title { font-size: 18pt; font-weight: bold; text-align: center; }
  .subtitle { font-size: 11pt; text-align: center; font-weight: bold; }
  .left-align { text-align: left; }
  .right-align { text-align: right; }
  .center-align { text-align: center; }
  .header-cell { font-weight: normal; text-align: center; border: 0.5pt solid #000000; font-size: 11pt; }
  .data-cell { border: 0.5pt solid #000000; font-size: 11pt; }
  .bold-text { font-weight: bold; }
</style>
</head>
<body>
<table border="0" style="border-collapse:collapse;width:100%;">
  <tr style="height:35pt;">
    <td colspan="10" class="title">订 货 合 同</td>
  </tr>
  <tr style="height:25pt;">
    <td colspan="10" class="subtitle">合同编号: ${order.salesOrderNo}</td>
  </tr>
  <tr style="height:15pt;">
    <td colspan="10"></td>
  </tr>
  <tr style="height:20pt;">
    <td colspan="10" class="left-align bold-text">甲方(需方)：<span style="font-weight:normal;">${order.purchaserName}</span></td>
  </tr>
  <tr style="height:20pt;">
    <td colspan="10" class="left-align bold-text">乙方(供方)：<span style="font-weight:normal;">苏州优选智造科技有限公司</span></td>
  </tr>
  <tr style="height:22pt;">
    <td colspan="10" class="left-align" style="font-size:11pt; color: #000;">一．产品名称，数量，价格</td>
  </tr>
  <tr style="height:30pt; background-color:#ffffff;">
    <td class="header-cell" style="width:100px;">物料号</td>
    <td class="header-cell" style="width:220px;">产品名称</td>
    <td class="header-cell" style="width:80px;">规格型号</td>
    <td class="header-cell" style="width:80px;">品牌</td>
    <td class="header-cell" style="width:60px;">单位</td>
    <td class="header-cell" style="width:65px;">数量</td>
    <td class="header-cell" style="width:90px;">单价（未税）</td>
    <td class="header-cell" style="width:90px;">单价（含税）</td>
    <td class="header-cell" style="width:100px;">金额（含税）</td>
    <td class="header-cell" style="width:140px;">备注</td>
  </tr>
  ${order.items.map(item => `
  <tr style="height:40pt;">
    <td class="data-cell center-align">${item.sku || item.id}</td>
    <td class="data-cell left-align" style="padding-left:4px;padding-right:4px;">${item.name}</td>
    <td class="data-cell center-align">${item.specification || item.model || '/'}</td>
    <td class="data-cell center-align">${item.brand || '/'}</td>
    <td class="data-cell center-align">${detectUnit(item.specification, item.name)}</td>
    <td class="data-cell center-align">${item.quantity}</td>
    <td class="data-cell right-align" style="padding-right:4px;">${item.priceExclTax.toFixed(2)}</td>
    <td class="data-cell right-align" style="padding-right:4px;">${item.priceInclTax.toFixed(2)}</td>
    <td class="data-cell right-align" style="padding-right:4px;">${item.amountInclTax.toFixed(2)}</td>
    <td class="data-cell center-align" style="font-size:10pt;">${order.salesOrderNo}</td>
  </tr>
  `).join('')}
  <tr style="height:25pt;">
    <td class="data-cell" colspan="7"></td>
    <td class="data-cell center-align">含税合计</td>
    <td class="data-cell right-align bold-text" style="padding-right:4px;">${totalIncl.toFixed(2)}</td>
    <td class="data-cell"></td>
  </tr>
</table>
</body>
</html>`;

    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `订货合同_${order.salesOrderNo}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

  // Perform signing simulation
  const handleConfirmStamp = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setSignSuccess(true);
      if (onConfirmSigning) {
        onConfirmSigning(order.id, 'online');
      }
    }, 1500);
  };

  // Perform offline submit simulation
  const handleOfflineSubmit = () => {
    if (!uploadedFile) {
      setErrorMsg('请先上传已盖章的回传件扫描件或照片');
      return;
    }

    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setSignSuccess(true);
      if (onConfirmSigning) {
        onConfirmSigning(order.id, 'offline', uploadedFile.preview);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Card Structure matching the dual-pane layout perfectly */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[1240px] h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header bar */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-slate-100 flex-shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-blue-50 text-[#0f52ba] rounded-lg font-bold text-sm">合同管理</span>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">订货合同签署 - {order.salesOrderNo}</h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dual-column body */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Column: Scrollable document preview (65%) */}
          <div className="w-[65%] bg-slate-50 border-r border-slate-100 p-8 overflow-y-auto flex flex-col">
            
            {/* White background A4-like contract paper page */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8 min-h-[1000px] text-slate-900 font-sans leading-relaxed text-sm select-text relative">
              
              {/* Star-shaped background watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.015] select-none pointer-events-none">
                <FileText size={400} />
              </div>

              {/* Title Section */}
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl font-bold tracking-wider text-black">订 货 合 同</h1>
                <p className="text-xs text-slate-400 font-mono">合同编号: {order.salesOrderNo}</p>
              </div>

              {/* Parties Statement */}
              <div className="space-y-2 mb-6 text-xs text-slate-800">
                <p><span className="font-bold">甲方(需方)：</span>{order.purchaserName}</p>
                <p><span className="font-bold">乙方(供方)：</span>苏州优选智造科技有限公司</p>
              </div>

              {/* Products/Items Table Section */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-blue-600 rounded-full inline-block"></span>
                  一．产品名称，数量，价格
                </h3>
                <table className="w-full border-collapse border border-slate-400 text-[11px] text-left">
                  <thead>
                    <tr className="bg-slate-50 font-bold text-slate-700 border-b border-slate-400 text-center">
                      <th className="border border-slate-400 p-2 w-[5%]">序号</th>
                      <th className="border border-slate-400 p-2 w-[15%]">物料号</th>
                      <th className="border border-slate-400 p-2 w-[30%]">产品名称</th>
                      <th className="border border-slate-400 p-2 w-[15%]">规格型号</th>
                      <th className="border border-slate-400 p-2 w-[10%]">品牌</th>
                      <th className="border border-slate-400 p-2 w-[7%]">单位</th>
                      <th className="border border-slate-400 p-2 w-[7%]">数量</th>
                      <th className="border border-slate-400 p-2 w-[11%]">金额（含税）</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="border border-slate-400 p-2 text-center font-mono text-slate-500">{idx + 1}</td>
                        <td className="border border-slate-400 p-2 font-mono text-slate-700 text-center">{item.sku || '/'}</td>
                        <td className="border border-slate-400 p-2 font-medium text-slate-900">{item.name}</td>
                        <td className="border border-slate-400 p-2 text-slate-600 text-center">{item.specification || item.model || '/'}</td>
                        <td className="border border-slate-400 p-2 text-slate-600 text-center">{item.brand || '/'}</td>
                        <td className="border border-slate-400 p-2 text-slate-600 text-center">{detectUnit(item.specification, item.name)}</td>
                        <td className="border border-slate-400 p-2 font-mono font-bold text-center text-slate-800">{item.quantity}</td>
                        <td className="border border-slate-400 p-2 font-mono text-right text-slate-900 font-semibold">¥{item.amountInclTax.toFixed(2)}</td>
                      </tr>
                    ))}
                    {/* Totals Row */}
                    <tr className="bg-slate-50/70 font-bold">
                      <td colSpan={6} className="border border-slate-400 p-2 text-right text-slate-700">含税合计：</td>
                      <td className="border border-slate-400 p-2 text-center font-mono text-slate-800">
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)}
                      </td>
                      <td className="border border-slate-400 p-2 text-right font-mono text-red-600 font-bold text-[12px]">
                        ¥{totalIncl.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tax Note */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 mb-6 space-y-1 font-medium leading-relaxed">
                <p>💡 货物含税总价为货物价款附加国内全额增值税税额。</p>
                <p>💡 当前国内增值税税率为 13%，含税总金额为：<span className="font-bold text-red-600">¥{totalIncl.toFixed(2)}</span> 元，实际付款及开票金额以发生时税率为准。</p>
              </div>

              {/* Delivery and Address Section */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-blue-600 rounded-full inline-block"></span>
                  二．配送及交付信息
                </h3>
                <div className="border border-slate-300 rounded-lg overflow-hidden text-[11px] bg-slate-50/10">
                  <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
                    <div className="p-2 border-r border-slate-200 text-center">销售订单号</div>
                    <div className="p-2 border-r border-slate-200 text-center">收货地址</div>
                    <div className="p-2 text-center">收货人 / 电话</div>
                  </div>
                  <div className="grid grid-cols-3 text-slate-700 font-medium">
                    <div className="p-2.5 border-r border-slate-200 font-mono text-center flex items-center justify-center">{order.salesOrderNo}</div>
                    <div className="p-2.5 border-r border-slate-200 flex items-center">{order.recipientAddress}</div>
                    <div className="p-2.5 text-center flex flex-col justify-center gap-0.5">
                      <span className="font-bold text-slate-800">{order.recipientName}</span>
                      <span className="text-slate-500 font-mono text-[10px]">{order.recipientPhone}</span>
                    </div>
                  </div>
                </div>
              </div>



            </div>
          </div>

          {/* Right Column: Tabbed Action Board (35%) */}
          <div className="w-[35%] border-l border-slate-100 flex flex-col bg-white">
            
            {/* Top Tabs */}
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (!isSigning && !signSuccess) {
                    setActiveTab('online');
                    setErrorMsg('');
                  }
                }}
                className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'online'
                    ? 'border-[#0f52ba] text-[#0f52ba]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40'
                }`}
                disabled={isSigning || signSuccess}
              >
                线上电子签署
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!isSigning && !signSuccess) {
                    setActiveTab('offline');
                    setErrorMsg('');
                  }
                }}
                className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-all cursor-pointer ${
                  activeTab === 'offline'
                    ? 'border-[#0f52ba] text-[#0f52ba]'
                    : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50/40'
                }`}
                disabled={isSigning || signSuccess}
              >
                线下盖章回传
              </button>
            </div>

            {/* Content pane depending on activeTab */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-between">
              
              {signSuccess ? (
                /* Success message block */
                <div className="my-auto space-y-6 text-center py-12 animate-in fade-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-sm">
                    <Check size={32} strokeWidth={3} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold text-slate-800">合同签署确认成功</h4>
                    <p className="text-sm text-slate-500 px-4 leading-relaxed">
                      {activeTab === 'online' 
                        ? '您已成功采用契约锁线上盖章！系统已记录确认信息，正在对接获取签署终态，合同状态已更新为“已签署”并自动归档。'
                        : '您已成功完成线下加盖企业公章并回传！合同扫描件已成功存储，状态同步更改为“已回传并生效”。'
                      }
                    </p>
                  </div>
                  <div className="pt-4 px-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md shadow-slate-100"
                    >
                      我知道了
                    </button>
                  </div>
                </div>
              ) : activeTab === 'online' ? (
                /* ONLINE SIGNING PANEL */
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-6">
                    
                    {/* Circle icon with check mark mimicking the exact image UI */}
                    <div className="text-center pt-8">
                      <div className="w-16 h-16 rounded-full bg-[#f0f5ff] text-[#0f52ba] flex items-center justify-center mx-auto shadow-inner mb-4">
                        <Check size={28} strokeWidth={2.5} />
                      </div>
                      <h4 className="text-base font-bold text-slate-800 tracking-tight">契约锁电子签署</h4>
                      <p className="text-xs text-slate-500 px-6 mt-1.5 leading-relaxed">
                        采用契约锁电子签章方式签署，发起后系统将自动对接获取签署状态。
                      </p>
                    </div>

                    {/* Notice card (Green Alert box from screenshot) */}
                    <div className="bg-emerald-50/80 border border-emerald-100/70 rounded-xl p-4 text-xs leading-relaxed space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                        <AlertCircle size={14} className="text-emerald-600" />
                        <span>签署须知</span>
                      </div>
                      <p className="text-emerald-700 font-medium pl-5">
                        使用线上签署需先在“契约锁”平台完成企业实名认证。使用电子签章可能会产生相应的平台服务费用，请知悉。
                      </p>
                    </div>

                  </div>

                  {/* Actions Area */}
                  <div className="space-y-4">
                    {errorMsg && (
                      <div className="flex gap-2 bg-red-50 border border-red-100 text-red-700 rounded-xl p-3.5 text-xs animate-in fade-in">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleConfirmStamp}
                      disabled={isSigning}
                      className="w-full py-3 text-sm font-bold text-white bg-[#0f52ba] hover:bg-[#0d47a1] disabled:bg-blue-300 rounded-xl transition-all shadow-lg shadow-blue-100/50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSigning ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>正在发起线上盖章...</span>
                        </>
                      ) : (
                        <span>确认盖章</span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* OFFLINE STAMPING PANEL */
                <div className="flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-6">
                    
                    {/* First Step: Download document */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">1</span>
                        <h4 className="text-sm font-bold text-slate-800">下载合同文件</h4>
                      </div>
                      <p className="text-xs text-slate-500 pl-7 leading-relaxed">
                        点击下方按钮，将系统内的订货合同导出为 XLS 文件并进行打印。
                      </p>
                      <div className="pl-7 pt-1">
                        <button
                          type="button"
                          onClick={handleDownloadContract}
                          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
                        >
                          <Download size={13} />
                          下载订货合同 (.xls)
                        </button>
                      </div>
                    </div>

                    {/* Second Step: Print, Stamp, and Upload scan */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0">2</span>
                        <h4 className="text-sm font-bold text-slate-800">上传已盖章的回传件</h4>
                      </div>
                      <p className="text-xs text-slate-500 pl-7 leading-relaxed">
                        在线下对纸质合同进行签字、加盖企业公章（红章）后，将其扫描成图片或 PDF 并上传到此处。
                      </p>

                      <div className="pl-7">
                        {!uploadedFile ? (
                          <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200
                              ${isDragging 
                                ? 'border-blue-500 bg-blue-50/30' 
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                              }
                            `}
                          >
                            <input 
                              type="file"
                              ref={fileInputRef}
                              accept="image/*,application/pdf"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                            <UploadCloud size={24} className="text-blue-500 mb-2" />
                            <h5 className="text-[11px] font-bold text-slate-800 mb-0.5">拖拽文件或点击上传</h5>
                            <p className="text-[9px] text-slate-400">支持图片 (JPG/PNG) 或 PDF，不超过10MB</p>
                          </div>
                        ) : (
                          <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                                <FileText size={16} />
                              </div>
                              <div className="overflow-hidden">
                                <h5 className="text-[11px] font-bold text-slate-800 truncate w-[140px]">{uploadedFile.name}</h5>
                                <p className="text-[9px] text-slate-400 font-mono">{uploadedFile.size}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={clearFile}
                              className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Submit Section */}
                  <div className="space-y-4">
                    {errorMsg && (
                      <div className="flex gap-2 bg-red-50 border border-red-100 text-red-700 rounded-xl p-3.5 text-xs animate-in fade-in">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleOfflineSubmit}
                      disabled={isSigning}
                      className="w-full py-3 text-sm font-bold text-white bg-[#0f52ba] hover:bg-[#0d47a1] disabled:bg-blue-300 rounded-xl transition-all shadow-lg shadow-blue-100/50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSigning ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>正在保存回传件...</span>
                        </>
                      ) : (
                        <span>提交盖章回传</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
