import React from 'react';
import { KeyRound } from 'lucide-react';
import { FulfillmentOrder, FulfillmentStatus } from '../../models/fulfillment';

interface FulfillmentTableProps {
  orders: FulfillmentOrder[];
  loading: boolean;
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onAction: (action: string, order: FulfillmentOrder) => void;
}

const STATUS_CONFIG_MAPPING = {
  [FulfillmentStatus.PENDING_PICKUP]: { label: '待揽收', color: 'bg-slate-100 text-slate-700' },
  [FulfillmentStatus.PICKED_UP]: { label: '已揽收', color: 'bg-blue-100 text-blue-700' },
  [FulfillmentStatus.IN_TRANSIT]: { label: '运输中', color: 'bg-amber-100 text-amber-700' },
  [FulfillmentStatus.DELIVERING]: { label: '派送中', color: 'bg-indigo-100 text-indigo-700' },
  [FulfillmentStatus.SIGNED]: { label: '已签收', color: 'bg-emerald-100 text-emerald-700' },
  [FulfillmentStatus.EXCEPTION]: { label: '异常', color: 'bg-rose-100 text-rose-700' },
};

export function FulfillmentTable({ orders, loading, selectedIds, onSelect, onSelectAll, onAction }: FulfillmentTableProps) {
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-sm">加载数据中...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] text-slate-500 gap-4">
        <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center">
          <span className="text-4xl">🚚</span>
        </div>
        <p>暂无符合条件的物流单</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-20">
          <tr>
            <th className="px-5 py-4 w-12 text-center border-b border-slate-100 sticky left-0 bg-slate-50 z-30">
              <input 
                type="checkbox"
                checked={orders.length > 0 && selectedIds.length === orders.length}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
            </th>
            <th className="px-5 py-4 font-medium text-slate-600">物流单号</th>
            <th className="px-5 py-4 font-medium text-slate-600">销售订单号</th>
            <th className="px-5 py-4 font-medium text-slate-600">生产单号时间</th>
            <th className="px-5 py-4 font-medium text-slate-600">物流公司</th>
            <th className="px-5 py-4 font-medium text-slate-600">收货人</th>
            <th className="px-5 py-4 font-medium text-slate-600">联系电话</th>
            <th className="px-5 py-4 font-medium text-slate-600">状态</th>
            <th className="px-5 py-4 font-medium text-slate-600">收货地址</th>
            <th className="px-5 py-4 font-medium text-slate-600 text-right sticky right-0 bg-slate-50 border-l border-slate-100 z-10 w-48">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders.map(order => {
            const statusConfig = STATUS_CONFIG_MAPPING[order.status] || { label: '未知', color: 'bg-slate-100 text-slate-700' };
            const canReceive = order.isSelfDelivery && order.status === FulfillmentStatus.IN_TRANSIT;
            
            return (
              <tr key={order.id} className={`hover:bg-blue-50 transition-colors group ${selectedIds.includes(order.id) ? 'bg-blue-50' : 'bg-white'}`}>
                <td className={`px-5 py-4 text-center sticky left-0 z-10 border-r border-slate-50 transition-colors ${selectedIds.includes(order.id) ? 'bg-blue-50' : 'bg-white'} group-hover:bg-blue-50`}>
                  <input 
                    type="checkbox"
                    checked={selectedIds.includes(order.id)}
                    onChange={() => onSelect(order.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="px-5 py-4 font-mono font-medium text-slate-900">{order.trackingNo}</td>
                <td className="px-5 py-4 text-slate-600 font-mono text-xs">{order.salesOrderNo}</td>
                 <td className="px-5 py-4 text-slate-500">
                  {order.productionTime.split(' ')[0]}
                  <span className="text-slate-400 ml-1 text-xs">{order.productionTime.split(' ')[1]}</span>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${order.isSelfDelivery ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                    {order.logisticsCompany}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="font-medium text-slate-900">{order.consignee}</div>
                </td>
                <td className="px-5 py-4 text-slate-600">
                  {order.consigneePhone}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="text-slate-600 max-w-[200px] truncate" title={order.shippingAddress}>
                    {order.shippingAddress}
                  </div>
                </td>
                <td className={`px-5 py-4 text-right sticky right-0 transition-colors border-l border-slate-50 ${selectedIds.includes(order.id) ? 'bg-blue-50' : 'bg-white'} group-hover:bg-blue-50`}>
                  <div className="flex items-center justify-end gap-3">
                    {canReceive && (
                      <button 
                        onClick={() => onAction('RECEIVE_CODE', order)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        收货码
                      </button>
                    )}
                    <button 
                      onClick={() => onAction('VIEW_LOGISTICS', order)}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      查看
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
