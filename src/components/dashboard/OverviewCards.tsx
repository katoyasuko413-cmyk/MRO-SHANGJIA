import React from 'react';
import { ShoppingBag, TrendingUp, Clock, Headset } from 'lucide-react';

export function OverviewCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <ShoppingBag size={20} />
          </div>
          <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+12%</span>
        </div>
        <div className="text-3xl font-extrabold text-slate-900">342</div>
        <div className="text-sm font-medium text-slate-500 mt-1">今日订单量</div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <TrendingUp size={20} />
          </div>
          <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-full">+8.4%</span>
        </div>
        <div className="text-3xl font-extrabold text-slate-900">¥ 45,280</div>
        <div className="text-sm font-medium text-slate-500 mt-1">累计销售额</div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500">
            <Clock size={20} />
          </div>
          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full">加急</span>
        </div>
        <div className="text-3xl font-extrabold text-slate-900">56</div>
        <div className="text-sm font-medium text-slate-500 mt-1">待处理订单</div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
            <Headset size={20} />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-slate-900">12</div>
        <div className="text-sm font-medium text-slate-500 mt-1">售后待处理</div>
      </div>
    </div>
  );
}
