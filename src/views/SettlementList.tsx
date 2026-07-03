import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, RotateCcw, FileText, Download, ArrowLeft, MoreHorizontal, Printer, Send, AlertCircle, CheckCircle2, RefreshCw, Upload } from 'lucide-react';
import { useSettlementViewModel } from '../hooks/useSettlementViewModel';
import { SettlementOrder, SettlementStatus, InvoiceStatus } from '../models/settlement';
import { Pagination } from '../components/common/Pagination';
import { SubmitInvoiceModal } from '../components/settlement/SubmitInvoiceModal';
import { ConfirmInvoiceInfoModal } from '../components/settlement/ConfirmInvoiceInfoModal';
import { DeliverInvoiceModal } from '../components/settlement/DeliverInvoiceModal';
import { UploadRedInvoiceModal } from '../components/settlement/UploadRedInvoiceModal';

const INVOICE_STATUS_CONFIG_MAPPING = {
  [SettlementStatus.PENDING]: { label: '待开票', color: 'bg-amber-100 text-amber-700' },
  [SettlementStatus.PROCESSING]: { label: '开票中', color: 'bg-blue-100 text-blue-700' },
  [SettlementStatus.COMPLETED]: { label: '已开票', color: 'bg-emerald-100 text-emerald-700' },
  [SettlementStatus.REJECTED]: { label: '已驳回', color: 'bg-rose-100 text-rose-700' },
};

const SETTLEMENT_STATUS_CONFIG = {
  [SettlementStatus.PENDING]: { label: '待结算', color: 'bg-amber-100 text-amber-700' },
  [SettlementStatus.PROCESSING]: { label: '结算中', color: 'bg-blue-100 text-blue-700' },
  [SettlementStatus.COMPLETED]: { label: '已开票', color: 'bg-emerald-100 text-emerald-700' },
  [SettlementStatus.REJECTED]: { label: '已驳回', color: 'bg-rose-100 text-rose-700' },
};

const INVOICE_DETAIL_STATUS_CONFIG = {
  [InvoiceStatus.NOT_ISSUED]: { label: '未开票', color: 'bg-slate-100 text-slate-600' },
  [InvoiceStatus.ISSUED]: { label: '已开票', color: 'bg-emerald-100 text-emerald-700' },
  [InvoiceStatus.RED_INVOICED]: { label: '已红冲', color: 'bg-red-100 text-red-700' },
  [InvoiceStatus.CANCELLED]: { label: '已作废', color: 'bg-rose-100 text-rose-700' },
  [InvoiceStatus.EXCHANGED]: { label: '已换票', color: 'bg-indigo-100 text-indigo-700' },
};

