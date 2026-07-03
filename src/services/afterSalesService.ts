import { AfterSalesOrder, AfterSalesType, AfterSalesStatus, AfterSalesAddress } from '../models/afterSales';

const MOCK_AFTER_SALES: AfterSalesOrder[] = [
  {
    id: 'AS20241101',
    salesOrderNo: 'SO202403190003',
    customerName: '速达精密制造',
    productName: '工业轴承 6204',
    type: AfterSalesType.RETURN,
    reason: '产品质量问题',
    totalAmountExclTax: 176.99,
    totalAmountInclTax: 200.00,
    status: AfterSalesStatus.PENDING_AUDIT,
    applyTime: '2024-11-01 10:14:22',
    orderTime: '2024-10-25 15:30:11',
    paymentType: '账期',
    phone: '13812345678',
    description: '轴承在使用时噪音过大，运转不顺畅，怀疑有质量缺陷。',
    items: [
      { id: 'I001', sku: 'SKU-ZHC-6204', name: '工业轴承 6204', brand: 'NSK', model: '6204-ZZ', unit: '个', quantity: 2 }
    ]
  },
  {
    id: 'AS20241103',
    salesOrderNo: 'SO202403140008',
    customerName: '速达精密制造',
    productName: '空压机配件',
    type: AfterSalesType.REPAIR,
    reason: '电机不启动',
    totalAmountExclTax: 1327.43,
    totalAmountInclTax: 1500.00,
    status: AfterSalesStatus.PROCESSING,
    applyTime: '2024-11-03 09:30:55',
    approvedTime: '2024-11-04 10:00:00',
    orderTime: '2024-10-27 11:24:45',
    paymentType: '现金',
    phone: '13812345678',
    description: '空压机通电后电机无任何反应，指示灯不亮。',
    items: [
      { id: 'I002', sku: 'SKU-KYJ-ACC', name: '空压机配件', brand: '捷美', model: 'JM-05', unit: '套', quantity: 1 }
    ]
  },
  {
    id: 'AS20241106',
    salesOrderNo: 'SO202403130009',
    customerName: '速达精密制造',
    productName: '工业吸尘器',
    type: AfterSalesType.REPAIR,
    reason: '吸力不足',
    totalAmountExclTax: 4424.78,
    totalAmountInclTax: 5000.00,
    status: AfterSalesStatus.PENDING_SUPPLIER_PROCESS,
    applyTime: '2024-11-06 15:45:10',
    approvedTime: '2024-11-07 09:15:00',
    orderTime: '2024-10-28 14:15:00',
    paymentType: '账期',
    phone: '13812345678',
    description: '吸尘器运转正常，但吸力明显减小，无法吸起重物。',
    expressCompany: '顺丰速运',
    expressNumber: 'SF1160829188',
    items: [
      { id: 'I003', sku: 'SKU-XC-09', name: '工业吸尘器', brand: '凯德', model: 'KD-2000', unit: '台', quantity: 1 }
    ]
  },
  {
    id: 'AS20241110',
    salesOrderNo: 'SO202404100121',
    customerName: '腾飞电子科技',
    productName: '高精度数字万用表',
    type: AfterSalesType.RETURN,
    reason: '规格不符/买错型号',
    totalAmountExclTax: 442.48,
    totalAmountInclTax: 500.00,
    status: AfterSalesStatus.PENDING_SUPPLIER_PROCESS,
    applyTime: '2024-11-10 11:20:00',
    approvedTime: '2024-11-11 14:00:22',
    orderTime: '2024-11-02 09:05:33',
    paymentType: '现金',
    phone: '15911112222',
    description: '原计划购买的是带温度测量功能的万用表，该型号型号不符，申请退货。',
    expressCompany: '圆通速递',
    expressNumber: 'YT8261908231',
    items: [
      { id: 'I004', sku: 'SKU-WYB-98A', name: '高精度数字万用表', brand: '福禄克', model: 'FLUKE-17B+', unit: '台', quantity: 1 }
    ]
  },
  {
    id: 'AS20241112',
    salesOrderNo: 'SO202404110055',
    customerName: '智控自动化系统',
    productName: '伺服电机驱动器',
    type: AfterSalesType.RETURN_REPAIR,
    reason: '过流报警故障',
    totalAmountExclTax: 1769.91,
    totalAmountInclTax: 2000.00,
    status: AfterSalesStatus.PENDING_SUPPLIER_PROCESS,
    applyTime: '2024-11-12 10:20:00',
    approvedTime: '2024-11-13 09:30:15',
    orderTime: '2024-11-04 11:45:00',
    paymentType: '账期',
    phone: '13988887777',
    description: '伺服电机通电运行10分钟后，驱动器频繁报E-03过流故障，无法正常运行，申请寄回原厂检测维修。',
    items: [
      { id: 'I011', sku: 'SKU-SVD-B2', name: '伺服电机驱动器', brand: '台达', model: 'ASD-B2-0421-F', unit: '台', quantity: 1 }
    ]
  },
  {
    id: 'AS20241115',
    salesOrderNo: 'SO202404120912',
    customerName: '红星重工集团',
    productName: '数控切割机电源模块',
    type: AfterSalesType.REPAIR,
    reason: '设备故障/无法开机',
    totalAmountExclTax: 8849.56,
    totalAmountInclTax: 10000.00,
    status: AfterSalesStatus.PENDING_AUDIT,
    applyTime: '2024-11-15 14:02:11',
    orderTime: '2024-11-08 16:33:00',
    paymentType: '账期',
    phone: '13566667777',
    description: '切割机配电箱电源模块红灯常亮，上电后无AC24V输出，影响整机运转。',
    items: [
      { id: 'I005', sku: 'SKU-PWR-CO2', name: '数控切割机电源模块', brand: '明纬', model: 'MW-24V-400W', unit: '个', quantity: 2 }
    ]
  },
  {
    id: 'AS20241118',
    salesOrderNo: 'SO202404200881',
    customerName: '蓝天航空设备',
    productName: '防爆激光测距仪',
    type: AfterSalesType.REPAIR,
    reason: '设备检测故障',
    totalAmountExclTax: 2654.87,
    totalAmountInclTax: 3000.00,
    status: AfterSalesStatus.COMPLETED,
    applyTime: '2024-11-18 16:15:30',
    approvedTime: '2024-11-19 11:30:00',
    completeTime: '2024-11-23 15:45:00',
    orderTime: '2024-11-10 11:12:44',
    paymentType: '现金',
    phone: '13122223333',
    description: '激光辅助红点不准，30米外有约10cm偏差，寄回校准并维修。',
    expressCompany: '特快专递',
    expressNumber: 'EMS771960183',
    items: [
      { id: 'I006', sku: 'SKU-LD-50', name: '防爆激光测距仪', brand: '博世', model: 'GLM500', unit: '台', quantity: 1 }
    ]
  },
  {
    id: 'AS20241120',
    salesOrderNo: 'SO202404281005',
    customerName: '恒达五金加工厂',
    productName: '硬质合金铣刀套件',
    type: AfterSalesType.RETURN,
    reason: '发大货与样品差异大',
    totalAmountExclTax: 884.96,
    totalAmountInclTax: 1000.00,
    status: AfterSalesStatus.COMPLETED,
    applyTime: '2024-11-20 10:22:15',
    approvedTime: '2024-11-21 09:20:00',
    completeTime: '2024-11-24 16:10:00',
    orderTime: '2024-11-12 15:44:11',
    paymentType: '账期',
    phone: '13688889999',
    description: '大件硬质合金铣刀的刃部涂层 and 样品差异极大，检测硬度不够，申请整批退回。',
    items: [
      { id: 'I007', sku: 'SKU-MILL-88', name: '硬质合金铣刀套件', brand: '株洲钻石', model: 'HM-4T-D10', unit: '套', quantity: 5 }
    ]
  },
  {
    id: 'AS20241122',
    salesOrderNo: 'SO202405020112',
    customerName: '智造动力工业',
    productName: '气动黄油机 12L',
    type: AfterSalesType.EXCHANGE,
    reason: '发错货/实际型号不符',
    totalAmountExclTax: 1592.92,
    totalAmountInclTax: 1800.00,
    status: AfterSalesStatus.PENDING_SUPPLIER_PROCESS,
    applyTime: '2024-11-22 13:45:00',
    approvedTime: '2024-11-23 10:45:00',
    orderTime: '2024-11-15 10:10:00',
    paymentType: '现金',
    phone: '13799990000',
    description: '订购的是12L豪华型，收货发现实际为8L标准版。申请换货为正确的12L豪华型气动黄油机。',
    expressCompany: '极兔速递',
    expressNumber: 'JT5019827361',
    items: [
      { id: 'I008', sku: 'SKU-GREASE-12L', name: '气动黄油机 12L', brand: '星丰', model: 'XF-12L-H', unit: '台', quantity: 1 }
    ]
  },
  {
    id: 'AS20241125',
    salesOrderNo: 'SO202405040922',
    customerName: '安泰精密模具',
    productName: '红外线测温仪',
    type: AfterSalesType.EXCHANGE,
    reason: '屏幕显示异常/划痕',
    totalAmountExclTax: 707.96,
    totalAmountInclTax: 800.00,
    status: AfterSalesStatus.PROCESSING,
    applyTime: '2024-11-25 15:10:30',
    approvedTime: '2024-11-26 13:50:00',
    orderTime: '2024-11-18 14:20:55',
    paymentType: '账期',
    phone: '18633334444',
    description: '开箱后发现屏幕有贯穿性深度划痕，且LCD局部有彩虹斑，申请换新。',
    expressCompany: '中通快递',
    expressNumber: 'ZT99872161109',
    items: [
      { id: 'I009', sku: 'SKU-THERM-88', name: '红外线测温仪', brand: '希玛', model: 'AR882', unit: '台', quantity: 2 }
    ]
  }
];

