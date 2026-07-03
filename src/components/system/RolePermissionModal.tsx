import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Role } from '../../models/system';

interface RolePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (roleId: string, permissions: string[]) => void;
  role: Role | null;
}

interface ActionPermission {
  id: string;
  name: string;
}

interface ChildPermission {
  id: string;
  name: string;
  actions?: ActionPermission[];
}

interface MenuPermission {
  id: string;
  name: string;
  children?: ChildPermission[];
  actions?: ActionPermission[];
}

const PERMISSIONS: MenuPermission[] = [
  { id: 'workspace', name: '工作台' },
  {
    id: 'store',
    name: '店铺管理',
    children: [
      { id: 'store-info', name: '店铺信息', actions: [{ id: 'store-edit', name: '编辑店铺' }] },
      { id: 'store-brands', name: '品牌提交记录', actions: [{ id: 'brand-apply', name: '申请品牌' }, { id: 'brand-withdraw', name: '撤销申请' }] },
      { id: 'store-qualification', name: '资质管理', actions: [{ id: 'qual-update', name: '更新资质' }] },
    ]
  },
  {
    id: 'product',
    name: '商品管理',
    children: [
      { 
        id: 'product-list', 
        name: '商品列表',
        actions: [
          { id: 'prod-add', name: '新增商品' },
          { id: 'prod-edit', name: '编辑商品' },
          { id: 'prod-delete', name: '删除商品' },
          { id: 'prod-import', name: '批量导入' },
          { id: 'prod-export', name: '批量导出' },
          { id: 'prod-price', name: '改价' },
          { id: 'prod-stock', name: '调整库存' },
          { id: 'prod-status', name: '上解冻' }
        ]
      },
    ]
  },
  {
    id: 'order',
    name: '订单管理',
    children: [
      { 
        id: 'order-list', 
        name: '订单列表',
        actions: [
          { id: 'order-view', name: '查看详情' },
          { id: 'order-deliver', name: '发货' },
          { id: 'order-export', name: '导出订单' }
        ]
      },
    ]
  },
  { 
    id: 'contract', 
    name: '合同管理', 
    actions: [
      { id: 'contract-view', name: '查看合同' }, 
      { id: 'contract-sign', name: '签署合同' },
      { id: 'contract-download', name: '下载合同' }
    ] 
  },
  { id: 'data', name: '数据流向' },
  {
    id: 'system',
    name: '系统管理',
    children: [
      { 
        id: 'system-org', 
        name: '组织管理',
        actions: [
          { id: 'org-add', name: '新增组织' },
          { id: 'org-edit', name: '编辑组织' },
          { id: 'org-disabled', name: '停用/启用' },
          { id: 'org-delete', name: '删除组织' }
        ]
      },
      { 
        id: 'system-account', 
        name: '账号管理',
        actions: [
          { id: 'acc-add', name: '新增账号' },
          { id: 'acc-edit', name: '编辑账号' },
          { id: 'acc-disabled', name: '停用/启用' },
          { id: 'acc-reset', name: '重置密码' }
        ]
      },
      { 
        id: 'system-role', 
        name: '角色管理',
        actions: [
          { id: 'role-add', name: '新增角色' },
          { id: 'role-edit', name: '编辑角色' },
          { id: 'role-perm', name: '配置权限' },
          { id: 'role-delete', name: '删除角色' }
        ]
      },
    ]
  }
];

