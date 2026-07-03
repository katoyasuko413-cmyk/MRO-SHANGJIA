import { Order } from '../models/order';

const MOCK_ORDERS: Order[] = [
  {
    id: 'O20240321001',
    salesOrderNo: 'SO202403210001',
    purchaserName: '浙江智造网络科技有限公司',
    recipientName: '张三',
    recipientPhone: '13800138000',
    recipientAddress: '浙江省杭州市余杭区文一西路999号',
    salesAmount: 1580.0,
    settlementStatus: 'UNSETTLED',
    orderTime: '2024-03-21 10:30:00',
    status: 'PENDING_ACCEPT',
    deliveryMethod: '顺丰速运',
    paymentAmount: 1580.0,
    items: [
      {
        id: 'I1001',
        sku: '3M-9001V',
        name: '3M 颗粒物防护口罩 KN95 工业粉尘防尘透气',
        brand: '3M',
        specification: '25只/盒',
        model: '9001V',
            quantity: 10,
            priceExclTax: 139.8,
            priceInclTax: 158.0,
            amountExclTax: 1398.0,
            amountInclTax: 1580.0,
            requirementDesc: '需加急发货，独立包装'
          }
    ],
    totalAmountExclTax: 1398.0,
    totalAmountInclTax: 1580.0
  },
  {
    id: 'O20240320002',
    salesOrderNo: 'SO202403200002',
    purchaserName: '上海工业设备集团',
    recipientName: '李四',
    recipientPhone: '13900139000',
    recipientAddress: '上海市浦东新区张江高科技园区',
    salesAmount: 12323.5,
    settlementStatus: 'UNSETTLED',
    orderTime: '2024-03-20 14:15:00',
    status: 'PENDING_SHIP',
    deliveryMethod: '京东物流',
    paymentAmount: 12323.5,
    items: [
      {
        id: 'I1002',
        sku: 'ST09014',
        name: '世达(SATA) 120件机修汽修棘轮扳手五金工具套装',
        brand: 'SATA',
        specification: '120件套',
        model: '09014',
        quantity: 10,
        priceExclTax: 795.5,
        priceInclTax: 899.0,
        amountExclTax: 7955.0,
        amountInclTax: 8990.0
      },
      {
        id: 'I1010',
        sku: 'BOSCH-GSR12V-30',
        name: '博世(BOSCH) 12V无刷手电钻',
        brand: 'Bosch',
        specification: '双电版',
        model: 'GSR 12V-30',
        quantity: 5,
        priceExclTax: 450.0,
        priceInclTax: 508.5,
        amountExclTax: 2250.0,
        amountInclTax: 2542.5
      },
      {
        id: 'I1011',
        sku: 'SATA-03015',
        name: '世达(SATA) 8寸活动扳手',
        brand: 'SATA',
        specification: '8寸/200mm',
        model: '03015',
        quantity: 20,
        priceExclTax: 35.0,
        priceInclTax: 39.55,
        amountExclTax: 700.0,
        amountInclTax: 791.0
      }
    ],
    totalAmountExclTax: 10905.0,
    totalAmountInclTax: 12323.5
  },
  {
    id: 'O20240319003',
    salesOrderNo: 'SO202403190003',
    purchaserName: '江苏机械制造厂',
    recipientName: '王五',
    recipientPhone: '13700137000',
    recipientAddress: '江苏省苏州市工业园区',
    salesAmount: 3450.0,
    settlementStatus: 'UNSETTLED',
    invoiceStatus: 'UNINVOICED',
    orderTime: '2024-03-19 09:45:00',
    status: 'RECEIVED',
    deliveryMethod: '中通快递',
    paymentAmount: 3450.0,
    items: [
      {
        id: 'I1003',
        sku: 'DS-TMW100',
        name: '海康威视 工业级无线条码扫描枪 二维码扫码器',
        brand: '海康威视',
        specification: '无线工业级',
        model: 'DS-TMW100',
        quantity: 10,
        priceExclTax: 305.3,
        priceInclTax: 345.0,
        amountExclTax: 3053.0,
        amountInclTax: 3450.0
      }
    ],
    totalAmountExclTax: 3053.0,
    totalAmountInclTax: 3450.0,
    signOffSheetUrl: 'mock_uploaded_sign_off.png',
    signBy: '王五',
    signOffTime: '2024-03-22 10:15:22'
  },
  {
    id: 'O20240318004',
    salesOrderNo: 'SO202403180004',
    purchaserName: '北京建工集团',
    recipientName: '赵六',
    recipientPhone: '13600136000',
    recipientAddress: '北京市海淀区中关村大街1号',
    salesAmount: 12500.0,
    settlementStatus: 'UNSETTLED',
    orderTime: '2024-03-18 11:20:00',
    status: 'PENDING_ACCEPT',
    deliveryMethod: '顺丰速运',
    paymentAmount: 12500.0,
    items: [
      {
        id: 'I1004',
        sku: 'TH-50A',
        name: '德力西(DELIXI) 交流接触器',
        brand: '德力西',
        specification: '50A',
        model: 'CJX2-5011',
        quantity: 50,
        priceExclTax: 221.2,
        priceInclTax: 250.0,
        amountExclTax: 11060.0,
        amountInclTax: 12500.0
      }
    ],
    totalAmountExclTax: 11060.0,
    totalAmountInclTax: 12500.0
  },
  {
    id: 'O20240317005',
    salesOrderNo: 'SO202403170005',
    purchaserName: '天津化工设备公司',
    recipientName: '钱七',
    recipientPhone: '13500135000',
    recipientAddress: '天津市滨海新区化工厂路18号',
    salesAmount: 5600.0,
    settlementStatus: 'UNSETTLED',
    orderTime: '2024-03-17 16:40:00',
    status: 'PENDING_RECEIPT',
    deliveryMethod: '德邦物流',
    paymentAmount: 5600.0,
    items: [
      {
        id: 'I1005',
        sku: 'V-500',
        name: '重型防化服 工业级防酸碱防护服',
        brand: '雷克兰',
        specification: 'L号',
        model: 'ChemMax 3',
        quantity: 20,
        priceExclTax: 247.7,
        priceInclTax: 280.0,
        amountExclTax: 4954.0,
        amountInclTax: 5600.0
      }
    ],
    totalAmountExclTax: 4954.0,
    totalAmountInclTax: 5600.0
  },
  {
    id: 'O20240316006',
    salesOrderNo: 'SO202403160006',
    purchaserName: '深圳电子制造厂',
    recipientName: '孙八',
    recipientPhone: '13400134000',
    recipientAddress: '深圳市宝安区电子工业园',
    salesAmount: 2100.0,
    settlementStatus: 'SETTLED',
    orderTime: '2024-03-16 08:30:00',
    status: 'CLOSED',
    deliveryMethod: '顺丰速运',
    paymentAmount: 0,
    items: [
      {
        id: 'I1006',
        sku: 'ESD-15',
        name: '防静电镊子 不锈钢高精密夹子',
        brand: 'VETUS',
        specification: '尖头',
        model: 'ESD-15',
        quantity: 100,
        priceExclTax: 18.5,
        priceInclTax: 21.0,
        amountExclTax: 1850.0,
        amountInclTax: 2100.0
      }
    ],
    totalAmountExclTax: 1850.0,
    totalAmountInclTax: 2100.0
  },
  {
    id: 'O20240315007',
    salesOrderNo: 'SO202403150007',
    purchaserName: '国网浙江省电力有限公司',
    recipientName: '周九',
    recipientPhone: '13300133000',
    recipientAddress: '浙江省杭州市黄龙路8号',
    salesAmount: 45000.0,
    settlementStatus: 'UNSETTLED',
    orderTime: '2024-03-15 13:20:00',
    status: 'CANCELLED',
    deliveryMethod: '特快专递',
    paymentAmount: 0,
    items: [
      {
        id: 'I1007',
        sku: 'CAB-10KY',
        name: '10KV高压电缆',
        brand: '远东电缆',
        specification: '3*50',
        model: 'YJV22-8.7/15KV',
        quantity: 500,
        priceExclTax: 79.6,
        priceInclTax: 90.0,
        amountExclTax: 39800.0,
        amountInclTax: 45000.0
      }
    ],
    totalAmountExclTax: 39800.0,
    totalAmountInclTax: 45000.0
  },
  {
    id: 'O20240314008',
    salesOrderNo: 'SO202403140008',
    purchaserName: '浙江智造网络科技有限公司',
    recipientName: '吴十',
    recipientPhone: '13200132000',
    recipientAddress: '浙江省杭州市余杭区文一西路999号',
    salesAmount: 1800.0,
    settlementStatus: 'UNSETTLED',
    invoiceStatus: 'UNINVOICED',
    orderTime: '2024-03-14 09:10:00',
    status: 'RECEIVED',
    deliveryMethod: '顺丰速运',
    paymentAmount: 1800.0,
    items: [
      {
        id: 'I1008',
        sku: '3M-9002V',
        name: '3M 颗粒物防护口罩 KN95 工业粉尘防尘透气 头戴式',
        brand: '3M',
        specification: '25只/盒',
        model: '9002V',
        quantity: 10,
        priceExclTax: 159.3,
        priceInclTax: 180.0,
        amountExclTax: 1593.0,
        amountInclTax: 1800.0
      }
    ],
    totalAmountExclTax: 1593.0,
    totalAmountInclTax: 1800.0
  },
  {
    id: 'O20240313009',
    salesOrderNo: 'SO202403130009',
    purchaserName: '上海工业设备集团',
    recipientName: '郑十一',
    recipientPhone: '13100131000',
    recipientAddress: '上海市浦东新区张江高科技园区',
    salesAmount: 2450.0,
    settlementStatus: 'UNSETTLED',
    invoiceStatus: 'UNINVOICED',
    orderTime: '2024-03-13 14:20:00',
    status: 'RECEIVED',
    deliveryMethod: '京东物流',
    paymentAmount: 2450.0,
    items: [
      {
        id: 'I1009',
        sku: 'ST09015',
        name: '世达(SATA) 94件机修汽修棘轮扳手五金工具套装',
        brand: 'SATA',
        specification: '94件套',
        model: '09015',
        quantity: 5,
        priceExclTax: 433.6,
        priceInclTax: 490.0,
        amountExclTax: 2168.0,
        amountInclTax: 2450.0
      }
    ],
    totalAmountExclTax: 2168.0,
    totalAmountInclTax: 2450.0
  },
  {
    id: 'O20240312010',
    salesOrderNo: 'SO202403120010',
    purchaserName: '江苏机械制造厂',
    recipientName: '王十二',
    recipientPhone: '13000130000',
    recipientAddress: '江苏省苏州市工业园区',
    salesAmount: 890.0,
    settlementStatus: 'UNSETTLED',
    orderTime: '2024-03-12 10:15:00',
    status: 'PENDING_ACCEPT',
    deliveryMethod: '中通快递',
    paymentAmount: 890.0,
    items: [
      {
        id: 'I1010',
        sku: 'DS-TMW101',
        name: '海康威视 桌面式条码扫描器',
        brand: '海康威视',
        specification: '桌面型',
        model: 'DS-TMW101',
        quantity: 2,
        priceExclTax: 393.8,
        priceInclTax: 445.0,
        amountExclTax: 787.6,
        amountInclTax: 890.0
      }
    ],
    totalAmountExclTax: 787.6,
    totalAmountInclTax: 890.0
  },
  {
    id: 'O20240315003',
    salesOrderNo: 'SO202403150003',
    purchaserName: '苏州电子制造有限公司',
    recipientName: '赵六',
    recipientPhone: '13600136000',
    recipientAddress: '江苏省苏州市工业园区星湖街328号',
    salesAmount: 5600.0,
    settlementStatus: 'UNSETTLED',
    orderTime: '2024-03-15 09:30:00',
    status: 'CANCELLED',
    deliveryMethod: '-',
    paymentAmount: 5600.0,
    items: [
      {
        id: 'I1004',
        sku: 'FLUKE-15B+',
        name: '福禄克(Fluke) 15B+ 数字万用表',
        brand: 'Fluke',
        specification: '标准版',
        model: '15B+',
        quantity: 8,
        priceExclTax: 619.5,
        priceInclTax: 700.0,
        amountExclTax: 4956.0,
        amountInclTax: 5600.0,
        requirementDesc: '需提供校准证书'
      }
    ],
    totalAmountExclTax: 4956.0,
    totalAmountInclTax: 5600.0
  },
  {
    id: 'O20240314002',
    salesOrderNo: 'SO202403140002',
    purchaserName: '南京精密仪器厂',
    recipientName: '周七',
    recipientPhone: '13500135000',
    recipientAddress: '江苏省南京市江宁区',
    salesAmount: 1200.0,
    settlementStatus: 'SETTLED',
    orderTime: '2024-03-14 11:20:00',
    status: 'REFUNDED',
    deliveryMethod: '中通快递',
    paymentAmount: 1200.0,
    items: [
      {
        id: 'I1005',
        sku: 'MITUTOYO-500-196-30',
        name: '三丰(Mitutoyo) AOS绝对式防漏结构数显卡尺',
        brand: 'Mitutoyo',
        specification: '0-150mm',
        model: '500-196-30',
        quantity: 2,
        priceExclTax: 531.0,
        priceInclTax: 600.0,
        amountExclTax: 1062.0,
        amountInclTax: 1200.0
      }
    ],
    totalAmountExclTax: 1062.0,
    totalAmountInclTax: 1200.0
  },
  {
    id: 'O20240320005',
    salesOrderNo: 'SO202403200005',
    purchaserName: '北京光电科技有限公司',
    recipientName: '钱八',
    recipientPhone: '13888888888',
    recipientAddress: '北京市海淀区上地十街10号',
    salesAmount: 8500.0,
    settlementStatus: 'UNSETTLED',
    orderTime: '2024-03-20 10:15:00',
    status: 'PENDING_SHIP',
    deliveryMethod: '-',
    paymentAmount: 8500.0,
    items: [
      {
        id: 'I1006',
        sku: 'TEST-SKU-001',
        name: '激光测距仪',
        brand: 'Bosch',
        specification: '标准版',
        model: 'GLM 50',
        quantity: 10,
        shippedQuantity: 0,
        priceExclTax: 752.2,
        priceInclTax: 850.0,
        amountExclTax: 7522.0,
        amountInclTax: 8500.0,
      }
    ],
    totalAmountExclTax: 7522.0,
    totalAmountInclTax: 8500.0
  },
  {
    id: 'O20240319006',
    salesOrderNo: 'SO202403190006',
    purchaserName: '上海微电子制造有限公司',
    recipientName: '吴九',
    recipientPhone: '13999999999',
    recipientAddress: '上海市浦东新区张江高科技园区',
    salesAmount: 15600.0,
    settlementStatus: 'UNSETTLED',
    orderTime: '2024-03-19 14:30:00',
    status: 'PARTIAL_SHIPPED',
    deliveryMethod: '顺丰速运',
    paymentAmount: 15600.0,
    items: [
      {
        id: 'I1007',
        sku: 'TEST-SKU-002',
        name: '高精度示波器',
        brand: 'Tektronix',
        specification: '200MHz',
        model: 'TBS2000B',
        quantity: 2,
        shippedQuantity: 2, // 未发货数量为 0
        priceExclTax: 6902.6,
        priceInclTax: 7800.0,
        amountExclTax: 13805.2,
        amountInclTax: 15600.0,
      },
      {
        id: 'I1008',
        sku: 'TEST-SKU-003',
        name: '数字万用表',
        brand: 'Fluke',
        specification: '标准版',
        model: '17B+',
        quantity: 5,
        shippedQuantity: 1, // 未发货数量为 4
        priceExclTax: 619.5,
        priceInclTax: 700.0,
        amountExclTax: 3097.5,
        amountInclTax: 3500.0,
      },
      {
        id: 'I1009',
        sku: 'TEST-SKU-004',
        name: '绝缘电阻测试仪',
        brand: 'Fluke',
        specification: '1000V',
        model: '1508',
        quantity: 3,
        shippedQuantity: 0, // 未发货数量为 3
        priceExclTax: 1327.4,
        priceInclTax: 1500.0,
        amountExclTax: 3982.2,
        amountInclTax: 4500.0,
      }
    ],
    totalAmountExclTax: 20884.9,
    totalAmountInclTax: 23600.0
  },
  {
    id: 'O20240311011',
    salesOrderNo: 'SO202403110011',
    purchaserName: '浙江智造网络科技有限公司',
    recipientName: '张三',
    recipientPhone: '13800138000',
    recipientAddress: '浙江省杭州市余杭区文一西路999号',
    salesAmount: 3200.0,
    settlementStatus: 'SETTLED',
    invoiceStatus: 'INVOICED',
    orderTime: '2024-03-11 09:30:00',
    status: 'COMPLETED',
    deliveryMethod: '顺丰速运',
    paymentAmount: 3200.0,
    items: [
      {
        id: 'I1111',
        sku: '3M-9001V',
        name: '3M 颗粒物防护口罩 KN95 工业粉尘防尘透气',
        brand: '3M',
        specification: '25只/盒',
        model: '9001V',
        quantity: 20,
        priceExclTax: 139.8,
        priceInclTax: 158.0,
        amountExclTax: 2796.0,
        amountInclTax: 3160.0,
      }
    ],
    totalAmountExclTax: 2831.85,
    totalAmountInclTax: 3200.0,
    signOffSheetUrl: 'mock_uploaded_sign_off.png',
    signBy: '张三',
    signOffTime: '2024-03-12 10:15:22'
  },
  {
    id: 'O20240311012',
    salesOrderNo: 'SO202403110012',
    purchaserName: '上海工业设备集团',
    recipientName: '李四',
    recipientPhone: '13900139000',
    recipientAddress: '上海市浦东新区张江高科技园区',
    salesAmount: 4500.0,
    settlementStatus: 'SETTLED',
    invoiceStatus: 'UNINVOICED',
    orderTime: '2024-03-11 11:15:00',
    status: 'COMPLETED',
    deliveryMethod: '京东物流',
    paymentAmount: 4500.0,
    items: [
      {
        id: 'I1112',
        sku: 'BOSCH-GSR12V-30',
        name: '博世(BOSCH) 12V无刷手电钻',
        brand: 'Bosch',
        specification: '双电版',
        model: 'GSR 12V-30',
        quantity: 9,
        priceExclTax: 450.0,
        priceInclTax: 508.5,
        amountExclTax: 4050.0,
        amountInclTax: 4576.5,
      }
    ],
    totalAmountExclTax: 3982.3,
    totalAmountInclTax: 4500.0,
    signOffSheetUrl: 'mock_uploaded_sign_off.png',
    signBy: '李四',
    signOffTime: '2024-03-12 14:15:22'
  },
  {
    id: 'O20240311013',
    salesOrderNo: 'SO202403110013',
    purchaserName: '江苏机械制造厂',
    recipientName: '王五',
    recipientPhone: '13700137000',
    recipientAddress: '江苏省苏州市工业园区',
    salesAmount: 1200.0,
    settlementStatus: 'UNSETTLED',
    invoiceStatus: 'UNINVOICED',
    orderTime: '2024-03-11 13:45:00',
    status: 'COMPLETED',
    deliveryMethod: '中通快递',
    paymentAmount: 1200.0,
    items: [
      {
        id: 'I1113',
        sku: 'DS-TMW100',
        name: '海康威视 工业级无线条码扫描枪 二维码扫码器',
        brand: '海康威视',
        specification: '无线工业级',
        model: 'DS-TMW100',
        quantity: 3,
        priceExclTax: 305.3,
        priceInclTax: 345.0,
        amountExclTax: 915.9,
        amountInclTax: 1035.0,
      }
    ],
    totalAmountExclTax: 1061.9,
    totalAmountInclTax: 1200.0,
    signOffSheetUrl: 'mock_uploaded_sign_off.png',
    signBy: '王五',
    signOffTime: '2024-03-12 11:30:22'
  },
  {
    id: 'O20240311014',
    salesOrderNo: 'SO202403110014',
    purchaserName: '苏州电子制造有限公司',
    recipientName: '赵六',
    recipientPhone: '13600136000',
    recipientAddress: '江苏省苏州市工业园区星湖街328号',
    salesAmount: 5800.0,
    settlementStatus: 'UNSETTLED',
    invoiceStatus: 'UNINVOICED',
    orderTime: '2024-03-11 15:20:00',
    status: 'COMPLETED',
    deliveryMethod: '中通快递',
    paymentAmount: 5800.0,
    items: [
      {
        id: 'I1114',
        sku: 'FLUKE-15B+',
        name: '福禄克(Fluke) 15B+ 数字万用表',
        brand: 'Fluke',
        specification: '标准版',
        model: '15B+',
        quantity: 8,
        priceExclTax: 619.5,
        priceInclTax: 700.0,
        amountExclTax: 4956.0,
        amountInclTax: 5600.0,
      }
    ],
    totalAmountExclTax: 5132.7,
    totalAmountInclTax: 5800.0,
    signOffSheetUrl: 'mock_uploaded_sign_off.png',
    signBy: '赵六',
    signOffTime: '2024-03-12 16:40:22'
  }
];