let instanceData = [...MOCK_AFTER_SALES];

export const getAfterSalesOrders = async (filters?: any): Promise<AfterSalesOrder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...instanceData];
      if (filters) {
        if (filters.status && filters.status !== 'ALL') {
          filtered = filtered.filter(item => item.status === filters.status);
        }
        if (filters.query) {
          const q = filters.query.toLowerCase();
          filtered = filtered.filter(item => 
            item.id.toLowerCase().includes(q) || 
            item.customerName.toLowerCase().includes(q) || 
            item.productName.toLowerCase().includes(q)
          );
        }
        if (filters.type) {
          filtered = filtered.filter(item => item.type === filters.type);
        }
      }
      resolve(filtered);
    }, 300);
  });
};

const getNowString = (): string => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

export const approveAfterSales = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      instanceData = instanceData.map(item => {
        if (item.id === id) {
          return { ...item, status: AfterSalesStatus.PENDING_CLIENT_SEND, approvedTime: getNowString() };
        }
        return item;
      });
      resolve(true);
    }, 300);
  });
};

export const rejectAfterSales = async (id: string, reason: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      instanceData = instanceData.map(item => {
        if (item.id === id) {
          return { ...item, status: AfterSalesStatus.REJECTED, rejectReason: reason };
        }
        return item;
      });
      resolve(true);
    }, 300);
  });
};

