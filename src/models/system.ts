export interface Account {
  id: string;
  name: string;
  phone: string;
  roleId: string;
  roleName: string;
  orgId: string;
  orgName: string;
  serviceCustomer?: string;
  status: '正常' | '停用' | string;
  createTime: string;
}

export interface Organization {
  id: string;
  name: string;
  parentId: string | null;
  createTime: string;
  status: '启用' | '停用' | string;
  order?: number;
}

export interface Role {
  id: string;
  name: string;
  code: string;
  description: string;
  status: '正常' | '停用' | string;
  createTime: string;
}
