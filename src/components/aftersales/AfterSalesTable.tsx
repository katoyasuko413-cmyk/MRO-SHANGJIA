import React from 'react';
import { AfterSalesOrder, AfterSalesStatus, AfterSalesType } from '../../models/afterSales';
import { formatAfterSalesDuration } from '../../utils/duration';

interface AfterSalesTableProps {
  orders: AfterSalesOrder[];
  loading: boolean;
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onViewDetails: (order: AfterSalesOrder) => void;
  onConfirmProcess: (order: AfterSalesOrder) => void;
  onFillLogistics: (order: AfterSalesOrder) => void;
  onCompleteOrder: (order: AfterSalesOrder) => void;
  onConfirmReceipt?: (order: AfterSalesOrder) => void;
  onViewLogistics?: (order: AfterSalesOrder) => void;
}

const TYPE_CONFIG = {
  [AfterSalesType.RETURN]: { label: '退货', color: 'bg-red-50 text-red-700 border border-red-100' },
  [AfterSalesType.REPAIR]: { label: '维修', color: 'bg-orange-50 text-orange-700 border border-orange-100' },
  [AfterSalesType.EXCHANGE]: { label: '换货', color: 'bg-teal-50 text-teal-700 border border-teal-100' },
  [AfterSalesType.RETURN_REPAIR]: { label: '维修', color: 'bg-indigo-50 text-indigo-700 border border-indigo-100' },
};

const STATUS_CONFIG = {
  [AfterSalesStatus.PENDING_AUDIT]: { label: '待运营端审核', color: 'bg-amber-100 text-amber-700' },
  [AfterSalesStatus.PENDING_CLIENT_SEND]: { label: '待客户寄回', color: 'bg-slate-100 text-slate-700' },
  [AfterSalesStatus.PENDING_SUPPLIER_PROCESS]: { label: '待供应商处理', color: 'bg-blue-100 text-blue-700 font-medium' },
  [AfterSalesStatus.PROCESSING]: { label: '处理中', color: 'bg-indigo-100 text-indigo-700 font-medium' },
  [AfterSalesStatus.COMPLETED]: { label: '已完成', color: 'bg-emerald-100 text-emerald-700' },
  [AfterSalesStatus.REJECTED]: { label: '运营端驳回', color: 'bg-rose-100 text-rose-700' },
};

