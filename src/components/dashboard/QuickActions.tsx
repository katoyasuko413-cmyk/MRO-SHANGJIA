import React from 'react';
import { Package, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <p className="text-sm text-slate-500 mb-6">快速处理日常高频业务</p>
        
        <button 
          onClick={() => navigate('/order')}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all group bg-slate-50"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <ShoppingCart size={24} />
          </div>
          <div className="text-left flex-1">
            <div className="font-bold text-slate-800">订单处理</div>
            <div className="text-xs text-slate-400 mt-1">发货 / 审核 / 详情</div>
          </div>
        </button>

        <button 
          onClick={() => navigate('/product')}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:shadow-md transition-all group bg-slate-50"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Package size={24} />
          </div>
          <div className="text-left flex-1">
            <div className="font-bold text-slate-800">商品发布</div>
            <div className="text-xs text-slate-400 mt-1">上架 / 编辑 / 库存</div>
          </div>
        </button>
      </div>

    </>
  );
}
