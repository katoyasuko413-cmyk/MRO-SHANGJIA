export enum SettlementStatus {
  PENDING = 'PENDING',    // 待结算
  PROCESSING = 'PROCESSING', // 结算中
  COMPLETED = 'COMPLETED',  // 已结算
  REJECTED = 'REJECTED'    // 已拒绝
}

export enum InvoiceStatus {
  NOT_ISSUED = 'NOT_ISSUED', // 未开票
  ISSUED = 'ISSUED',         // 已开票
  RED_INVOICED = 'RED_INVOICED', // 已红冲
  CANCELLED = 'CANCELLED',    // 已作废
  EXCHANGED = 'EXCHANGED'    // 已换票
}

export interface SettlementProduct {
  id: string;
  name: string;
  sku: string;
  brand?: string;
  category?: string;
  unit?: string;
  model?: string;
  spec: string;
  price: number;
  quantity: number;
  amount: number;
  taxRate: number;
  taxAmount: number;
  netAmount: number; // 未含税总额
}

export interface SettlementOrderInfo {
  orderNo: string;
  orderDate: string;
  settlementTime: string;
  netAmount: number;
  totalAmount: number;
  products: SettlementProduct[];
  hasAfterSales?: boolean;
  afterSalesType?: '退货退款' | '换货' | '维修';
}

export interface SettlementOrder {
  id: string;
  settlementNo: string;
  customerName: string;
  totalAmount: number;
  taxAmount: number;
  netAmount: number;
  status: SettlementStatus;
  settlementTime: string; // 结算时间
  
  // Invoice Details
  invoiceTitle: string;     // 发票抬头
  taxNo: string;            // 税号
  invoiceType: string;      // 发票类型
  bankName: string;         // 开户银行
  bankAccount: string;      // 开户行账号
  bankAddress: string;      // 开户行地址
  invoiceStatus: InvoiceStatus; // 发票状态
  invoiceNo?: string;       // 发票号
  invoiceImage?: string;    // 发票图片
  settlementQty: number;    // 结算数量
  hasAfterSales?: boolean;  // 是否有售后

  orders: SettlementOrderInfo[];
  remark?: string;
  rejectReason?: string;
  afterSalesType?: '退货退款' | '换货' | '维修';
  exchangeDetail?: InvoiceExchangeDetail;
}

export interface InvoiceExchangeDetail {
  originalInvoiceNo: string;
  newInvoiceNo: string;
  reason: string;
  exchangeTime: string;
  newInvoiceImage?: string;
  redTargetInvoiceNo?: string;
  redInvoiceNo?: string;
  redInvoiceImage?: string;
  redInvoiceTime?: string;
}

export interface InvoiceRecognitionResult {
  invoiceNo: string;
  invoiceDate: string;
  buyerName: string;
  buyerTaxNo: string;
  sellerName: string;
  sellerTaxNo: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
}

export interface SettlementSummary {
  totalOrders: number;
  totalAmount: number;
  pendingAmount: number;
  completedAmount: number;
}
