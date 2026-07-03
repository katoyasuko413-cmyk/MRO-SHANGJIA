import { FulfillmentOrder, FulfillmentStatus } from '../models/fulfillment';

const generateMockData = (): FulfillmentOrder[] => {
  const data: FulfillmentOrder[] = [];
  const companies = ['顺丰速运', '中通快递', '京东物流', '圆通速递'];
  const statusPool = Object.values(FulfillmentStatus).filter(s => s !== FulfillmentStatus.EXCEPTION);
  
  for (let i = 1; i <= 50; i++) {
    const isSelfDelivery = i % 5 === 0;
    const status = isSelfDelivery 
      ? (i % 2 === 0 ? FulfillmentStatus.IN_TRANSIT : FulfillmentStatus.SIGNED)
      : statusPool[i % statusPool.length];
      
    data.push({
      id: `F${String(i).padStart(4, '0')}`,
      trackingNo: isSelfDelivery ? `京A12345` : `SF${1234567890 + i}`,
      productionTime: `2024-05-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`,
      logisticsCompany: isSelfDelivery ? '自配送' : companies[i % companies.length],
      isSelfDelivery,
      salesOrderNo: `S0202405${String(i).padStart(4, '0')}`,
      consignee: `张三${i}`,
      consigneePhone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
      shippingAddress: `北京市朝阳区望京街道${i}号院`,
      status,
      ...(isSelfDelivery ? {
        deliverer: `李四${i}`,
        delivererPhone: `139${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`
      } : {})
    });
  }
  return data;
};

let mockData = generateMockData();

export const getFulfillments = async (filters?: any): Promise<FulfillmentOrder[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...mockData];
      if (filters) {
        if (filters.status && filters.status !== 'ALL') {
          filtered = filtered.filter(f => f.status === filters.status);
        }
        if (filters.trackingNo) {
          filtered = filtered.filter(f => f.trackingNo.toLowerCase().includes(filters.trackingNo.toLowerCase()));
        }
        if (filters.salesOrderNo) {
          filtered = filtered.filter(f => f.salesOrderNo.toLowerCase().includes(filters.salesOrderNo.toLowerCase()));
        }
        if (filters.consignee) {
          filtered = filtered.filter(f => f.consignee.toLowerCase().includes(filters.consignee.toLowerCase()));
        }
        if (filters.logisticsCompany) {
          filtered = filtered.filter(f => f.logisticsCompany === filters.logisticsCompany);
        }
        if (filters.startDate && filters.endDate) {
          filtered = filtered.filter(f => {
            const time = f.productionTime.split(' ')[0];
            return time >= filters.startDate && time <= filters.endDate;
          });
        }
      }
      // sort by id desc
      filtered.reverse();
      resolve(filtered);
    }, 400); // simulate network delay
  });
};

export const confirmReceiveCode = async (id: string, code: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (code && code.length > 0 && /^\d+$/.test(code)) {
        const order = mockData.find(o => o.id === id);
        if (order) {
          order.status = FulfillmentStatus.SIGNED;
          resolve(true);
        } else {
          reject(new Error('订单不存在'));
        }
      } else {
        reject(new Error('收货码无效，请输入纯数字'));
      }
    }, 400);
  });
};
