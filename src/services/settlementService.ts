import { SettlementOrder, SettlementStatus, InvoiceStatus } from '../models/settlement';

let MOCK_SETTLEMENTS: SettlementOrder[] = Array.from({ length: 20 }).map((_, index) => {
  const id = `S100${String(index + 1).padStart(2, '0')}`;
  const orderNum = 5008101 + index;
  const amount = 1000 + (index * 250) + (index * index * 10);
  const taxRate = 13;
  const taxAmount = amount * (taxRate / 100);
  const netAmount = amount - taxAmount;
  
  const statusPool = [
    SettlementStatus.PROCESSING, 
    SettlementStatus.COMPLETED, 
    SettlementStatus.PROCESSING, 
    SettlementStatus.COMPLETED, 
    SettlementStatus.PENDING
  ];
  const status = statusPool[index % statusPool.length];
  const invoiceStatus = status === SettlementStatus.COMPLETED
    ? (index % 4 === 0 ? InvoiceStatus.RED_INVOICED : InvoiceStatus.ISSUED)
    : InvoiceStatus.NOT_ISSUED;
  const invoiceNo = status === SettlementStatus.COMPLETED ? `FP${20240500 + index}` : undefined;
  const invoiceImage = status === SettlementStatus.COMPLETED ? `https://images.unsplash.com/photo-1554224155-16974cf4d262?q=80&w=2000&auto=format&fit=crop` : undefined;
  
  let afterSalesType: '退货退款' | '换货' | '维修' | undefined = undefined;
  if (index === 1 || index === 8 || index === 14) {
    afterSalesType = '退货退款';
  } else if (index === 3 || index === 10 || index === 17) {
    afterSalesType = '换货';
  } else if (index === 5 || index === 12 || index === 19) {
    afterSalesType = '维修';
  }

  return {
    id,
    settlementNo: `JS-20240512-${String(index + 1).padStart(3, '0')}`,
    customerName: index % 2 === 0 ? '北汽福田汽车股份有限公司' : '中国石油化工股份有限公司',
    totalAmount: amount,
    taxAmount: taxAmount,
    netAmount: netAmount,
    status,
    settlementTime: `2024-05-${String((index % 12) + 12).padStart(2, '0')} ${String(index % 24).padStart(2, '0')}:00:00`,
    invoiceTitle: '鹏龙天创',
    taxNo: index % 2 === 0 ? '91110000101111111X' : '91110000102222222Y',
    invoiceType: '增值税专用发票',
    bankName: index % 2 === 0 ? '中国工商银行北京分行' : '中国建设银行北京分行',
    bankAccount: index % 2 === 0 ? '6222021001001234567' : '6227001210010098765',
    bankAddress: index % 2 === 0 ? '北京市昌平区沙河镇' : '北京市朝阳区朝阳门北大街',
    invoiceStatus,
    invoiceNo,
    invoiceImage,
    afterSalesType,
    settlementQty: 0, // Will be calculated below
    orders: Array.from({ length: 2 + (index % 3) }).map((_, oIdx) => {
      const oOrderNo = `ORD-${orderNum}-${oIdx}`;
      const orderHasAfterSales = oIdx === 0 && !!afterSalesType;
      const products = Array.from({ length: 3 + (oIdx % 2) }).map((_, pIndex) => {
        const pAmount = 100 + (pIndex * 50);
        const pTaxRate = 13;
        const pTaxAmount = pAmount * (pTaxRate / 100);
        return {
          id: `SP-${index}-${oIdx}-${pIndex}`,
          name: `${index % 2 === 0 ? '工业级' : '专业型'}${['防护服', '安全鞋', '护目镜', '手套', '安全帽', '耳塞', '呼吸器', '洗眼器', '急救包', '指示牌', '灭火器', '绝缘垫'][pIndex % 12]}`,
          sku: `SKU-${2000 + index}-${oIdx}-${pIndex}`,
          brand: pIndex % 3 === 0 ? '3M' : pIndex % 3 === 1 ? '霍尼韦尔' : '代尔塔',
          category: '劳动防护',
          unit: '件',
          model: `MD-${index}-${oIdx}-${pIndex}`,
          spec: ['大号', '中号', '小号', '均码'][pIndex % 4],
          price: pAmount / 2,
          quantity: 2,
          amount: pAmount,
          taxRate: pTaxRate,
          taxAmount: pTaxAmount,
          netAmount: pAmount - pTaxAmount
        };
      });
      const oTotalAmount = products.reduce((sum, p) => sum + p.amount, 0);
      const oNetAmount = products.reduce((sum, p) => sum + p.netAmount, 0);
      
      return {
        orderNo: oOrderNo,
        orderDate: `2024-05-${String((index % 12) + 1).padStart(2, '0')}`,
        settlementTime: `2024-05-${String((index % 12) + 12).padStart(2, '0')} ${String(index % 24).padStart(2, '0')}:00:00`,
        netAmount: oNetAmount,
        totalAmount: oTotalAmount,
        products,
        hasAfterSales: orderHasAfterSales,
        afterSalesType: orderHasAfterSales ? afterSalesType : undefined
      };
    })
  };
});

// Calculate total amounts based on nested orders
MOCK_SETTLEMENTS = MOCK_SETTLEMENTS.map(s => {
  const totalAmount = s.orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const netAmount = s.orders.reduce((sum, o) => sum + o.netAmount, 0);
  const settlementQty = s.orders.reduce((sum, o) => {
    return sum + o.products.reduce((pSum, p) => pSum + p.quantity, 0);
  }, 0);
  const taxAmount = totalAmount - netAmount;
  const hasAfterSales = s.orders.some(o => o.hasAfterSales);
  return {
    ...s,
    totalAmount,
    netAmount,
    taxAmount,
    settlementQty,
    hasAfterSales
  };
});

