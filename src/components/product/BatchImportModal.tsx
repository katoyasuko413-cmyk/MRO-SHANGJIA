import React from 'react';
import { X, Download, Upload } from 'lucide-react';

interface BatchImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BatchImportModal({ isOpen, onClose }: BatchImportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">批量导入商品</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800">导入模板必需列：</span>供应商SKU、商品名称、品牌、主品类ID、规格、型号、单位、税点(1/9/13)、未税含运采购价、货期(天)、库存数量。<br className="my-1"/>
            <span className="font-bold text-slate-800">可选列：</span>商品合同名称、场景(多个用逗号分隔)、标签(多个用逗号分隔)。<br className="my-1"/>
            上传后将直接导入为<span className="text-blue-600 font-bold px-1">草稿</span>状态，重复的供应商SKU将被跳过。
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold transition-all shadow-sm">
              <Download size={18} className="text-slate-400" />
              下载模板
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow-sm shadow-blue-200 relative overflow-hidden">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                accept=".xlsx, .xls, .csv"
              />
              <Upload size={18} className="text-blue-100" />
              上传并导入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