export const processAfterSales = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      instanceData = instanceData.map(item => {
        if (item.id === id) {
          let nextStatus = AfterSalesStatus.PROCESSING;
          if (item.status === AfterSalesStatus.PENDING_AUDIT) {
            nextStatus = item.type === AfterSalesType.REPAIR 
              ? AfterSalesStatus.PROCESSING 
              : AfterSalesStatus.PENDING_CLIENT_SEND;
          } else if (item.status === AfterSalesStatus.PENDING_SUPPLIER_PROCESS) {
            nextStatus = (item.type === AfterSalesType.RETURN_REPAIR || item.type === AfterSalesType.RETURN || item.type === AfterSalesType.EXCHANGE)
              ? AfterSalesStatus.PENDING_CLIENT_SEND 
              : AfterSalesStatus.PROCESSING;
          } else {
            nextStatus = item.type === AfterSalesType.REPAIR 
              ? AfterSalesStatus.PROCESSING 
              : AfterSalesStatus.PENDING_CLIENT_SEND;
          }
          return { ...item, status: nextStatus };
        }
        return item;
      });
      resolve(true);
    }, 300);
  });
};

export const submitLogisticsAfterSales = async (id: string, expressCompany: string, expressNumber: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      instanceData = instanceData.map(item => {
        if (item.id === id) {
          const isRepair = item.type === AfterSalesType.REPAIR || item.type === AfterSalesType.RETURN_REPAIR;
          const nextStatus = (isRepair && item.status === AfterSalesStatus.PROCESSING)
            ? AfterSalesStatus.COMPLETED
            : AfterSalesStatus.PROCESSING;
          const completeTime = nextStatus === AfterSalesStatus.COMPLETED ? getNowString() : item.completeTime;
          return { 
            ...item, 
            status: nextStatus,
            expressCompany,
            expressNumber,
            completeTime
          };
        }
        return item;
      });
      resolve(true);
    }, 300);
  });
};

