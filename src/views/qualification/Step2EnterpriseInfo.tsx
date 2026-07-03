import React from 'react';
import { UploadBox } from './UploadBox';

export default function Step2EnterpriseInfo({ mockData }: { mockData?: boolean }) {
    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
            <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">企业信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>经营执照</label>
                        <div className="text-xs text-slate-500 mt-1 mb-2">支持 png、jpg 格式，大小小于 10M。三证合一，只需要上传一张营业执照即可。</div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <UploadBox title="上传营业执照" />
                            <UploadBox title="上传组织机构代码证" />
                            <UploadBox title="上传税务登记证" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>企业名称</label>
                        <input type="text" defaultValue={mockData ? "某某知名科技制造有限公司" : undefined} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="请输入企业名称" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>统一社会信用代码</label>
                        <input type="text" defaultValue={mockData ? "911100000000000000" : undefined} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="请输入统一社会信用代码" />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>公司地址</label>
                        <input type="text" defaultValue={mockData ? "北京市朝阳区高新科技园区88号" : undefined} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="请输入公司详细地址" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-800">注册资金</label>
                        <div className="relative">
                            <input type="text" defaultValue={mockData ? "1000" : undefined} className="w-full border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="请输入注册资金" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">万元</span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-800">年销售额</label>
                        <div className="relative">
                            <input type="text" defaultValue={mockData ? "5000" : undefined} className="w-full border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="请输入年销售额" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">万元</span>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-800">公司人数</label>
                        <div className="relative">
                            <input type="text" defaultValue={mockData ? "200" : undefined} className="w-full border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="请输入公司人数" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">人</span>
                        </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>财务三表<span className="text-xs text-slate-400 font-normal ml-2">（近一年数据）</span></label>
                        <div className="text-xs text-slate-500 mb-2 mt-1">请提供近一年的资产负债表、利润表、现金流量表，需加盖公章。</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            <UploadBox title="上传财务三表" />
                        </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>廉洁承诺书</label>
                            <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                模板下载
                            </a>
                        </div>
                        <div className="text-xs text-slate-500 mb-2 mt-1">使用平台提供模板，法定代表人签字并加盖公章。</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            <UploadBox title="上传廉洁承诺书" />
                        </div>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <div className="flex items-center gap-4">
                            <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>国家企业信用信息公示系统截图</label>
                            <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                                查看示例
                            </a>
                        </div>
                        <div className="text-xs text-slate-500 mb-2 mt-1">查询结果体现企业信息无经营异常。</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            <UploadBox title="上传截图" />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mb-0">
                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-3 border-b border-slate-100">法人信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>法人证件电子版</label>
                        <div className="text-xs text-slate-500 mb-2 mt-1">支持 png、jpg 格式，大小小于 10M，请保证文字清晰可辨。</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <UploadBox title="上传身份证人像面" />
                            <UploadBox title="上传身份证国徽面" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>法定代表人姓名</label>
                        <input type="text" defaultValue={mockData ? "张三" : undefined} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="与身份证姓名一致" />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>法定代表人证件号</label>
                        <input type="text" defaultValue={mockData ? "110105199001011234" : undefined} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="请输入身份证号码" />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-800"><span className="text-red-500 mr-1">*</span>证件有效期</label>
                        <div className="flex gap-2 items-center">
                            <input type="text" defaultValue={mockData ? "2020-01-01" : undefined} className="w-36 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="YYYY-MM-DD" />
                            <span className="text-slate-400">-</span>
                            <input type="text" defaultValue={mockData ? "长期" : undefined} className="w-36 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors" placeholder="YYYY-MM-DD 或长期" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
