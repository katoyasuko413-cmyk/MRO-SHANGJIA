import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardCheck, Clock, FileText, CheckCircle2, Building2, Plus, Edit, ChevronRight } from 'lucide-react';

export interface EnterpriseQualification {
  id: string;
  name: string;
  status: 'reviewing' | 'certified' | 'rejected';
  submitDate: string;
}

export default function QualificationMgmt() {
  const navigate = useNavigate();
  const [enterprises, setEnterprises] = useState<EnterpriseQualification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('enterprises');
    let data: EnterpriseQualification[] = [];
    if (saved) {
      data = JSON.parse(saved);
      if (data.length === 1 && data[0].id === '1') {
        data.push({ id: '2', name: '其他企业', status: 'certified', submitDate: new Date().toISOString().split('T')[0] });
        localStorage.setItem('enterprises', JSON.stringify(data));
      }
    } else {
      const qualificationState = localStorage.getItem('isQualified');
      if (qualificationState === 'reviewing') {
        data = [
          { id: '1', name: '默认企业信息', status: 'reviewing', submitDate: new Date().toISOString().split('T')[0] },
          { id: '2', name: '其他企业', status: 'certified', submitDate: new Date().toISOString().split('T')[0] }
        ];
      } else if (qualificationState === 'true') {
        data = [
          { id: '1', name: '默认企业信息', status: 'certified', submitDate: new Date().toISOString().split('T')[0] },
          { id: '2', name: '其他企业', status: 'reviewing', submitDate: new Date().toISOString().split('T')[0] }
        ];
      }
      if (data.length > 0) {
        localStorage.setItem('enterprises', JSON.stringify(data));
      }
    }
    setEnterprises(data);
  }, []);

  const handleCreate = () => {
    navigate('/qualification-wizard');
  };

  const handleEdit = (id: string) => {
    navigate(`/qualification-wizard?id=${id}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'certified':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200"><CheckCircle2 size={14} /> 已认证</span>;
      case 'reviewing':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200"><Clock size={14} className="animate-spin" /> 审核中</span>;
      case 'rejected':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-sm font-medium border border-red-200"><FileText size={14} /> 已驳回</span>;
      default:
        return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto mt-4 px-4 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">资质管理</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">管理您的企业认证与经营资质信息。一个账号最多可入驻5个企业信息。</p>
        </div>
        <button
          onClick={handleCreate}
          disabled={enterprises.length >= 5}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-sm whitespace-nowrap ${
            enterprises.length >= 5
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-[#0F172A] hover:bg-slate-800 text-white shadow-slate-200'
          }`}
        >
          <Plus size={18} />
          {enterprises.length >= 5 ? '已达到入驻上限' : '新增入驻企业'}
        </button>
      </div>

      {enterprises.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-sm text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative border-4 border-white shadow-sm">
            <ClipboardCheck className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">您尚未完成任何企业资质认证</h2>
          <p className="text-slate-500 mb-8 max-w-2xl text-sm leading-relaxed">
            为了保障平台交易安全与合规，请提交您的企业资质信息进行审核。一个账号最多支持入驻5个企业。
          </p>
          
          <button 
            onClick={handleCreate}
            className="bg-[#0F172A] hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 text-sm"
          >
            立即去认证
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {enterprises.map((ent) => (
            <div key={ent.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100 opacity-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start sm:items-center gap-5">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0">
                    <Building2 className="w-7 h-7 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <h3 className="text-lg font-bold text-slate-900">{ent.name}</h3>
                      {getStatusBadge(ent.status)}
                    </div>
                    <div className="text-sm text-slate-500 font-medium">
                      提交日期：{ent.submitDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(ent.id)}
                    className="flex text-sm items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-lg transition-all"
                  >
                    <Edit size={16} className="text-slate-500" />
                    查看 / 修改信息
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
