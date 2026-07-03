import { useState, useEffect } from 'react';
import { Contract } from '../models/contract';

// Mock data
const mockContracts: Contract[] = [
  {
    id: 'CT-2024-006',
    contractNo: 'TC-20240501-001',
    name: '2024年度大客户战略合作框架协议',
    type: '框架合同',
    signingDate: '2024-05-01',
    validityPeriod: '2024-05-01 至 2025-04-30',
    status: '待签署',
    tianchuangContact: '-',
    children: [
      {
        id: 'CT-2024-006-1',
        contractNo: 'TC-20240501-001-A',
        name: '补充协议：价格保护条款',
        type: '补充协议',
        signingDate: '2024-05-01',
        validityPeriod: '2024-05-01 至 2025-04-30',
        status: '待签署',
        tianchuangContact: '-'
      }
    ]
  },
  {
    id: 'CT-2023-001',
    contractNo: 'TC-20231015-001',
    name: '2023年度XX品牌框架采购协议',
    type: '框架合同',
    signingDate: '2023-10-15',
    validityPeriod: '2023-10-15 至 2024-10-14',
    status: '履约中',
    tianchuangContact: '张小斐',
    children: [
      {
        id: 'CT-2023-002',
        contractNo: 'TC-20231102-005',
        name: '双十一大促专项补充协议',
        type: '补充协议',
        signingDate: '2023-11-02',
        validityPeriod: '2023-11-02 至 2023-11-30',
        status: '已到期',
        tianchuangContact: '王建国'
      }
    ]
  },
  {
    id: 'CT-2024-001',
    contractNo: 'TC-20240110-012',
    name: '2024年春季新品首发合作协议',
    type: '框架合同',
    signingDate: '2024-01-10',
    validityPeriod: '2024-01-10 至 2024-05-31',
    status: '即将到期',
    tianchuangContact: '李雪琴',
    children: [
      {
        id: 'CT-2024-004',
        contractNo: 'TC-20240320-004',
        name: '春季营销活动推广专项协议',
        type: '补充协议',
        signingDate: '2024-03-20',
        validityPeriod: '2024-04-01 至 2024-05-15',
        status: '即将到期',
        tianchuangContact: '-'
      }
    ]
  },
  {
    id: 'CT-2024-002',
    contractNo: 'TC-20240215-008',
    name: '华东区物流仓储长期租赁合同',
    type: '框架合同',
    signingDate: '2024-02-15',
    validityPeriod: '2024-03-01 至 2025-02-28',
    status: '履约中',
    tianchuangContact: '王建国'
  },
  {
    id: 'CT-2022-015',
    contractNo: 'TC-20221201-033',
    name: '2023年度基础IT设施采购服务',
    type: '框架合同',
    signingDate: '2022-12-01',
    validityPeriod: '2023-01-01 至 2023-12-31',
    status: '已到期',
    tianchuangContact: '李雪琴'
  },
  {
    id: 'CT-2024-005',
    contractNo: 'TC-20240405-002',
    name: '电商平台联合直播带货合作协议',
    type: '框架合同',
    signingDate: '2024-04-05',
    validityPeriod: '2024-04-10 至 2024-10-09',
    status: '履约中',
    tianchuangContact: '李雪琴',
    children: [
      {
        id: 'CT-2024-003',
        contractNo: 'TC-20240301-021',
        name: '2024年代运营商服务补充条款',
        type: '补充协议',
        signingDate: '2024-03-01',
        validityPeriod: '2024-03-01 至 2024-12-31',
        status: '履约中',
        tianchuangContact: '-'
      }
    ]
  }
];

export function useContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    const fetchContracts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setContracts(mockContracts);
      setLoading(false);
    };

    fetchContracts();
  }, []);

  return {
    contracts,
    loading
  };
}
