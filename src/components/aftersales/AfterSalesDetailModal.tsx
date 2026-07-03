import React, { useState, useEffect } from 'react';
import { X, Check, ClipboardX, Send, Hammer } from 'lucide-react';
import { AfterSalesOrder, AfterSalesStatus, AfterSalesType } from '../../models/afterSales';
import { formatAfterSalesDuration } from '../../utils/duration';
import { Order } from '../../models/order';
import { orderService } from '../../services/orderService';

interface AfterSalesDetailModalProps {
  isOpen: boolean;
  order: AfterSalesOrder | null;
  onClose: () => void;
  onApprove: (id: string) => Promise<any>;
  onReject: (id: string, reason: string) => Promise<any>;
  onConfirmProcess: (id: string) => Promise<any>;
}

const TYPE_LABELS = {
  [AfterSalesType.RETURN]: '退货',
  [AfterSalesType.REPAIR]: '维修',
  [AfterSalesType.EXCHANGE]: '换货',
  [AfterSalesType.RETURN_REPAIR]: '维修',
};

const STATUS_LABELS = {
  [AfterSalesStatus.PENDING_AUDIT]: '待运营端审核',
  [AfterSalesStatus.PENDING_CLIENT_SEND]: '待客户寄回',
  [AfterSalesStatus.PENDING_SUPPLIER_PROCESS]: '待供应商处理',
  [AfterSalesStatus.PROCESSING]: '处理中',
  [AfterSalesStatus.COMPLETED]: '已完成',
  [AfterSalesStatus.REJECTED]: '运营端驳回',
};

