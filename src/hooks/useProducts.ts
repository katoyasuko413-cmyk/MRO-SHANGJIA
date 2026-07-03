import { useState, useEffect, useCallback } from 'react';
import { Product } from '../models/product';
import { productService } from '../services/productService';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [auditFilter, setAuditFilter] = useState<string>('ALL');
  const [salesFilter, setSalesFilter] = useState<string>('ALL');
  const [spuStatusFilter, setSpuStatusFilter] = useState<string>('ALL');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getProducts({
        search: searchTerm,
        auditStatus: auditFilter,
        salesStatus: salesFilter,
        spuStatus: spuStatusFilter
      });
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, auditFilter, salesFilter, spuStatusFilter]);

  // Debounced fetch on searchTerm change could be added here, 
  // but we keep it simple since it's just mock logic.
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    searchTerm,
    setSearchTerm,
    auditFilter,
    setAuditFilter,
    salesFilter,
    setSalesFilter,
    spuStatusFilter,
    setSpuStatusFilter,
    refresh: fetchProducts
  };
}
