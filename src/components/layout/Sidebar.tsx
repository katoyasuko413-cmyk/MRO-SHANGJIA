import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Headset, 
  Truck, 
  Wallet, 
  Store, 
  BarChart2, 
  Settings,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  FileSignature,
  Handshake
} from 'lucide-react';

type MenuItem = {
  path?: string;
  name: string;
  icon: React.ElementType;
  children?: { path: string; name: string }[];
};

const MENU_ITEMS: MenuItem[] = [
  { path: '/dashboard', name: '工作台', icon: LayoutDashboard },
  { 
    name: '店铺管理', 
    icon: Store, 
    children: [
      { path: '/store/info', name: '店铺信息' },
      { path: '/store/brand-records', name: '品牌提交记录' },
      { path: '/qualification', name: '资质管理' }
    ]
  },
  { path: '/product', name: '商品管理', icon: Package },
  { path: '/order', name: '订单管理', icon: ShoppingCart },
  { 
    name: '售后管理', 
    icon: Headset,
    children: [
      { path: '/after-sales/orders', name: '售后订单' },
      { path: '/after-sales/addresses', name: '售后地址' }
    ]
  },
  { path: '/fulfillment', name: '物流管理', icon: Truck },
  { 
    name: '结算管理', 
    icon: Wallet,
    children: [
      { path: '/settlement/invoice', name: '开票清单' },
      { path: '/settlement/list', name: '发票管理' }
    ]
  },
  { path: '/data', name: '数据中心', icon: BarChart2 },
  { path: '/contract', name: '合同管理', icon: FileSignature },
  { 
    name: '系统管理', 
    icon: Settings, 
    children: [
      { path: '/account', name: '账号管理' },
      { path: '/org', name: '组织管理' },
      { path: '/role', name: '角色管理' },
    ]
  }
];

export default function Sidebar() {
  const isQualified = localStorage.getItem('isQualified') === 'true';
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    '系统管理': location.pathname.startsWith('/account') || location.pathname.startsWith('/org') || location.pathname.startsWith('/role'),
    '店铺管理': location.pathname.startsWith('/store') || location.pathname.startsWith('/qualification'),
    '结算管理': location.pathname.startsWith('/settlement'),
    '售后管理': location.pathname.startsWith('/after-sales')
  });

  useEffect(() => {
    if (location.pathname.startsWith('/account') || location.pathname.startsWith('/org') || location.pathname.startsWith('/role')) {
      if (!isCollapsed) {
        setOpenMenus(prev => ({ ...prev, '系统管理': true }));
      }
    }
    if (location.pathname.startsWith('/store') || location.pathname.startsWith('/qualification')) {
      if (!isCollapsed) {
        setOpenMenus(prev => ({ ...prev, '店铺管理': true }));
      }
    }
    if (location.pathname.startsWith('/settlement')) {
      if (!isCollapsed) {
        setOpenMenus(prev => ({ ...prev, '结算管理': true }));
      }
    }
    if (location.pathname.startsWith('/after-sales')) {
      if (!isCollapsed) {
        setOpenMenus(prev => ({ ...prev, '售后管理': true }));
      }
    }
  }, [location.pathname, isCollapsed]);

  const toggleMenu = (name: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenMenus(prev => ({ ...prev, [name]: true }));
      return;
    }
    setOpenMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };
  
  const currentMenuItems = isQualified 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.name === '工作台' || item.name === '合同管理');

  return (
    <div className={`bg-[#0F172A] min-h-screen text-slate-300 flex flex-col font-sans transition-all duration-300 ease-in-out shrink-0 ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className={`h-14 flex items-center border-b border-slate-800 shrink-0 transition-all duration-300 ${isCollapsed ? 'justify-center flex-col gap-1 py-1' : 'px-5 justify-between'}`}>
        {!isCollapsed ? (
          <>
            <div className="flex items-center overflow-hidden">
              <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-lg shrink-0 object-contain" />
              <span className="text-xl font-bold tracking-tight text-white whitespace-nowrap ml-3">天创MRO商城</span>
            </div>
            <button 
              onClick={() => setIsCollapsed(true)} 
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
              title="收起侧边栏"
            >
              <PanelLeftClose size={18} />
            </button>
          </>
        ) : (
          <button 
            onClick={() => setIsCollapsed(false)} 
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-800 transition-colors shadow-sm overflow-hidden"
            title="展开侧边栏"
          >
            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
          </button>
        )}
      </div>
      
      <div className="flex-1 py-6 overflow-y-auto overflow-x-hidden sidebar-scroll">
        <nav className={`space-y-2 ${isCollapsed ? 'px-3' : 'px-4'}`}>
          {currentMenuItems.map((item) => {
            if (item.children) {
              const isOpen = openMenus[item.name] && !isCollapsed;
              const isChildActive = item.children.some(child => location.pathname.startsWith(child.path));
              return (
                <div key={item.name} className="space-y-1">
                  <button
                    onClick={() => toggleMenu(item.name)}
                    title={isCollapsed ? item.name : undefined}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center p-3' : 'justify-between px-4 py-3'} rounded-xl transition-all duration-200 font-medium border border-transparent ${
                      isChildActive && !isOpen
                        ? 'text-white bg-slate-800/80'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                      <item.icon className={isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      isOpen ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />
                    )}
                  </button>
                  {isOpen && !isCollapsed && (
                    <div className="pl-11 pr-2 py-1 space-y-1">
                      {item.children.map(child => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `block px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium border ${
                              isActive
                                ? 'bg-blue-500/10 text-blue-500 font-bold border-blue-500/20'
                                : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
                            }`
                          }
                        >
                          {child.name}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path!}
                title={isCollapsed ? item.name : undefined}
                className={({ isActive }) =>
                  `flex items-center ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl transition-all duration-200 font-medium border ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-500 font-bold border-blue-500/20'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className={isCollapsed ? 'w-6 h-6' : 'w-5 h-5'} />
                {!isCollapsed && <span>{item.name}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className={`p-4 border-t border-slate-800 shrink-0 transition-opacity ${isCollapsed ? 'opacity-0 hidden' : 'opacity-100'}`}>
        <div className="text-xs text-slate-500 font-medium tracking-widest uppercase">商家端 v2.0</div>
      </div>
    </div>
  );
}
