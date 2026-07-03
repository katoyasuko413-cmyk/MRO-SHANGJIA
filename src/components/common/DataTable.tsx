import React, { ReactNode, useState } from 'react';
import { FileText, ChevronRight, ChevronDown } from 'lucide-react';

export interface Column<T> {
  key: string;
  title: ReactNode;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => ReactNode;
  width?: string | number;
  fixed?: 'left' | 'right';
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: ReactNode;
  rowKey: string | ((record: T) => string);
  minWidth?: string;
  expandable?: boolean;
  childrenColumnName?: keyof T;
}

export function DataTable<T>({ 
  columns, 
  data, 
  loading, 
  emptyText = '暂无数据', 
  rowKey,
  minWidth,
  expandable = false,
  childrenColumnName = 'children' as keyof T
}: DataTableProps<T>) {
  
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) => {
    const nextKeys = new Set(expandedKeys);
    if (nextKeys.has(key)) {
      nextKeys.delete(key);
    } else {
      nextKeys.add(key);
    }
    setExpandedKeys(nextKeys);
  };

  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return (record[rowKey as keyof T] as unknown as string) || index.toString();
  };

  return (
    <div className="overflow-x-auto relative min-h-[300px]">
      {loading && (
        <div className="absolute inset-0 bg-white/80 z-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent animate-spin" />
            <span className="text-sm text-slate-500">加载中...</span>
          </div>
        </div>
      )}
      
      <table className="w-full text-left border-collapse text-sm" style={{ minWidth }}>
        <thead className="bg-slate-50 border-y border-slate-100">
          <tr>
            {columns.map((col) => {
              const isFixedLeft = col.fixed === 'left';
              const isFixedRight = col.fixed === 'right';
              
              let stickyClasses = '';
              if (isFixedLeft) {
                stickyClasses = 'sticky left-0 bg-slate-50 z-10 shadow-[4px_0_4px_-4px_rgba(0,0,0,0.05)]';
              } else if (isFixedRight) {
                stickyClasses = 'sticky right-0 bg-slate-50 z-10 shadow-[-12px_0_12px_-12px_rgba(0,0,0,0.1)]';
              }

              return (
                <th 
                  key={col.key} 
                  className={`px-5 py-4 font-semibold text-slate-600 whitespace-nowrap ${stickyClasses} ${col.headerClassName || ''}`}
                  style={{ width: col.width }}
                >
                  {col.title}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((record, index) => {
            const key = getRowKey(record, index);
            const children = expandable ? (record[childrenColumnName] as unknown as T[]) : null;
            const hasChildren = children && children.length > 0;
            const isExpanded = expandedKeys.has(key);

            const renderRow = (rowRecord: T, rowIndex: number, isChild: boolean, parentIndex: number) => {
              const rowKeyStr = getRowKey(rowRecord, isChild ? Number(`${parentIndex}.${rowIndex}`) : rowIndex);
              return (
                <tr key={rowKeyStr} className={`hover:bg-slate-50/50 transition-colors group relative ${isChild ? 'bg-slate-50/30' : ''}`}>
                  {columns.map((col, colIndex) => {
                    const isFixedLeft = col.fixed === 'left';
                    const isFixedRight = col.fixed === 'right';
                    const value = col.dataIndex ? rowRecord[col.dataIndex] : undefined;
                    
                    let stickyClasses = '';
                    if (isFixedLeft) {
                      stickyClasses = `sticky left-0 ${isChild ? 'bg-slate-50/30' : 'bg-white'} group-hover:bg-slate-50 z-10 shadow-[4px_0_4px_-4px_rgba(0,0,0,0.05)] transition-colors`;
                    } else if (isFixedRight) {
                      stickyClasses = `sticky right-0 ${isChild ? 'bg-slate-50/30' : 'bg-white'} group-hover:bg-slate-50 z-10 shadow-[-12px_0_12px_-12px_rgba(0,0,0,0.1)] transition-colors`;
                    }

                    // Render expander icon on the first column
                    const isFirstCol = colIndex === 0;
                    
                    return (
                      <td 
                        key={col.key}
                        className={`px-5 py-4 whitespace-nowrap ${stickyClasses} ${col.className || ''}`}
                      >
                        <div className="flex items-center">
                          {isFirstCol && expandable && hasChildren && !isChild && (
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleExpand(rowKeyStr); }}
                              className="mr-2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none flex-shrink-0"
                            >
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </button>
                          )}
                          {isFirstCol && expandable && !hasChildren && !isChild && (
                            <span className="w-[26px] block flex-shrink-0" />
                          )}
                          {isFirstCol && isChild && (
                            <div className="w-[26px] ml-4 border-l-2 border-b-2 border-slate-200 h-4 -mt-4 mr-2 rounded-bl opacity-60 flex-shrink-0" />
                          )}
                          {col.render ? col.render(value, rowRecord, rowIndex) : (value as ReactNode)}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            };

            return (
              <React.Fragment key={key}>
                {renderRow(record, index, false, index)}
                {isExpanded && hasChildren && children.map((child, childIndex) => renderRow(child, childIndex, true, index))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      
      {!loading && (!data || data.length === 0) && (
        <div className="p-12 text-center text-slate-400">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p>{emptyText}</p>
        </div>
      )}
    </div>
  );
}