export function AfterSalesDetailModal({
  isOpen,
  order,
  onClose,
  onApprove,
  onReject,
  onConfirmProcess
}: AfterSalesDetailModalProps) {
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [loadingAction, setLoadingAction] = useState(false);
  const [associatedOrder, setAssociatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (order?.salesOrderNo) {
      orderService.getOrders({ salesOrderNo: order.salesOrderNo }).then(orders => {
        if (orders && orders.length > 0) {
          const found = orders.find(o => o.salesOrderNo === order.salesOrderNo);
          setAssociatedOrder(found || orders[0]);
        } else {
          setAssociatedOrder(null);
        }
      }).catch(() => {
        setAssociatedOrder(null);
      });
    } else {
      setAssociatedOrder(null);
    }
  }, [order?.salesOrderNo]);

  if (!isOpen || !order) return null;

  const handleApprove = async () => {
    setLoadingAction(true);
    await onApprove(order.id);
    setLoadingAction(false);
    onClose();
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      alert('请输入拒绝原因');
      return;
    }
    setLoadingAction(true);
    await onReject(order.id, rejectReason);
    setLoadingAction(false);
    setRejecting(false);
    setRejectReason('');
    onClose();
  };

  const handleConfirmProcess = async () => {
    setLoadingAction(true);
    await onConfirmProcess(order.id);
    setLoadingAction(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex flex-shrink-0 items-center justify-between bg-white">
          <span className="text-xl font-bold text-slate-800 tracking-tight">售后申请详情</span>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X size={22} className="stroke-[2.5]" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto space-y-7 scrollbar-thin">
          
          {/* Base Information Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm">
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium shrink-0">售后单号：</span>
              <span className="text-slate-800 font-mono font-semibold">{order.id}</span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium shrink-0">订单号：</span>
              <span className="text-slate-800 font-mono font-semibold">{order.salesOrderNo}</span>
            </div>
            
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium shrink-0">申请人：</span>
              <span className="text-slate-800 font-semibold">
                {order.customerName.includes('速达') ? `${order.customerName} (部)` : order.customerName || '李白 (研发部)'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium shrink-0">申请时间：</span>
              <span className="text-slate-800 font-mono font-medium">{order.applyTime}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium shrink-0">售后类型：</span>
              <span className="text-slate-800 font-semibold">
                {order.type === AfterSalesType.RETURN ? '退货退款' : TYPE_LABELS[order.type]}
              </span>
            </div>
            {(order.type === AfterSalesType.REPAIR || order.type === AfterSalesType.RETURN_REPAIR) && (
              <div className="flex items-center">
                <span className="w-24 text-slate-500 font-medium shrink-0">维修方式：</span>
                <span className="text-amber-800 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-lg text-xs font-bold leading-normal">
                  {order.type === AfterSalesType.REPAIR ? '上门' : '寄回'}
                </span>
              </div>
            )}
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium shrink-0">下单时间：</span>
              <span className="text-slate-800 font-mono font-medium">{order.orderTime || '-'}</span>
            </div>

            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium shrink-0">付款类型：</span>
              <span className="text-slate-800 font-semibold">
                {order.paymentType || '账期'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium shrink-0">当前状态：</span>
              <span className="px-3 py-0.5 bg-[#fef3c7] text-[#d97706] rounded-full text-xs font-bold leading-normal">
                {STATUS_LABELS[order.status]}
              </span>
            </div>

            {order.approvedTime && (
              <div className="flex items-center">
                <span className="w-24 text-slate-500 font-medium shrink-0">审核时间：</span>
                <span className="text-slate-800 font-mono font-medium">{order.approvedTime}</span>
              </div>
            )}

            {order.completeTime && (
              <div className="flex items-center">
                <span className="w-24 text-slate-500 font-medium shrink-0">完成时间：</span>
                <span className="text-slate-800 font-mono font-medium">{order.completeTime}</span>
              </div>
            )}

            <div className="flex items-center">
              <span className="w-24 text-slate-500 font-medium shrink-0">售后时长：</span>
              <span className={`font-mono font-semibold text-xs px-2.5 py-0.5 rounded border ${
                order.approvedTime 
                  ? 'text-blue-700 bg-blue-50 border-blue-100' 
                  : 'text-slate-400 bg-slate-50 border-slate-100'
              }`}>
                {formatAfterSalesDuration(order)}
              </span>
            </div>

            <div className="flex items-center md:col-span-2">
              <span className="w-24 text-slate-500 font-medium shrink-0">售后原因：</span>
              <span className="text-slate-900 font-bold">{order.reason}</span>
            </div>

            <div className="flex items-start md:col-span-2">
              <span className="w-24 text-slate-500 font-medium shrink-0 pt-0.5">问题描述：</span>
              <p className="text-slate-600 font-medium leading-relaxed flex-1">
                {order.description || "收到的便利贴包装破损，部分便签有折痕，无法正常使用，申请退货退款。"}
              </p>
            </div>

            <div className="flex items-baseline md:col-span-2 mt-1">
              <span className="w-28 text-slate-500 font-medium shrink-0">售后涉及金额：</span>
              <span className="text-[#ff4d4f] text-3xl font-extrabold font-mono tracking-tight antialiased">
                ¥{(order.totalAmountInclTax || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* 1) Settlement and Invoice info block (Orange Left Vertical border design) */}
          <div className="space-y-4">
            <div className="bg-[#fffbeb] border-l-4 border-amber-500 px-4 py-3 rounded-r-xl">
              <h4 className="text-sm font-bold text-[#b45309] tracking-wide">结算与发票信息</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 py-1.5">
              <div>
                <span className="text-xs text-slate-400 font-bold block mb-1">结算单号：</span>
                <span className="text-sm font-semibold font-mono text-slate-800">
                  {`SET${order.id.replace('AS', '')}0001`}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block mb-1">客户发票号：</span>
                <span className="text-sm font-semibold font-mono text-slate-800">
                  {`INV-C-${order.id.replace('AS', '')}101`}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block mb-1">供应商发票号：</span>
                <span className="text-sm font-semibold font-mono text-slate-800">
                  {`INV-S-${order.id.replace('AS', '')}188`}
                </span>
              </div>
            </div>
          </div>

          {/* 关联订单 block */}
          <div className="space-y-4">
            <div className="bg-slate-50 border-l-4 border-slate-400 px-4 py-3 rounded-r-xl">
              <h4 className="text-sm font-bold text-slate-700 tracking-wide">关联订单</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 py-1.5">
              <div>
                <span className="text-xs text-slate-400 font-bold block mb-1">关联订单号：</span>
                <span className="text-sm font-semibold font-mono text-slate-800">
                  {order.salesOrderNo}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block mb-1">收货人：</span>
                <span className="text-sm font-semibold text-slate-800">
                  {associatedOrder?.recipientName || (order.customerName === "速达精密制造" ? "王五" : "张三")}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block mb-1">联系方式：</span>
                <span className="text-sm font-semibold font-mono text-slate-800">
                  {associatedOrder?.recipientPhone || order.phone || "13800138000"}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block mb-1">联系地址：</span>
                <span className="text-sm font-semibold text-slate-800">
                  {associatedOrder?.recipientAddress || "浙江省杭州市余杭区文一西路999号"}
                </span>
              </div>
            </div>
          </div>

          {/* 2) Associated Items list block (Blue Left Border Design) */}
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-3 py-0.5">
              <h4 className="text-sm font-bold text-slate-800 tracking-wide">售后商品明细</h4>
            </div>
            <div className="bg-[#f8fafc] border border-slate-100 rounded-2xl p-5 space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => {
                  const price = order.totalAmountInclTax / item.quantity;
                  return (
                    <div key={item.id} className="space-y-2">
                      <div className="text-sm text-slate-800 font-bold leading-normal">
                        {item.name} <span className="text-xs text-slate-400 font-normal font-mono ml-2">(SKU: {item.sku})</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-400 font-medium gap-x-4">
                        <span>
                          单价：<span className="text-slate-800 font-bold font-mono">¥{price.toFixed(2)}</span>
                        </span>
                        <span className="text-slate-200">|</span>
                        <span>
                          数量：<span className="text-slate-800 font-bold font-mono">{item.quantity}</span>
                        </span>
                        <span className="text-slate-200">|</span>
                        <span>
                          小计：<span className="text-[#ff4d4f] font-bold font-mono">¥{(price * item.quantity).toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="space-y-2">
                  <div className="text-sm text-slate-800 font-bold leading-normal">
                    3M便利贴备忘录/便条纸/报事贴/透明指示标 <span className="text-xs text-slate-400 font-normal font-mono ml-2">(SKU: b1282a9d)</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-400 font-medium gap-x-4">
                    <span>
                      单价：<span className="text-slate-800 font-bold font-mono">¥25.00</span>
                    </span>
                    <span className="text-slate-200">|</span>
                    <span>
                      数量：<span className="text-slate-800 font-bold font-mono">1</span>
                    </span>
                    <span className="text-slate-200">|</span>
                    <span>
                      小计：<span className="text-[#ff4d4f] font-bold font-mono">¥25.00</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3) Pictures attachments section */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-800 tracking-wide">图片凭证</h4>
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer hover:bg-slate-100 transition-all">
                <svg className="w-7 h-7 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] font-bold">外观破损1.jpg</span>
              </div>
              <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer hover:bg-slate-100 transition-all">
                <svg className="w-7 h-7 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[10px] font-bold">包装细节.png</span>
              </div>
            </div>
          </div>

          {/* Logistics Return Info if status is sent back */}
          {order.status !== AfterSalesStatus.PENDING_SUPPLIER_PROCESS && (order.expressCompany || order.expressNumber) && (
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-blue-800 tracking-wider uppercase">客户退回物流信息</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
                <div>
                  <span className="text-slate-400 text-xs">快递公司：</span>
                  <span className="font-semibold">{order.expressCompany || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">运单号/车牌号：</span>
                  <span className="font-mono font-semibold text-slate-900">{order.expressNumber || '-'}</span>
                </div>
              </div>
            </div>
          )}

          {order.status === AfterSalesStatus.REJECTED && order.rejectReason && (
            <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl">
              <h4 className="text-xs font-bold text-red-700 mb-1">
                运营端驳回原因
              </h4>
              <p className="text-sm text-red-600">{order.rejectReason}</p>
            </div>
          )}

          {/* Inline Rejection Form Drawer */}
          {rejecting && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 animate-in slide-in-from-bottom-2 duration-200">
              <label className="block text-xs font-bold text-slate-700">请填写拒绝通过的原因：</label>
              <textarea 
                rows={3}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors"
                placeholder="例如：不符合退换货政策，未提供检测证明..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejecting(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleRejectSubmit}
                  className="px-3 py-1.5 text-xs text-white bg-red-500 rounded-lg hover:bg-red-600 shadow-sm"
                  disabled={loadingAction}
                >
                  确认拒绝
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between rounded-b-2xl">
          <div>
            {order.status === AfterSalesStatus.PENDING_SUPPLIER_PROCESS && (
              <span className="text-xs text-slate-500">供应商确认维修或退货处理已完成</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {order.status === AfterSalesStatus.PENDING_SUPPLIER_PROCESS && (
              <button
                type="button"
                onClick={handleConfirmProcess}
                className="px-4 py-2 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-100"
                disabled={loadingAction}
              >
                <Hammer size={16} />
                确认处理
              </button>
            )}

            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
