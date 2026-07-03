import { useState, useEffect, useCallback } from 'react';
import { SettlementOrder, SettlementStatus, InvoiceStatus } from '../models/settlement';
import { getSettlementOrders, submitInvoice, confirmSettlementInvoice, deliverInvoice, rejectSettlementInvoice } from '../services/settlementService';

export function useSettlementViewModel(options?: { onlyInvoiced?: boolean }) {
  const [settlements, setSettlements] = useState<SettlementOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Page state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter state (Draft/Internal)
  const [filters, setFilters] = useState({
    settlementNo: '',
    startDate: '',
    endDate: '',
    status: (options?.onlyInvoiced ? 'all' : SettlementStatus.PENDING) as string,
    invoiceStatus: 'all' as string
  });

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Applied filters (Actually used for data processing)
  const [appliedFilters, setAppliedFilters] = useState({
    settlementNo: '',
    startDate: '',
    endDate: '',
    status: (options?.onlyInvoiced ? 'all' : SettlementStatus.PENDING) as string,
    invoiceStatus: 'all' as string
  });

  const fetchSettlements = useCallback(async () => {
    try {
      setLoading(true);
      let data = await getSettlementOrders();
      if (options?.onlyInvoiced) {
        data = data.filter(s => !!s.invoiceNo);
      }
      setSettlements(data);
      setError(null);
    } catch (err) {
      setError('加载开票清单失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettlements();
  }, [fetchSettlements]);

  const filteredSettlements = settlements.filter(s => {
    const matchesSettlementNo = appliedFilters.settlementNo === '' || s.settlementNo.toLowerCase().includes(appliedFilters.settlementNo.toLowerCase());
    const matchesStatus = appliedFilters.status === 'all' || s.status === appliedFilters.status;
    const matchesInvoiceStatus = appliedFilters.invoiceStatus === 'all' 
      ? true 
      : (appliedFilters.invoiceStatus === InvoiceStatus.ISSUED 
          ? (s.invoiceStatus === InvoiceStatus.ISSUED || s.invoiceStatus === InvoiceStatus.EXCHANGED)
          : s.invoiceStatus === appliedFilters.invoiceStatus);
    
    // Time filter
    let matchesTime = true;
    if (appliedFilters.startDate || appliedFilters.endDate) {
      const settleTime = new Date(s.settlementTime).getTime();
      if (appliedFilters.startDate) {
        const start = new Date(appliedFilters.startDate).getTime();
        if (settleTime < start) matchesTime = false;
      }
      if (appliedFilters.endDate) {
        const end = new Date(appliedFilters.endDate).setHours(23, 59, 59, 999);
        if (settleTime > end) matchesTime = false;
      }
    }
    
    return matchesSettlementNo && matchesStatus && matchesInvoiceStatus && matchesTime;
  });

  const paginatedSettlements = filteredSettlements.slice((page - 1) * pageSize, page * pageSize);

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    setPage(1); // Reset to first page on new search
    setSelectedIds([]); // Clear selection on search
  };

  const handleTabChange = (tabId: string) => {
    const newFilters = options?.onlyInvoiced
      ? { ...filters, invoiceStatus: tabId }
      : { ...filters, status: tabId };
    setFilters(newFilters);
    setAppliedFilters(newFilters);
    setPage(1);
    setSelectedIds([]);
  };

  const handleReset = () => {
    const resetFilters = {
      settlementNo: '',
      startDate: '',
      endDate: '',
      status: (options?.onlyInvoiced ? 'all' : SettlementStatus.PENDING) as string,
      invoiceStatus: 'all' as string
    };
    setFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setPage(1);
    setSelectedIds([]);
  };

  const submitInvoiceAction = async (orderIds: string[], invoiceData: { amount: number, invoiceTitle: string, taxNo: string }) => {
    try {
      await submitInvoice(orderIds, invoiceData);
      await fetchSettlements(); // Refresh data to synchronize
      setSelectedIds([]); // Clear selection after success
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '交票失败' };
    }
  };

  const confirmInvoiceAction = async (orderIds: string[]) => {
    try {
      await confirmSettlementInvoice(orderIds);
      await fetchSettlements();
      setSelectedIds([]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '确认失败' };
    }
  };
  
  const rejectInvoiceAction = async (orderIds: string[], reason: string) => {
    try {
      await rejectSettlementInvoice(orderIds, reason);
      await fetchSettlements();
      setSelectedIds([]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '驳回失败' };
    }
  };

  const deliverInvoiceAction = async (orderIds: string[], data: { invoiceNo: string }) => {
    try {
      await deliverInvoice(orderIds, data);
      await fetchSettlements();
      setSelectedIds([]);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '交票失败' };
    }
  };

  const uploadRedInvoiceAction = async (orderId: string, data: { invoiceNo: string, invoiceImage?: string }) => {
    try {
      const { uploadRedInvoice } = await import('../services/settlementService');
      await uploadRedInvoice(orderId, data);
      await fetchSettlements();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '红冲失败' };
    }
  };

  const exchangeInvoiceAction = async (orderId: string, data: { newInvoiceNo: string, reason: string, newInvoiceImage?: string }) => {
    try {
      const { exchangeInvoice } = await import('../services/settlementService');
      await exchangeInvoice(orderId, data);
      await fetchSettlements();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '换票失败' };
    }
  };

  const uploadExchangeRedInvoiceAction = async (
    orderId: string,
    data: { redTargetInvoiceNo: string; redInvoiceNo: string; redInvoiceImage?: string }
  ) => {
    try {
      const { uploadExchangeRedInvoice } = await import('../services/settlementService');
      await uploadExchangeRedInvoice(orderId, data);
      await fetchSettlements();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '上传换票红票失败' };
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = (ids: string[]) => {
    setSelectedIds(prev => prev.length === ids.length ? [] : ids);
  };

  return {
    state: {
      settlements: paginatedSettlements,
      total: filteredSettlements.length,
      loading,
      error,
      page,
      pageSize,
      filters,
      selectedIds
    },
    actions: {
      setFilters: (newFilters: any) => setFilters(prev => ({ ...prev, ...newFilters })),
      setPage,
      setPageSize,
      handleSearch,
      handleTabChange,
      handleReset,
      refresh: fetchSettlements,
      submitInvoice: submitInvoiceAction,
      confirmInvoice: confirmInvoiceAction,
      rejectInvoice: rejectInvoiceAction,
      deliverInvoice: deliverInvoiceAction,
      uploadRedInvoice: uploadRedInvoiceAction,
      exchangeInvoice: exchangeInvoiceAction,
      uploadExchangeRedInvoice: uploadExchangeRedInvoiceAction,
      toggleSelect,
      toggleSelectAll
    }
  };
}
