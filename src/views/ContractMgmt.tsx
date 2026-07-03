import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Plus, Download, CalendarRange } from 'lucide-react';
import { useContracts } from '../hooks/useContracts';
import { DataTable, Column } from '../components/common/DataTable';
import { Contract } from '../models/contract';
import { ContractDetailModal } from '../components/contract/ContractDetailModal';
import { Pagination } from '../components/common/Pagination';

export default function ContractMgmt() {
  const { contracts, loading } = useContracts();
  const [isExpanded, setIsExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter states
  const [filters, setFilters] = useState({
    contractNo: '',
    name: '',
    status: '',
    type: '',
    validityPeriod: '',
    signingDate: '',
    tianchuangContact: ''
  });

  const showToastMsg = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleReset = () => {
    setFilters({
      contractNo: '',
      name: '',
      status: '',
      type: '',
      validityPeriod: '',
      signingDate: '',
      tianchuangContact: ''
    });
  };

  const handleAction = (action: string, contract: Contract) => {
    if (action === '查看合同') {
      setSelectedContract(contract);
      setIsViewModalOpen(true);
    } else {
      showToastMsg(`此功能开发中: ${action} - ${contract.contractNo}`);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '待签署':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-medium">待签署</span>;
      case '履约中':
        return <span className="px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 rounded text-xs font-medium">履约中</span>;
      case '即将到期':
        return <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs font-medium">即将到期</span>;
      case '已到期':
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-medium">已到期</span>;
      default:
        return <span className="px-2.5 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded text-xs font-medium">{status}</span>;
    }
  };

  const columns: Column<Contract>[] = [
    {
      title: '合同编号',
      key: 'contractNo',
      dataIndex: 'contractNo',
      className: 'font-medium text-slate-900',
    },
    {
      title: '合同/协议名称',
      key: 'name',
      dataIndex: 'name',
      className: 'text-slate-700',
    },
    {
      title: '合同类型',
      key: 'type',
      dataIndex: 'type',
      render: (type: string) => (
        <span className="text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs">
          {type}
        </span>
      )
    },
    {
      title: '签署日期',
      key: 'signingDate',
      dataIndex: 'signingDate',
      className: 'text-slate-600'
    },
    {
      title: '合同有效期',
      key: 'validityPeriod',
      dataIndex: 'validityPeriod',
      render: (period: string) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <CalendarRange size={14} className="text-slate-400" />
          {period}
        </div>
      )
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (status: string) => getStatusBadge(status)
    },
    {
      title: '对接天创采购',
      key: 'tianchuangContact',
      dataIndex: 'tianchuangContact',
      render: (contact: string) => (
        contact && contact !== '-' ? (
          <span className="text-slate-900">{contact}</span>
        ) : (
          <span className="text-slate-400">-</span>
        )
      )
    },
    {
      title: '操作',
      key: 'actions',
      fixed: 'right',
      width: 128,
      className: 'text-right',
      headerClassName: 'text-right',
      render: (_, contract: Contract) => (
        <div className="flex items-center justify-end gap-3 text-xs font-bold">
          <button 
            onClick={() => handleAction('查看合同', contract)}
            className="text-slate-600 hover:text-slate-900 transition-colors"
          >
            查看合同
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">合同管理</h1>
          <p className="text-sm text-slate-500 mt-1">管理入驻协议及相关业务合同</p>
        </div>
      </div>

      {/* 筛选区域 - 独立卡片 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 items-center">
          <input 
            type="text" 
            placeholder="合同编号" 
            value={filters.contractNo}
            onChange={(e) => setFilters({...filters, contractNo: e.target.value})}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <input 
            type="text" 
            placeholder="合同/协议名称" 
            value={filters.name}
            onChange={(e) => setFilters({...filters, name: e.target.value})}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
          <select 
            className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">状态</option>
            <option value="待签署">待签署</option>
            <option value="履约中">履约中</option>
            <option value="即将到期">即将到期</option>
            <option value="已到期">已到期</option>
          </select>

          <div className="flex items-center justify-end gap-3 h-[38px]">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700 transition-colors mr-2"
            >
              {isExpanded ? (
                <><ChevronUp size={16} /> 收起筛选</>
              ) : (
                <><ChevronDown size={16} /> 展开筛选</>
              )}
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
            >
              重置
            </button>
            <button 
              className="px-4 py-2 text-sm font-bold text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600 transition-all shadow-sm shadow-blue-200 flex items-center gap-1.5"
            >
              <Search size={16} className="text-blue-100" />
              搜索
            </button>
          </div>

          {isExpanded && (
            <>
              <select 
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">合同类型</option>
                <option value="框架合同">框架合同</option>
                <option value="补充协议">补充协议</option>
              </select>
              <input 
                type="text" 
                placeholder="合同有效期 (yyyy-MM-dd 至 yyyy-MM-dd)" 
                value={filters.validityPeriod}
                onChange={(e) => setFilters({...filters, validityPeriod: e.target.value})}
                onFocus={(e) => e.target.type = 'date'}
                onBlur={(e) => {if (!e.target.value) e.target.type = 'text';}}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm text-slate-500"
              />
              <input 
                type="date" 
                placeholder="签署日期" 
                value={filters.signingDate}
                onChange={(e) => setFilters({...filters, signingDate: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm text-slate-500"
              />
              <input 
                type="text" 
                placeholder="对接天创采购（姓名）"
                value={filters.tianchuangContact}
                onChange={(e) => setFilters({...filters, tianchuangContact: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
              />
            </>
          )}
        </div>
      </div>

      {/* 列表区域 */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col relative">
        <DataTable
          columns={columns}
          data={contracts}
          loading={loading}
          rowKey="id"
          emptyText="暂无合同数据"
          minWidth="1200px"
          expandable={true}
        />
        
        {/* 分页 */}
        {!loading && contracts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={contracts.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            itemName="条合同记录"
          />
        )}
      </div>

      {/* Global Toast */}
      {showToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-xl shadow-lg border border-slate-700 font-medium text-sm animate-in slide-in-from-top-4 fade-in duration-300">
          {toastMessage}
        </div>
      )}

      {/* 查看合同弹窗 */}
      <ContractDetailModal 
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedContract(null);
        }}
        contract={selectedContract}
      />
    </div>
  );
}