export async function getSettlementOrders(): Promise<SettlementOrder[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...MOCK_SETTLEMENTS];
}

export async function getSettlementById(id: string): Promise<SettlementOrder | undefined> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return MOCK_SETTLEMENTS.find(s => s.id === id);
}

export async function confirmSettlementInvoice(orderIds: string[]): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  MOCK_SETTLEMENTS = MOCK_SETTLEMENTS.map(s => {
    if (orderIds.includes(s.id)) {
      return {
        ...s,
        status: SettlementStatus.PROCESSING
      };
    }
    return s;
  });
}

export async function rejectSettlementInvoice(orderIds: string[], reason: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  MOCK_SETTLEMENTS = MOCK_SETTLEMENTS.map(s => {
    if (orderIds.includes(s.id)) {
      return {
        ...s,
        status: SettlementStatus.REJECTED,
        rejectReason: reason
      };
    }
    return s;
  });
}

export async function deliverInvoice(orderIds: string[], invoiceData: { invoiceNo: string }): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 800));
  MOCK_SETTLEMENTS = MOCK_SETTLEMENTS.map(s => {
    if (orderIds.includes(s.id)) {
      return {
        ...s,
        status: SettlementStatus.COMPLETED,
        invoiceStatus: InvoiceStatus.ISSUED,
        invoiceNo: invoiceData.invoiceNo
      };
    }
    return s;
  });
}

export async function submitInvoice(orderIds: string[], invoiceData: { amount: number, invoiceTitle: string, taxNo: string }): Promise<void> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const targetOrders = MOCK_SETTLEMENTS.filter(s => orderIds.includes(s.id));
  if (targetOrders.length === 0) throw new Error('订单不存在');
  
  const totalAmount = targetOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Validation
  if (Math.abs(totalAmount - invoiceData.amount) > 0.01) {
    throw new Error('发票金额与订单总金额不一致');
  }
  
  for (const order of targetOrders) {
    if (order.invoiceTitle !== invoiceData.invoiceTitle) {
      throw new Error(`结算单 ${order.settlementNo} 的发票抬头与发票信息不一致`);
    }
    if (order.taxNo !== invoiceData.taxNo) {
      throw new Error(`结算单 ${order.settlementNo} 的纳税人识别号与发票信息不一致`);
    }
  }

  // Update status for all
  MOCK_SETTLEMENTS = MOCK_SETTLEMENTS.map(s => {
    if (orderIds.includes(s.id)) {
      return {
        ...s,
        status: SettlementStatus.COMPLETED,
        invoiceStatus: InvoiceStatus.ISSUED
      };
    }
    return s;
  });
}

export async function uploadRedInvoice(orderId: string, data: { invoiceNo: string; invoiceImage?: string }): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  MOCK_SETTLEMENTS = MOCK_SETTLEMENTS.map(s => {
    if (s.id === orderId) {
      if (s.invoiceStatus !== InvoiceStatus.ISSUED && s.invoiceStatus !== InvoiceStatus.EXCHANGED) {
        throw new Error('仅已开票或已换票状态可进行红冲操作');
      }
      return {
        ...s,
        invoiceStatus: InvoiceStatus.RED_INVOICED,
        invoiceNo: data.invoiceNo,
        invoiceImage: data.invoiceImage || s.invoiceImage
      };
    }
    return s;
  });
}

export async function exchangeInvoice(
  orderId: string, 
  data: { newInvoiceNo: string; reason: string; newInvoiceImage?: string }
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  MOCK_SETTLEMENTS = MOCK_SETTLEMENTS.map(s => {
    if (s.id === orderId) {
      if (s.invoiceStatus !== InvoiceStatus.ISSUED && s.invoiceStatus !== InvoiceStatus.EXCHANGED) {
        throw new Error('仅已开票或已换票状态可进行换票操作');
      }
      
      const originalInvoiceNo = s.exchangeDetail?.originalInvoiceNo || s.invoiceNo || '未知原发票号';
      
      return {
        ...s,
        invoiceStatus: InvoiceStatus.EXCHANGED,
        invoiceNo: data.newInvoiceNo,
        invoiceImage: data.newInvoiceImage || s.invoiceImage,
        exchangeDetail: {
          originalInvoiceNo,
          newInvoiceNo: data.newInvoiceNo,
          reason: data.reason,
          exchangeTime: new Date().toLocaleString('zh-CN', { hour12: false }),
          newInvoiceImage: data.newInvoiceImage || s.invoiceImage
        }
      };
    }
    return s;
  });
}

export async function uploadExchangeRedInvoice(
  orderId: string,
  data: { redTargetInvoiceNo: string; redInvoiceNo: string; redInvoiceImage?: string }
): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  MOCK_SETTLEMENTS = MOCK_SETTLEMENTS.map(s => {
    if (s.id === orderId) {
      if (!s.exchangeDetail) {
        throw new Error('该结算单暂未进行换票，无法上传换票红票');
      }
      return {
        ...s,
        exchangeDetail: {
          ...s.exchangeDetail,
          redTargetInvoiceNo: data.redTargetInvoiceNo,
          redInvoiceNo: data.redInvoiceNo,
          redInvoiceImage: data.redInvoiceImage,
          redInvoiceTime: new Date().toLocaleString('zh-CN', { hour12: false })
        }
      };
    }
    return s;
  });
}
