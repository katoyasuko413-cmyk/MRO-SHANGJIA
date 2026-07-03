import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle2, XCircle, Clock, Check } from 'lucide-react';
import { BrandApplicationModal } from '../components/product/BrandApplicationModal';
import { Pagination } from '../components/common/Pagination';

interface BrandRecord {
  id: string;
  name: string;
  enName?: string;
  initial?: string;
  logo?: string;
  nature: string;
  serviceArea: string;
  validityPeriod: string;
  submitTime: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  remark?: string;
}

const MOCK_RECORDS: BrandRecord[] = [
  {
    id: 'BR20231025001',
    name: '华为',
    enName: 'HUAWEI',
    initial: 'H',
    logo: 'https://images.unsplash.com/photo-1614680376593-902f74fa0d41?w=100&h=100&fit=crop&q=80',
    nature: '原厂品牌',
    serviceArea: '广东省 深圳市',
    validityPeriod: '2023-10-25 至 长期',
    submitTime: '2023-10-25 14:30:00',
    status: 'APPROVED',
  },
  {
    id: 'BR20231026002',
    name: '思科',
    enName: 'Cisco',
    initial: 'C',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&h=100&fit=crop&q=80',
    nature: '一级代理商',
    serviceArea: '全国',
    validityPeriod: '2023-10-26 至 2028-10-25',
    submitTime: '2023-10-26 09:15:00',
    status: 'PENDING',
  },
  {
    id: 'BR20231027003',
    name: '未知品牌X',
    enName: 'Unknown X',
    initial: 'U',
    nature: '二级代理商',
    serviceArea: '浙江省 杭州市',
    validityPeriod: '2023-10-27 至 2024-10-26',
    submitTime: '2023-10-27 16:45:00',
    status: 'REJECTED',
    remark: '资质文件不全，缺少商标注册证，请补充后重新提交。',
  },
  {
    id: 'BR20231028004',
    name: '苹果',
    enName: 'Apple',
    initial: 'A',
    logo: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=100&h=100&fit=crop&q=80',
    nature: '一级代理商',
    serviceArea: '全国',
    validityPeriod: '2023-10-28 至 2025-10-27',
    submitTime: '2023-10-28 10:20:00',
    status: 'APPROVED',
  },
  {
    id: 'BR20231029005',
    name: '小米',
    enName: 'XIAOMI',
    initial: 'X',
    logo: 'https://images.unsplash.com/photo-1614680376712-42a26179e0de?w=100&h=100&fit=crop&q=80',
    nature: '原厂品牌',
    serviceArea: '北京市',
    validityPeriod: '2023-10-29 至 长期',
    submitTime: '2023-10-29 11:10:00',
    status: 'APPROVED',
  },
  {
    id: 'BR20231030006',
    name: '联想',
    enName: 'Lenovo',
    initial: 'L',
    logo: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=100&h=100&fit=crop&q=80',
    nature: '原厂品牌',
    serviceArea: '全国',
    validityPeriod: '2023-10-30 至 长期',
    submitTime: '2023-10-30 08:45:00',
    status: 'PENDING',
  },
  {
    id: 'BR20231031007',
    name: '惠普',
    enName: 'HP',
    initial: 'H',
    logo: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=100&h=100&fit=crop&q=80',
    nature: '二级代理商',
    serviceArea: '上海市',
    validityPeriod: '2023-10-31 至 2024-10-30',
    submitTime: '2023-10-31 15:30:00',
    status: 'REJECTED',
    remark: '品牌授权书已过期，请提供最新的授权文件。',
  },
  {
    id: 'BR20231101008',
    name: '戴尔',
    enName: 'DELL',
    initial: 'D',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80',
    nature: '一级代理商',
    serviceArea: '全国',
    validityPeriod: '2023-11-01 至 2026-10-31',
    submitTime: '2023-11-01 13:20:00',
    status: 'APPROVED',
  },
  {
    id: 'BR20231102009',
    name: '星光科技',
    enName: 'StarLight',
    initial: 'S',
    logo: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=100&h=100&fit=crop&q=80',
    nature: '原厂品牌',
    serviceArea: '浙江省 杭州市',
    validityPeriod: '2023-11-02 至 长期',
    submitTime: '2023-11-02 10:00:00',
    status: 'APPROVED',
    remark: '入驻认证审核通过自动同步的新增品牌',
  }
];