export function AfterSalesTable({
  orders,
  loading,
  selectedIds,
  onSelect,
  onSelectAll,
  onViewDetails,
  onConfirmProcess,
  onFillLogistics,
  onCompleteOrder,
  onConfirmReceipt,
  onViewLogistics
}: AfterSalesTableProps) {
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
          <span className="text-4xl">🛠️</span>
        </div>
        <p>暂无符合条件的售后服务单</p>
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
            <th className="px-5 py-4 font-medium text-slate-600">售后单号</th>
            <th className="px-5 py-4 font-medium text-slate-600">关联订单</th>
            <th className="px-5 py-4 font-medium text-slate-600">客户</th>
            <th className="px-5 py-4 font-medium text-slate-600">商品</th>
            <th className="px-5 py-4 font-medium text-slate-600">类型</th>
            <th className="px-5 py-4 font-medium text-slate-600">售后原因</th>
            <th className="px-5 py-4 font-medium text-slate-600">涉及金额</th>
            <th className="px-5 py-4 font-medium text-slate-600">售后时长</th>
            <th className="px-5 py-4 font-medium text-slate-600">状态</th>
            <th className="px-5 py-4 font-medium text-slate-600 text-right sticky right-0 bg-slate-50 border-l border-slate-100 z-10 w-48">供应商操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {orders.map(order => {
            const statusConfig = STATUS_CONFIG[order.status] || { label: '未知', color: 'bg-slate-100 text-slate-700' };
            const typeConfig = TYPE_CONFIG[order.type] || { label: '未知', color: 'bg-slate-50 text-slate-600' };
            const isSelected = selectedIds.includes(order.id);
            
            return (
              <tr 
                key={order.id} 
                className={`transition-colors group ${isSelected ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'}`}
              >
                <td className="px-5 py-4 text-center sticky left-0 z-10 border-r border-slate-100 bg-inherit shadow-[1px_0_0_0_#e2e8f0]">
                  <input 
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onSelect(order.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="px-5 py-4 font-mono font-medium text-slate-900">{order.id}</td>
                <td className="px-5 py-4 font-mono text-slate-600 text-sm">{order.salesOrderNo}</td>
                <td className="px-5 py-4 text-slate-800 font-medium">{order.customerName}</td>
                <td className="px-5 py-4 text-slate-700 font-medium">{order.productName}</td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${typeConfig.color}`}>
                    {typeConfig.label}
                  </span>
                </td>
                <td className="px-5 py-4 text-slate-600 max-w-[200px] truncate" title={order.reason}>
                  {order.reason}
                </td>
                <td className="px-5 py-4 text-slate-600 font-mono">
                  <div className="flex flex-col text-xs space-y-0.5 text-left">
                    <span className="text-slate-500">未税: <span className="text-slate-700 font-mono font-medium">¥{(order.totalAmountExclTax || 0).toFixed(2)}</span></span>
                    <span className="text-orange-600 font-semibold">含税: <span className="font-mono">¥{(order.totalAmountInclTax || 0).toFixed(2)}</span></span>
                  </div>
                </td>
                <td className="px-5 py-4 text-slate-700 font-mono text-xs font-semibold">
                  {formatAfterSalesDuration(order)}
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                </td>
                <td className="px-5 py-4 text-right sticky right-0 z-10 border-l border-slate-100 bg-inherit shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                  <div className="flex items-center justify-end gap-3">
                    <button 
                      onClick={() => onViewDetails(order)}
                      className="text-blue-600 hover:text-blue-800 font-semibold transition-colors text-sm"
                    >
                      详情
                    </button>
                    {order.status === AfterSalesStatus.PENDING_SUPPLIER_PROCESS && (
                      <button 
                        onClick={() => onConfirmProcess(order)}
                        className="text-blue-600 hover:text-blue-800 font-semibold transition-colors text-sm"
                      >
                        确认处理
                      </button>
                    )}
                    {order.status === AfterSalesStatus.PENDING_CLIENT_SEND && (
                      <>
                        <button 
                          onClick={() => onViewLogistics?.(order)}
                          className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors text-sm font-medium"
                        >
                          查看物流
                        </button>
                        {(order.type === AfterSalesType.RETURN || order.type === AfterSalesType.REPAIR || order.type === AfterSalesType.RETURN_REPAIR) ? (
                          <button 
                            onClick={() => onConfirmReceipt?.(order)}
                            className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors text-sm"
                          >
                            确认收货
                          </button>
                        ) : (
                          <button 
                            onClick={() => onFillLogistics(order)}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors text-sm"
                          >
                            填写物流单号
                          </button>
                        )}
                      </>
                    )}
                    {order.status === AfterSalesStatus.PROCESSING && (
                      <>
                        {(order.type === AfterSalesType.EXCHANGE || order.type === AfterSalesType.RETURN || order.type === AfterSalesType.RETURN_REPAIR) && (
                          <button 
                            onClick={() => onViewLogistics?.(order)}
                            className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors text-sm font-medium"
                          >
                            查看物流
                          </button>
                        )}
                        {order.type === AfterSalesType.REPAIR ? (
                          <button 
                            onClick={() => onCompleteOrder(order)}
                            className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors text-sm"
                          >
                            维修完成
                          </button>
                        ) : order.type === AfterSalesType.RETURN_REPAIR ? (
                          <button 
                            onClick={() => onFillLogistics(order)}
                            className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors text-sm"
                          >
                            维修完成
                          </button>
                        ) : (
                          <button 
                            onClick={() => onCompleteOrder(order)}
                            className="text-emerald-600 hover:text-emerald-800 font-semibold transition-colors text-sm"
                          >
                            确认完成
                          </button>
                        )}
                      </>
                    )}
                    {order.status === AfterSalesStatus.COMPLETED && (order.type === AfterSalesType.EXCHANGE || order.type === AfterSalesType.RETURN || order.type === AfterSalesType.RETURN_REPAIR) && (
                      <button 
                        onClick={() => onViewLogistics?.(order)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors text-sm font-medium"
                      >
                        查看物流
                      </button>
                    )}
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
