import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Order, OrderItem } from '../../models/order';

interface ShipOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (orderId: string, logisticsCompany: string, trackingNumber: string, shippedItems: { id: string; quantity: number }[], deliverer?: string, contactPhone?: string) => void;
  order: Order | null;
}

export function ShipOrderModal({ isOpen, onClose, onSubmit, order }: ShipOrderModalProps) {
  const [logisticsCompany, setLogisticsCompany] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [deliverer, setDeliverer] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedItems, setSelectedItems] = useState<{ [id: string]: boolean }>({});
  const [shippingQuantities, setShippingQuantities] = useState<{ [id: string]: number | string }>({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && order) {
      setLogisticsCompany('');
      setTrackingNumber('');
      setDeliverer('');
      setContactPhone('');
      setError('');
      
      const newSelected: { [id: string]: boolean } = {};
      const newQtys: { [id: string]: number | string } = {};
      order.items.forEach(item => {
        const unshippedQty = item.quantity - (item.shippedQuantity || 0);
        newSelected[item.id] = false; // default false, or we can make it true by default
        newQtys[item.id] = unshippedQty > 0 ? unshippedQty : 0;
      });
      setSelectedItems(newSelected);
      setShippingQuantities(newQtys);
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const getUnshippedQty = (item: OrderItem) => item.quantity - (item.shippedQuantity || 0);
  const shippableItems = order.items.filter(item => getUnshippedQty(item) > 0);

  const handleSelectAll = (checked: boolean) => {
    const newSelected: { [id: string]: boolean } = {};
    order.items.forEach(item => {
      if (getUnshippedQty(item) > 0) {
        newSelected[item.id] = checked;
      }
    });
    setSelectedItems(newSelected);
  };

  const handleItemSelect = (id: string, checked: boolean) => {
    setSelectedItems(prev => ({ ...prev, [id]: checked }));
  };

  const handleQtyChange = (id: string, newQty: number | string, maxQty: number) => {
    let finalQty = newQty;
    if (typeof finalQty === 'number') {
      if (finalQty > maxQty) finalQty = maxQty;
    }
    setShippingQuantities(prev => ({ ...prev, [id]: finalQty }));
  };

  const handleQtyBlur = (id: string, maxQty: number) => {
    setShippingQuantities(prev => {
      let val = prev[id];
      let num = typeof val === 'string' ? parseInt(val, 10) : val;
      if (isNaN(num) || num < 1) num = 1;
      if (num > maxQty) num = maxQty;
      return { ...prev, [id]: num };
    });
  };

  const allSelected = shippableItems.length > 0 && shippableItems.every(item => selectedItems[item.id]);
  const isPartiallySelected = shippableItems.some(item => selectedItems[item.id]) && !allSelected;
  const isAnySelected = shippableItems.some(item => selectedItems[item.id]);

  const handleSubmit = () => {
    if (!isAnySelected) {
      setError('请选择至少一件发货商品');
      return;
    }
    if (!logisticsCompany.trim()) {
      setError('请选择物流公司');
      return;
    }
    if (logisticsCompany === '自配送') {
      if (!trackingNumber.trim()) {
        setError('请输入车牌号');
        return;
      }
      if (!deliverer.trim()) {
        setError('请输入送货人');
        return;
      }
      if (!contactPhone.trim()) {
        setError('请输入联系电话');
        return;
      }
    } else {
      if (!trackingNumber.trim()) {
        setError('请输入物流单号');
        return;
      }
    }

    const shippedItems = order.items
      .filter(item => selectedItems[item.id])
      .map(item => ({
        id: item.id,
        quantity: shippingQuantities[item.id] as number
      }));

    onSubmit(order.id, logisticsCompany, trackingNumber, shippedItems, deliverer, contactPhone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-lg font-bold text-slate-800">发货信息录入</h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Logistics Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">物流公司 <span className="text-red-500">*</span></label>
              <select
                value={logisticsCompany}
                onChange={e => setLogisticsCompany(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="" disabled>请选择物流公司</option>
                <option value="顺丰速运">顺丰速运</option>
                <option value="中通快递">中通快递</option>
                <option value="圆通速递">圆通速递</option>
                <option value="申通快递">申通快递</option>
                <option value="韵达速递">韵达速递</option>
                <option value="极兔速递">极兔速递</option>
                <option value="京东物流">京东物流</option>
                <option value="自配送">自配送</option>
                <option value="其他">其他</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">{logisticsCompany === '自配送' ? '车牌号' : '物流单号'} <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder={logisticsCompany === '自配送' ? '请输入车牌号' : '请输入物流单号'}
                value={trackingNumber}
                onChange={e => setTrackingNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            {logisticsCompany === '自配送' && (
              <>
                <div className="space-y-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700">送货人 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="请输入送货人"
                    value={deliverer}
                    onChange={e => setDeliverer(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="block text-sm font-medium text-slate-700">联系电话 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="请输入联系电话"
                    value={contactPhone}
                    onChange={e => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          <div className="h-px bg-slate-100 my-4" />

          {/* Product selection */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              选择发货商品 - 销售订单号: <span className="font-mono text-slate-900">{order.salesOrderNo}</span> <span className="text-red-500">*</span>
            </label>
            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[40vh] flex flex-col">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10 hidden md:table-header-group">
                    <tr>
                      <th className="p-3 w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={allSelected}
                          ref={input => {
                            if (input) input.indeterminate = isPartiallySelected;
                          }}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="p-3 font-medium text-slate-600">商品信息</th>
                      <th className="p-3 font-medium text-slate-600 text-center">下单数量</th>
                      <th className="p-3 font-medium text-slate-600 text-center w-24">未发货数量</th>
                      <th className="p-3 font-medium text-slate-600 text-center w-36">发货数量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map(item => {
                      const unshippedQty = getUnshippedQty(item);
                      const isShippable = unshippedQty > 0;
                      return (
                      <tr key={item.id} className={`hover:bg-slate-50 bg-white transition-colors group flex flex-col md:table-row ${!isShippable ? 'opacity-60' : ''}`}>
                        <td className="p-3 text-center border-b md:border-b-0 border-slate-100 hidden md:table-cell">
                          <input 
                            type="checkbox" 
                            checked={selectedItems[item.id] || false}
                            onChange={(e) => handleItemSelect(item.id, e.target.checked)}
                            disabled={!isShippable}
                            className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-start gap-2">
                            <div className="md:hidden mt-0.5">
                              <input 
                                type="checkbox" 
                                checked={selectedItems[item.id] || false}
                                onChange={(e) => handleItemSelect(item.id, e.target.checked)}
                                disabled={!isShippable}
                                className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-slate-800">{item.name}</div>
                              <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-2">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded">SKU: {item.sku}</span>
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded">{item.brand}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 font-medium text-slate-700 md:text-center flex justify-between md:table-cell border-t md:border-t-0 border-slate-50 border-dashed">
                          <span className="md:hidden text-slate-500 text-xs">下单数量</span>
                          {item.quantity}
                        </td>
                        <td className="p-3 font-medium text-slate-700 md:text-center flex justify-between md:table-cell border-t md:border-t-0 border-slate-50 border-dashed">
                          <span className="md:hidden text-slate-500 text-xs">未发货数量</span>
                          {unshippedQty}
                        </td>
                        <td className="p-3 flex justify-between md:table-cell border-t md:border-t-0 border-slate-50">
                          <span className="md:hidden text-slate-500 text-xs self-center">发货数量</span>
                          <div className="inline-flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                            <button
                              type="button"
                              onClick={() => {
                                const current = Number(shippingQuantities[item.id]) || unshippedQty;
                                handleQtyChange(item.id, Math.max(1, current - 1), unshippedQty);
                              }}
                              disabled={!isShippable || !selectedItems[item.id] || Number(shippingQuantities[item.id] || unshippedQty) <= 1}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={1}
                              max={unshippedQty}
                              value={shippingQuantities[item.id] !== undefined ? shippingQuantities[item.id] : unshippedQty}
                              onChange={e => {
                                const val = e.target.value;
                                if (val === '') {
                                  handleQtyChange(item.id, '', unshippedQty);
                                } else {
                                  handleQtyChange(item.id, parseInt(val, 10), unshippedQty);
                                }
                              }}
                              onBlur={() => handleQtyBlur(item.id, unshippedQty)}
                              disabled={!isShippable || !selectedItems[item.id]}
                              className="w-12 text-center text-sm py-1 border-x border-slate-200 focus:outline-none disabled:bg-slate-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const current = Number(shippingQuantities[item.id]) || unshippedQty;
                                handleQtyChange(item.id, current + 1, unshippedQty);
                              }}
                              disabled={!isShippable || !selectedItems[item.id] || Number(shippingQuantities[item.id] || unshippedQty) >= unshippedQty}
                              className="px-2 py-1 text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-transparent"
                            >
                              +
                            </button>
                          </div>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {error}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-2xl">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
          >
            取消
          </button>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Check size={16} />
            确认发货
          </button>
        </div>
      </div>
    </div>
  );
}
