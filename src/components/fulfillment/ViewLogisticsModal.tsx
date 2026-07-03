import React from 'react';
import { X } from 'lucide-react';
import { FulfillmentOrder, FulfillmentStatus } from '../../models/fulfillment';

interface ViewLogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: FulfillmentOrder | null;
}

const STATUS_CONFIG_MAPPING = {
  [FulfillmentStatus.PENDING_PICKUP]: '待揽收',
  [FulfillmentStatus.PICKED_UP]: '已揽收',
  [FulfillmentStatus.IN_TRANSIT]: '运输中',
  [FulfillmentStatus.DELIVERING]: '派送中',
  [FulfillmentStatus.SIGNED]: '已签收',
  [FulfillmentStatus.EXCEPTION]: '异常',
};

export function ViewLogisticsModal({ isOpen, onClose, order }: ViewLogisticsModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-shrink-0 items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">物流详情</h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm text-slate-500 col-span-1">物流状态</span>
              <span className="text-sm font-medium text-slate-900 col-span-2">
                 {STATUS_CONFIG_MAPPING[order.status] || '未知'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm text-slate-500 col-span-1">物流公司</span>
              <span className="text-sm font-medium text-slate-900 col-span-2">{order.logisticsCompany}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="text-sm text-slate-500 col-span-1">
                {order.isSelfDelivery || order.logisticsCompany === '自配送' ? '车牌号' : '物流单号'}
              </span>
              <span className="text-sm font-medium text-slate-900 col-span-2">{order.trackingNo}</span>
            </div>
            {order.isSelfDelivery && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-slate-500 col-span-1">送货人</span>
                  <span className="text-sm font-medium text-slate-900 col-span-2">{order.deliverer || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <span className="text-sm text-slate-500 col-span-1">联系电话</span>
                  <span className="text-sm font-medium text-slate-900 col-span-2">{order.delivererPhone || '-'}</span>
                </div>
              </>
            )}
            {!order.isSelfDelivery && (
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100">
                <span className="text-sm text-slate-500 col-span-1">物流追踪</span>
                <div className="text-sm text-slate-900 col-span-2 space-y-4 relative before:absolute before:inset-0 before:ml-[5px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                  <div className="relative flex items-start group">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white bg-blue-500 z-10 shrink-0 mt-1"></div>
                    <div className="pl-3 pb-1">
                      <div className="text-sm font-medium text-slate-800">包裹正在派送中，请准备签收</div>
                      <div className="text-xs text-slate-400 mt-0.5">2023-11-20 09:30:00</div>
                    </div>
                  </div>
                  <div className="relative flex items-start group">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white bg-slate-300 z-10 shrink-0 mt-1"></div>
                    <div className="pl-3 pb-1">
                      <div className="text-sm text-slate-600">快件已到达【北京朝阳营业部】</div>
                      <div className="text-xs text-slate-400 mt-0.5">2023-11-19 22:15:00</div>
                    </div>
                  </div>
                  <div className="relative flex items-start group">
                    <div className="flex items-center justify-center w-3 h-3 rounded-full border-2 border-white bg-slate-300 z-10 shrink-0 mt-1"></div>
                    <div className="pl-3 pb-1">
                      <div className="text-sm text-slate-600">顺丰速运已揽收</div>
                      <div className="text-xs text-slate-400 mt-0.5">2023-11-19 18:00:00</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}