export default function SettlementList() {
  const { state, actions } = useSettlementViewModel();
  const [viewingDetail, setViewingDetail] = useState<SettlementOrder | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<SettlementOrder[] | null>(null);
  const [showDeliverModal, setShowDeliverModal] = useState<SettlementOrder[] | null>(null);
  const [redInvoiceOrder, setRedInvoiceOrder] = useState<SettlementOrder | null>(null);

  const tabs = [
    { id: SettlementStatus.PENDING, label: '待开票' },
    { id: SettlementStatus.PROCESSING, label: '开票中' },
    { id: SettlementStatus.COMPLETED, label: '已开票' },
    { id: SettlementStatus.REJECTED, label: '已驳回' },
    { id: 'all', label: '全部' },
  ];

  // Check if selection is valid for batch invoicing
  const selectedOrders = state.settlements.filter(s => state.selectedIds.includes(s.id));
  const canBatchInvoice = selectedOrders.length > 0 && 
                         (selectedOrders.every(s => s.status === SettlementStatus.PENDING) || selectedOrders.every(s => s.status === SettlementStatus.PROCESSING)) &&
                         selectedOrders.every(s => s.invoiceTitle === selectedOrders[0].invoiceTitle) &&
                         selectedOrders.every(s => s.taxNo === selectedOrders[0].taxNo);

  const getBatchDeclineReason = () => {
    if (selectedOrders.length === 0) return null;
    if (!selectedOrders.every(s => s.status === SettlementStatus.PENDING)) return "包含已结算或不可结算订单";
    if (!selectedOrders.every(s => s.invoiceTitle === selectedOrders[0].invoiceTitle)) return "勾选订单的发票抬头不一致";
    if (!selectedOrders.every(s => s.taxNo === selectedOrders[0].taxNo)) return "勾选订单的纳税人识别号不一致";
    return null;
  };

  const currentRecord = viewingDetail ? state.settlements.find(s => s.id === viewingDetail.id) || viewingDetail : null;

  if (currentRecord) {
    return (
      <SettlementDetail 
        record={currentRecord} 
        onBack={() => setViewingDetail(null)} 
        onAction={() => {
          if (currentRecord.status === SettlementStatus.PENDING) {
            setShowConfirmModal([currentRecord]);
          } else if (currentRecord.status === SettlementStatus.PROCESSING) {
            setShowDeliverModal([currentRecord]);
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {showConfirmModal && (
        <ConfirmInvoiceInfoModal 
          orders={showConfirmModal}
          onClose={() => setShowConfirmModal(null)}
          onSuccess={() => {
            setShowConfirmModal(null);
            actions.refresh();
          }}
          onConfirm={() => actions.confirmInvoice(showConfirmModal.map(o => o.id))}
          onReject={(reason) => actions.rejectInvoice(showConfirmModal.map(o => o.id), reason)}
        />
      )}

      {showDeliverModal && (
        <DeliverInvoiceModal 
          orders={showDeliverModal}
          onClose={() => setShowDeliverModal(null)}
          onSuccess={() => {
            setShowDeliverModal(null);
            actions.refresh();
          }}
          onSubmit={(data) => actions.deliverInvoice(showDeliverModal.map(o => o.id), data)}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">开票清单</h1>
          <p className="text-sm text-slate-500 mt-1">查看及管理所有订单结算状态及发票清单</p>
        </div>
        <div className="flex items-center gap-3">
          {state.filters.status === SettlementStatus.PENDING && (
            <button 
              disabled={state.selectedIds.length === 0}
              onClick={() => setShowConfirmModal(state.settlements.filter(s => state.selectedIds.includes(s.id)))}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                state.selectedIds.length > 0
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 size={16} />
              批量确认
            </button>
          )}
          {(state.filters.status === SettlementStatus.PROCESSING || state.filters.status === 'all') && (
            <button 
              disabled={!canBatchInvoice}
              onClick={() => setShowDeliverModal(selectedOrders)}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm ${
                canBatchInvoice 
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-100' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
              合并交票
            </button>
          )}
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm shadow-blue-200">
            <Download size={16} />
            导出结算单
          </button>
        </div>
      </div>

      {/* 筛选区 */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-64">
            <input 
              type="text" 
              placeholder="订单编号" 
              value={state.filters.settlementNo}
              onChange={(e) => actions.setFilters({ settlementNo: e.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">申请时间:</span>
            <input 
              type="date" 
              value={state.filters.startDate}
              onChange={(e) => actions.setFilters({ startDate: e.target.value })}
              className="w-36 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            />
            <span className="text-slate-400">至</span>
            <input 
              type="date" 
              value={state.filters.endDate}
              onChange={(e) => actions.setFilters({ endDate: e.target.value })}
              className="w-36 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
          
          <div className="flex items-center gap-2 ml-auto">
            <button 
              onClick={actions.handleReset}
              className="px-4 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white whitespace-nowrap"
            >
              重置
            </button>
            <button 
              onClick={actions.handleSearch}
              className="px-4 py-1.5 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
            >
              <Search size={14} />
              搜索
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col relative">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-2 bg-slate-50/30">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => actions.handleTabChange(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-all relative ${
                state.filters.status === tab.id 
                  ? 'text-blue-600' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {state.filters.status === tab.id && (
                <motion.div 
                  layoutId="settlement-tab-active"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" 
                />
              )}
            </button>
          ))}
        </div>

        {/* 批量操作提示台 */}
        {state.selectedIds.length > 0 && !canBatchInvoice && (
          <div className="bg-rose-50 px-5 py-2.5 border-b border-rose-100 flex items-center justify-between text-xs animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <AlertCircle size={14} />
              <span>无法合并交票：{getBatchDeclineReason()}</span>
            </div>
            <button 
              onClick={() => actions.toggleSelectAll([])}
              className="text-rose-500 hover:text-rose-700 font-medium px-2"
            >
              重设选择
            </button>
          </div>
        )}
        
        {state.selectedIds.length > 0 && canBatchInvoice && (
          <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-100 flex items-center justify-between text-xs animate-in slide-in-from-top-1">
            <div className="flex items-center gap-2 text-emerald-600 font-bold">
              <CheckCircle2 size={14} />
              <span>已选 {state.selectedIds.length} 笔订单，支持合并交票 (抬头：{selectedOrders[0].invoiceTitle})</span>
            </div>
            <button 
              onClick={() => actions.toggleSelectAll([])}
              className="text-slate-500 hover:text-slate-700 font-medium px-2"
            >
              取消选择
            </button>
          </div>
        )}

        {/* 列表 */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 w-12 sticky left-0 bg-slate-50 z-20">
                   <input 
                     type="checkbox" 
                     className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                     checked={state.settlements.length > 0 && state.selectedIds.length === state.settlements.length}
                     onChange={() => actions.toggleSelectAll(state.settlements.map(s => s.id))}
                   />
                </th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">订单编号</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">发票抬头</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">税号</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right">未含税总金额</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right">含税总金额</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">申请时间</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">售后类型</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">结算状态</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500">开票状态</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right whitespace-nowrap min-w-[140px] sticky right-0 bg-slate-50 z-20 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.loading ? (
                <tr>
                  <td colSpan={11} className="py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" />
                      <span>数据加载中...</span>
                    </div>
                  </td>
                </tr>
              ) : state.settlements.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-20 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileText size={48} className="mb-4 opacity-50" />
                      <p className="text-sm font-medium text-slate-600">没有找到匹配的记录</p>
                    </div>
                  </td>
                </tr>
              ) : (
                state.settlements.map((s) => (
                   <tr key={s.id} className={`hover:bg-slate-50/80 transition-colors group bg-white ${state.selectedIds.includes(s.id) ? 'bg-blue-50/30' : ''}`}>
                    <td className="px-6 py-4 sticky left-0 bg-white group-hover:bg-slate-50/80 transition-colors z-10">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                        checked={state.selectedIds.includes(s.id)}
                        onChange={() => actions.toggleSelect(s.id)}
                      />
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-600 whitespace-nowrap">{s.settlementNo}</td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap truncate max-w-[200px]" title={s.invoiceTitle}>{s.invoiceTitle}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">{s.taxNo}</td>
                    <td className="px-6 py-4 text-right text-slate-500 tabular-nums whitespace-nowrap">¥{s.netAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 whitespace-nowrap">¥{s.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{s.settlementTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <AfterSalesTypeBadge type={s.afterSalesType} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge config={SETTLEMENT_STATUS_CONFIG[s.status]} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge config={INVOICE_STATUS_CONFIG_MAPPING[s.status]} />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50/80 transition-colors z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-end gap-3 text-sm">
                        <button 
                          onClick={() => setViewingDetail(s)}
                          className="text-blue-500 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
                        >
                          查看
                        </button>
                        {s.status === SettlementStatus.PENDING && (
                          <button 
                            onClick={() => setShowConfirmModal([s])}
                            className="text-blue-500 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
                          >
                            信息确认
                          </button>
                        )}
                        {s.status === SettlementStatus.PROCESSING && (
                          <button 
                            onClick={() => setShowDeliverModal([s])}
                            className="text-blue-500 hover:text-blue-600 font-medium transition-colors whitespace-nowrap"
                          >
                            交票
                          </button>
                        )}
                        {s.invoiceStatus === InvoiceStatus.EXCHANGED && (
                          <button 
                            onClick={() => setRedInvoiceOrder(s)}
                            className="text-red-500 hover:text-red-600 font-medium transition-colors whitespace-nowrap"
                          >
                            红冲
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页 */}
        <Pagination 
          currentPage={state.page}
          pageSize={state.pageSize}
          totalItems={state.total}
          onPageChange={actions.setPage}
          onPageSizeChange={actions.setPageSize}
          itemName="个清单"
        />
      </div>

      {redInvoiceOrder && (
        <UploadRedInvoiceModal
          order={redInvoiceOrder}
          onClose={() => setRedInvoiceOrder(null)}
          onSuccess={() => {
            setRedInvoiceOrder(null);
            actions.refresh();
          }}
          onSubmit={(data) => actions.uploadRedInvoice(redInvoiceOrder.id, data)}
        />
      )}
    </div>
  );
}

function SettlementDetail({ 
  record, 
  onBack, 
  onAction 
}: { 
  record: SettlementOrder; 
  onBack: () => void; 
  onAction: () => void; 
}) {
  const invoiceDetailConfig = INVOICE_DETAIL_STATUS_CONFIG[record.invoiceStatus];
  const firstOrder = record.orders[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-300 shadow-sm">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium">返回列表</span>
        </button>
        {record.status === SettlementStatus.PENDING && (
          <button 
            onClick={onAction}
            className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-100 hover:bg-amber-600 transition-all font-bold text-sm"
          >
            <CheckCircle2 size={16} />
            信息确认
          </button>
        )}
        {record.status === SettlementStatus.PROCESSING && (
          <button 
            onClick={onAction}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all font-bold text-sm"
          >
            <Send size={16} />
            立即交票
          </button>
        )}
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        {/* 发票信息详情 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MoreHorizontal size={16} className="text-blue-500" />
              发票信息详情
            </h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <DetailField label="发票抬头" value={record.invoiceTitle} span={2} />
            <DetailField label="统一社会信用代码" value={record.taxNo} />
            <DetailField label="发票类型" value={record.invoiceType} />
            <DetailField 
              label="发票状态" 
              value={<StatusBadge config={invoiceDetailConfig} />} 
            />
            <DetailField 
              label="结算状态" 
              value={<StatusBadge config={SETTLEMENT_STATUS_CONFIG[record.status]} />} 
            />

            {record.status === SettlementStatus.REJECTED && record.rejectReason && (
              <div className="md:col-span-2 p-3 bg-rose-50 border border-rose-100 rounded-lg flex gap-2 text-rose-700 text-xs mt-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold mr-2">驳回原因:</span>
                  {record.rejectReason}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 订单基本信息 */}
        {firstOrder && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                订单基本信息
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <DetailField label="订单编号" value={firstOrder.orderNo} />
              <DetailField label="下单时间" value={firstOrder.orderDate} />
              <DetailField label="申请时间" value={firstOrder.settlementTime} />
              <DetailField label="未税总金额" value={`¥${firstOrder.netAmount.toFixed(2)}`} />
              <DetailField label="含税总金额" value={`¥${firstOrder.totalAmount.toFixed(2)}`} highlight />
              {record.afterSalesType && (
                <DetailField label="售后类型" value={<AfterSalesTypeBadge type={record.afterSalesType} />} />
              )}
            </div>
          </div>
        )}

        {/* 订单明细展示 - 只展示第一笔 */}
        {firstOrder && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-blue-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full" />
                <h3 className="text-sm font-bold text-blue-900">订单商品明细</h3>
              </div>
              <span className="text-xs text-slate-500">共 {firstOrder.products.length} 项商品</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead className="bg-white border-b border-slate-50 text-slate-500 whitespace-nowrap">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">商品基本信息</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">品牌</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">分类</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">规格型号</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">单价</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">数量</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider">单位</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-center">税率</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">未含税总额</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">含税总额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {firstOrder.products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-4 min-w-[200px]">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{p.name}</span>
                          <span className="text-[10px] text-slate-400 mt-0.5 font-mono">SKU: {p.sku}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">{p.brand}</td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{p.category}</td>
                      <td className="px-6 py-4 text-slate-500 min-w-[120px]">
                        {p.model} / {p.spec}
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums text-slate-600">¥{p.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-900">{p.quantity}</td>
                      <td className="px-6 py-4 text-slate-500 text-center">{p.unit}</td>
                      <td className="px-6 py-4 text-center text-slate-600 font-medium">
                        {p.taxRate ? `${p.taxRate}%` : '13%'}
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums text-slate-600 font-medium">¥{(p.netAmount || (p.amount * 0.87)).toFixed(2)}</td>
                      <td className="px-6 py-4 text-right tabular-nums font-bold text-blue-600">¥{p.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}



        {/* 发票图片展示 */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Printer size={16} className="text-blue-500" />
              发票图片展示
            </h2>
          </div>
          <div className="p-6">
            {record.invoiceStatus === InvoiceStatus.ISSUED || record.status === SettlementStatus.COMPLETED ? (
              <div className="flex flex-col items-center gap-4">
                <div className="relative group overflow-hidden rounded-xl border border-slate-200">
                  <img 
                    src={`https://api.dicebear.com/7.x/shapes/svg?seed=${record.id}&backgroundColor=f8fafc`} 
                    alt="Invoice" 
                    className="w-full max-w-2xl h-auto grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/0 group-hover:bg-slate-900/20 transition-all">
                    <button className="bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
                      查看原图
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-400">发票信息已上传并归档</p>
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-dashed border-slate-200">
                  <Printer size={32} className="opacity-30" />
                </div>
                <p className="text-sm">暂无发票图片，请先完成交票</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    );
}

function AfterSalesTypeBadge({ type }: { type?: '退货退款' | '换货' | '维修' }) {
  if (!type) {
    return <span className="text-slate-400 font-mono font-medium">-</span>;
  }
  
  const colors = {
    '退货退款': 'bg-rose-50 text-rose-700 border-rose-200',
    '换货': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    '维修': 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${colors[type]}`}>
      {type}
    </span>
  );
}

function DetailField({ label, value, span = 1, copyable = false, highlight = false }: { label: string, value: React.ReactNode, span?: number, copyable?: boolean, highlight?: boolean }) {
  return (
    <div className={`flex flex-col gap-1.5 ${span === 2 ? 'md:col-span-2' : ''}`}>
      <span className="text-xs text-slate-400 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <div className={`text-sm font-medium ${highlight ? 'text-blue-600 text-lg font-bold' : 'text-slate-900 font-mono'}`}>
          {value}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ config }: { config: { label: string, color: string } }) {
  // Convert old color classes to match BrandRecords badge style if possible or simulate it
  // Sample: px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200
  let colorStyle = "";
  if (config.color.includes('amber')) colorStyle = "bg-amber-50 text-amber-700 border-amber-200";
  else if (config.color.includes('emerald')) colorStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
  else if (config.color.includes('blue')) colorStyle = "bg-blue-50 text-blue-700 border-blue-200";
  else if (config.color.includes('rose')) colorStyle = "bg-red-50 text-red-700 border-red-200";
  else colorStyle = "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colorStyle}`}>
      {config.label}
    </span>
  );
}

function StatCard({ title, value, subValue, color }: { title: string, value: string, subValue: string, color: 'blue' | 'amber' | 'emerald' | 'indigo' }) {
  const colors = {
    blue: 'border-blue-100 bg-blue-50/30 text-blue-600',
    amber: 'border-amber-100 bg-amber-50/30 text-amber-600',
    emerald: 'border-emerald-100 bg-emerald-50/30 text-emerald-600',
    indigo: 'border-indigo-100 bg-indigo-50/30 text-indigo-600',
  };

  return (
    <div className={`p-5 rounded-2xl border ${colors[color]} shadow-sm shadow-slate-100/50 flex flex-col gap-1`}>
      <span className="text-xs font-bold uppercase tracking-wider opacity-60">{title}</span>
      <div className="flex items-last-baseline gap-2 mt-1">
        <span className="text-2xl font-bold tracking-tight text-slate-900">{value}</span>
      </div>
      <span className="text-[10px] text-slate-400 mt-1">{subValue}</span>
    </div>
  );
}
