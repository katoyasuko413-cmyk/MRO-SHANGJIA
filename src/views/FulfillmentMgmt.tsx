import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, CheckSquare, Settings, Download } from 'lucide-react';
import { useFulfillments } from '../hooks/useFulfillments';
import { FulfillmentTable } from '../components/fulfillment/FulfillmentTable';
import { ReceiveCodeModal } from '../components/fulfillment/ReceiveCodeModal';
import { ViewLogisticsModal } from '../components/fulfillment/ViewLogisticsModal';
import { Pagination } from '../components/common/Pagination';
import { FulfillmentOrder, FulfillmentStatus } from '../models/fulfillment';

const TABS: { label: string; value: string }[] = [
  { label: '全部', value: 'ALL' },
  { label: '待揽收', value: FulfillmentStatus.PENDING_PICKUP },
  { label: '已揽收', value: FulfillmentStatus.PICKED_UP },
  { label: '运输中', value: FulfillmentStatus.IN_TRANSIT },
  { label: '派送中', value: FulfillmentStatus.DELIVERING },
  { label: '已签收', value: FulfillmentStatus.SIGNED },
];

export default function FulfillmentMgmt() {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  
  const [filters, setFilters] = useState({
    trackingNo: '',
    logisticsCompany: '',
    salesOrderNo: '',
    consignee: '',
    startDate: '',
    endDate: ''
  });

  const { orders, loading, fetchOrders, submitReceiveCode } = useFulfillments({ status: activeTab });

  const [isExpanded, setIsExpanded] = useState(false);
  const [receiveCodeModalOpen, setReceiveCodeModalOpen] = useState(false);
  const [viewLogisticsModalOpen, setViewLogisticsModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<FulfillmentOrder | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchOrders({ ...filters, status: activeTab });
    setSelectedIds([]);
  }, [activeTab, fetchOrders]);

  const handleSearch = () => {
    fetchOrders({ ...filters, status: activeTab });
    setSelectedIds([]);
  };

  const handleReset = () => {
    setFilters({
      trackingNo: '',
      logisticsCompany: '',
      salesOrderNo: '',
      consignee: '',
      startDate: '',
      endDate: ''
    });
    fetchOrders({ status: activeTab });
    setSelectedIds([]);
  };

  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAction = (action: string, order: FulfillmentOrder) => {
    if (action === 'PRINT') {
      showToastMsg(`打印指令已发送：物流单号 ${order.trackingNo}`);
    } else if (action === 'RECEIVE_CODE') {
      setActiveOrder(order);
      setReceiveCodeModalOpen(true);
    } else if (action === 'VIEW_LOGISTICS') {
      setActiveOrder(order);
      setViewLogisticsModalOpen(true);
    }
  };

  const handleReceiveCodeSubmit = async (orderId: string, code: string) => {
    const result = await submitReceiveCode(orderId, code);
    if (result.success) {
      showToastMsg(`物流单 ${activeOrder?.trackingNo || orderId} 已确认收货`);
      fetchOrders({ ...filters, status: activeTab }); // refresh
    }
    return result;
  };

  const paginatedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pageIds = paginatedOrders.map(order => order.id);
      const newIds = Array.from(new Set([...selectedIds, ...pageIds]));
      setSelectedIds(newIds);
    } else {
      const pageIds = paginatedOrders.map(order => order.id);
      setSelectedIds(prev => prev.filter(id => !pageIds.includes(id)));
    }
  };

  const handleExport = () => {
    if (selectedIds.length > 0) {
      showToastMsg(`成功导出 ${selectedIds.length} 条已选记录`);
      setSelectedIds([]);
    } else {
      showToastMsg('操作成功：已导出全部记录');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">物流管理</h1>
          <p className="text-sm text-slate-500 mt-1">查看和管理所有物流履约单号与状态</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExport}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Download size={16} />
            {selectedIds.length > 0 ? `导出所选 (${selectedIds.length})` : '导出全部'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
          <input 
            type="text" 
            placeholder="物流单号" 
            value={filters.trackingNo}
            onChange={(e) => setFilters({...filters, trackingNo: e.target.value})}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <select 
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm text-slate-700"
            value={filters.logisticsCompany}
            onChange={(e) => setFilters({...filters, logisticsCompany: e.target.value})}
          >
            <option value="">全部快递公司</option>
            <option value="顺丰速运">顺丰速运</option>
            <option value="京东物流">京东物流</option>
            <option value="中通快递">中通快递</option>
            <option value="圆通速递">圆通速递</option>
            <option value="申通快递">申通快递</option>
            <option value="自配送">自配送</option>
          </select>
          <input 
            type="text" 
            placeholder="销售订单号" 
            value={filters.salesOrderNo}
            onChange={(e) => setFilters({...filters, salesOrderNo: e.target.value})}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />

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
              onClick={handleSearch}
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
                placeholder="收货人" 
                value={filters.consignee}
                onChange={(e) => setFilters({...filters, consignee: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
              />
              <div className="flex w-full items-center gap-2">
                <input 
                  type="date" 
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm text-slate-700"
                />
                <span className="text-slate-400 text-sm">至</span>
                <input 
                  type="date" 
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm text-slate-700"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative min-h-[600px]">
        <div className="flex border-b border-slate-100 px-2 bg-slate-50/30 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setCurrentPage(1);
                setSelectedIds([]);
              }}
              className={`px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap
                ${activeTab === tab.value ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}
              `}
            >
              {tab.label}
              {activeTab === tab.value && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        <FulfillmentTable 
          orders={paginatedOrders} 
          loading={loading}
          selectedIds={selectedIds}
          onSelect={handleSelect}
          onSelectAll={handleSelectAll}
          onAction={handleAction}
        />
        
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={orders.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          itemName="条物流记录"
        />
      </div>

      <ReceiveCodeModal
        isOpen={receiveCodeModalOpen}
        order={activeOrder}
        onClose={() => setReceiveCodeModalOpen(false)}
        onSubmit={handleReceiveCodeSubmit}
      />

      <ViewLogisticsModal
        isOpen={viewLogisticsModalOpen}
        order={activeOrder}
        onClose={() => setViewLogisticsModalOpen(false)}
      />

      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg border border-slate-700 font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
