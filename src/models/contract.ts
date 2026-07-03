export interface Contract {
  id: string;
  contractNo: string;
  name: string;
  type: '框架合同' | '补充协议' | string;
  signingDate: string; // YYYY-MM-DD
  validityPeriod: string; // YYYY-MM-DD 至 YYYY-MM-DD
  status: '待签署' | '履约中' | '即将到期' | '已到期' | string;
  tianchuangContact: string;
  children?: Contract[];
}
