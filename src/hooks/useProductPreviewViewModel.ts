import { useState, useCallback } from 'react';
import { Product } from '../models/product';
import { productService } from '../services/productService';

export interface ProductPreviewState {
  product: Product | null;
  loading: boolean;
  quantity: number;
  activeThumbnailIndex: number;
  copiedField: string | null;
  similarProducts: Product[];
  toastMessage: string | null;
  activeTab: 'intro' | 'parameters' | 'others';
}

export interface ProductPreviewActions {
  loadProduct: (id: string | null) => Promise<void>;
  setQuantity: (qty: number) => void;
  setActiveThumbnailIndex: (idx: number) => void;
  copyToClipboard: (text: string, fieldName: string) => void;
  setToastMessage: (msg: string | null) => void;
  setActiveTab: (tab: 'intro' | 'parameters' | 'others') => void;
}

export function useProductPreviewViewModel() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState<number>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'intro' | 'parameters' | 'others'>('intro');

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2000);
  }, []);

  const loadProduct = useCallback(async (id: string | null) => {
    setLoading(true);
    try {
      // If no ID is provided, use the first product as default (P10001)
      const targetId = id || 'P10001';
      const fetchedProduct = await productService.getProductById(targetId);
      
      if (fetchedProduct) {
        setProduct(fetchedProduct);
        setQuantity(fetchedProduct.moq || 1);
        setActiveThumbnailIndex(0);
        
        // Load all products to find similar ones in the same category
        const allProducts = await productService.getProducts();
        const filtered = allProducts.filter(p => p.id !== fetchedProduct.id);
        // Fallback: if no other products, just show some products as similar
        setSimilarProducts(filtered.slice(0, 3));
      } else {
        setProduct(null);
        showToast('未找到该商品');
      }
    } catch (err) {
      console.error('Failed to load product preview', err);
      showToast('加载失败');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const copyToClipboard = useCallback((text: string, fieldName: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      showToast(`已复制${fieldName}`);
      setTimeout(() => {
        setCopiedField(null);
      }, 1500);
    } catch (err) {
      // Fallback for environments where clipboard API isn't fully supported
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedField(fieldName);
      showToast(`已复制${fieldName}`);
      setTimeout(() => {
        setCopiedField(null);
      }, 1500);
    }
  }, [showToast]);

  const updateQuantity = useCallback((qty: number) => {
    if (!product) return;
    const min = product.moq || 1;
    if (qty < min) {
      showToast(`起订量不能低于 ${min} 件`);
      setQuantity(min);
    } else {
      setQuantity(qty);
    }
  }, [product, showToast]);

  return {
    state: {
      product,
      loading,
      quantity,
      activeThumbnailIndex,
      copiedField,
      similarProducts,
      toastMessage,
      activeTab,
    } as ProductPreviewState,
    actions: {
      loadProduct,
      setQuantity: updateQuantity,
      setActiveThumbnailIndex,
      copyToClipboard,
      setToastMessage,
      setActiveTab,
    } as ProductPreviewActions
  };
}
