export type AuditStatus = 'DRAFT' | 'PENDING_AUDIT' | 'AUDIT_REJECTED' | 'PENDING_APPROVAL' | 'APPROVAL_REJECTED' | 'APPROVED';
export type SalesStatus = 'ON_SALE' | 'OFF_SALE' | 'PUBLISHED'; // Added PUBLISHED if needed, but the user implies product status
export type SPUStatus = 'BINDING' | 'BOUND' | 'UNBOUND';

export interface Product {
  id: string;
  sku: string;
  spu: string;
  spuStatus?: SPUStatus;
  supplierSku: string;
  name: string;
  contractName: string;
  brand: string;
  specification: string;
  model: string;
  mainCategory: string;
  scene?: string;
  purchasePriceExclTax: number;
  purchasePriceInclTax: number;
  taxRate: number;
  taxCode: string;
  leadTimeDays: number;
  moq: number;
  
  price: number;
  stock: number;
  salesStatus: SalesStatus;
  auditStatus: AuditStatus;
  displayStatus: 'DISPLAY' | 'HIDDEN';
  enjoyedAreas?: string[];
  salesAreas?: string[];
  rejectReason?: string;
  updatedAt: string;
  image: string;
  images?: string[];
  detailImages?: string[];
}
