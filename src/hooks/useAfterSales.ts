import { useState, useEffect, useCallback } from 'react';
import { AfterSalesOrder, AfterSalesStatus, AfterSalesType } from '../models/afterSales';
import { getAfterSalesOrders, approveAfterSales, rejectAfterSales, processAfterSales, submitLogisticsAfterSales, completeAfterSales, receiveRepairAfterSales } from '../services/afterSalesService';

export function useAfterSales() {
  const [orders, setOrders] = useState<AfterSalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fitlers states
  const [filters, setFilters] = useState({
    status: 'ALL', // ALL | PENDING_AUDIT | PENDING_CLIENT_SEND | PENDING_SUPPLIER_PROCESS | COMPLETED | REJECTED
    query: '',
    type: ''
  });

  // Selected for search
  const [appliedFilters, setAppliedFilters] = useState({
    status: 'ALL',
    query: '',
    type: ''
  });

  // Selected row ids for batch processing
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    pendingProcess: 0,
    completed: 0
  });

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      // Wait, we query all orders first to calculate statistics
      const allData = await getAfterSalesOrders();
      
      // Calculate Stats
      const totalCount = allData.length;
      const pendingCount = allData.filter(item => item.status === AfterSalesStatus.PENDING_SUPPLIER_PROCESS).length;
      const completedCount = allData.filter(item => item.status === AfterSalesStatus.COMPLETED).length;

      setStats({
        total: totalCount,
        pendingProcess: pendingCount,
        completed: completedCount
      });

      // Filter local list according to appliedFilters
      let filtered = [...allData];
      if (appliedFilters.status !== 'ALL') {
        filtered = filtered.filter(item => item.status === appliedFilters.status);
      }
      if (appliedFilters.query) {
        const q = appliedFilters.query.toLowerCase();
        filtered = filtered.filter(item => 
          item.id.toLowerCase().includes(q) || 
          item.customerName.toLowerCase().includes(q) || 
          item.productName.toLowerCase().includes(q)
        );
      }
      if (appliedFilters.type) {
        if (appliedFilters.type === AfterSalesType.REPAIR) {
          filtered = filtered.filter(item => item.type === AfterSalesType.REPAIR || item.type === AfterSalesType.RETURN_REPAIR);
        } else {
          filtered = filtered.filter(item => item.type === appliedFilters.type);
        }
      }

      setOrders(filtered);
      setError(null);
    } catch (err: any) {
      setError(err.message || '获取售后订单失败');
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = () => {
    setAppliedFilters({ ...filters });
    setPage(1);
    setSelectedIds([]);
  };

  const handleReset = () => {
    const initialFilters = {
      status: 'ALL',
      query: '',
      type: ''
    };
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setPage(1);
    setSelectedIds([]);
  };

  const handleStatusTabChange = (status: string) => {
    const nextFilters = { ...filters, status };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setPage(1);
    setSelectedIds([]);
  };

  const approveOrderAction = async (id: string) => {
    try {
      setLoading(true);
      await approveAfterSales(id);
      await fetchOrders();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '审核失败' };
    } finally {
      setLoading(false);
    }
  };

  const rejectOrderAction = async (id: string, reason: string) => {
    try {
      setLoading(true);
      await rejectAfterSales(id, reason);
      await fetchOrders();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '驳回失败' };
    } finally {
      setLoading(false);
    }
  };

  const processOrderAction = async (id: string) => {
    try {
      setLoading(true);
      await processAfterSales(id);
      await fetchOrders();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '处理失败' };
    } finally {
      setLoading(false);
    }
  };

  const submitLogisticsAction = async (id: string, expressCompany: string, expressNumber: string) => {
    try {
      setLoading(true);
      await submitLogisticsAfterSales(id, expressCompany, expressNumber);
      await fetchOrders();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '提交物流失败' };
    } finally {
      setLoading(false);
    }
  };

  const completeOrderAction = async (id: string) => {
    try {
      setLoading(true);
      await completeAfterSales(id);
      await fetchOrders();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '完成售后订单失败' };
    } finally {
      setLoading(false);
    }
  };

  const receiveRepairAction = async (id: string) => {
    try {
      setLoading(true);
      await receiveRepairAfterSales(id);
      await fetchOrders();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '确认收货失败' };
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = (ids: string[]) => {
    setSelectedIds(prev => prev.length === ids.length ? [] : ids);
  };

  const paginatedOrders = orders.slice((page - 1) * pageSize, page * pageSize);

  return {
    state: {
      orders: paginatedOrders,
      rawOrdersCount: orders.length,
      loading,
      error,
      page,
      pageSize,
      filters,
      selectedIds,
      stats
    },
    actions: {
      setFilters: (newFilters: any) => setFilters(prev => ({ ...prev, ...newFilters })),
      setPage,
      setPageSize,
      handleSearch,
      handleReset,
      handleStatusTabChange,
      approveOrder: approveOrderAction,
      rejectOrder: rejectOrderAction,
      processOrder: processOrderAction,
      submitLogistics: submitLogisticsAction,
      completeOrder: completeOrderAction,
      receiveRepair: receiveRepairAction,
      toggleSelect,
      toggleSelectAll,
      refresh: fetchOrders
    }
  };
}
