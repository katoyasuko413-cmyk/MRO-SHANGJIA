import React from 'react';
import { ClipboardCheck, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QualificationWarning() {
  const navigate = useNavigate();

  const handleQualifySubmit = () => {
    navigate('/qualification-wizard');
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto mt-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-8 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 relative border-2 border-white shadow-sm">
          <ClipboardCheck className="w-8 h-8 text-blue-600" />
          <div className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white text-[10px] font-bold">!</span>
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">完成企业资质认证</h1>
        <p className="text-slate-500 mb-6 max-w-2xl text-sm leading-relaxed">
          您好，欢迎入驻天创MRO商城！为了保障平台交易安全与合规，在开展任何业务之前，请先提交您的企业资质信息进行审核。
        </p>

        <div className="bg-slate-50/80 rounded-2xl p-6 text-left w-full mb-8 border border-slate-100/60">
           <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
             <FileText className="w-4 h-4 text-blue-500" />
             请准备以下材料：
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100/50">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">1</div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">营业执照</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">需为彩色扫描件，并在复印件上加盖公章。</div>
                </div>
             </div>
             <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100/50">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">2</div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">财务三表 (近一年度)</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">资产负债表、利润表、现金流量表，加盖公章。</div>
                </div>
             </div>
             <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100/50">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">3</div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">廉洁承诺书</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">使用平台提供模板，法定代表人签字并加盖公章。</div>
                </div>
             </div>
             <div className="flex items-start gap-3 p-3 bg-white rounded-xl shadow-sm border border-slate-100/50">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 text-xs mt-0.5">4</div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">国家企业信用信息公示截图</div>
                  <div className="text-xs text-slate-500 mt-1 leading-relaxed">查询结果体现企业信息无经营异常。</div>
                </div>
             </div>
           </div>
        </div>

        <button 
          onClick={handleQualifySubmit}
          className="bg-[#0F172A] hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm"
        >
          我已准备好，立即去认证
        </button>
      </div>
    </div>
  );
}