export const orderService = {
  async getOrders(params?: { 
    salesOrderNo?: string; 
    purchaser?: string; 
    recipient?: string; 
    contact?: string; 
    settlementStatus?: string;
    status?: string;
    orderTimeStart?: string;
    orderTimeEnd?: string;
  }): Promise<Order[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...MOCK_ORDERS];
        
        if (params?.salesOrderNo) {
          result = result.filter(o => o.salesOrderNo.includes(params.salesOrderNo!));
        }
        if (params?.purchaser) {
          result = result.filter(o => o.purchaserName.includes(params.purchaser!));
        }
        if (params?.recipient) {
          result = result.filter(o => o.recipientName.includes(params.recipient!));
        }
        if (params?.contact) {
          result = result.filter(o => o.recipientPhone.includes(params.contact!));
        }
        if (params?.settlementStatus && params.settlementStatus !== 'ALL') {
          result = result.filter(o => o.settlementStatus === params.settlementStatus);
        }
        if (params?.status && params.status !== 'ALL') {
          result = result.filter(o => o.status === params.status);
        }
        if (params?.orderTimeStart) {
          result = result.filter(o => o.orderTime >= params.orderTimeStart!);
        }
        if (params?.orderTimeEnd) {
          result = result.filter(o => o.orderTime <= params.orderTimeEnd! + ' 23:59:59');
        }
        
        resolve(result);
      }, 500); // Simulate network delay
    });
  },

  async uploadSignOff(
    orderId: string, 
    signOffData: { signOffSheetUrl: string; signBy: string; signOffTime: string }
  ): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const order = MOCK_ORDERS.find(o => o.id === orderId);
        if (order) {
          order.signOffSheetUrl = signOffData.signOffSheetUrl;
          order.signBy = signOffData.signBy;
          order.signOffTime = signOffData.signOffTime;
        }
        resolve(true);
      }, 300);
    });
  }
};
