import { Product } from '../models/product';

const MOCK_PRODUCTS: Product[] = [
  {
    id: 'P10001',
    sku: 'Exvrir3HMI',
    spu: 'SPU-Exvrir3HMI',
    spuStatus: 'BOUND',
    supplierSku: 'ZBCY-2509-31-B',
    name: '喷漆防护眼镜',
    contractName: '-',
    brand: '3M',
    specification: '-',
    model: '防雾',
    mainCategory: '安全防护',
    scene: '车间',
    purchasePriceExclTax: 28.318584,
    purchasePriceInclTax: 32.0,
    taxRate: 13,
    taxCode: '1090100000000000000',
    leadTimeDays: 3,
    moq: 1,

    price: 33.6,
    stock: 1250,
    salesStatus: 'ON_SALE',
    auditStatus: 'APPROVED',
    displayStatus: 'DISPLAY',
    enjoyedAreas: ['江苏省', '浙江省', '上海市'],
    salesAreas: ['全国'],
    updatedAt: '2024-03-20 10:30',
    image: 'https://i.imgs.ovh/2026/05/09/a528d4c62a4e992f92ecd5d52a2e9524.jpg',
    images: [
      'https://i.imgs.ovh/2026/05/09/a528d4c62a4e992f92ecd5d52a2e9524.jpg',
      'https://i.imgs.ovh/2026/05/09/fe0baee0f128e3d46c359710db4a6cae.jpg'
    ],
    detailImages: [
      'https://i.imgs.ovh/2026/05/09/fdabf62f05e0a3982410b6132b606fa0.jpg',
      'https://i.imgs.ovh/2026/05/09/a3939d117f9927a82a3a9e31979ed022.jpg',
      'https://i.imgs.ovh/2026/05/09/d40296790cd3cdf4ad61b0892841b17d.jpg'
    ],
  },
  {
    id: 'P10002',
    sku: '3M-9001V',
    spu: 'SPU-3M-9000',
    spuStatus: 'BINDING',
    supplierSku: 'SUP-3M-002',
    name: '3M 颗粒物防护口罩 KN95 工业粉尘防尘透气',
    contractName: '3M防护用品年度合同',
    brand: '3M',
    specification: '25只/盒',
    model: '9001V',
    mainCategory: '安防劳保',
    scene: '办公',
    purchasePriceExclTax: 139.8,
    purchasePriceInclTax: 158.0,
    taxRate: 13,
    taxCode: '1090100000000000000',
    leadTimeDays: 5,
    moq: 10,

    price: 158.0,
    stock: 500,
    salesStatus: 'ON_SALE',
    auditStatus: 'APPROVED',
    displayStatus: 'DISPLAY',
    updatedAt: '2024-03-19 14:20',
    image: 'bg-slate-100',
  },
  {
    id: 'P10003',
    sku: 'ST09014',
    spu: '',
    spuStatus: 'UNBOUND',
    supplierSku: 'SUP-SATA-003',
    name: '世达(SATA) 120件机修汽修棘轮扳手五金工具套装',
    contractName: '世达工具采买协议',
    brand: 'SATA',
    specification: '120件套',
    model: '09014',
    mainCategory: '手动工具',
    scene: '冲压',
    purchasePriceExclTax: 795.5,
    purchasePriceInclTax: 899.0,
    taxRate: 13,
    taxCode: '1090100000000000000',
    leadTimeDays: 7,
    moq: 1,

    price: 899.0,
    stock: 45,
    salesStatus: 'OFF_SALE',
    auditStatus: 'PENDING_AUDIT',
    displayStatus: 'HIDDEN',
    updatedAt: '2024-03-21 09:15',
    image: 'bg-green-100',
  },
  {
    id: 'P10004',
    sku: 'DS-TMW100',
    spu: '',
    spuStatus: 'UNBOUND',
    supplierSku: 'SUP-HIK-004',
    name: '海康威视 工业级无线条码扫描枪 二维码扫码器',
    contractName: '海康电子设备协议',
    brand: '海康威视',
    specification: '无线工业级',
    model: 'DS-TMW100',
    mainCategory: '工控自动化',
    scene: '',
    purchasePriceExclTax: 305.3,
    purchasePriceInclTax: 345.0,
    taxRate: 13,
    taxCode: '1090100000000000000',
    leadTimeDays: 14,
    moq: 5,

    price: 345.0,
    stock: 0,
    salesStatus: 'OFF_SALE',
    auditStatus: 'AUDIT_REJECTED',
    displayStatus: 'HIDDEN',
    rejectReason: '商品图片不够清晰，请重新上传白底高清主图',
    updatedAt: '2024-03-21 11:45',
    image: 'bg-blue-100',
  },
  {
    id: 'P10005',
    sku: 'UT89X',
    spu: 'SPU-UNI-UT89',
    spuStatus: 'BOUND',
    supplierSku: 'SUP-UNI-005',
    name: '优利德(UNI-T) 数字万用表 高精度防烧电工表',
    contractName: '优利德仪器集采',
    brand: '优利德',
    specification: '高精度',
    model: 'UT89X',
    mainCategory: '仪器仪表',
    scene: '总装',
    purchasePriceExclTax: 175.2,
    purchasePriceInclTax: 198.0,
    taxRate: 13,
    taxCode: '1090100000000000000',
    leadTimeDays: 2,
    moq: 1,

    price: 198.0,
    stock: 210,
    salesStatus: 'ON_SALE',
    auditStatus: 'APPROVED',
    displayStatus: 'DISPLAY',
    updatedAt: '2024-03-18 16:00',
    image: 'bg-purple-100',
  }
];

export const productService = {
  async getProducts(params?: { search?: string; auditStatus?: string; salesStatus?: string; spuStatus?: string }): Promise<Product[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...MOCK_PRODUCTS];
        
        if (params?.search) {
          result = result.filter(p => 
            p.name.includes(params.search!) || p.sku.includes(params.search!)
          );
        }
        
        if (params?.auditStatus && params.auditStatus !== 'ALL') {
          result = result.filter(p => p.auditStatus === params.auditStatus);
        }
        
        if (params?.salesStatus && params.salesStatus !== 'ALL') {
          result = result.filter(p => p.salesStatus === params.salesStatus);
        }

        if (params?.spuStatus && params.spuStatus !== 'ALL') {
          result = result.filter(p => p.spuStatus === params.spuStatus);
        }
        
        resolve(result);
      }, 500); // Simulate network delay
    });
  }
};
