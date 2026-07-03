import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  itemName?: string;
}

export function Pagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  itemName = '条记录'
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="p-4 border-t border-slate-100 text-sm text-slate-500 flex sm:flex-row flex-col sm:items-center justify-between gap-4 bg-zinc-50/50">
      <div className="flex items-center gap-4">
        <div>共计 {totalItems} {itemName}</div>
        <div className="flex items-center gap-2">
          <span>每页展示</span>
          <select 
            className="border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
            value={pageSize}
            onChange={(e) => {
              onPageSizeChange(Number(e.target.value));
              // Note: the parent component should handle resetting to page 1 if needed
            }}
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          <span>条</span>
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        <button 
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="p-1 px-3 border border-slate-200 rounded hover:bg-white bg-transparent disabled:opacity-50 transition-colors flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          上一页
        </button>
        
        {/* Simple pagination numbers - mostly just showing current page for now since it's mock */}
        <div className="flex items-center px-2">
          第 <span className="font-semibold text-slate-700 mx-1">{currentPage}</span> / {totalPages} 页
        </div>

        <button 
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          className="p-1 px-3 border border-slate-200 rounded hover:bg-white bg-transparent disabled:opacity-50 transition-colors flex items-center gap-1"
        >
          下一页
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
