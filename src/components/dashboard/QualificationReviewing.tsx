import React from 'react';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QualificationReviewing() {
  const navigate = useNavigate();

  const handleQualifySubmit = () => {
    navigate('/qualification-wizard');
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto mt-4">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-12 text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative border-4 border-white shadow-sm">
          <Clock className="w-10 h-10 text-blue-600 animate-pulse" />
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">企业资质认证正在审核中</h1>
        
        <div className="text-slate-500 mb-8 max-w-xl text-center space-y-2">
          <p className="text-sm leading-relaxed">
            您的入驻审核资料已提交，平台工作人员正在加急审核中。
          </p>
          <p className="text-sm leading-relaxed font-medium text-blue-600 bg-blue-50 inline-block px-4 py-1.5 rounded-full">
            预计审核周期：1-2 个工作日
          </p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 text-left w-full max-w-lg mb-8 border border-slate-100">
           <h3 className="text-sm font-bold text-slate-800 mb-3 text-center">审核期间您可以：</h3>
           <ul className="text-sm text-slate-600 space-y-3">
             <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
               <span>浏览工作台概览结构。</span>
             </li>
             <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
               <span>审核通过后，我们将通过短信或邮件通知您。</span>
             </li>
             <li className="flex items-start gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-1.5 shrink-0"></div>
               <span>如果发现资料填写错误，您可以撤回并重新提交。</span>
             </li>
           </ul>
        </div>

        <button 
          onClick={handleQualifySubmit}
          className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 px-8 py-2.5 rounded-lg font-bold transition-all shadow-sm active:scale-95 text-sm"
        >
          查看/修改资质信息
        </button>
      </div>
    </div>
  );
}
