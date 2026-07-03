import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, ShieldCheck, Clock, CheckCircle, Headphones } from 'lucide-react';
import { useAfterSales } from '../hooks/useAfterSales';
import { AfterSalesTable } from '../components/aftersales/AfterSalesTable';
import { AfterSalesDetailModal } from '../components/aftersales/AfterSalesDetailModal';
import { ProcessAfterSalesModal } from '../components/aftersales/ProcessAfterSalesModal';
import { LogisticsModal } from '../components/aftersales/LogisticsModal';
import { ConfirmReceiptModal } from '../components/aftersales/ConfirmReceiptModal';
import { ViewAfterSalesLogisticsModal } from '../components/aftersales/ViewAfterSalesLogisticsModal';
import { ConfirmRepairCompletionModal } from '../components/aftersales/ConfirmRepairCompletionModal';
import { Pagination } from '../components/common/Pagination';
import { AfterSalesOrder, AfterSalesStatus, AfterSalesType } from '../models/afterSales';

const TAB_OPTIONS = [
  { label: '全部', value: 'ALL' },
  { label: '待运营端审核', value: AfterSalesStatus.PENDING_AUDIT },
  { label: '待供应商处理', value: AfterSalesStatus.PENDING_SUPPLIER_PROCESS },
  { label: '待客户寄回', value: AfterSalesStatus.PENDING_CLIENT_SEND },
  { label: '处理中', value: AfterSalesStatus.PROCESSING },
  { label: '已完成', value: AfterSalesStatus.COMPLETED },
  { label: '运营端驳回', value: AfterSalesStatus.REJECTED },
];

