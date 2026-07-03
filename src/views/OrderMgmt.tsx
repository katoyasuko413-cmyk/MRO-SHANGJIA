import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, Download, CheckSquare } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { OrderTable } from '../components/order/OrderTable';
import { OrderDetailModal } from '../components/order/OrderDetailModal';
import { RejectOrderModal } from '../components/order/RejectOrderModal';
import { ShipOrderModal } from '../components/order/ShipOrderModal';
import { ViewOrderLogisticsModal } from '../components/order/ViewOrderLogisticsModal';
import { DeliveryNoteModal } from '../components/order/DeliveryNoteModal';
import { ViewSignOffModal, UploadSignOffModal } from '../components/order/SignOffModal';
import { OrderContractModal } from '../components/order/OrderContractModal';
import { Pagination } from '../components/common/Pagination';
import { Order, OrderStatus } from '../models/order';
import { orderService } from '../services/orderService';

const TABS: { label: string; value: OrderStatus }[] = [
  { label: '全部', value: 'ALL' },
  { label: '待接单', value: 'PENDING_ACCEPT' },
  { label: '待发货', value: 'PENDING_SHIP' },
  { label: '部分发货', value: 'PARTIAL_SHIPPED' },
  { label: '待收货', value: 'PENDING_RECEIPT' },
  { label: '已收货', value: 'RECEIVED' },
  { label: '已完成', value: 'COMPLETED' },
  { label: '已取消', value: 'CANCELLED' },
  { label: '已退款', value: 'REFUNDED' },
];

