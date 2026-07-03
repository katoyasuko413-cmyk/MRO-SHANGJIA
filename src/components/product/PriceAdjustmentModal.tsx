import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '../../models/product';

interface PriceAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onConfirm: (productId: string, newPriceExclTax: number, newPriceInclTax: number, taxRate: number) => void;
}

export function PriceAdjustmentModal({ isOpen, onClose, product, onConfirm }: PriceAdjustmentModalProps) {
  const [taxRate, setTaxRate] = useState<number>(13);
  const [priceExclTax, setPriceExclTax] = useState<string>('');
  const [priceInclTax, setPriceInclTax] = useState<string>('');

  useEffect(() => {
    if (isOpen && product) {
      setTaxRate(Number(product.taxRate) || 13);
      setPriceExclTax(product.purchasePriceExclTax?.toString() || '');
      setPriceInclTax(product.purchasePriceInclTax?.toString() || '');
    }
  }, [isOpen, product]);

  // Auto calculate when excl tax or tax rate changes
  const handleExclTaxChange = (val: string) => {
    setPriceExclTax(val);
    const excl = parseFloat(val);
    if (!isNaN(excl)) {
      const incl = excl * (1 + taxRate / 100);
      setPriceInclTax(incl.toFixed(2));
    } else {
      setPriceInclTax('');
    }
  };

  // Auto calculate excl tax when incl tax changes
  const handleInclTaxChange = (val: string) => {
    setPriceInclTax(val);
    const incl = parseFloat(val);
    if (!isNaN(incl)) {
      const excl = incl / (1 + taxRate / 100);
      setPriceExclTax(excl.toFixed(2));
    } else {
      setPriceExclTax('');
    }
  };

  const handleTaxRateChange = (val: number) => {
    setTaxRate(val);
    const excl = parseFloat(priceExclTax);
    if (!isNaN(excl)) {
      const incl = excl * (1 + val / 100);
      setPriceInclTax(incl.toFixed(2));
    }
  };

  if (!isOpen || !product) return null;

  const handleConfirm = () => {
    const excl = parseFloat(priceExclTax);
    const incl = parseFloat(priceInclTax);
    if (!isNaN(excl) && !isNaN(incl)) {
      onConfirm(product.id, excl, incl, taxRate);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">商品调价</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4">
            <label className="w-32 text-right text-sm font-medium text-slate-700 shrink-0">
              <span className="text-red-500 mr-1">*</span>税率
            </label>
            <div className="relative flex-1">
              <select 
                value={taxRate}
                onChange={(e) => handleTaxRateChange(Number(e.target.value))}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none text-slate-700 font-medium"
              >
                <option value="1">1%</option>
                <option value="9">9%</option>
                <option value="13">13%</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-32 text-right text-sm font-medium text-slate-700 shrink-0">
              未税含运采购价
            </label>
            <div className="flex-1 flex items-center border border-slate-200 rounded-lg overflow-hidden h-[42px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input 
                type="number" 
                value={priceExclTax}
                onChange={(e) => handleExclTaxChange(e.target.value)}
                className="flex-1 w-full h-full text-center text-sm font-medium text-slate-900 outline-none no-spinner"
              />
              <div className="w-8 h-full flex flex-col border-l border-slate-200 bg-slate-50">
                <button 
                  onClick={() => handleExclTaxChange((parseFloat(priceExclTax || '0') + 1).toFixed(2))}
                  className="flex-1 flex items-center justify-center hover:bg-slate-100 text-slate-400 border-b border-slate-200"
                >
                  <ChevronUp size={14} />
                </button>
                <button 
                  onClick={() => handleExclTaxChange(Math.max(0, parseFloat(priceExclTax || '0') - 1).toFixed(2))}
                  className="flex-1 flex items-center justify-center hover:bg-slate-100 text-slate-400"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="w-32 text-right text-sm font-medium text-slate-700 shrink-0">
              含税含运采购价
            </label>
            <div className="flex-1 flex items-center border border-slate-200 rounded-lg overflow-hidden h-[42px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <input 
                type="number" 
                value={priceInclTax}
                onChange={(e) => handleInclTaxChange(e.target.value)}
                className="flex-1 w-full h-full text-center text-sm font-medium text-slate-900 outline-none no-spinner"
              />
              <div className="w-8 h-full flex flex-col border-l border-slate-200 bg-slate-50">
                <button 
                  onClick={() => handleInclTaxChange((parseFloat(priceInclTax || '0') + 1).toFixed(2))}
                  className="flex-1 flex items-center justify-center hover:bg-slate-100 text-slate-400 border-b border-slate-200"
                >
                  <ChevronUp size={14} />
                </button>
                <button 
                  onClick={() => handleInclTaxChange(Math.max(0, parseFloat(priceInclTax || '0') - 1).toFixed(2))}
                  className="flex-1 flex items-center justify-center hover:bg-slate-100 text-slate-400"
                >
                  <ChevronDown size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-rose-500 text-xs font-medium pl-8">
              * 修改价格后数据状态将自动变为“已下架”，需重新审批后方可再次上架。
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-white">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
          >
            取消
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!priceExclTax || !priceInclTax}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            确认调价
          </button>
        </div>
      </div>
    </div>
  );
}
