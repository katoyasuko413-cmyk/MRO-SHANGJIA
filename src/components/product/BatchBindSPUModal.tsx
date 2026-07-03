import React, { useState, useEffect } from 'react';
import { X, Search, ChevronDown, Loader2 } from 'lucide-react';
import { CategorySelect } from './CategorySelect';
import { Product } from '../../models/product';
import { productService } from '../../services/productService';
import { MOCK_CATEGORIES } from '../../mock/industryCategories';

interface BatchBindSPUModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (count: number, spuNames: string) => void;
  selectedProducts?: Product[];
}

export function BatchBindSPUModal({ isOpen, onClose, onConfirm }: BatchBindSPUModalProps) {
  const [filters, setFilters] = useState({
    categories: [] as string[],
    brand: '',
    spec: '',
    model: ''
  });

  const [spus, setSpus] = useState<string[]>([]);
  const [localProducts, setLocalProducts] = useState<Product[]>([]);
  const [checkedProductIds, setCheckedProductIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Reset all states when modal opens
  useEffect(() => {
    if (isOpen) {
      setFilters({
        categories: [],
        brand: '',
        spec: '',
        model: ''
      });
      setSpus([]);
      setLocalProducts([]);
      setCheckedProductIds([]);
      setHasSearched(false);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const allProducts = await productService.getProducts();
      
      // Filter products based on search conditions
      let filtered = allProducts;

      // Category matching
      if (filters.categories && filters.categories.length > 0) {
        // find node names for filters.categories in MOCK_CATEGORIES
        const names: string[] = [];
        const traverse = (nodes: any[]) => {
          for (const n of nodes) {
            if (filters.categories.includes(n.id)) {
              names.push(n.name);
            }
            if (n.children) traverse(n.children);
          }
        };
        traverse(MOCK_CATEGORIES);
        
        filtered = filtered.filter(p => 
          names.some(name => {
            // Check character intersection to match overlapping category names
            const titleCharSet = new Set(name.split(''));
            const prodCharSet = new Set(p.mainCategory.split(''));
            let intersectionCount = 0;
            for (const char of titleCharSet) {
              if (prodCharSet.has(char) && char !== '品' && char !== '用' && char !== '类') {
                intersectionCount++;
              }
            }
            return intersectionCount >= 2 || name.includes(p.mainCategory) || p.mainCategory.includes(name);
          })
        );
      }

      // Brand matching
      if (filters.brand) {
        filtered = filtered.filter(p => p.brand === filters.brand);
      }

      // Spec matching
      if (filters.spec) {
        const query = filters.spec.toLowerCase();
        filtered = filtered.filter(p => 
          p.specification && p.specification.toLowerCase().includes(query)
        );
      }

      // Model matching
      if (filters.model) {
        const query = filters.model.toLowerCase();
        filtered = filtered.filter(p => 
          p.model && p.model.toLowerCase().includes(query)
        );
      }

      setLocalProducts(filtered);
      setCheckedProductIds([]); // Reset selection on a new search
    } catch (err) {
      console.error("Failed SPU search", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setCheckedProductIds(localProducts.map(p => p.id));
    } else {
      setCheckedProductIds([]);
    }
  };

  const handleToggleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setCheckedProductIds(prev => [...prev, productId]);
    } else {
      setCheckedProductIds(prev => prev.filter(id => id !== productId));
    }
  };

  const handleConfirmSubmit = () => {
    if (checkedProductIds.length === 0 || spus.length === 0) return;
    onConfirm(checkedProductIds.length, spus.join(', '));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-6xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">批量绑定SPU</h3>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div className="space-y-1.5 md:col-span-3">
              <label className="text-xs font-bold text-slate-700">品类</label>
              <CategorySelect 
                value={filters.categories}
                onChange={(cats) => setFilters({ ...filters, categories: cats })}
                placeholder="请选择主品类"
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">品牌</label>
              <div className="relative">
                <select 
                  className="w-full pl-3 pr-8 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none shadow-sm text-slate-800"
                  value={filters.brand}
                  onChange={e => setFilters({ ...filters, brand: e.target.value })}
                >
                  <option value="">请选择品牌</option>
                  <option value="3M">3M</option>
                  <option value="SATA">世达</option>
                  <option value="海康威视">海康威视</option>
                  <option value="优利德">优利德</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">规格</label>
              <input 
                type="text" 
                placeholder="请输入规格"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm text-slate-800"
                value={filters.spec}
                onChange={e => setFilters({ ...filters, spec: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">型号</label>
              <input 
                type="text" 
                placeholder="请输入型号"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm text-slate-800"
                value={filters.model}
                onChange={e => setFilters({ ...filters, model: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2 md:col-span-3">
              <button 
                onClick={handleSearch}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Search size={14} /> 搜索
              </button>
              <button 
                onClick={() => {
                  setFilters({ categories: [], brand: '', spec: '', model: '' });
                  setLocalProducts([]);
                  setCheckedProductIds([]);
                  setHasSearched(false);
                }}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 font-bold py-2 px-4 rounded-lg text-sm transition-all shadow-sm cursor-pointer"
              >
                重置
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                <tr>
                  <th className="px-4 py-3 w-12 text-center border-r border-slate-200">
                    {localProducts.length > 0 ? (
                      <input 
                        type="checkbox" 
                        checked={checkedProductIds.length === localProducts.length} 
                        onChange={(e) => handleToggleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 w-4 h-4 cursor-pointer" 
                      />
                    ) : (
                      <input type="checkbox" className="rounded border-slate-300 text-slate-300 w-4 h-4 cursor-not-allowed" disabled />
                    )}
                  </th>
                  <th className="px-4 py-3 border-r border-slate-200">商品名称</th>
                  <th className="px-4 py-3 border-r border-slate-200 w-32">品类</th>
                  <th className="px-4 py-3 border-r border-slate-200 w-32">品牌</th>
                  <th className="px-4 py-3 border-r border-slate-200 w-32">规格</th>
                  <th className="px-4 py-3 w-32">型号</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <span className="text-sm font-semibold text-slate-500">正在检索商品数据...</span>
                      </div>
                    </td>
                  </tr>
                ) : localProducts.length > 0 ? (
                  localProducts.map(product => (
                    <tr key={product.id} className={`hover:bg-slate-50/50 transition-colors ${checkedProductIds.includes(product.id) ? 'bg-blue-50/30' : ''}`}>
                      <td className="px-4 py-3 text-center border-r border-slate-200">
                        <input 
                          type="checkbox" 
                          checked={checkedProductIds.includes(product.id)} 
                          onChange={(e) => handleToggleSelectProduct(product.id, e.target.checked)}
                          className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 w-4 h-4 cursor-pointer" 
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 font-medium text-slate-800">
                        <div>
                          <span>{product.name}</span>
                          <span className="ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 font-mono text-[10px] rounded border border-slate-200">ID: {product.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200 text-slate-600">{product.mainCategory}</td>
                      <td className="px-4 py-3 border-r border-slate-200 text-slate-600">{product.brand}</td>
                      <td className="px-4 py-3 border-r border-slate-200 text-slate-600">{product.specification || '-'}</td>
                      <td className="px-4 py-3 text-slate-600">{product.model || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center text-slate-400 bg-slate-50/10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                          <Search size={22} />
                        </div>
                        <span className="font-semibold text-slate-500 mt-1">
                          {!hasSearched ? '点击“搜索”展示符合检索条件的商品数据' : '未检索到符合条件的商品'}
                        </span>
                        <p className="text-xs text-slate-400">
                          {!hasSearched ? '默认无数据，请先在上方设置品类、品牌、型号等检索条件进行快速过滤' : '请尝试调整品类或重置条件后再次搜索'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* SPU Select */}
          <div className={`pt-5 border-t border-slate-100 ${checkedProductIds.length === 0 ? 'opacity-50 pointer-events-none' : ''} transition-opacity duration-200`}>
            <div className="flex flex-col gap-2 max-w-5xl">
              <div className="flex items-center gap-4">
                <label className="text-sm font-bold text-slate-700 whitespace-nowrap flex items-center gap-1 min-w-[120px]">
                  <span className="text-red-500">*</span>选择绑定SPU
                </label>
                <div className="flex-1 relative">
                  <select 
                    disabled={checkedProductIds.length === 0}
                    className="w-full pl-3 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none shadow-sm text-slate-700 font-medium disabled:bg-slate-50 disabled:cursor-not-allowed"
                    onChange={(e) => {
                      if (e.target.value && !spus.includes(e.target.value)) {
                        setSpus([...spus, e.target.value]);
                      }
                      e.target.value = ''; // Reset select text
                    }}
                  >
                    <option value="">请选择要绑定的一或多个SPU</option>
                    <option value="SPU-ELEC-001">SPU-ELEC-001 (电子类标准SPU)</option>
                    <option value="SPU-MECH-042">SPU-MECH-042 (机械工具标准SPU)</option>
                    <option value="SPU-SAFE-998">SPU-SAFE-998 (防护用品标准SPU)</option>
                    <option value="SPU-TOOL-103">SPU-TOOL-103 (手动工具通用SPU)</option>
                    <option value="SPU-METER-507">SPU-METER-507 (高精度仪表集成SPU)</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="ml-[136px]">
                {spus.length > 0 && (
                   <div className="flex flex-wrap gap-2 mb-2">
                     {spus.map(s => (
                       <span key={s} className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg text-xs font-bold border border-blue-100 flex items-center gap-1.5">
                         {s}
                         <button onClick={() => setSpus(spus.filter(i => i !== s))} className="hover:text-blue-800"><X size={12} /></button>
                       </span>
                     ))}
                   </div>
                )}
                <p className="text-xs text-slate-400">
                  {checkedProductIds.length === 0 
                    ? '请先勾选上方需要绑定的商品，再选择对应SPU' 
                    : '已选择首选SPU，可点击多选，绑定后会将所选SPU应用于所有已勾选的商品'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center rounded-b-xl bg-slate-50/50">
          <div className="text-sm font-medium text-slate-600">
            {checkedProductIds.length > 0 && (
              <span>已选 <strong className="text-blue-600 font-bold">{checkedProductIds.length}</strong> 个商品, 准备绑定 <strong className="text-blue-600 font-bold">{spus.length}</strong> 个SPU</span>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-8 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl transition-all shadow-sm text-sm cursor-pointer"
            >
              取消
            </button>
            <button 
              disabled={checkedProductIds.length === 0 || spus.length === 0}
              onClick={handleConfirmSubmit}
              className={`px-8 py-2.5 text-white font-bold rounded-xl transition-all shadow-md text-sm ${checkedProductIds.length === 0 || spus.length === 0 ? 'bg-blue-300 cursor-not-allowed shadow-none' : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200 cursor-pointer'}`}
            >
              确认绑定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
