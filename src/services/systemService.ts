import { Account, Organization, Role } from '../models/system';

// Mock Data
export const mockAccounts: Account[] = [
  { id: '1', name: '系统管理员', phone: '13800138000', roleId: '1', roleName: '超级管理员', orgId: '1', orgName: '天创集团', serviceCustomer: '客户A', status: '正常', createTime: '2023-01-01 10:00:00' },
  { id: '2', name: '张三', phone: '13900139000', roleId: '2', roleName: '业务运营', orgId: '2', orgName: '运营部', serviceCustomer: '客户B', status: '正常', createTime: '2023-05-15 14:30:00' },
  { id: '3', name: '李四', phone: '13700137000', roleId: '3', roleName: '财务审批', orgId: '3', orgName: '财务部', serviceCustomer: '客户C', status: '停用', createTime: '2023-08-22 09:15:00' },
  { id: '4', name: '王五', phone: '13600136000', roleId: '2', roleName: '业务运营', orgId: '2', orgName: '运营部', serviceCustomer: '客户A', status: '正常', createTime: '2024-01-10 11:45:00' },
  { id: '5', name: '赵六', phone: '13500135000', roleId: '4', roleName: '技术支持', orgId: '4', orgName: '技术部', serviceCustomer: '客户B', status: '正常', createTime: '2024-02-28 16:20:00' }
];

export const mockOrgs: Organization[] = [
  { id: '1', name: '天创集团', parentId: null, status: '启用', createTime: '2023-01-01 10:00:00', order: 100 },
  { id: '2', name: '运营部', parentId: '1', status: '启用', createTime: '2023-01-05 10:00:00', order: 90 },
  { id: '3', name: '财务部', parentId: '1', status: '启用', createTime: '2023-01-05 10:00:00', order: 95 },
  { id: '4', name: '技术部', parentId: '1', status: '启用', createTime: '2023-01-05 10:00:00', order: 80 },
  { id: '6', name: '市场部', parentId: '1', status: '启用', createTime: '2023-02-15 10:00:00', order: 85 },
  { id: '9', name: '人事部', parentId: '1', status: '停用', createTime: '2023-03-10 10:00:00', order: 75 },
  { id: '8', name: '活动运营组', parentId: '2', status: '启用', createTime: '2023-02-01 10:00:00', order: 70 },
  { id: '7', name: '内容运营组', parentId: '2', status: '启用', createTime: '2023-02-01 10:00:00', order: 60 },
  { id: '5', name: '平台运营组', parentId: '2', status: '启用', createTime: '2023-02-01 10:00:00', order: 50 },
];

export const mockRoles: Role[] = [
  { id: '1', name: '超级管理员', code: 'SUPER_ADMIN', description: '拥有系统所有权限', status: '正常', createTime: '2023-01-01 10:00:00' },
  { id: '2', name: '业务运营', code: 'OP_STAFF', description: '负责日常商品、订单、售后等业务管理', status: '正常', createTime: '2023-01-05 10:00:00' },
  { id: '3', name: '财务审批', code: 'FIN_AUDITOR', description: '负责结算管理与财务审批', status: '正常', createTime: '2023-01-05 10:00:00' },
  { id: '4', name: '技术支持', code: 'TECH_SUPPORT', description: '负责系统配置、日志查看等', status: '正常', createTime: '2023-01-05 10:00:00' },
];

// Mock Service API
export const systemService = {
  getAccounts: async (): Promise<Account[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockAccounts]), 500));
  },
  getOrgs: async (): Promise<Organization[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockOrgs]), 500));
  },
  updateOrgsOrder: async (orders: {id: string, order: number}[]): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      orders.forEach(o => {
        const org = mockOrgs.find(mo => mo.id === o.id);
        if (org) {
          org.order = o.order;
        }
      });
      resolve();
    }, 500));
  },
  updateOrgStatus: async (id: string, status: string): Promise<void> => {
    return new Promise((resolve) => setTimeout(() => {
      const org = mockOrgs.find(mo => mo.id === id);
      if (org) {
        org.status = status;
      }
      resolve();
    }, 500));
  },
  getRoles: async (): Promise<Role[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...mockRoles]), 500));
  }
};
