import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, Filter, Trash2, ArrowUpCircle, ArrowDownCircle, CheckSquare, ChevronDown, ChevronUp, Download, Upload, EyeOff, Eye, Link } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductTable } from '../components/product/ProductTable';
import { CategorySelect } from '../components/product/CategorySelect';
import { BatchImportModal } from '../components/product/BatchImportModal';
import { StockManagementModal } from '../components/product/StockManagementModal';
import { ProductDetailModal } from '../components/product/ProductDetailModal';
import { ProductFormModal } from '../components/product/ProductFormModal';
import { BindSPUModal } from '../components/product/BindSPUModal';
import { BatchBindSPUModal } from '../components/product/BatchBindSPUModal';
import { PriceAdjustmentModal } from '../components/product/PriceAdjustmentModal';
import { Pagination } from '../components/common/Pagination';
import { Product } from '../models/product';

export default function ProductMgmt() {
  const { 
    products, 
    loading,
  } = useProducts();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [moreActionsOpen, setMoreActionsOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [bindSPUModalOpen, setBindSPUModalOpen] = useState(false);
  const [batchBindSPUModalOpen, setBatchBindSPUModalOpen] = useState(false);
  const [priceAdjModalOpen, setPriceAdjModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'copy' | 'edit'>('create');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const moreActionsRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [filters, setFilters] = useState({
    keyword: '',
    sku: '',
    spu: '',
    categories: [] as string[],
    auditStatus: '',
    displayStatus: '',
    brand: '',
    spuStatus: ''
  });

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds(prev => 
      checked ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? products.map(p => p.id) : []);
  };

  const handleReset = () => {
    setFilters({
      keyword: '',
      sku: '',
      spu: '',
      categories: [],
      auditStatus: '',
      displayStatus: '',
      brand: '',
      spuStatus: ''
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target as Node)) {
        setMoreActionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleHideFromShelf = () => {
    if (selectedIds.length === 0) {
      showToastMsg('请先选择商品');
    } else {
      showToastMsg('操作成功：已设置为上架不展示');
    }
  };

  const handleAction = (action: string, product: Product) => {
    if (action === '库存变更') {
      setActiveProduct(product);
      setStockModalOpen(true);
    } else if (action === '查看' || action === '阅览') {
      setActiveProduct(product);
      setDetailModalOpen(true);
    } else if (action === '复制') {
      // 复制时清空特定字段
      const copiedProduct = { 
        ...product, 
        id: '', // 清空ID
        supplierSku: '', 
        mainCategory: '', 
        subCategory: '', 
        taxRate: 13, 
        purchasePriceExclTax: 0, 
        purchasePriceInclTax: 0 
      };
      setActiveProduct(copiedProduct);
      setFormMode('copy');
      setFormModalOpen(true);
    } else if (action === '编辑') {
      setActiveProduct(product);
      setFormMode('edit');
      setFormModalOpen(true);
    } else if (action === '下架') {
      if (window.confirm('确认下架该商品吗？下架后前端将不再展示。')) {
        showToastMsg('已下架商品');
      }
    } else if (action === '提交审批') {
      if (window.confirm('确认提交审批吗？')) {
        showToastMsg('已提交审批');
      }
    } else if (action === '绑定SPU') {
      setActiveProduct(product);
      setBindSPUModalOpen(true);
    } else if (action === '调价') {
      setActiveProduct(product);
      setPriceAdjModalOpen(true);
    } else if (action === '预览') {
      window.open(`/product-preview?id=${product.id}`, '_blank');
    } else {
      showToastMsg(`此功能开发中: ${action}`);
    }
  };

  const handleStockConfirm = (productId: string, amount: number) => {
    showToastMsg(`操作成功：库存已增加 ${amount} 件`);
    setStockModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">商品管理</h1>
          <p className="text-sm text-slate-500 mt-1">商品全生命周期管理，包含创建、审核、上下架、库存管理、SPU绑定</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setActiveProduct(null);
              setFormMode('create');
              setFormModalOpen(true);
            }}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm shadow-blue-200"
          >
            <Plus size={16} className="text-blue-100" />
            发布商品
          </button>
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <Upload size={16} className="text-slate-400" />
            批量导入
          </button>
          <button 
            onClick={() => showToastMsg('操作成功：已添加到导出队列')}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm"
          >
            <Download size={16} className="text-slate-400" />
            批量导出
          </button>
        </div>
      </div>

      {/* 筛选区域 - 独立卡片 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
          <input 
            type="text" 
            placeholder="商品名称/SKU" 
            value={filters.keyword}
            onChange={(e) => setFilters({...filters, keyword: e.target.value})}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <input 
            type="text" 
            placeholder="供应商SKU" 
            value={filters.sku}
            onChange={(e) => setFilters({...filters, sku: e.target.value})}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <div className="min-w-[200px]">
            <CategorySelect 
              value={filters.categories} 
              onChange={(cats) => setFilters({...filters, categories: cats})} 
              placeholder="品类"
            />
          </div>

          <div className="flex items-center justify-end gap-3 h-[38px]">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors mr-2"
            >
              {isExpanded ? (
                <><ChevronUp size={16} /> 收起筛选</>
              ) : (
                <><ChevronDown size={16} /> 展开筛选</>
              )}
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
            >
              重置
            </button>
            <button 
              className="px-4 py-2 text-sm font-bold text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600 transition-all shadow-sm shadow-blue-200 flex items-center gap-1.5"
            >
              <Search size={16} className="text-blue-100" />
              搜索
            </button>
          </div>

          {isExpanded && (
            <>
              <input 
                type="text" 
                placeholder="SPU" 
                value={filters.spu}
                onChange={(e) => setFilters({...filters, spu: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
              />
              <select 
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                value={filters.auditStatus}
                onChange={(e) => setFilters({...filters, auditStatus: e.target.value})}
              >
                <option value="">商品状态</option>
                <option value="DRAFT">草稿</option>
                <option value="PENDING_AUDIT">待审核</option>
                <option value="AUDIT_REJECTED">审核驳回</option>
                <option value="PENDING_APPROVAL">待审批</option>
                <option value="APPROVAL_REJECTED">审批驳回</option>
                <option value="ON_SALE">已上架</option>
                <option value="OFF_SALE">已下架</option>
              </select>
              <select 
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                value={filters.displayStatus}
                onChange={(e) => setFilters({...filters, displayStatus: e.target.value})}
              >
                <option value="">展示状态</option>
                <option value="DISPLAY">展示</option>
                <option value="HIDDEN">不展示</option>
              </select>
              <select 
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                value={filters.brand}
                onChange={(e) => setFilters({...filters, brand: e.target.value})}
              >
                <option value="">品牌</option>
                <option value="Apple">Apple</option>
                <option value="Huawei">华为</option>
                <option value="Xiaomi">小米</option>
                <option value="Lenovo">联想</option>
              </select>
              <select 
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                value={filters.spuStatus}
                onChange={(e) => setFilters({...filters, spuStatus: e.target.value})}
              >
                <option value="">SPU绑定状态</option>
                <option value="BINDING">绑定中</option>
                <option value="BOUND">已绑定</option>
                <option value="UNBOUND">已解绑</option>
              </select>
            </>
          )}
        </div>
      </div>

      {/* 列表区域 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative">

        {/* 批量操作工具栏 - 始终显示 */}
        <div className={`${selectedIds.length > 0 ? 'bg-blue-50/80 border-blue-100' : 'bg-slate-50/80 border-slate-100'} px-5 py-3 border-b flex items-center justify-between text-sm transition-all duration-300`}>
          <div className="flex items-center gap-2 text-slate-800">
            <CheckSquare size={16} className={selectedIds.length > 0 ? 'text-blue-500' : 'text-slate-400'} />
            <span className={`font-medium ${selectedIds.length > 0 ? 'text-blue-800' : 'text-slate-500'}`}>
              {selectedIds.length > 0 ? `已选择 ${selectedIds.length} 项` : '未选定商品'}
            </span>
          </div>
          <div className="flex items-center gap-2">
             <button disabled={selectedIds.length === 0} onClick={() => { showToastMsg('操作成功：已设置为上架展示'); setSelectedIds([]); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-blue-100 text-slate-700 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale">
               <Eye size={15} /> 上架展示
             </button>
             <button disabled={selectedIds.length === 0} onClick={() => { showToastMsg('操作成功：已设置为上架不展示'); setSelectedIds([]); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-blue-100 text-slate-700 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale">
               <EyeOff size={15} /> 上架不展示
             </button>
             <button disabled={selectedIds.length === 0} onClick={() => { showToastMsg('操作成功：已设置批量下架'); setSelectedIds([]); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-blue-100 text-slate-700 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale">
               <ArrowDownCircle size={15} /> 批量下架
             </button>
             <button onClick={() => setBatchBindSPUModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-blue-100 text-slate-700 font-medium transition-colors">
               <Link size={15} /> 批量绑定SPU
             </button>
             <div className="w-px h-4 bg-slate-200 mx-2" />
             <button disabled={selectedIds.length === 0} onClick={() => { showToastMsg('操作成功：已删除'); setSelectedIds([]); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-red-50 text-red-600 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:grayscale">
               <Trash2 size={15} /> 批量删除
             </button>
          </div>
        </div>

        {/* 数据表 */}
        <ProductTable 
          products={products} 
          loading={loading} 
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onAction={handleAction}
        />
        
        {/* 分页 */}
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={products.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          itemName="条商品记录"
        />
      </div>

      <BatchImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)} 
      />

      <StockManagementModal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        product={activeProduct}
        onConfirm={handleStockConfirm}
      />

      <ProductDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        product={activeProduct}
      />

      <ProductFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        product={activeProduct}
        mode={formMode}
      />

      <BindSPUModal
        isOpen={bindSPUModalOpen}
        onClose={() => setBindSPUModalOpen(false)}
        product={activeProduct}
        onConfirm={(productId, spu) => {
          showToastMsg(`成功绑定SPU: ${spu}`);
          setBindSPUModalOpen(false);
        }}
      />

      <BatchBindSPUModal
        isOpen={batchBindSPUModalOpen}
        onClose={() => setBatchBindSPUModalOpen(false)}
        onConfirm={(count, spuNames) => {
          showToastMsg(`批量绑定SPU成功：已为 ${count} 个商品绑定 SPU (${spuNames})`);
          setBatchBindSPUModalOpen(false);
          setSelectedIds([]);
        }}
      />

      <PriceAdjustmentModal
        isOpen={priceAdjModalOpen}
        onClose={() => setPriceAdjModalOpen(false)}
        product={activeProduct}
        onConfirm={(productId, newExcl, newIncl, taxRate) => {
          showToastMsg(`成功调价，未税: ¥${newExcl}, 含税: ¥${newIncl}`);
          setPriceAdjModalOpen(false);
        }}
      />

      {/* Global Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg border border-slate-700 font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
