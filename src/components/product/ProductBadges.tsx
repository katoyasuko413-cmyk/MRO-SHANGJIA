import React from 'react';
import { AuditStatus, SalesStatus } from '../../models/product';

export const AuditBadge = ({ status }: { status: AuditStatus }) => {
  switch(status) {
    case 'APPROVED':
      return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">已通过</span>;
    case 'PENDING_AUDIT':
    case 'PENDING_APPROVAL':
      return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">待审核/待审批</span>;
    case 'AUDIT_REJECTED':
    case 'APPROVAL_REJECTED':
      return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">被驳回</span>;
    case 'DRAFT':
    default:
      return <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">草稿</span>;
  }
};

export const SalesBadge = ({ status }: { status: SalesStatus }) => {
  return status === 'ON_SALE' 
    ? <span className="flex items-center gap-1.5 text-sm text-slate-700"><span className="w-2 h-2 rounded-full bg-green-500"></span>已上架</span>
    : <span className="flex items-center gap-1.5 text-sm text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-300"></span>已下架</span>;
};