export default function BrandRecords() {
  const [records, setRecords] = useState<BrandRecord[]>(MOCK_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BrandRecord | null>(null);
  const [recordToDelete, setRecordToDelete] = useState<BrandRecord | null>(null);
  const [showToast, setShowToast] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showToast) {
      timer = setTimeout(() => {
        setShowToast(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showToast]);

  // Computed Status Label
  const getStatusDisplay = (status: BrandRecord['status']) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 size={14} />
            审核通过
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
            <XCircle size={14} />
            审核驳回
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={14} />
            审核中
          </span>
        );
    }
  };

  const filteredRecords = records.filter(record => {
    const matchSearch = record.name.includes(searchTerm);
    const matchStatus = statusFilter === 'ALL' || record.status === statusFilter;
    const matchType = typeFilter === 'ALL' || record.nature === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleSaveBrand = (brandData: any) => {
    if (editingRecord) {
      setRecords(records.map(r => r.id === editingRecord.id ? {
        ...r,
        name: brandData.name,
        enName: brandData.enName,
        initial: brandData.initial,
        nature: brandData.nature || r.nature,
        serviceArea: brandData.serviceArea || r.serviceArea,
        validityPeriod: brandData.validityPeriod || r.validityPeriod,
        logo: brandData.logo,
        submitTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        status: 'PENDING',
        remark: undefined // clear rejection reason
      } : r));
    } else {
      const newRecord: BrandRecord = {
        id: `BR${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        name: brandData.name,
        enName: brandData.enName,
        initial: brandData.initial,
        nature: brandData.nature || '原厂品牌',
        serviceArea: brandData.serviceArea || '全国',
        validityPeriod: brandData.validityPeriod || '2024-01-01 至 2025-01-01',
        logo: brandData.logo,
        submitTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
        status: 'PENDING',
      };
      setRecords([newRecord, ...records]);
    }
    
    setIsModalOpen(false);
    setShowToast(true);
  };

  const handleEdit = (record: BrandRecord) => {
    setEditingRecord(record);
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  const handleView = (record: BrandRecord) => {
    setEditingRecord(record);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (recordToDelete) {
      setRecords(records.filter(r => r.id !== recordToDelete.id));
      setRecordToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">品牌提交记录</h1>
          <p className="text-sm text-slate-500 mt-1">查看及管理您向平台提交的所有品牌资质与申请进度</p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <input 
                type="text" 
                placeholder="品牌中文名字" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
            <div>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">品牌性质</option>
                <option value="原厂品牌">原厂品牌</option>
                <option value="一级代理商">一级代理商</option>
                <option value="二级代理商">二级代理商</option>
              </select>
            </div>
            <div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="ALL">审核状态</option>
                <option value="APPROVED">审核通过</option>
                <option value="PENDING">审核中</option>
                <option value="REJECTED">审核驳回</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => {
                setSearchTerm('');
                setTypeFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="px-5 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors bg-white"
            >
              重置
            </button>
            <button 
              onClick={() => {
                // Triggered by filter computed automatically due to state based, but could be a separate submit in a real scenario
              }}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center gap-2"
            >
              <Search size={16} />
              搜索
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-sm font-medium text-slate-500 whitespace-nowrap">申请单号</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500 whitespace-nowrap">品牌名称</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500 whitespace-nowrap">英文名称</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500 whitespace-nowrap">首字母</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500 whitespace-nowrap">品牌性质</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500 whitespace-nowrap">服务区域</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500 whitespace-nowrap">有效期</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500 whitespace-nowrap">提交时间</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500 whitespace-nowrap">当前状态</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500 min-w-[250px]">备注/驳回原因</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500 text-right whitespace-nowrap min-w-[140px] sticky right-0 bg-slate-50 z-20 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/80 transition-colors group bg-white">
                    <td className="py-3 px-4 text-sm text-slate-600 font-mono">
                      {record.id}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-900">{record.name}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {record.enName || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {record.initial || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                      {record.nature}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                      {record.serviceArea}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                      {record.validityPeriod}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 whitespace-nowrap">
                      {record.submitTime}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusDisplay(record.status)}
                    </td>
                    <td className="py-3 px-4 text-sm min-w-[250px] max-w-[400px]">
                      {record.remark ? (
                        <div className="text-slate-600 line-clamp-2 whitespace-normal break-words" title={record.remark}>{record.remark}</div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center justify-end gap-3 text-sm">
                        <button onClick={() => handleView(record)} className="text-blue-500 hover:text-blue-600 font-medium transition-colors whitespace-nowrap">查看</button>
                        {record.status === 'REJECTED' && (
                          <button onClick={() => handleEdit(record)} className="text-blue-500 hover:text-blue-600 font-medium transition-colors whitespace-nowrap">编辑</button>
                        )}
                        {record.status === 'REJECTED' && (
                          <button 
                            onClick={() => setRecordToDelete(record)}
                            className="text-red-500 hover:text-red-600 font-medium transition-colors whitespace-nowrap"
                          >
                            删除
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <FileText size={48} className="mb-4 opacity-50" />
                      <p className="text-sm font-medium text-slate-600">没有找到匹配的记录</p>
                      <p className="text-xs mt-1">您可以调整筛选条件</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 分页 */}
        <Pagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalItems={filteredRecords.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>

      <BrandApplicationModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setIsViewMode(false);
        }}
        onSave={handleSaveBrand}
        initialData={editingRecord}
        rejectReason={editingRecord?.remark}
        isView={isViewMode}
      />

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">确认删除</h3>
              <p className="text-sm text-slate-600">
                确定要删除申请单号为 <span className="font-medium text-slate-900">{recordToDelete.id}</span> 的品牌记录吗？此操作无法撤销。
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => setRecordToDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm"
              >
                取消
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 border border-transparent rounded-lg hover:bg-red-600 transition-all shadow-sm"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <CheckCircle2 size={18} className="text-green-400" />
          <span className="text-sm font-medium">提交成功</span>
        </div>
      )}
    </div>
  );
}
