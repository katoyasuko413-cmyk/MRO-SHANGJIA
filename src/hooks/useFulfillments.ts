import { useState, useCallback, useEffect } from 'react';
import { FulfillmentOrder } from '../models/fulfillment';
import { getFulfillments, confirmReceiveCode } from '../services/fulfillmentService';

export function useFulfillments(initialFilters: any = {}) {
  const [orders, setOrders] = useState<FulfillmentOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async (filters: any = initialFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFulfillments(filters);
      setOrders(data);
    } catch (err: any) {
      setError(err.message || '获取物流数据失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReceiveCode = async (id: string, code: string) => {
    try {
      await confirmReceiveCode(id, code);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || '操作失败' };
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    submitReceiveCode,
  };
}
