import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, RotateCcw, FileText, Download, ArrowLeft, MoreHorizontal, Printer, Send, AlertCircle, CheckCircle2, RefreshCw, Upload } from 'lucide-react';
import { useSettlementViewModel } from '../hooks/useSettlementViewModel';
import { SettlementOrder, SettlementStatus, InvoiceStatus } from '../models/settlement';
import { Pagination } from '../components/common/Pagination';
import { UploadRedInvoiceModal } from '../components/settlement/UploadRedInvoiceModal';
import { ExchangeInvoiceModal } from '../components/settlement/ExchangeInvoiceModal';

const STATUS_CONFIG = {
  [SettlementStatus.PENDING]: { label: '待开票', color: 'bg-amber-100 text-amber-700' },
  [SettlementStatus.PROCESSING]: { label: '开票中', color: 'bg-blue-100 text-blue-700' },
  [SettlementStatus.COMPLETED]: { label: '已开票', color: 'bg-emerald-100 text-emerald-700' },
  [SettlementStatus.REJECTED]: { label: '已驳回', color: 'bg-rose-100 text-rose-700' },
};

const INVOICE_STATUS_CONFIG = {
  [InvoiceStatus.NOT_ISSUED]: { label: '未开票', color: 'bg-slate-100 text-slate-600' },
  [InvoiceStatus.ISSUED]: { label: '已开票', color: 'bg-emerald-100 text-emerald-700' },
  [InvoiceStatus.RED_INVOICED]: { label: '已红冲', color: 'bg-red-100 text-red-700' },
  [InvoiceStatus.CANCELLED]: { label: '已作废', color: 'bg-rose-100 text-rose-700' },
  [InvoiceStatus.EXCHANGED]: { label: '已换票', color: 'bg-indigo-100 text-indigo-700' },
};

