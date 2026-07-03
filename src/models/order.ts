export type OrderStatus = 'ALL' | 'PENDING_ACCEPT' | 'PENDING_SHIP' | 'PARTIAL_SHIPPED' | 'PENDING_RECEIPT' | 'RECEIVED' | 'COMPLETED' | 'CLOSED' | 'REJECTED' | 'CANCELLED' | 'REFUNDED';
export type SettlementStatus = 'SETTLED' | 'UNSETTLED';

export interface OrderItem {
  id: string;
  sku: string;
  name: string;
  brand: string;
  specification: string;
  model: string;
  quantity: number;
  shippedQuantity?: number;
  priceExclTax: number;
  priceInclTax: number;
  amountExclTax: number;
  amountInclTax: number;
  requirementDesc?: string;
}

export interface Order {
  id: string;
  salesOrderNo: string;
  purchaserName: string;
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  salesAmount: number;
  settlementStatus: SettlementStatus;
  orderTime: string;
  status: OrderStatus;
  deliveryMethod?: string;
  paymentAmount?: number;
  items: OrderItem[];
  totalAmountExclTax: number;
  totalAmountInclTax: number;
  signOffSheetUrl?: string;
  signOffTime?: string;
  signBy?: string;
  invoiceStatus?: 'INVOICED' | 'UNINVOICED';
}