export function RolePermissionModal({ isOpen, onClose, onSuccess, role }: RolePermissionModalProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen && role) {
      const getInitialPerms = () => {
        let perms: string[] = [];
        if (role.code === 'SUPER_ADMIN') {
          const collectAll = (nodes: any[]) => {
            nodes.forEach(n => {
              perms.push(n.id);
              if (n.children) collectAll(n.children);
              if (n.actions) collectAll(n.actions);
            });
          };
          collectAll(PERMISSIONS);
        } else {
          perms = ['workspace', 'store', 'store-info', 'store-edit', 'product', 'product-list', 'prod-view'];
        }
        return perms;
      };
      
      setSelectedIds(new Set(getInitialPerms()));
    } else {
      setSelectedIds(new Set());
    }
  }, [isOpen, role]);

  if (!isOpen || !role) return null;

  const getAllDescendants = (id: string, nodes: any[] = PERMISSIONS): string[] => {
    let result: string[] = [];
    const findNodeAndCollect = (list: any[]) => {
      for (const node of list) {
        if (node.id === id) {
          const collect = (n: any) => {
            if (n.children) n.children.forEach((c: any) => { result.push(c.id); collect(c); });
            if (n.actions) n.actions.forEach((a: any) => { result.push(a.id); collect(a); });
          };
          collect(node);
          return true;
        } else {
          if (node.children && findNodeAndCollect(node.children)) return true;
          if (node.actions && findNodeAndCollect(node.actions)) return true;
        }
      }
      return false;
    };
    findNodeAndCollect(nodes);
    return result;
  };

  const getAllAncestors = (id: string, nodes: any[] = PERMISSIONS): string[] => {
    let result: string[] = [];
    const findPath = (list: any[], currentPath: string[]): boolean => {
      for (const node of list) {
        if (node.id === id) {
          result = [...currentPath];
          return true;
        }
        if (node.children && findPath(node.children, [...currentPath, node.id])) return true;
        if (node.actions && findPath(node.actions, [...currentPath, node.id])) return true;
      }
      return false;
    };
    findPath(nodes, []);
    return result;
  };

  const handleToggle = (id: string) => {
    const newSelected = new Set(selectedIds);
    const isSelected = newSelected.has(id);

    if (isSelected) {
      newSelected.delete(id);
      getAllDescendants(id).forEach(d => newSelected.delete(d));
    } else {
      newSelected.add(id);
      getAllDescendants(id).forEach(d => newSelected.add(d));
      getAllAncestors(id).forEach(a => newSelected.add(a));
    }

    setSelectedIds(newSelected);
  };

  const handleSubmit = () => {
    onSuccess(role.id, Array.from(selectedIds));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-slate-800">配置权限</h3>
            <p className="text-xs text-slate-500 mt-1">当前角色：<span className="font-semibold text-slate-700">{role.name}</span></p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-600">
                <tr>
                  <th className="px-6 py-3 font-medium w-48 border-r border-slate-100">一级菜单</th>
                  <th className="px-6 py-3 font-medium">子菜单/页面及操作权限</th>
                </tr>
              </thead>
              <tbody>
                {PERMISSIONS.map((parent, idx) => {
                  const hasChildren = parent.children && parent.children.length > 0;
                  const hasActions = parent.actions && parent.actions.length > 0;
                  
                  const getSubNodeIds = (node: any): string[] => {
                    let ids: string[] = [];
                    if (node.children) {
                      node.children.forEach((c: any) => { ids.push(c.id); ids = ids.concat(getSubNodeIds(c)); });
                    }
                    if (node.actions) {
                      node.actions.forEach((a: any) => { ids.push(a.id); ids = ids.concat(getSubNodeIds(a)); });
                    }
                    return ids;
                  };

                  const allDescIds = getSubNodeIds(parent);
                  const isParentSelected = selectedIds.has(parent.id);
                  const isIndeterminate = allDescIds.length > 0 && allDescIds.some(id => selectedIds.has(id)) && !allDescIds.every(id => selectedIds.has(id));
                  
                  return (
                    <tr key={parent.id} className={`border-b border-slate-100 ${idx === PERMISSIONS.length - 1 ? 'border-none' : ''}`}>
                      <td className="px-6 py-4 align-top border-r border-slate-100 bg-slate-50/30">
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox"
                            checked={isParentSelected}
                            ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                            onChange={() => handleToggle(parent.id)}
                            className="w-4 h-4 text-blue-500 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="font-medium text-slate-800 group-hover:text-blue-600 transition-colors">{parent.name}</span>
                        </label>
                      </td>
                      <td className="px-6 py-4">
                        {hasChildren ? (
                          <div className="flex flex-col gap-y-6">
                            {parent.children!.map(child => {
                               const childDescIds = getSubNodeIds(child);
                               const isChildIndeterminate = childDescIds.length > 0 && childDescIds.some(id => selectedIds.has(id)) && !childDescIds.every(id => selectedIds.has(id));
                               
                               return (
                                <div key={child.id} className="flex flex-col gap-y-3 relative">
                                  <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                      type="checkbox"
                                      checked={selectedIds.has(child.id)}
                                      ref={el => { if (el) el.indeterminate = isChildIndeterminate; }}
                                      onChange={() => handleToggle(child.id)}
                                      className="w-4 h-4 text-blue-500 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                                    />
                                    <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{child.name}</span>
                                  </label>
                                  {child.actions && child.actions.length > 0 && (
                                    <div className="flex flex-wrap gap-x-6 gap-y-3 pl-7">
                                      {child.actions.map(action => (
                                        <label key={action.id} className="flex items-center gap-2 cursor-pointer group">
                                          <input 
                                            type="checkbox"
                                            checked={selectedIds.has(action.id)}
                                            onChange={() => handleToggle(action.id)}
                                            className="w-4 h-4 text-blue-400 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                                          />
                                          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{action.name}</span>
                                        </label>
                                      ))}
                                    </div>
                                  )}
                                </div>
                               );
                            })}
                          </div>
                        ) : hasActions ? (
                          <div className="flex flex-wrap gap-x-6 gap-y-3 pl-2">
                            {parent.actions!.map(action => (
                              <label key={action.id} className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                  type="checkbox"
                                  checked={selectedIds.has(action.id)}
                                  onChange={() => handleToggle(action.id)}
                                  className="w-4 h-4 text-blue-400 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                                />
                                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{action.name}</span>
                              </label>
                            ))}
                          </div>
                        ) : (
                          <div className="pl-2">
                            <span className="text-slate-400 text-xs italic">无下级权限节点</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-white rounded-b-2xl">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            取消
          </button>
          <button 
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200"
          >
            保存配置
          </button>
        </div>
      </div>
    </div>
  );
}

