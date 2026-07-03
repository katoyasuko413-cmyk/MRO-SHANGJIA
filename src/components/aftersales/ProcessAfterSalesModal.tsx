import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AfterSalesOrder, AfterSalesType, AfterSalesAddress } from '../../models/afterSales';
import { getAfterSalesAddresses } from '../../services/afterSalesService';

interface ProcessAfterSalesModalProps {
  isOpen: boolean;
  order: AfterSalesOrder | null;
  onClose: () => void;
  onSubmit: (id: string, data: {
    result: 'agree' | 'reject';
    address?: string;
    deliveryMethod?: 'express' | 'self';
    rejectReason?: string;
  }) => void;
}

const TYPE_LABELS = {
  [AfterSalesType.RETURN]: '退货',
  [AfterSalesType.REPAIR]: '维修',
  [AfterSalesType.EXCHANGE]: '换货',
  [AfterSalesType.RETURN_REPAIR]: '维修',
};

export function ProcessAfterSalesModal({
  isOpen,
  order,
  onClose,
  onSubmit
}: ProcessAfterSalesModalProps) {
  const [result, setResult] = useState<'agree' | 'reject'>('agree');
  const [addresses, setAddresses] = useState<AfterSalesAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'express' | 'self'>('express');
  const [rejectReason, setRejectReason] = useState('');

  // Load addresses on mount or when modal opens
  useEffect(() => {
    if (isOpen) {
      getAfterSalesAddresses().then(list => {
        setAddresses(list);
        const defaultAddr = list.find(addr => addr.isDefault) || list[0];
        if (defaultAddr) {
          const fullAddress = `${defaultAddr.province}${defaultAddr.city}${defaultAddr.district}${defaultAddr.detailAddress}`;
          setSelectedAddress(`${fullAddress} - 收件人: ${defaultAddr.contactName} (${defaultAddr.phone})`);
        } else if (list.length > 0) {
          const firstFullAddress = `${list[0].province}${list[0].city}${list[0].district}${list[0].detailAddress}`;
          const firstAddrStr = `${firstFullAddress} - 收件人: ${list[0].contactName} (${list[0].phone})`;
          setSelectedAddress(firstAddrStr);
        }
      });
    }
  }, [isOpen]);

  // Reset inner states when modal triggers with new order
  useEffect(() => {
    if (order) {
      setResult('agree');
      setDeliveryMethod('express');
      setRejectReason('');
    }
  }, [order, isOpen]);

  if (!isOpen || !order) return null;

  const typeLabel = TYPE_LABELS[order.type] || '协商处理';
  const displayAmount = `¥${(order.totalAmountInclTax || 0).toFixed(2)}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (result === 'reject' && !rejectReason.trim()) {
      alert('请填写拒绝原因');
      return;
    }
    onSubmit(order.id, {
      result,
      address: (result === 'agree' && order.type !== AfterSalesType.REPAIR) ? selectedAddress : undefined,
      deliveryMethod: (result === 'agree' && order.type !== AfterSalesType.REPAIR && order.type !== AfterSalesType.RETURN_REPAIR) ? deliveryMethod : undefined,
      rejectReason: result === 'reject' ? rejectReason : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal panel container */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-xl flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            处理售后申请 - {order.id}
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content body with form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* After Sales Type Row */}
          <div className="flex items-center">
            <span className="w-28 text-slate-500 text-sm shrink-0 text-right pr-6 font-medium">
              售后类型
            </span>
            <span className="text-slate-800 text-sm font-medium">
              {typeLabel}
            </span>
          </div>

          {/* Amount Row */}
          {order.type !== AfterSalesType.REPAIR && order.type !== AfterSalesType.RETURN_REPAIR && (
            <div className="flex items-center">
              <span className="w-28 text-slate-500 text-sm shrink-0 text-right pr-6 font-medium">
                申请金额
              </span>
              <span className="text-red-500 font-semibold text-sm antialiased">
                {displayAmount}
              </span>
            </div>
          )}

          {order.type !== AfterSalesType.REPAIR ? (
            <>
              {/* Select Merchant Address (Changed from Merchant notes) */}
              <div className="flex items-start">
                <span className="w-28 text-slate-500 text-sm shrink-0 text-right pr-6 font-medium pt-2">
                  选择商家售后地址
                </span>
                <div className="flex-1">
                  <select
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                  >
                    {addresses.map((addr) => {
                      const fullAddress = `${addr.province}${addr.city}${addr.district}${addr.detailAddress}`;
                      const addrStr = `${fullAddress} - 收件人: ${addr.contactName} (${addr.phone})`;
                      return (
                        <option key={addr.id} value={addrStr}>
                          {addrStr} {addr.isDefault ? '(默认)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    * 客户需将商品寄回到上述选择的商家地址进行入库检测或维修。
                  </p>
                </div>
              </div>

              {/* Delivery Method Radio Group (Changed from Logistics input) */}
              {order.type !== AfterSalesType.RETURN_REPAIR && (
                <div className="flex items-center">
                  <span className="w-28 text-slate-500 text-sm shrink-0 text-right pr-6 font-medium">
                    退换货方式
                  </span>
                  <div className="flex-center gap-6 flex">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="radio"
                        name="deliveryMethod"
                        value="express"
                        checked={deliveryMethod === 'express'}
                        onChange={() => setDeliveryMethod('express')}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-700">自行寄回</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="radio"
                        name="deliveryMethod"
                        value="self"
                        checked={deliveryMethod === 'self'}
                        onChange={() => setDeliveryMethod('self')}
                        className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-slate-700">商家自取</span>
                    </label>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-start">
              <span className="w-28 text-slate-500 text-sm shrink-0 text-right pr-6 font-medium pt-1">
                处理提示
              </span>
              <div className="flex-1 text-sm text-blue-600 bg-blue-50 border border-blue-100 p-4 rounded-xl leading-relaxed">
                此售后申请类型为<strong>【维修（上门服务）】</strong>。已同意处理后，该售后单将直接转为<strong>【处理中】</strong>状态，由供应商进行后续维修服务，无需填报收货地址与寄回方式。
              </div>
            </div>
          )}

          {/* Footer Actions Row */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all font-sans"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-500 border border-transparent rounded-xl hover:bg-blue-600 transition-all shadow-sm shadow-blue-100 flex items-center gap-1.5 h-[41px]"
            >
              提交处理
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
