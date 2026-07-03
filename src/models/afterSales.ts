export enum AfterSalesType {
  RETURN = 'RETURN', // 退货
  REPAIR = 'REPAIR', // 上门维修
  EXCHANGE = 'EXCHANGE', // 换货
  RETURN_REPAIR = 'RETURN_REPAIR', // 寄回维修
}

export enum AfterSalesStatus {
  PENDING_AUDIT = 'PENDING_AUDIT', // 待运营端审核
  PENDING_CLIENT_SEND = 'PENDING_CLIENT_SEND', // 待客户寄回
  PENDING_SUPPLIER_PROCESS = 'PENDING_SUPPLIER_PROCESS', // 待供应商处理
  PROCESSING = 'PROCESSING', // 处理中
  COMPLETED = 'COMPLETED', // 已完成
  REJECTED = 'REJECTED', // 运营端驳回
}

export interface AfterSalesItem {
  id: string; // SKU or Item ID
  sku: string;
  name: string;
  model?: string;
  brand?: string;
  unit?: string;
  quantity: number;
}

export interface AfterSalesOrder {
  id: string; // 售后单号 (e.g. AS20241101)
  salesOrderNo: string; // 关联订单
  customerName: string; // 客户
  productName: string; // 商品 (for quick displays, e.g. "工业轴承 6204")
  type: AfterSalesType; // 类型
  reason: string; // 申请原因 (申请原因 -> 售后原因)
  totalAmountExclTax: number; // 未税金额
  totalAmountInclTax: number; // 含税金额
  status: AfterSalesStatus; // 状态
  applyTime: string; // 申请时间 (e.g. "2024-05-20 14:30:00")
  orderTime?: string; // 下单时间
  paymentType?: string; // 付款类型
  approvedTime?: string; // 运营端审核通过时间
  completeTime?: string; // 客户完成时间
  items?: AfterSalesItem[];
  // fields for details display
  phone?: string;
  description?: string;
  expressCompany?: string;
  expressNumber?: string;
  rejectReason?: string;
}

export interface AfterSalesAddress {
  id: string;
  contactName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detailAddress: string;
  warehouseName: string;
  isDefault: boolean;
}

