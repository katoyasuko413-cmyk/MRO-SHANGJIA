import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { X, Edit2 } from 'lucide-react';
import Step1Agreement from './qualification/Step1Agreement';
import Step2EnterpriseInfo from './qualification/Step2EnterpriseInfo';
import Step3BusinessInfo from './qualification/Step3BusinessInfo';
import Step4FinanceInfo from './qualification/Step4FinanceInfo';

export default function QualificationWizard() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  
  const [isCertified, setIsCertified] = useState(false);
  const [editable, setEditable] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (editId) {
      const saved = localStorage.getItem('enterprises');
      if (saved) {
        const data = JSON.parse(saved);
        const ent = data.find((e: any) => e.id === editId);
        if (ent) {
          if (ent.status === 'certified') {
            setIsCertified(true);
            setEditable(false);
            setCurrentStep(2); // Skip agreement
          }
        }
      }
    }
  }, [editId]);

  const steps = isCertified 
    ? [
        { num: 2, title: '企业信息' },
        { num: 3, title: '经营信息' },
        { num: 4, title: '财务信息' },
      ]
    : [
        { num: 1, title: '入驻协议签署' },
        { num: 2, title: '企业信息填写' },
        { num: 3, title: '经营信息填写' },
        { num: 4, title: '财务信息填写' },
      ];

  const renderCurrentStep = () => {
    const wrapped = (content: React.ReactNode) => (
      <fieldset disabled={!editable} className={!editable ? "opacity-90 pointer-events-none" : ""}>
        {content}
      </fieldset>
    );
    switch (currentStep) {
      case 1: return <Step1Agreement />;
      case 2: return wrapped(<Step2EnterpriseInfo mockData={isCertified} />);
      case 3: return wrapped(<Step3BusinessInfo mockData={isCertified} />);
      case 4: return wrapped(<Step4FinanceInfo mockData={isCertified} />);
      default: return null;
    }
  };

  const getStepIndex = (num: number) => {
    return steps.findIndex(s => s.num === num);
  };

  const currentStepIndex = getStepIndex(currentStep);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] h-[95vh] animate-in zoom-in-95 duration-200">
        
        {/* 头部：标题与关闭按钮 */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              {isCertified ? '入驻企业详情' : '入驻资质认证'}
            </h2>
            {isCertified && !editable && (
               <span className="px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                 已认证
               </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isCertified && !editable && (
              <button 
                onClick={() => setEditable(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <Edit2 size={14} />
                编辑信息
              </button>
            )}
            <button 
              onClick={() => navigate('/qualification')} 
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 进度条 */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="max-w-2xl mx-auto relative px-4">
            {/* 连接线 */}
            <div className="absolute top-4 left-10 right-10 h-[2px] bg-slate-200"></div>
            {/* 覆盖已完成的连线 */}
            <div 
              className="absolute top-4 left-10 h-[2px] bg-blue-500 transition-all duration-500"
              style={{ width: `calc(${(currentStepIndex / (steps.length - 1)) * 100}% - 0px)` }}
            ></div>

            <div className="flex items-center justify-between relative z-10">
              {steps.map((step, index) => {
                const isCompleted = currentStepIndex > index;
                const isCurrent = currentStep === step.num;
                
                return (
                  <div key={step.num} className="flex flex-col items-center bg-transparent">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 bg-slate-50
                        ${isCurrent ? 'border-blue-500 text-blue-500' : 
                          isCompleted ? 'border-blue-500 text-blue-500' : 'border-slate-300 text-slate-400'}`}
                    >
                      {index + 1}
                    </div>
                    <div 
                      className={`mt-1.5 font-bold text-xs bg-slate-50 px-1
                        ${isCurrent ? 'text-blue-500' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}
                    >
                      {step.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-6 md:px-10 overflow-y-auto flex-1 bg-white">
          {renderCurrentStep()}
        </div>

        {/* 底部操作区 */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white shrink-0 flex items-center justify-between">
            {currentStep === 1 ? (
              <>
                 <div className="flex flex-wrap items-center gap-4 md:gap-8">
                    <div className="flex gap-6 text-sm text-slate-800">
                      <div>签署人姓名：<span className="font-bold border-b border-slate-300 pb-0.5 px-2">张三</span></div>
                      <div>签署时间：<span className="font-bold border-b border-slate-300 pb-0.5 px-2">2024.01.01</span></div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer group select-none ml-0 md:ml-4">
                      <div className={`w-4 h-4 flex items-center justify-center border rounded-sm transition-colors ${agreed ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-slate-50 group-hover:border-slate-400'}`}>
                        {agreed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <input 
                        type="checkbox" 
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        className="hidden"
                      />
                      <span className="font-bold text-slate-800 text-sm hover:text-blue-500 transition-colors">我已阅读并同意《平台入驻协议》</span>
                    </label>
                 </div>
                 <button 
                  disabled={!agreed}
                  onClick={() => setCurrentStep(2)}
                  className={`px-8 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${
                    agreed 
                    ? 'bg-[#0F172A] text-white hover:bg-slate-800 hover:shadow-md active:scale-95' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                 >
                   同意并进入下一步
                 </button>
              </>
            ) : (
               <div className="flex w-full justify-between items-center">
                 {currentStepIndex > 0 ? (
                   <button 
                    onClick={() => setCurrentStep(steps[currentStepIndex - 1].num)} 
                    className="px-6 py-2.5 border border-slate-300 text-slate-600 rounded-lg font-bold hover:bg-slate-50 transition-colors text-sm"
                   >
                     返回上一步
                   </button>
                 ) : <div></div>}
                 
                 {editable ? (
                   <button 
                    onClick={() => {
                      if (currentStepIndex < steps.length - 1) {
                        setCurrentStep(steps[currentStepIndex + 1].num);
                      } else {
                        const saved = localStorage.getItem('enterprises');
                        let data = saved ? JSON.parse(saved) : [];
                        
                        if (editId) {
                          const index = data.findIndex((e: any) => e.id === editId);
                          if (index > -1) {
                            // If it's certified and edited, maybe it stays certified?
                            // the mock logic just updates loosely
                          }
                        } else {
                          data.push({
                            id: Date.now().toString(),
                            name: `填报企业${data.length + 1}`,
                            status: 'reviewing',
                            submitDate: new Date().toISOString().split('T')[0]
                          });
                        }
                        
                        localStorage.setItem('enterprises', JSON.stringify(data));
                        const isAnyCertified = data.some((e: any) => e.status === 'certified');
                        if (!isAnyCertified) {
                          localStorage.setItem('isQualified', 'reviewing');
                        }
                        window.location.href = '/qualification';
                      }
                    }}
                    className="px-8 py-2.5 bg-[#0F172A] text-white hover:bg-slate-800 hover:shadow-md active:scale-95 text-sm font-bold rounded-lg transition-all"
                   >
                     {currentStepIndex === steps.length - 1 ? '提交审核' : '下一步'}
                   </button>
                 ) : (
                   <button 
                    onClick={() => {
                      if (currentStepIndex < steps.length - 1) {
                        setCurrentStep(steps[currentStepIndex + 1].num);
                      } else {
                        navigate('/qualification');
                      }
                    }}
                    className="px-8 py-2.5 bg-[#0F172A] text-white hover:bg-slate-800 hover:shadow-md active:scale-95 text-sm font-bold rounded-lg transition-all"
                   >
                     {currentStepIndex === steps.length - 1 ? '我知道了' : '下一步'}
                   </button>
                 )}
               </div>
            )}
        </div>
        
      </div>
    </div>
  );
}
