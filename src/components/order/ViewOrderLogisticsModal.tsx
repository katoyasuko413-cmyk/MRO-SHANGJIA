import React, { useState } from 'react';
import { X, Truck, Package } from 'lucide-react';
import { Order } from '../../models/order';

interface ViewOrderLogisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const mockShipments = [
  {
    id: '1',
    company: '顺丰速运',
    trackingNumber: 'SF1029384756',
    status: '运输中',
    items: [
      { sku: 'SKU1001', name: '得力(deli)A4打印纸', orderQty: 10, shipQty: 10 },
      { sku: 'SKU1002', name: '晨光(M&G)黑色中性笔', orderQty: 50, shipQty: 50 },
    ],
    timeline: [
      { status: '快件已发车', time: '2026-05-13 14:00:00', active: true },
      { status: '顺丰已揽收', time: '2026-05-13 10:00:00', active: false },
      { status: '发货人已打印快递单', time: '2026-05-13 09:00:00', active: false },
    ]
  },
  {
    id: '2',
    company: '京东物流',
    trackingNumber: 'JD9876543210',
    status: '已签收',
    items: [
      { sku: 'SKU1003', name: '齐心(Comix)订书机', orderQty: 5, shipQty: 5 },
    ],
    timeline: [
      { status: '已签收，感谢使用京东物流', time: '2026-05-14 16:30:00', active: true },
      { status: '派送中', time: '2026-05-14 09:00:00', active: false },
      { status: '快件已发车', time: '2026-05-13 15:00:00', active: false },
    ]
  }
];

export function ViewOrderLogisticsModal({ isOpen, onClose, order }: ViewOrderLogisticsModalProps) {
  const [activeShipmentId, setActiveShipmentId] = useState('1');

  if (!isOpen || !order) return null;

  const activeShipment = mockShipments.find(s => s.id === activeShipmentId) || mockShipments[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl overflow-hidden flex flex-col h-[80vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-shrink-0 items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            <Truck className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-slate-800">物流详情</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors border border-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Tracking Numbers */}
          <div className="w-56 flex-shrink-0 border-r border-slate-100 bg-slate-50/50 overflow-y-auto">
            {mockShipments.map(shipment => (
              <button
                key={shipment.id}
                onClick={() => setActiveShipmentId(shipment.id)}
                className={`w-full text-left px-5 py-4 transition-colors ${
                  activeShipmentId === shipment.id
                    ? 'bg-blue-50 border-r-2 border-blue-600'
                    : 'hover:bg-slate-100 border-r-2 border-transparent'
                }`}
              >
                <div className={`font-medium mb-1 ${activeShipmentId === shipment.id ? 'text-blue-600' : 'text-slate-700'}`}>
                  {shipment.company}
                </div>
                <div className={`text-sm ${activeShipmentId === shipment.id ? 'text-blue-500' : 'text-slate-500'}`}>
                  {shipment.trackingNumber}
                </div>
              </button>
            ))}
          </div>

          {/* Right Main Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Top Info Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 mb-8 flex justify-between">
              <div>
                <div className="text-sm text-slate-500 mb-1">物流公司</div>
                <div className="text-base font-medium text-slate-900">{activeShipment.company}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1">
                  {activeShipment.company === '自配送' ? '车牌号' : '运单编号'}
                </div>
                <div className="text-base font-medium text-slate-900">{activeShipment.trackingNumber}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500 mb-1 text-right">物流状态</div>
                <div className="text-lg font-bold text-blue-600 text-right">{activeShipment.status}</div>
              </div>
            </div>

            {/* Package Items Table */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <Package className="text-slate-400" size={20} />
                <h4 className="font-bold text-slate-800 text-base">包裹商品信息</h4>
              </div>
              <div className="border border-slate-100 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-medium">
                    <tr>
                      <th className="px-5 py-3 border-b border-slate-100">SKU编码</th>
                      <th className="px-5 py-3 border-b border-slate-100">商品名称</th>
                      <th className="px-5 py-3 border-b border-slate-100 text-center w-24">下单数量</th>
                      <th className="px-5 py-3 border-b border-slate-100 text-center w-24">发货数量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {activeShipment.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-5 py-3 font-mono text-slate-600">{item.sku}</td>
                        <td className="px-5 py-3">{item.name}</td>
                        <td className="px-5 py-3 text-center text-slate-600">{item.orderQty}</td>
                        <td className="px-5 py-3 text-center font-medium">{item.shipQty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Logistics Tracking Timeline */}
            <div>
              <div className="flex items-center gap-2 flex-shrink-0 mb-6">
                <Truck className="text-slate-400" size={20} />
                <h4 className="font-bold text-slate-800 text-base">物流追踪</h4>
              </div>
              <div className="pl-2 space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200">
                {activeShipment.timeline.map((event, idx) => (
                  <div key={idx} className="relative flex items-start group">
                    <div className={`flex items-center justify-center w-[14px] h-[14px] rounded-full border-[3px] border-white z-10 shrink-0 mt-1 shadow-sm ${event.active ? 'bg-blue-500 ring-4 ring-blue-50' : 'bg-slate-300'}`}></div>
                    <div className="pl-6 flex flex-col pt-0.5">
                      <div className={`text-base ${event.active ? 'font-medium text-slate-800' : 'text-slate-600'}`}>{event.status}</div>
                      <div className="text-sm font-mono text-slate-400 mt-1">{event.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