export default function AfterSalesMgmt() {
  const { state, actions } = useAfterSales();
  
  // Local active states for UI actions
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AfterSalesOrder | null>(null);
  
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [actionOrder, setActionOrder] = useState<AfterSalesOrder | null>(null);

  const [logisticsModalOpen, setLogisticsModalOpen] = useState(false);
  const [logisticsOrder, setLogisticsOrder] = useState<AfterSalesOrder | null>(null);

  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<AfterSalesOrder | null>(null);

  const [viewLogisticsModalOpen, setViewLogisticsModalOpen] = useState(false);
  const [viewLogisticsOrder, setViewLogisticsOrder] = useState<AfterSalesOrder | null>(null);

  const [repairCompletionModalOpen, setRepairCompletionModalOpen] = useState(false);
  const [repairCompletionOrder, setRepairCompletionOrder] = useState<AfterSalesOrder | null>(null);

  // Toast status
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSearchClick = () => {
    actions.handleSearch();
  };

  const handleResetClick = () => {
    actions.handleReset();
  };

  const handleTabChange = (val: string) => {
    actions.handleStatusTabChange(val);
  };

  const handleViewDetails = (order: AfterSalesOrder) => {
    setSelectedOrder(order);
    setDetailModalOpen(true);
  };

  const handleConfirmProcessTrigger = (order: AfterSalesOrder) => {
    setActionOrder(order);
    setConfirmModalOpen(true);
  };

  const handleConfirmProcessAction = async (id: string, data: {
    result: 'agree' | 'reject';
    address?: string;
    deliveryMethod?: 'express' | 'self';
    rejectReason?: string;
  }) => {
    const res = await actions.processOrder(id);
    if (res.success) {
      if (actionOrder?.type === AfterSalesType.REPAIR) {
        showToastMsg(`售后单 ${id} 已同意处理（维修服务直接流转），当前状态更新为：处理中`);
      } else {
        const methodStr = data.deliveryMethod === 'express' ? '自行寄回' : '商家自取';
        const shortAddr = data.address ? data.address.split(' ')[0] : '';
        showToastMsg(`售后单 ${id} 已同意处理（寄回地址：${shortAddr}，方式：${methodStr}），状态已更新为：待客户寄回`);
      }
    } else {
      showToastMsg(`处理失败: ${res.error}`);
    }
    setConfirmModalOpen(false);
    setActionOrder(null);
  };

  const handleFillLogisticsTrigger = (order: AfterSalesOrder) => {
    setLogisticsOrder(order);
    setLogisticsModalOpen(true);
  };

  const handleLogisticsSubmit = async (id: string, expressCompany: string, expressNumber: string) => {
    const order = state.orders.find(o => o.id === id);
    const isRepair = order && (order.type === AfterSalesType.REPAIR || order.type === AfterSalesType.RETURN_REPAIR);
    const isProcessing = order && order.status === AfterSalesStatus.PROCESSING;

    const res = await actions.submitLogistics(id, expressCompany, expressNumber);
    if (res.success) {
      if (isRepair && isProcessing) {
        showToastMsg(`售后单 ${id} 维保寄回物流信息已提交，当前状态更新为：已完成`);
      } else {
        showToastMsg(`售后单 ${id} 物流信息已提交，当前状态变更为：处理中`);
      }
    } else {
      showToastMsg(`提交失败: ${res.error}`);
    }
    setLogisticsModalOpen(false);
    setLogisticsOrder(null);
  };

  const handleCompleteOrderAction = async (order: AfterSalesOrder) => {
    if (order.type === AfterSalesType.REPAIR && order.status === AfterSalesStatus.PROCESSING) {
      setRepairCompletionOrder(order);
      setRepairCompletionModalOpen(true);
      return;
    }

    const res = await actions.completeOrder(order.id);
    if (res.success) {
      showToastMsg(`售后单 ${order.id} 处理已完成`);
    } else {
      showToastMsg(`处理失败: ${res.error}`);
    }
  };

  const handleRepairCompletionSubmit = async (photos: string[]) => {
    if (!repairCompletionOrder) return;
    const res = await actions.completeOrder(repairCompletionOrder.id);
    if (res.success) {
      showToastMsg(`售后单 ${repairCompletionOrder.id} 维修完成`);
    } else {
      showToastMsg(`处理失败: ${res.error}`);
    }
    setRepairCompletionModalOpen(false);
    setRepairCompletionOrder(null);
  };

  const handleConfirmReceiptTrigger = (order: AfterSalesOrder) => {
    setReceiptOrder(order);
    setReceiptModalOpen(true);
  };

  const handleViewLogisticsTrigger = (order: AfterSalesOrder) => {
    setViewLogisticsOrder(order);
    setViewLogisticsModalOpen(true);
  };

  const handleConfirmReceiptSubmit = async () => {
    if (!receiptOrder) return;
    const isRepair = receiptOrder.type === AfterSalesType.REPAIR || receiptOrder.type === AfterSalesType.RETURN_REPAIR;
    const res = isRepair 
      ? await actions.receiveRepair(receiptOrder.id)
      : await actions.completeOrder(receiptOrder.id);
    if (res.success) {
      if (isRepair) {
        showToastMsg(`售后单 ${receiptOrder.id} 确认收货成功，当前状态变更为：处理中`);
      } else {
        showToastMsg(`售后单 ${receiptOrder.id} 确认收货成功，当前状态变更为：已完成`);
      }
    } else {
      showToastMsg(`操作失败: ${res.error}`);
    }
    setReceiptModalOpen(false);
    setReceiptOrder(null);
  };

  const handleApproveAction = async (id: string) => {
    const res = await actions.approveOrder(id);
    if (res.success) {
      showToastMsg(`售后单 ${id} 审核已通过`);
    } else {
      showToastMsg(`操作失败: ${res.error}`);
    }
  };

  const handleRejectAction = async (id: string, reason: string) => {
    const res = await actions.rejectOrder(id, reason);
    if (res.success) {
      showToastMsg(`售后单 ${id} 审核已被拒绝`);
    } else {
      showToastMsg(`操作失败: ${res.error}`);
    }
  };

  const handleConfirmProcessFromDetail = async (id: string) => {
    const targetOrder = state.orders.find(o => o.id === id);
    if (targetOrder) {
      setDetailModalOpen(false);
      handleConfirmProcessTrigger(targetOrder);
    }
  };

  const handleSelectOne = (id: string) => {
    actions.toggleSelect(id);
  };

  const handleSelectAll = (checked: boolean) => {
    const idsOnPage = state.orders.map(o => o.id);
    actions.toggleSelectAll(checked ? idsOnPage : []);
  };

  // Sync back state modifications to selected detail
  const currentDetailOrder = selectedOrder 
    ? state.orders.find(o => o.id === selectedOrder.id) || selectedOrder 
    : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">售后管理</h1>
            <p className="text-sm text-slate-500 mt-1">处理和审核客户提交的商品退换货、维修申请</p>
          </div>
        </div>
      </div>

      {/* Filter and Query Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Query input */}
          <div className="w-full md:flex-1">
            <input 
              type="text" 
              placeholder="搜索售后单号/客户名/商品名称..." 
              value={state.filters.query}
              onChange={(e) => actions.setFilters({ query: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchClick();
              }}
            />
          </div>

          {/* Type Selector */}
          <div className="w-full md:w-56">
            <select
              value={state.filters.type}
              onChange={(e) => actions.setFilters({ type: e.target.value })}
              className="w-full px-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm text-slate-700"
            >
              <option value="">全部售后类型</option>
              <option value={AfterSalesType.RETURN}>退货</option>
              <option value={AfterSalesType.REPAIR}>维修</option>
              <option value={AfterSalesType.EXCHANGE}>换货</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
            <button 
              onClick={handleResetClick}
              className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm flex items-center gap-1.5"
            >
              <RotateCcw size={16} />
              重置
            </button>
            <button 
              onClick={handleSearchClick}
              className="px-5 py-2.5 text-sm font-bold text-white bg-blue-500 border border-transparent rounded-xl hover:bg-blue-600 transition-all shadow-sm shadow-blue-100 flex items-center gap-1.5 h-[41px]"
            >
              <Search size={16} className="text-blue-100" />
              查询
            </button>
          </div>

        </div>
      </div>

      {/* Main Table view and Tabs */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative min-h-[500px]">
        
        {/* Status Horizontal Tabs */}
        <div className="flex border-b border-slate-100 px-2 bg-slate-50/20 overflow-x-auto">
          {TAB_OPTIONS.map(tab => (
            <button
              key={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={`px-6 py-4 text-sm font-medium transition-all relative whitespace-nowrap
                ${state.filters.status === tab.value ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'}
              `}
            >
              {tab.label}
              {state.filters.status === tab.value && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Table Body */}
        <AfterSalesTable 
          orders={state.orders}
          loading={state.loading}
          selectedIds={state.selectedIds}
          onSelect={handleSelectOne}
          onSelectAll={handleSelectAll}
          onViewDetails={handleViewDetails}
          onConfirmProcess={handleConfirmProcessTrigger}
          onFillLogistics={handleFillLogisticsTrigger}
          onCompleteOrder={handleCompleteOrderAction}
          onConfirmReceipt={handleConfirmReceiptTrigger}
          onViewLogistics={handleViewLogisticsTrigger}
        />

        {/* Standard Pagination Controls */}
        <Pagination 
          currentPage={state.page}
          pageSize={state.pageSize}
          totalItems={state.rawOrdersCount}
          onPageChange={actions.setPage}
          onPageSizeChange={(size) => {
            actions.setPageSize(size);
            actions.setPage(1);
          }}
          itemName="个售后服务单"
        />

      </div>

      {/* Modals & Dialog overlays */}
      <AfterSalesDetailModal 
        isOpen={detailModalOpen}
        order={currentDetailOrder}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedOrder(null);
        }}
        onApprove={handleApproveAction}
        onReject={handleRejectAction}
        onConfirmProcess={handleConfirmProcessFromDetail}
      />

      <ProcessAfterSalesModal 
        isOpen={confirmModalOpen}
        order={actionOrder}
        onClose={() => {
          setConfirmModalOpen(false);
          setActionOrder(null);
        }}
        onSubmit={handleConfirmProcessAction}
      />

      <LogisticsModal 
        isOpen={logisticsModalOpen}
        order={logisticsOrder}
        onClose={() => {
          setLogisticsModalOpen(false);
          setLogisticsOrder(null);
        }}
        onSubmit={handleLogisticsSubmit}
      />

      <ConfirmReceiptModal 
        isOpen={receiptModalOpen}
        order={receiptOrder}
        onClose={() => {
          setReceiptModalOpen(false);
          setReceiptOrder(null);
        }}
        onConfirm={handleConfirmReceiptSubmit}
      />

      <ViewAfterSalesLogisticsModal 
        isOpen={viewLogisticsModalOpen}
        order={viewLogisticsOrder}
        onClose={() => {
          setViewLogisticsModalOpen(false);
          setViewLogisticsOrder(null);
        }}
      />

      <ConfirmRepairCompletionModal 
        isOpen={repairCompletionModalOpen}
        order={repairCompletionOrder}
        onClose={() => {
          setRepairCompletionModalOpen(false);
          setRepairCompletionOrder(null);
        }}
        onConfirm={handleRepairCompletionSubmit}
      />

      {/* Standard custom floating toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg border border-slate-700 font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