export default function SettlementMgmt() {
  const { state, actions } = useSettlementViewModel({ onlyInvoiced: true });
  const [viewingDetail, setViewingDetail] = useState<SettlementOrder | null>(null);
  const [redInvoiceOrder, setRedInvoiceOrder] = useState<SettlementOrder | null>(null);
  const [exchangeInvoiceOrder, setExchangeInvoiceOrder] = useState<SettlementOrder | null>(null);

  const tabs = [
    { id: 'all', label: '全部' },
    { id: InvoiceStatus.ISSUED, label: '已开票' },
    { id: InvoiceStatus.RED_INVOICED, label: '已红冲' },
    { id: InvoiceStatus.EXCHANGED, label: '已换票' },
  ];

  const currentRecord = viewingDetail ? state.settlements.find(s => s.id === viewingDetail.id) || viewingDetail : null;

  if (currentRecord) {
    return (
      <SettlementDetail 
        record={currentRecord} 
        onBack={() => setViewingDetail(null)} 
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">发票管理</h1>
          <p className="text-sm text-slate-500 mt-1">全局结算状态监控与发票管理</p>
        </div>
        <div className="flex items-center gap-2">
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
              placeholder="结算单编号" 
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

      {/* 列表 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 px-2 bg-slate-50/30">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => actions.handleTabChange(tab.id)}
              className={`px-6 py-4 text-sm font-medium transition-all relative ${
                state.filters.invoiceStatus === tab.id 
                  ? 'text-blue-600 font-bold' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
              {state.filters.invoiceStatus === tab.id && (
                <motion.div 
                  layoutId="settlement-mgmt-tab-active"
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full" 
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead className="bg-slate-50 border-b border-slate-200 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">结算单编号</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">发票抬头</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">发票号</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">税号</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right whitespace-nowrap">未含税总金额</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right whitespace-nowrap">含税总金额</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-center whitespace-nowrap">结算数量</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-center whitespace-nowrap">发票状态</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-center whitespace-nowrap">是否售后</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 whitespace-nowrap">申请时间</th>
                <th className="px-6 py-4 text-sm font-medium text-slate-500 text-right sticky right-0 bg-slate-50 z-20 whitespace-nowrap">操作</th>
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
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors bg-white">
                    <td className="px-6 py-4 font-mono font-medium text-slate-600 whitespace-nowrap">{s.settlementNo}</td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap" title={s.invoiceTitle}>{s.invoiceTitle}</td>
                    <td className="px-6 py-4 font-mono text-slate-500 whitespace-nowrap">{s.invoiceNo || '-'}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">{s.taxNo}</td>
                    <td className="px-6 py-4 text-right text-slate-500 tabular-nums whitespace-nowrap">¥{s.netAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 whitespace-nowrap">¥{s.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-600 whitespace-nowrap">{s.settlementQty}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${INVOICE_STATUS_CONFIG[s.invoiceStatus]?.color || 'bg-slate-100 text-slate-600'}`}>
                        {INVOICE_STATUS_CONFIG[s.invoiceStatus]?.label || '未知状态'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      {s.hasAfterSales ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          有售后
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-medium">无</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{s.settlementTime}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 z-10 transition-colors">
                      <div className="flex justify-end items-center gap-3">
                        <button 
                          onClick={() => setViewingDetail(s)}
                          className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                        >
                          查看
                        </button>
                        {(s.invoiceStatus === InvoiceStatus.ISSUED || s.invoiceStatus === InvoiceStatus.EXCHANGED) && (
                          <button 
                            onClick={() => setExchangeInvoiceOrder(s)}
                            className="text-indigo-500 hover:text-indigo-600 font-medium transition-colors"
                          >
                            换票
                          </button>
                        )}
                        {(s.invoiceStatus === InvoiceStatus.EXCHANGED || (s.invoiceStatus === InvoiceStatus.ISSUED && s.hasAfterSales)) && (
                          <button 
                            onClick={() => setRedInvoiceOrder(s)}
                            className="text-red-500 hover:text-red-600 font-medium transition-colors"
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

      {exchangeInvoiceOrder && (
        <ExchangeInvoiceModal
          order={exchangeInvoiceOrder}
          onClose={() => setExchangeInvoiceOrder(null)}
          onSuccess={() => {
            setExchangeInvoiceOrder(null);
            actions.refresh();
          }}
          onSubmit={(data) => actions.exchangeInvoice(exchangeInvoiceOrder.id, data)}
        />
      )}
    </div>
  );
}

function SettlementDetail({ 
  record, 
  onBack 
}: { 
  record: SettlementOrder; 
  onBack: () => void; 
}) {
  const settlementConfig = STATUS_CONFIG[record.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-slate-300 shadow-sm transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium">返回列表</span>
        </button>
      </div>

      <div className="space-y-6 max-w-6xl mx-auto">
        {/* 核心卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                结算单基本信息
              </h2>
            </div>
            <div className="p-6 grid grid-cols-2 gap-y-6">
              <DetailField label="结算单编号" value={record.settlementNo} />
              <DetailField label="结算单位" value={record.customerName} />
              <DetailField label="未含税总金额" value={`¥${record.netAmount.toFixed(2)}`} />
              <DetailField label="含税总金额" value={`¥${record.totalAmount.toFixed(2)}`} highlight />
              <DetailField label="申请时间" value={record.settlementTime} />
              <DetailField label="发票状态" value={<StatusBadge config={INVOICE_STATUS_CONFIG[record.invoiceStatus]} />} />
              <DetailField 
                label="是否售后" 
                value={
                  record.hasAfterSales ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      有售后 ({record.afterSalesType || '售后'})
                    </span>
                  ) : (
                    <span className="text-slate-400">无</span>
                  )
                } 
              />
              <div className="col-span-2 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">发票图片</span>
                <div className="relative group overflow-hidden rounded-xl border border-slate-100 aspect-[16/9] sm:aspect-[21/9]">
                  {record.invoiceImage ? (
                    <img 
                      src={record.invoiceImage} 
                      alt="发票图片" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-slate-400">
                      <FileText size={32} className="mb-2 opacity-50" />
                      <span className="text-xs">暂无发票图片</span>
                    </div>
                  )}
                  {record.invoiceImage && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-colors">
                        <Search size={20} />
                      </button>
                      <button className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-colors">
                        <Download size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-amber-500" />
                识别结果
              </h2>
            </div>
            <div className="p-4 space-y-3 bg-slate-50/30">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-50 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">发票号码</span>
                  <span className="text-sm font-bold text-slate-700 font-mono italic">{record.invoiceNo || '26112000001672557316'}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-50 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">开票日期</span>
                  <span className="text-sm font-bold text-slate-700 font-mono">{record.settlementTime.split(' ')[0]}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-50 space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">购买方名称</span>
                  <span className="text-sm font-bold text-slate-800">{record.invoiceTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">税号:</span>
                  <span className="text-xs font-mono text-slate-600">{record.taxNo}</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-50 space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">销售方名称</span>
                  <span className="text-sm font-bold text-slate-800">红旗智行科技（北京）有限公司北京分公司</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">税号:</span>
                  <span className="text-xs font-mono text-slate-600">91110302MA01FW664K</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-50 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">合计金额 (不含税)</span>
                  <span className="text-sm font-bold text-slate-700 font-mono">¥{record.netAmount.toFixed(2)}</span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-50 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">税额</span>
                  <span className="text-sm font-bold text-slate-700 font-mono">¥{record.taxAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">价税合计</span>
                <span className="text-xl font-bold text-blue-900 tabular-nums font-mono">¥{record.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>



        {/* 订单展示 */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-slate-800">订单展示</h2>
            <span className="text-sm text-slate-500">共 {record.orders.length} 笔订单</span>
          </div>

          {record.orders.map((order, index) => (
            <div key={order.orderNo} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-blue-50/30 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full" />
                  <h3 className="text-sm font-bold text-blue-900">订单 {index + 1}</h3>
                </div>
                {order.hasAfterSales && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    存在售后：{order.afterSalesType || '售后'}
                  </span>
                )}
              </div>
              <div className="px-6 py-4 border-b border-slate-50 bg-white flex flex-wrap items-center gap-x-8 gap-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">订单编号</span>
                  <span className="text-sm font-mono font-bold text-slate-700">{order.orderNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">下单时间</span>
                  <span className="text-sm text-slate-600">{order.orderDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">申请时间</span>
                  <span className="text-sm text-slate-600">{order.settlementTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">未税总金额</span>
                  <span className="text-sm font-mono text-slate-600">¥{order.netAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">含税总金额</span>
                  <span className="text-sm font-mono font-bold text-blue-600">¥{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-white border-b border-slate-50 text-slate-500 whitespace-nowrap">
                    <tr>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider whitespace-nowrap">商品基本信息</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider whitespace-nowrap">品牌</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider whitespace-nowrap">分类</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider whitespace-nowrap">规格型号</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-right whitespace-nowrap">单价</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-center whitespace-nowrap">数量</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider whitespace-nowrap">单位</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-center whitespace-nowrap">税率</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-right whitespace-nowrap">未含税总额</th>
                      <th className="px-6 py-4 font-bold uppercase tracking-wider text-right whitespace-nowrap">含税总额</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {order.products.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 min-w-[200px]">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{p.name}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 font-mono">SKU: {p.sku}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium whitespace-nowrap">{p.brand}</td>
                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{p.category}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {p.model} / {p.spec}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums text-slate-600">¥{p.price.toFixed(2)}</td>
                        <td className="px-6 py-4 text-center font-bold text-slate-900">{p.quantity}</td>
                        <td className="px-6 py-4 text-slate-500 text-center">{p.unit}</td>
                        <td className="px-6 py-4 text-center text-slate-600 font-medium whitespace-nowrap">
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
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailField({ label, value, span = 1, highlight = false }: { label: string, value: React.ReactNode, span?: number, highlight?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 ${span === 2 ? 'col-span-2' : ''}`}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
      <div className={`font-medium ${highlight ? 'text-lg text-blue-600 font-bold' : 'text-sm text-slate-900 font-mono'}`}>
        {value}
      </div>
    </div>
  );
}

function StatusBadge({ config }: { config: { label: string, color: string } }) {
  let colorStyle = "";
  if (config.color.includes('amber')) colorStyle = "bg-amber-50 text-amber-700 border-amber-200";
  else if (config.color.includes('emerald')) colorStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
  else if (config.color.includes('blue')) colorStyle = "bg-blue-50 text-blue-700 border-blue-200";
  else if (config.color.includes('rose')) colorStyle = "bg-red-50 text-red-700 border-red-200";
  else colorStyle = "bg-slate-50 text-slate-600 border-slate-200";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold border ${colorStyle}`}>
      {config.label}
    </span>
  );
}