export const receiveRepairAfterSales = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      instanceData = instanceData.map(item => {
        if (item.id === id) {
          return { ...item, status: AfterSalesStatus.PROCESSING };
        }
        return item;
      });
      resolve(true);
    }, 300);
  });
};

export const completeAfterSales = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      instanceData = instanceData.map(item => {
        if (item.id === id) {
          return { ...item, status: AfterSalesStatus.COMPLETED, completeTime: getNowString() };
        }
        return item;
      });
      resolve(true);
    }, 300);
  });
};

let mockAddresses: AfterSalesAddress[] = [
  {
    id: 'ADDR001',
    contactName: '供应商售后服务部',
    phone: '13812345678',
    province: '广东省',
    city: '深圳市',
    district: '福田区',
    detailAddress: '华强北路驻深办福田仓库 1栋2层',
    warehouseName: '深圳市驻深办福田仓库 (华强北分仓)',
    isDefault: true
  },
  {
    id: 'ADDR002',
    contactName: '供应商技术检测中心',
    phone: '13987654321',
    province: '上海市',
    city: '上海市',
    district: '浦东新区',
    detailAddress: '金桥基地 11号备件库',
    warehouseName: '上海市浦东新区金桥基地 11号备件库',
    isDefault: false
  },
  {
    id: 'ADDR003',
    contactName: '供应商仓储中心',
    phone: '13500001111',
    province: '北京市',
    city: '北京市',
    district: '大兴区',
    detailAddress: '亦庄经济开发区 C3栋中央配送中心',
    warehouseName: '北京市亦庄经济开发区 C3栋中央配送中心',
    isDefault: false
  }
];

export const getAfterSalesAddresses = async (): Promise<AfterSalesAddress[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockAddresses]);
    }, 200);
  });
};

export const createAfterSalesAddress = async (address: Omit<AfterSalesAddress, 'id'>): Promise<AfterSalesAddress> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newAddress: AfterSalesAddress = {
        ...address,
        id: `ADDR${String(mockAddresses.length + 1).padStart(3, '0')}-${Date.now().toString().slice(-4)}`
      };
      if (newAddress.isDefault) {
        mockAddresses = mockAddresses.map(addr => ({ ...addr, isDefault: false }));
      }
      mockAddresses.push(newAddress);
      resolve(newAddress);
    }, 200);
  });
};

export const updateAfterSalesAddress = async (address: AfterSalesAddress): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (address.isDefault) {
        mockAddresses = mockAddresses.map(addr => addr.id === address.id ? { ...address } : { ...addr, isDefault: false });
      } else {
        mockAddresses = mockAddresses.map(addr => addr.id === address.id ? { ...address } : addr);
      }
      resolve(true);
    }, 200);
  });
};

export const deleteAfterSalesAddress = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockAddresses = mockAddresses.filter(addr => addr.id !== id);
      if (mockAddresses.length > 0 && !mockAddresses.some(addr => addr.isDefault)) {
        mockAddresses[0].isDefault = true;
      }
      resolve(true);
    }, 200);
  });
};

export const setDefaultAfterSalesAddress = async (id: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockAddresses = mockAddresses.map(addr => ({ ...addr, isDefault: addr.id === id }));
      resolve(true);
    }, 200);
  });
};

