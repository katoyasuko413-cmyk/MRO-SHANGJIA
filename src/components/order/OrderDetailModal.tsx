import React from 'react';
import { X } from 'lucide-react';
import { Order } from '../../models/order';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export function OrderDetailModal({ isOpen, onClose, order }: OrderDetailModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">订单详情</h2>
            <p className="text-sm text-slate-500 mt-1">销售订单号: {order.salesOrderNo}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">销售订单号</p>
              <p className="font-semibold text-slate-800">{order.salesOrderNo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">下单时间</p>
              <p className="font-semibold text-slate-800">{order.orderTime}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">采购方</p>
              <p className="font-semibold text-slate-800">{order.purchaserName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">付款金额</p>
              <p className="font-semibold text-orange-600">¥ {order.paymentAmount?.toFixed(2) || '0.00'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">收货人信息</h3>
              <div className="space-y-3">
                <div className="text-sm flex">
                  <span className="text-slate-500 w-20">收货人：</span>
                  <span className="text-slate-800 font-medium">{order.recipientName}</span>
                </div>
                <div className="text-sm flex">
                  <span className="text-slate-500 w-20">联系电话：</span>
                  <span className="text-slate-800 font-medium">{order.recipientPhone}</span>
                </div>
                <div className="text-sm flex">
                  <span className="text-slate-500 w-20">收货地址：</span>
                  <span className="text-slate-800 font-medium">{order.recipientAddress}</span>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">配送信息</h3>
              <div className="space-y-3">
                <div className="text-sm flex">
                  <span className="text-slate-500 w-20">配送方式：</span>
                  <span className="text-slate-800 font-medium">
                    {['PENDING_ACCEPT', 'PENDING_SHIP', 'REJECTED', 'CANCELLED', 'REFUNDED'].includes(order.status) 
                      ? '-' 
                      : (order.deliveryMethod || '-')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-4">商品列表</h3>
            <div className="border border-slate-200 rounded-xl overflow-x-auto whitespace-nowrap custom-scrollbar">
              <table className="w-full text-left text-sm min-w-max">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <tr>
                    <th className="py-3 px-4 font-medium">序号</th>
                    <th className="py-3 px-4 font-medium">商品编码</th>
                    <th className="py-3 px-4 font-medium">商品名称</th>
                    <th className="py-3 px-4 font-medium">品牌</th>
                    <th className="py-3 px-4 font-medium">规格</th>
                    <th className="py-3 px-4 font-medium">型号</th>
                    <th className="py-3 px-4 font-medium text-right">下单数量</th>
                    <th className="py-3 px-4 font-medium text-right">已发货数量</th>
                    <th className="py-3 px-4 font-medium text-right">未发货数量</th>
                    <th className="py-3 px-4 font-medium text-right">未税单价</th>
                    <th className="py-3 px-4 font-medium text-right">含税单价</th>
                    <th className="py-3 px-4 font-medium text-right">未税总价</th>
                    <th className="py-3 px-4 font-medium text-right">含税总价</th>
                    <th className="py-3 px-4 font-medium">需求描述</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 text-slate-600">{index + 1}</td>
                      <td className="py-3 px-4 text-slate-800">{item.sku}</td>
                      <td className="py-3 px-4 text-slate-800 font-medium truncate max-w-[200px]" title={item.name}>{item.name}</td>
                      <td className="py-3 px-4 text-slate-600">{item.brand}</td>
                      <td className="py-3 px-4 text-slate-600">{item.specification}</td>
                      <td className="py-3 px-4 text-slate-600">{item.model}</td>
                      <td className="py-3 px-4 text-right font-medium text-slate-800">{item.quantity}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{item.shippedQuantity || 0}</td>
                      <td className="py-3 px-4 text-right text-slate-600">{item.quantity - (item.shippedQuantity || 0)}</td>
                      <td className="py-3 px-4 text-right text-slate-600">¥{item.priceExclTax.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-slate-800 font-medium">¥{item.priceInclTax.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-slate-600">¥{item.amountExclTax.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-slate-800 font-medium">¥{item.amountInclTax.toFixed(2)}</td>
                      <td className="py-3 px-4 text-slate-600 truncate max-w-[200px]" title={item.requirementDesc || '-'}>{item.requirementDesc || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 flex flex-col items-end gap-2 bg-slate-50 p-4 rounded-xl w-72 ml-auto border border-slate-100">
              <div className="flex justify-between w-full text-sm whitespace-nowrap">
                <span className="text-slate-500">商品总价（未税）：</span>
                <span className="font-medium text-slate-800">¥{order.totalAmountExclTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between w-full whitespace-nowrap">
                <span className="text-slate-600 font-medium flex-shrink-0">商品总价（含税）：</span>
                <span className="text-lg font-bold text-orange-600">¥{order.totalAmountInclTax.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
