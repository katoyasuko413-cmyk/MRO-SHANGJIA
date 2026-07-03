export enum FulfillmentStatus {
  PENDING_PICKUP = 'PENDING_PICKUP',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERING = 'DELIVERING',
  SIGNED = 'SIGNED',
  EXCEPTION = 'EXCEPTION',
}

export interface FulfillmentOrder {
  id: string;
  trackingNo: string;
  productionTime: string;
  logisticsCompany: string;
  isSelfDelivery: boolean;
  salesOrderNo: string;
  consignee: string;
  consigneePhone: string;
  shippingAddress: string;
  status: FulfillmentStatus;
  deliverer?: string;
  delivererPhone?: string;
}
