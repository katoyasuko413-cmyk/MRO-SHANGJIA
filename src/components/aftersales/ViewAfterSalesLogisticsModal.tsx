import React from 'react';
import { X, Truck, MapPin, HelpCircle, Package, Calendar } from 'lucide-react';
import { AfterSalesOrder, AfterSalesType, AfterSalesStatus } from '../../models/afterSales';

interface ViewAfterSalesLogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: AfterSalesOrder | null;
}

export function ViewAfterSalesLogisticsModal({ isOpen, onClose, order }: ViewAfterSalesLogisticsModalProps) {
  if (!isOpen || !order) return null;

  const hasLogistics = !!(order.expressCompany && order.expressNumber);

  // Return a simulated, professional timeline based on the actual progress
  const getTimeline = () => {
    const dates = {
      apply: order.applyTime || '2026-06-16 10:00:00',
      approved: order.approvedTime || '2026-06-16 15:30:00',
      complete: order.completeTime || '2026-06-17 14:00:00',
    };

    const carrier = order.expressCompany || '顺丰速运';
    const trackingNo = order.expressNumber || 'SF1425368947';

    if (order.status === AfterSalesStatus.COMPLETED) {
      return [
        {
          status: '【已完成】售后服务已处理完毕并签收',
          time: dates.complete,
          active: true,
          desc: '售后事务已最终确认闭环，商品已交接完成。'
        },
        {
          status: '包裹正在派送中，请准备签收',
          time: '2026-06-17 09:30:00',
          active: false,
          desc: '已分拨至当地营业点进行派送（自提/送货上门）'
        },
        {
          status: '快件已到达中转枢纽，正在分拨中',
          time: '2026-06-16 23:15:00',
          active: false,
          desc: '货物已安全到仓并完成清点分拨'
        },
        {
          status: `${carrier}已收件揽收`,
          time: '2026-06-16 18:00:00',
          active: false,
          desc: `运单号为 ${trackingNo}，客户已成功发出寄回商品`
        },
        {
          status: '【审核通过】请按供应商要求格式寄回',
          time: dates.approved,
          active: false,
          desc: '供应商同意受理售后申请，确认寄回处理'
        },
        {
          status: '【售后申请已提交】',
          time: dates.apply,
          active: false,
          desc: `客户提交售后服务申请，单号：${order.id}`
        }
      ];
    }

    if (order.status === AfterSalesStatus.PROCESSING) {
      return [
        {
          status: '【处理中】售后产品正在由供应商处理/维修中',
          time: '正在处理中...',
          active: true,
          desc: '售后商品已签收接收。针对换货/退款/维修申请正在加急入库检测与后续处理。'
        },
        {
          status: '快件已签收（供应商已收货）',
          time: '2026-06-17 11:20:00',
          active: false,
          desc: '收货仓库已成功接收并确认签收返修商品。'
        },
        {
          status: `${carrier}已收件揽收`,
          time: '2026-06-16 18:00:00',
          active: false,
          desc: `运单号为 ${trackingNo}，客户已成功发出寄回商品`
        },
        {
          status: '【审核通过】请按供应商要求格式寄回',
          time: dates.approved,
          active: false,
          desc: '供应商同意受理售后申请，确认寄回处理'
        },
        {
          status: '【售后申请已提交】',
          time: dates.apply,
          active: false,
          desc: `客户提交售后服务申请，单号：${order.id}`
        }
      ];
    }

    if (hasLogistics) {
      return [
        {
          status: '包裹正在派送中，请准备签收',
          time: '2026-06-17 09:30:00',
          active: true,
          desc: '已分拨至当地营业点进行派送（自提/送货上门）'
        },
        {
          status: '快件已到达中转枢纽，正在分拨中',
          time: '2026-06-16 23:15:00',
          active: false,
          desc: '货物已安全到仓并完成清点分拨'
        },
        {
          status: `${carrier}已收件揽收`,
          time: '2026-06-16 18:00:00',
          active: false,
          desc: `运单号为 ${trackingNo}，客户已成功发出寄回商品`
        },
        {
          status: '【审核通过】请按供应商要求格式寄回',
          time: dates.approved,
          active: false,
          desc: '供应商同意受理售后申请，确认寄回处理'
        },
        {
          status: '【售后申请已提交】',
          time: dates.apply,
          active: false,
          desc: `客户提交售后服务申请，单号：${order.id}`
        }
      ];
    } else {
      return [
        {
          status: '【等待客户发货】等待客户寄回商品',
          time: '进行中...',
          active: true,
          desc: '供应商已同意您的售后申请，正在等待您将退换/维保商品寄出并填报物流单号。'
        },
        {
          status: '【审核通过】同意售后申请并通知寄回',
          time: dates.approved,
          active: false,
          desc: '售后申请已由供应商或运营端审核通过，状态变更为：待客户寄回。'
        },
        {
          status: '【售后申请已提交】',
          time: dates.apply,
          active: false,
          desc: `客户已提交售后申请，关联订单 ${order.salesOrderNo}。`
        }
      ];
    }
  };

  const timeline = getTimeline();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Box */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Truck className="text-indigo-600" size={22} />
            <span className="text-base font-bold text-slate-800">售后寄回物流详情</span>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Base Order / Logistics Summary */}
          <div className="bg-slate-50/80 border border-slate-100 rounded-xl p-5 grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6">
            <div>
              <span className="block text-xs text-slate-400 font-medium mb-1">售后单号</span>
              <span className="text-sm font-semibold text-slate-700 font-mono">{order.id}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 font-medium mb-1">客户名称</span>
              <span className="text-sm font-semibold text-slate-700 truncate block max-w-[150px]">{order.customerName}</span>
            </div>
            <div>
              <span className="block text-xs text-slate-400 font-medium mb-1">物流公司</span>
              {hasLogistics ? (
                <span className="text-sm font-semibold text-slate-700">{order.expressCompany}</span>
              ) : (
                <span className="text-sm font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100/50 text-xs inline-block">待客户发货</span>
              )}
            </div>
            {hasLogistics && (
              <div>
                <span className="block text-xs text-slate-400 font-medium mb-1">物流单号</span>
                <span className="text-sm font-semibold text-slate-800 font-mono">{order.expressNumber}</span>
              </div>
            )}
            <div className="col-span-2">
              <span className="block text-xs text-slate-400 font-medium mb-1">涉及商品</span>
              <span className="text-sm font-semibold text-slate-700">{order.productName}</span>
            </div>
          </div>

          {/* If customer hasn't shipped, display convenient instructions and default supplier address */}
          {!hasLogistics && (
            <div className="border border-indigo-100 bg-indigo-50/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                <MapPin size={18} className="text-indigo-600" />
                <span>推荐寄回地址（供应商福田仓库）</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1.5 pl-6">
                <div><span className="text-slate-400">收货单位：</span><span className="font-semibold text-slate-700">供应商售后服务部</span></div>
                <div><span className="text-slate-400">联系电话：</span><span className="font-semibold text-slate-700">13812345678</span></div>
                <div><span className="text-slate-400">详细地址：</span><span className="font-semibold text-slate-700">广东省深圳市福田区华强北路驻深办福田仓库 1栋2层</span></div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 rounded-lg p-2.5 border border-amber-100 mt-2">
                <HelpCircle size={14} className="shrink-0" />
                <span>温馨提示：当您收到客户的快递面单或客户线下发货后，可在此界面点击“确认收货”，或由管理员手动填写寄回单号变更为处理中。</span>
              </div>
            </div>
          )}

          {/* Timeline Logistics Tracking */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <span className="w-1.5 h-4 bg-indigo-600 rounded-full" />
              <span>服务轨迹与物流追踪</span>
            </h4>
            <div className="pl-3 py-1 space-y-6 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
              {timeline.map((event, idx) => (
                <div key={idx} className="relative flex items-start group">
                  <div className={`flex items-center justify-center w-[14px] h-[14px] rounded-full border-[3px] border-white z-10 shrink-0 mt-1 shadow-sm ${
                    event.active 
                      ? 'bg-indigo-600 ring-4 ring-indigo-50 scale-110' 
                      : 'bg-slate-300'
                  }`} />
                  <div className="pl-5 flex flex-col pt-0.5">
                    <span className={`text-sm font-bold ${event.active ? 'text-indigo-600' : 'text-slate-700'}`}>
                      {event.status}
                    </span>
                    <span className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {event.desc}
                    </span>
                    <span className="text-xs font-mono text-slate-400 mt-1.5 flex items-center gap-1">
                      <Calendar size={12} />
                      {event.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end rounded-b-2xl">
          <button 
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-sm font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors"
          >
            关闭窗口
          </button>
        </div>
      </div>
    </div>
  );
}
