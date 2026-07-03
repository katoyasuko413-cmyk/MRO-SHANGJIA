import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Order } from '../../models/order';

interface OrderTableProps {
  orders: Order[];
  loading: boolean;
  selectedIds: string[];
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onAction: (action: string, order: Order) => void;
}

export function OrderTable({ 
  orders, 
  loading, 
  selectedIds, 
  onSelect, 
  onSelectAll, 
  onAction 
}: OrderTableProps) {
  const [openDropdownOrderId, setOpenDropdownOrderId] = useState<string | null>(null);
  const allSelected = orders.length > 0 && selectedIds.length === orders.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < orders.length;

  const renderStatus = (status: string) => {
    switch (status) {
      case 'PENDING_ACCEPT':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded-md text-xs font-medium">待接单</span>;
      case 'PENDING_SHIP':
        return <span className="px-2.5 py-1 bg-orange-50 text-orange-600 border border-orange-200 rounded-md text-xs font-medium">待发货</span>;
      case 'PARTIAL_SHIPPED':
        return <span className="px-2.5 py-1 bg-teal-50 text-teal-600 border border-teal-200 rounded-md text-xs font-medium">部分发货</span>;
      case 'PENDING_RECEIPT':
        return <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md text-xs font-medium">待收货</span>;
      case 'RECEIVED':
        return <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 rounded-md text-xs font-medium">已收货</span>;
      case 'COMPLETED':
      case 'CLOSED':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-600 border border-slate-200 rounded-md text-xs font-medium">已完成</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 bg-red-50 text-red-600 border border-red-200 rounded-md text-xs font-medium">已拒单</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-md text-xs font-medium">已取消</span>;
      case 'REFUNDED':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-md text-xs font-medium">已退款</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-50 text-slate-600 border border-slate-200 rounded-md text-xs font-medium">{status}</span>;
    }
  };

  const renderSettlementStatus = (order: Order) => {
    if (order.status === 'RECEIVED') {
      return <span className="text-orange-500 font-medium">未结算</span>;
    }
    if (order.status === 'CLOSED') {
      return <span className="text-green-600 font-medium">已结算</span>;
    }
    if (order.settlementStatus === 'SETTLED') {
      return <span className="text-green-600 font-medium">已结算</span>;
    }
    return <span className="text-orange-500 font-medium">未结算</span>;
  };

  const renderInvoiceStatus = (order: Order) => {
    if (order.status === 'RECEIVED') {
      return <span className="text-slate-400 font-medium">未开票</span>;
    }
    if (order.status === 'CLOSED') {
      return <span className="text-green-600 font-medium">已开票</span>;
    }
    if (order.settlementStatus === 'SETTLED') {
      if (order.invoiceStatus === 'INVOICED') {
        return <span className="text-green-600 font-medium">已开票</span>;
      }
      return <span className="text-slate-400 font-medium">未开票</span>;
    }
    return <span className="text-slate-400 font-medium">未开票</span>;
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[400px] flex items-center justify-center p-8 bg-white">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border-4 border-blue-200 border-t-blue-500 animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">加载中...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex-1 min-h-[400px] flex items-center justify-center p-8 bg-white">
        <div className="text-center text-slate-500">
          <p>暂无数据</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-x-auto mx-1 custom-scrollbar">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
          <tr>
            <th className="py-3 px-4 w-12 text-center sticky left-0 bg-slate-50 z-20 border-r border-slate-200">
              <input 
                type="checkbox" 
                checked={allSelected}
                ref={input => {
                  if (input) input.indeterminate = isPartiallySelected;
                }}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
              />
            </th>
            <th className="py-3 px-4 font-medium">销售订单号</th>
            <th className="py-3 px-4 font-medium">采购方</th>
            <th className="py-3 px-4 font-medium">收货人</th>
            <th className="py-3 px-4 font-medium">联系电话</th>
            <th className="py-3 px-4 font-medium max-w-xs truncate">收货地址</th>
            <th className="py-3 px-4 font-medium text-right">未税销售金额</th>
            <th className="py-3 px-4 font-medium text-right">含税销售金额</th>
            <th className="py-3 px-4 font-medium text-center">结算状态</th>
            <th className="py-3 px-4 font-medium text-center">开票状态</th>
            <th className="py-3 px-4 font-medium text-center">下单时间</th>
            <th className="py-3 px-4 font-medium text-center">状态</th>
            <th className="py-3 px-4 font-medium text-center sticky right-0 bg-slate-50 z-20 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {orders.map((order, idx) => {
            const isSelected = selectedIds.includes(order.id);
            const isNearBottom = idx === orders.length - 1 && orders.length >= 2;
            return (
              <tr 
                key={order.id} 
                className={`transition-colors group ${isSelected ? 'bg-blue-50' : 'bg-white hover:bg-slate-50'}`}
              >
                <td className="py-3 px-4 text-center sticky left-0 z-10 border-r border-slate-100 bg-inherit shadow-[1px_0_0_0_#e2e8f0]">
                  <input 
                    type="checkbox" 
                    checked={isSelected}
                    onChange={(e) => onSelect(order.id, e.target.checked)}
                    className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
                  />
                </td>
                <td className="py-3 px-4 text-slate-800 font-medium">
                  {order.salesOrderNo}
                </td>
                <td className="py-3 px-4 text-slate-700">{order.purchaserName}</td>
                <td className="py-3 px-4 text-slate-700">{order.recipientName}</td>
                <td className="py-3 px-4 font-mono text-slate-700">{order.recipientPhone}</td>
                <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate" title={order.recipientAddress}>
                  {order.recipientAddress}
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-slate-600">¥{order.totalAmountExclTax?.toFixed(2) || '0.00'}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="font-medium text-orange-600">¥{(order.totalAmountInclTax || order.salesAmount || 0).toFixed(2)}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  {renderSettlementStatus(order)}
                </td>
                <td className="py-3 px-4 text-center">
                  {renderInvoiceStatus(order)}
                </td>
                <td className="py-3 px-4 text-slate-500 text-center">
                  {order.orderTime}
                </td>
                <td className="py-3 px-4 text-center">
                  {renderStatus(order.status)}
                </td>
                <td className={`py-3 px-4 text-center sticky right-0 bg-inherit shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)] overflow-visible ${
                  openDropdownOrderId === order.id ? 'z-30' : 'z-20'
                }`}>
                  <div className="flex items-center justify-center gap-3 relative">
                    {(() => {
                      const actionsList: { key: string; label: string; colorClass: string; onClick: () => void }[] = [];

                      if (order.status === 'PENDING_ACCEPT') {
                        actionsList.push({
                          key: 'ACCEPT',
                          label: '接单',
                          colorClass: 'text-blue-600 hover:text-blue-700',
                          onClick: () => onAction('ACCEPT', order)
                        });
                        actionsList.push({
                          key: 'SHIP',
                          label: '发货',
                          colorClass: 'text-orange-600 hover:text-orange-700',
                          onClick: () => onAction('SHIP', order)
                        });
                      }

                      if (['PENDING_SHIP', 'PARTIAL_SHIPPED'].includes(order.status)) {
                        actionsList.push({
                          key: 'SHIP',
                          label: '发货',
                          colorClass: 'text-orange-600 hover:text-orange-700',
                          onClick: () => onAction('SHIP', order)
                        });
                      }

                      if (['PENDING_RECEIPT', 'RECEIVED', 'COMPLETED', 'CLOSED'].includes(order.status)) {
                        actionsList.push({
                          key: 'VIEW_LOGISTICS',
                          label: '查看物流',
                          colorClass: 'text-blue-600 hover:text-blue-700',
                          onClick: () => onAction('VIEW_LOGISTICS', order)
                        });
                      }

                      if (order.status === 'RECEIVED' || order.status === 'COMPLETED') {
                        if (order.signOffSheetUrl) {
                          actionsList.push({
                            key: 'VIEW_SIGN_OFF',
                            label: '签收单',
                            colorClass: 'text-indigo-600 hover:text-indigo-700',
                            onClick: () => onAction('VIEW_SIGN_OFF', order)
                          });
                        } else {
                          actionsList.push({
                            key: 'UPLOAD_SIGN_OFF',
                            label: '上传签收单',
                            colorClass: 'text-violet-600 hover:text-violet-700',
                            onClick: () => onAction('UPLOAD_SIGN_OFF', order)
                          });
                        }
                      }

                      const isOrderInvoiced = (order.status === 'CLOSED') || 
                                              (order.settlementStatus === 'SETTLED' && order.invoiceStatus === 'INVOICED');
                      if (isOrderInvoiced) {
                        actionsList.push({
                          key: 'DOWNLOAD_CONTRACT',
                          label: '订货合同',
                          colorClass: 'text-amber-600 hover:text-amber-700 font-semibold',
                          onClick: () => onAction('DOWNLOAD_CONTRACT', order)
                        });
                      }

                      actionsList.push({
                        key: 'DELIVERY_NOTE',
                        label: '供货单',
                        colorClass: 'text-emerald-600 hover:text-emerald-700',
                        onClick: () => onAction('DELIVERY_NOTE', order)
                      });

                      actionsList.push({
                        key: 'DETAIL',
                        label: '订单详情',
                        colorClass: 'text-blue-600 hover:text-blue-700',
                        onClick: () => onAction('DETAIL', order)
                      });

                      const visibleActions = actionsList.slice(0, 2);
                      const dropdownActions = actionsList.slice(2);

                      return (
                        <>
                          {visibleActions.map((act) => (
                            <button
                              key={act.key}
                              onClick={() => act.onClick()}
                              className={`${act.colorClass} font-medium transition-colors text-sm`}
                            >
                              {act.label}
                            </button>
                          ))}
                          
                          {dropdownActions.length > 0 && (
                            <div className="relative inline-block text-left">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenDropdownOrderId(openDropdownOrderId === order.id ? null : order.id);
                                }}
                                className="flex items-center gap-0.5 text-slate-500 hover:text-slate-800 font-medium transition-colors text-sm"
                              >
                                <span>更多</span>
                                <ChevronDown 
                                  size={14} 
                                  className={`transition-transform duration-200 ${
                                    openDropdownOrderId === order.id ? 'rotate-180' : ''
                                  }`} 
                                />
                              </button>
                              
                              {openDropdownOrderId === order.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-30 cursor-default" 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenDropdownOrderId(null);
                                    }} 
                                  />
                                  <div className={`absolute right-0 w-32 rounded-xl bg-white border border-slate-100 shadow-xl py-1.5 z-40 animate-in fade-in duration-150 text-left ${
                                    isNearBottom 
                                      ? 'bottom-full mb-2 origin-bottom slide-in-from-bottom-1' 
                                      : 'top-full mt-2 origin-top slide-in-from-top-1'
                                  }`}>
                                    {dropdownActions.map((act) => (
                                      <button
                                        key={act.key}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setOpenDropdownOrderId(null);
                                          act.onClick();
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-50 transition-colors ${act.colorClass}`}
                                      >
                                        {act.label}
                                      </button>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </>
                      );
                    })()}
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
