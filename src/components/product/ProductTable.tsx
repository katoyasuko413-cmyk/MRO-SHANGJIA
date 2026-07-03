import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../../models/product';
import { ChevronDown } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  selectedIds: string[];
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onAction?: (action: string, product: Product) => void;
}

type ActionType = '库存变更' | '下架' | '查看' | '阅览' | '编辑' | '提交审批' | '删除' | '复制' | '绑定SPU' | '调价' | '预览';

function ProductActions({ 
  product,
  isOpen,
  onToggle,
  onAction
}: { 
  product: Product;
  isOpen: boolean;
  onToggle: (state: boolean) => void;
  onAction?: (action: string, product: Product) => void;
}) {
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && moreRef.current && !moreRef.current.contains(event.target as Node)) {
        onToggle(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onToggle]);

  let available: ActionType[] = [];

  if (product.auditStatus === 'DRAFT' || product.auditStatus === 'AUDIT_REJECTED' || product.auditStatus === 'APPROVAL_REJECTED') {
    available.push('编辑', '提交审批', '删除');
  } else if (product.auditStatus === 'PENDING_AUDIT' || product.auditStatus === 'PENDING_APPROVAL') {
    available.push('查看', '阅览');
  } else if (product.auditStatus === 'APPROVED') {
    available.push('查看', '库存变更');
    if (product.salesStatus === 'ON_SALE') {
      available.push('下架', '调价');
    } else if (product.salesStatus === 'OFF_SALE') {
      available.push('编辑', '删除', '调价');
    }
  }

  available.push('复制', '绑定SPU', '预览');
  // Remove duplicates just in case
  available = Array.from(new Set(available));

  const main = available.slice(0, 3);
  const more = available.slice(3);

  const getActionColor = (action: ActionType) => {
    switch (action) {
      case '删除': return 'text-slate-400 hover:text-red-600';
      case '库存变更':
      case '提交审批': return 'text-blue-600 hover:text-blue-700';
      case '编辑': return 'text-blue-600 hover:text-blue-700';
      default: return 'text-slate-600 hover:text-slate-900';
    }
  };

  return (
    <div className="flex items-center justify-end gap-3 text-xs font-bold" onClick={e => e.stopPropagation()}>
      {main.map(action => (
        <button 
          key={action} 
          className={`${getActionColor(action)} hover:underline transition-colors`} 
          title={action}
          onClick={() => {
            onToggle(false);
            onAction && onAction(action, product);
          }}
        >
          {action}
        </button>
      ))}
      
      {more.length > 0 && (
        <div className="relative" ref={moreRef}>
          <button 
            className="text-slate-500 hover:text-slate-800 flex items-center gap-0.5 transition-colors"
            onClick={() => onToggle(!isOpen)}
          >
            更多 <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isOpen && (
            <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-slate-100 rounded-lg shadow-lg z-50 py-1 animate-in fade-in zoom-in-95">
              {more.map(action => (
                <button 
                  key={action}
                  onClick={() => {
                    onToggle(false);
                    onAction && onAction(action, product);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${action === '删除' ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'}`}
                >
                  {action}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ProductTable({ products, loading, selectedIds, onSelect, onSelectAll, onAction }: ProductTableProps) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const isAllSelected = products.length > 0 && selectedIds.length === products.length;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < products.length;

  const getStatusBadge = (product: Product) => {
    if (product.auditStatus === 'DRAFT') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 whitespace-nowrap">草稿</span>;
    }
    if (product.auditStatus === 'PENDING_AUDIT') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 whitespace-nowrap">待审核</span>;
    }
    if (product.auditStatus === 'AUDIT_REJECTED') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 whitespace-nowrap">审核驳回</span>;
    }
    if (product.auditStatus === 'PENDING_APPROVAL') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 whitespace-nowrap">待审批</span>;
    }
    if (product.auditStatus === 'APPROVAL_REJECTED') {
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 whitespace-nowrap">审批驳回</span>;
    }
    if (product.auditStatus === 'APPROVED') {
      if (product.salesStatus === 'ON_SALE') {
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">已上架</span>;
      }
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 whitespace-nowrap">已下架</span>;
    }
    return null;
  };

  const getSPUStatusBadge = (product: Product) => {
    if (product.salesStatus !== 'ON_SALE' && product.auditStatus !== 'APPROVED') return '-';
    
    switch (product.spuStatus) {
      case 'BINDING':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 whitespace-nowrap">绑定中</span>;
      case 'BOUND':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 whitespace-nowrap">已绑定</span>;
      case 'UNBOUND':
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 whitespace-nowrap">已解绑</span>;
      default:
        return '-';
    }
  };

  return (
    <div className="overflow-x-auto relative min-h-[300px]">
      {loading && (
        <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
             <div className="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" />
             <span className="text-sm text-slate-500">加载中...</span>
          </div>
        </div>
      )}
      <table className="w-full text-left border-collapse min-w-[2200px]">
        <thead>
          <tr className="bg-slate-50 border-y border-slate-100">
            <th className="px-4 py-4 w-[48px] text-center sticky left-0 bg-slate-50 z-10 shadow-[4px_0_4px_-4px_rgba(0,0,0,0.05)] whitespace-nowrap">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={isAllSelected}
                ref={(input) => { if (input) input.indeterminate = isIndeterminate; }}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">SKU</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">SPU</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">供应商SKU</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[200px]">商品名称</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap w-[160px]">商品合同名称</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">品牌</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">规格</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">型号</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">主品类</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">场景</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">未税含运采购价</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">含税含运采购价</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">税点</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">货期(天)</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">最小起订量</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">库存</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">上架展示</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">SPU绑定状态</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">状态</th>
            <th className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right sticky right-0 bg-slate-50 z-10 shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.05)] w-[160px] whitespace-nowrap">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
              <td className="px-4 py-4 text-center sticky left-0 bg-white group-hover:bg-slate-50 z-10 shadow-[4px_0_4px_-4px_rgba(0,0,0,0.05)] transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  checked={selectedIds.includes(product.id)}
                  onChange={(e) => onSelect(product.id, e.target.checked)}
                />
              </td>
              <td className="px-4 py-4 text-sm text-slate-600 font-mono">{product.sku}</td>
              <td className="px-4 py-4 text-sm text-slate-600 font-mono">{product.spu}</td>
              <td className="px-4 py-4 text-sm text-slate-600 font-mono">{product.supplierSku}</td>
              <td className="px-4 py-4 text-sm font-bold text-slate-900 leading-tight">
                <div className="line-clamp-2" title={product.name}>{product.name}</div>
              </td>
              <td className="px-4 py-4 text-sm text-slate-600">
                <div className="line-clamp-2" title={product.contractName}>{product.contractName}</div>
              </td>
              <td className="px-4 py-4 text-sm text-slate-600">{product.brand}</td>
              <td className="px-4 py-4 text-sm text-slate-600">{product.specification}</td>
              <td className="px-4 py-4 text-sm text-slate-600">{product.model}</td>
              <td className="px-4 py-4 text-sm text-slate-600">{product.mainCategory}</td>
              <td className="px-4 py-4 text-sm text-slate-600">{product.scene || '-'}</td>
              <td className="px-4 py-4 text-sm text-slate-900 font-medium">¥{product.purchasePriceExclTax.toFixed(2)}</td>
              <td className="px-4 py-4 text-sm font-bold text-blue-600">¥{product.purchasePriceInclTax.toFixed(2)}</td>
              <td className="px-4 py-4 text-sm text-slate-600">{product.taxRate}%</td>
              <td className="px-4 py-4 text-sm text-slate-600">{product.leadTimeDays}</td>
              <td className="px-4 py-4 text-sm text-slate-600">{product.moq || 1}</td>
              <td className="px-4 py-4 text-sm text-slate-600">{product.stock}</td>
              <td className="px-4 py-4 text-sm text-slate-600 whitespace-nowrap">
                {product.displayStatus === 'DISPLAY' ? (
                  <span className="text-green-600">展示</span>
                ) : (
                  <span className="text-slate-400">不展示</span>
                )}
              </td>
              <td className="px-4 py-4 text-sm text-slate-600 font-medium">
                {getSPUStatusBadge(product)}
              </td>
              <td className="px-4 py-4">
                {getStatusBadge(product)}
              </td>
              <td className={`px-4 py-4 text-right sticky right-0 bg-white group-hover:bg-slate-50 shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.05)] transition-colors ${openDropdownId === product.id ? 'z-30' : 'z-10'}`}>
                <ProductActions 
                  product={product} 
                  isOpen={openDropdownId === product.id}
                  onToggle={(state) => setOpenDropdownId(state ? product.id : null)}
                  onAction={onAction}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && products.length === 0 && (
        <div className="p-12 text-center text-slate-500">
           暂无数据
        </div>
      )}
    </div>
  );
}
