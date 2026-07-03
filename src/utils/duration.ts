import { AfterSalesOrder, AfterSalesStatus } from '../models/afterSales';

/**
 * Calculates and formats after-sales duration.
 * Calculated from operations audit approval (approvedTime) to customer completion (completeTime).
 * If the order is not yet approved, returns "-".
 * If it is approved but not complete, calculates duration up to the current time.
 */
export function formatAfterSalesDuration(order: AfterSalesOrder): string {
  if (!order.approvedTime) {
    return '-';
  }

  // If status is still pending audit or rejected, it shouldn't show a duration since audit hasn't passed
  if (order.status === AfterSalesStatus.PENDING_AUDIT || order.status === AfterSalesStatus.REJECTED) {
    return '-';
  }

  const startDate = new Date(order.approvedTime.replace(/-/g, '/'));
  
  let endDate: Date;
  if (order.status === AfterSalesStatus.COMPLETED) {
    if (order.completeTime) {
      endDate = new Date(order.completeTime.replace(/-/g, '/'));
    } else {
      // Fallback if completeTime is not set yet
      endDate = new Date();
    }
  } else {
    endDate = new Date();
  }

  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs < 0) {
    return '0分钟';
  }

  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 60) {
    return `${diffMins}分钟`;
  }

  const diffHours = Math.floor(diffMins / 60);
  const remainingMins = diffMins % 60;
  if (diffHours < 24) {
    return `${diffHours}小时${remainingMins}分钟`;
  }

  const diffDays = Math.floor(diffHours / 24);
  const remainingHours = diffHours % 24;
  return `${diffDays}天${remainingHours}小时`;
}
