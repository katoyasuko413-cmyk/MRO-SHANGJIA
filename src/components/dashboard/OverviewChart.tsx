import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '08:00', 订单量: 120, 销售额: 2400 },
  { name: '10:00', 订单量: 200, 销售额: 5600 },
  { name: '12:00', 订单量: 150, 销售额: 3200 },
  { name: '14:00', 订单量: 280, 销售额: 7800 },
  { name: '16:00', 订单量: 350, 销售额: 9600 },
  { name: '18:00', 订单量: 450, 销售额: 12500 },
  { name: '20:00', 订单量: 300, 销售额: 8000 },
];

export function OverviewChart() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex gap-4">
          <button className="text-sm font-bold text-blue-600 border-b-2 border-blue-600 pb-1">今日</button>
          <button className="text-sm font-medium text-slate-400 hover:text-slate-700 pb-1">昨日</button>
          <button className="text-sm font-medium text-slate-400 hover:text-slate-700 pb-1">本月</button>
          <button className="text-sm font-medium text-slate-400 hover:text-slate-700 pb-1">上月</button>
        </div>
        <div className="flex gap-4 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#0F172A]"></div>
            销售额
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            订单量
          </div>
        </div>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dx={-10} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dx={10} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Line yAxisId="left" type="monotone" dataKey="销售额" stroke="#0F172A" strokeWidth={3} activeDot={{ r: 8 }} />
            <Line yAxisId="right" type="monotone" dataKey="订单量" stroke="#3B82F6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
