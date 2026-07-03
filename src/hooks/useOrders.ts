import { useState, useEffect, useCallback } from 'react';
import { Order } from '../models/order';
import { orderService } from '../services/orderService';

export function useOrders(initialFilters = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  
  const fetchOrders = useCallback(async (filters: any) => {
    setLoading(true);
    try {
      const data = await orderService.getOrders(filters);
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(initialFilters);
  }, [fetchOrders]); // Re-fetch only when explicitly requested or initially

  return { orders, loading, fetchOrders };
}