export default function OrderMgmt() {
  const [activeTab, setActiveTab] = useState<OrderStatus>('PENDING_ACCEPT');
  
  const [filters, setFilters] = useState({
    salesOrderNo: '',
    purchaser: '',
    recipient: '',
    contact: '',
    settlementStatus: '',
    orderTimeStart: '',
    orderTimeEnd: ''
  });

  const { orders, loading, fetchOrders } = useOrders({ status: activeTab });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [shipModalOpen, setShipModalOpen] = useState(false);
  const [logisticsModalOpen, setLogisticsModalOpen] = useState(false);
  const [deliveryNoteModalOpen, setDeliveryNoteModalOpen] = useState(false);
  const [viewSignOffModalOpen, setViewSignOffModalOpen] = useState(false);
  const [uploadSignOffModalOpen, setUploadSignOffModalOpen] = useState(false);
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Whenever tab or filters or page changes, we can fetch
    fetchOrders({ ...filters, status: activeTab });
  }, [activeTab, fetchOrders]);

  const handleSearch = () => {
    fetchOrders({ ...filters, status: activeTab });
  };

  const handleReset = () => {
    setFilters({
      salesOrderNo: '',
      purchaser: '',
      recipient: '',
      contact: '',
      settlementStatus: '',
      orderTimeStart: '',
      orderTimeEnd: ''
    });
    fetchOrders({ status: activeTab });
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds(prev => 
      checked ? [...prev, id] : prev.filter(item => item !== id)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? orders.map(o => o.id) : []);
  };

  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAction = (action: string, order: Order) => {
    if (action === 'DETAIL') {
      setActiveOrder(order);
      setDetailModalOpen(true);
    } else if (action === 'ACCEPT') {
      showToastMsg(`订单 ${order.salesOrderNo} 已接单`);
      fetchOrders({ ...filters, status: activeTab }); // refresh
    } else if (action === 'REJECT') {
      setActiveOrder(order);
      setRejectModalOpen(true);
    } else if (action === 'SHIP') {
      setActiveOrder(order);
      setShipModalOpen(true);
    } else if (action === 'VIEW_LOGISTICS') {
      setActiveOrder(order);
      setLogisticsModalOpen(true);
    } else if (action === 'DELIVERY_NOTE') {
      setActiveOrder(order);
      setDeliveryNoteModalOpen(true);
    } else if (action === 'VIEW_SIGN_OFF') {
      setActiveOrder(order);
      setViewSignOffModalOpen(true);
    } else if (action === 'UPLOAD_SIGN_OFF') {
      setActiveOrder(order);
      setUploadSignOffModalOpen(true);
    } else if (action === 'DOWNLOAD_CONTRACT') {
      setActiveOrder(order);
      setContractModalOpen(true);
    }
  };

  const handleSignOffSubmit = async (orderId: string, signOffData: { signOffSheetUrl: string; signBy: string; signOffTime: string }) => {
    try {
      await orderService.uploadSignOff(orderId, signOffData);
      showToastMsg(`订单 ${activeOrder?.salesOrderNo || orderId} 签收单上传成功！`);
      setUploadSignOffModalOpen(false);
      // If we are currently view sign-off modal and trigger re-upload, we close the view modal or keep it fresh
      setViewSignOffModalOpen(false);
      fetchOrders({ ...filters, status: activeTab }); // refresh
    } catch (err) {
      console.error(err);
      showToastMsg('操作失败，请重试');
    }
  };

  const handleRejectSubmit = (orderId: string, reason: string) => {
    showToastMsg(`订单已拒单，理由：${reason}`);
    setRejectModalOpen(false);
    fetchOrders({ ...filters, status: activeTab }); // refresh
  };

  const handleShipSubmit = (orderId: string, logisticsCompany: string, trackingNumber: string, shippedItems: any[], deliverer?: string, contactPhone?: string) => {
    showToastMsg(`订单 ${activeOrder?.salesOrderNo || orderId} 已发货`);
    setShipModalOpen(false);
    fetchOrders({ ...filters, status: activeTab }); // refresh
  };

  // Mock pagination (since we do frontend mock slicing)
  const paginatedOrders = orders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">订单管理</h1>
          <p className="text-sm text-slate-500 mt-1">查看及管理所有销售订单信息</p>
        </div>
      </div>

      {/* 筛选区域 - 独立卡片 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
          <input 
            type="text" 
            placeholder="销售订单号" 
            value={filters.salesOrderNo}
            onChange={(e) => setFilters({...filters, salesOrderNo: e.target.value})}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <input 
            type="text" 
            placeholder="采购方" 
            value={filters.purchaser}
            onChange={(e) => setFilters({...filters, purchaser: e.target.value})}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <input 
            type="text" 
            placeholder="收货人" 
            value={filters.recipient}
            onChange={(e) => setFilters({...filters, recipient: e.target.value})}
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
                placeholder="联系方式" 
                value={filters.contact}
                onChange={(e) => setFilters({...filters, contact: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
              />
              <select 
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm text-slate-700"
                value={filters.settlementStatus}
                onChange={(e) => setFilters({...filters, settlementStatus: e.target.value})}
              >
                <option value="">结算状态</option>
                {/* 只有已收货状态才能有已结算，但为了筛选方便这里都展示，或者根据业务逻辑动态展示 */}
                {(activeTab === 'ALL' || activeTab === 'RECEIVED' || activeTab === 'COMPLETED') && (
                  <option value="SETTLED">已结算</option>
                )}
                <option value="UNSETTLED">未结算</option>
              </select>
              <div className="flex w-full items-center gap-2">
                <input 
                  type="date" 
                  value={filters.orderTimeStart}
                  onChange={(e) => setFilters({...filters, orderTimeStart: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm text-slate-700"
                />
                <span className="text-slate-400 text-sm">至</span>
                <input 
                  type="date" 
                  value={filters.orderTimeEnd}
                  onChange={(e) => setFilters({...filters, orderTimeEnd: e.target.value})}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm text-slate-700"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* 列表区域 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative min-h-[600px]">

        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-2 bg-slate-50/30 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setSelectedIds([]);
                setCurrentPage(1);
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

        {/* 批量操作工具栏 - 始终显示 */}
        <div className={`${selectedIds.length > 0 ? 'bg-blue-50/80 border-blue-100' : 'bg-slate-50/80 border-slate-100'} px-5 py-3 border-b flex items-center justify-between text-sm transition-all duration-300`}>
          <div className="flex items-center gap-2 text-slate-800">
            <CheckSquare size={16} className={selectedIds.length > 0 ? 'text-blue-500' : 'text-slate-400'} />
            <span className={`font-medium ${selectedIds.length > 0 ? 'text-blue-800' : 'text-slate-500'}`}>
              {selectedIds.length > 0 ? `已选择 ${selectedIds.length} 项` : '未选定订单'}
            </span>
          </div>
          <div className={`flex items-center gap-2 ${selectedIds.length === 0 ? 'opacity-60 grayscale' : ''}`}>
             <button disabled={selectedIds.length === 0} onClick={() => { showToastMsg('已为您加入导出队列'); setSelectedIds([]); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-blue-100 text-slate-700 font-medium transition-colors disabled:cursor-not-allowed">
               <Download size={15} /> 批量导出
             </button>
             {activeTab === 'PENDING_ACCEPT' && (
               <>
                 <div className="w-px h-4 bg-slate-200 mx-2" />
                 <button disabled={selectedIds.length === 0} onClick={() => { showToastMsg('操作成功：批量接单'); setSelectedIds([]); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-blue-100 text-blue-600 font-medium transition-colors disabled:cursor-not-allowed">
                   批量接单
                 </button>
               </>
             )}
          </div>
        </div>

        {/* 数据表 */}
        <OrderTable 
          orders={paginatedOrders} 
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
          totalItems={orders.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
          itemName="条订单记录"
        />
      </div>

      <OrderDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        order={activeOrder}
      />

      <RejectOrderModal
        isOpen={rejectModalOpen}
        order={activeOrder}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
      />

      <ShipOrderModal
        isOpen={shipModalOpen}
        order={activeOrder}
        onClose={() => setShipModalOpen(false)}
        onSubmit={handleShipSubmit}
      />

      <ViewOrderLogisticsModal
        isOpen={logisticsModalOpen}
        order={activeOrder}
        onClose={() => setLogisticsModalOpen(false)}
      />

      <DeliveryNoteModal
        isOpen={deliveryNoteModalOpen}
        onClose={() => setDeliveryNoteModalOpen(false)}
        order={activeOrder}
      />

      <ViewSignOffModal
        isOpen={viewSignOffModalOpen}
        onClose={() => setViewSignOffModalOpen(false)}
        order={activeOrder}
        onUploadClick={() => setUploadSignOffModalOpen(true)}
      />

      <UploadSignOffModal
        isOpen={uploadSignOffModalOpen}
        onClose={() => setUploadSignOffModalOpen(false)}
        order={activeOrder}
        onSubmit={handleSignOffSubmit}
      />

      <OrderContractModal
        isOpen={contractModalOpen}
        onClose={() => setContractModalOpen(false)}
        order={activeOrder}
        onConfirmSigning={(orderId, type) => {
          if (type === 'online') {
            showToastMsg(`订单 ${activeOrder?.salesOrderNo || orderId} 契约锁线上盖章确认成功！`);
          } else {
            showToastMsg(`订单 ${activeOrder?.salesOrderNo || orderId} 线下盖章件回传并生效！`);
          }
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
