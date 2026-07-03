import React from 'react';
import { UploadBox } from './UploadBox';

export default function Step4FinanceInfo({ mockData }: { mockData?: boolean }) {
  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
        
      {/* 银行信息 */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">银行信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>银行开户许可证</label>
            <div className="text-xs text-slate-500 mb-2 mt-1">支持 png、jpg 格式，大小小于 10M，请保证照片清晰可辨。</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <UploadBox title="上传银行开户许可证" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>银行名称</label>
            <input type="text" defaultValue={mockData ? "中国工商银行" : undefined} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="请输入银行名称" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>银行公户</label>
            <input type="text" defaultValue={mockData ? "某某科技制造有限公司" : undefined} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="请输入公户名称" />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>开户行号</label>
            <input type="text" defaultValue={mockData ? "10283918239" : undefined} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="请输入开户地联行号" />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>银行账号类型</label>
            <select defaultValue={mockData ? "对公账户" : ""} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-colors">
                <option value="">请选择账号类型</option>
                <option value="对公账户">对公基本账户</option>
                <option value="对公一般账户">对公一般账户</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>开户行地址</label>
            <input type="text" defaultValue={mockData ? "北京市朝阳区开户行支行路1号" : undefined} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="请输入开户行详细地址" />
          </div>
        </div>
      </div>

      {/* 结算信息 */}
      <div className="mb-0">
        <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">结算信息</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
          <div className="space-y-3 md:col-span-2">
            <label className="text-sm font-bold text-slate-800 block"><span className="text-red-500 mr-1">*</span>发票类型</label>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="invoiceType" defaultChecked className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-slate-300" />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">增值税专用发票</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="invoiceType" className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-slate-300" />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">增值税普通发票</span>
              </label>
            </div>
          </div>

          <div className="space-y-3 md:col-span-2">
            <label className="text-sm font-bold text-slate-800 block"><span className="text-red-500 mr-1">*</span>税率</label>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="taxRate" className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-slate-300" />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">1%</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="taxRate" className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-slate-300" />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">9%</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="radio" name="taxRate" defaultChecked className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-slate-300" />
                <span className="text-sm text-slate-700 group-hover:text-slate-900">13%</span>
              </label>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
