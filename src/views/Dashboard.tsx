import React from 'react';
import { QualificationWarning } from '../components/dashboard/QualificationWarning';
import { QualificationReviewing } from '../components/dashboard/QualificationReviewing';
import { OverviewCards } from '../components/dashboard/OverviewCards';
import { OverviewChart } from '../components/dashboard/OverviewChart';
import { QuickActions } from '../components/dashboard/QuickActions';

export default function Dashboard() {
  const qualificationState = localStorage.getItem('isQualified') || 'false';

  if (qualificationState === 'false') {
    return <QualificationWarning />;
  }

  if (qualificationState === 'reviewing') {
    return <QualificationReviewing />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* 左侧：经营概览 (3列) */}
        <div className="lg:col-span-3 space-y-6">
          <h2 className="text-xl font-bold text-slate-800">经营概览</h2>
          <OverviewCards />

          <h2 className="text-xl font-bold text-slate-800 pt-4">核心数据看板</h2>
          <OverviewChart />
        </div>

        {/* 右侧：快捷入口 (1列) */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold text-slate-800">快捷入口</h2>
          <QuickActions />
        </div>

      </div>
    </div>
  );
}
