import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, CheckCircle, AlertCircle, Info, X, ChevronDown, Building2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface EnterpriseQualification {
  id: string;
  name: string;
  status: 'reviewing' | 'certified' | 'rejected';
  submitDate: string;
}

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [enterprises, setEnterprises] = useState<EnterpriseQualification[]>([]);
  const [currentEnterpriseId, setCurrentEnterpriseId] = useState<string>('');

  // Mock notifications for qualification and product review scenarios
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'qualification_success',
      title: '企业资质审核通过',
      content: '您的企业资质「天创工业商城」已通过平台审核，现在可以发布商品了。',
      time: '10分钟前',
      isRead: false,
      link: '/qualification',
    },
    {
      id: '2',
      type: 'product_rejected',
      title: '商品上架审核退回',
      content: '您提交的商品「重型工业绝缘手套」因主图不清晰被退回，请修改后重新提交。',
      time: '2小时前',
      isRead: false,
      link: '/product',
    },
    {
      id: '3',
      type: 'qualification_warning',
      title: '即将过期资质提醒',
      content: '您的「特种行业经营许可证」将于30天后过期，请尽快更新。',
      time: '1天前',
      isRead: true,
      link: '/qualification',
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    // Load enterprises
    const saved = localStorage.getItem('enterprises');
    if (saved) {
      const data = JSON.parse(saved);
      setEnterprises(data);
      const activeId = localStorage.getItem('activeEnterpriseId');
      if (activeId && data.some((e: any) => e.id === activeId)) {
        setCurrentEnterpriseId(activeId);
      } else if (data.length > 0) {
        setCurrentEnterpriseId(data[0].id);
        localStorage.setItem('activeEnterpriseId', data[0].id);
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.pathname]);

  const handleLogout = () => {
    // In a real app, clear auth tokens here
    navigate('/login');
  };

  const switchEnterprise = (id: string, name: string) => {
    setCurrentEnterpriseId(id);
    localStorage.setItem('activeEnterpriseId', id);
    setIsUserMenuOpen(false);
    // Reload the page or navigate to reset data for the new enterprise
    window.location.reload();
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (link: string) => {
    setIsNotificationOpen(false);
    navigate(link);
  };

  const getNotificationIcon = (type: string) => {
    if (type.includes('success')) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (type.includes('warning') || type.includes('rejected')) return <AlertCircle className="w-5 h-5 text-blue-500" />;
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    // Default prefix
    const breadcrumbs = ['首页'];

    if (path.startsWith('/dashboard')) breadcrumbs.push('工作台');
    else if (path.startsWith('/store/info')) breadcrumbs.push('店铺管理', '店铺信息');
    else if (path.startsWith('/store/brand-records')) breadcrumbs.push('店铺管理', '品牌提交记录');
    else if (path.startsWith('/qualification-wizard')) breadcrumbs.push('店铺管理', '资质入驻');
    else if (path.startsWith('/qualification')) breadcrumbs.push('店铺管理', '资质管理');
    else if (path.startsWith('/product')) breadcrumbs.push('商品管理');
    else if (path.startsWith('/order')) breadcrumbs.push('订单管理');
    else if (path.startsWith('/after-sales')) breadcrumbs.push('售后管理');
    else if (path.startsWith('/fulfillment')) breadcrumbs.push('物流管理');
    else if (path.startsWith('/settlement/list')) breadcrumbs.push('结算管理', '发票管理');
    else if (path.startsWith('/settlement/invoice')) breadcrumbs.push('结算管理', '开票清单');
    else if (path.startsWith('/settlement')) breadcrumbs.push('结算管理');
    else if (path.startsWith('/data')) breadcrumbs.push('数据中心');
    else if (path.startsWith('/contract')) breadcrumbs.push('合同管理');
    else if (path.startsWith('/account')) breadcrumbs.push('系统管理', '账号管理');
    else if (path.startsWith('/org')) breadcrumbs.push('系统管理', '组织管理');
    else if (path.startsWith('/role')) breadcrumbs.push('系统管理', '角色管理');
    else if (path.startsWith('/notifications')) breadcrumbs.push('消息通知');

    return breadcrumbs;
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-8 flex items-center justify-between font-sans shadow-sm z-10 w-full relative">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm">
        {getBreadcrumbs().map((crumb, index, array) => (
          <React.Fragment key={index}>
            <span className={index === array.length - 1 ? "text-slate-700 font-medium" : "text-slate-500"}>
              {crumb}
            </span>
            {index < array.length - 1 && (
              <span className="mx-2 text-slate-300">/</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* User & Actions */}
      <div className="flex items-center gap-6">
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            className="relative text-slate-400 hover:text-slate-700 transition-colors p-1"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <span className="font-semibold text-slate-800">通知提醒</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    全部已读
                  </button>
                )}
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification.link)}
                        className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className={`text-sm font-medium truncate ${
                                !notification.isRead ? 'text-slate-900' : 'text-slate-700'
                              }`}>
                                {notification.title}
                              </p>
                              {!notification.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-2">
                              {notification.content}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                      <Bell className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-500">暂无通知提醒</p>
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-3 border-t border-slate-100 text-center bg-slate-50/50">
                  <button 
                    onClick={() => handleNotificationClick('/notifications')}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    查看全部通知
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        <div className="flex items-center gap-3 relative" ref={userMenuRef}>
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg transition-colors group"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <User className="w-4 h-4 text-slate-500" />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-bold text-slate-700">Admin User</div>
              <div className="text-xs text-slate-400 max-w-[120px] truncate">
                {enterprises.find(e => e.id === currentEnterpriseId)?.name || '高级管理员'}
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Enterprise Switcher Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                <div className="text-xs font-semibold text-slate-500 mb-1">当前企业</div>
                <div className="text-sm font-bold text-slate-800 line-clamp-2">
                  {enterprises.find(e => e.id === currentEnterpriseId)?.name || '未绑定企业'}
                </div>
              </div>
              <div className="max-h-[50vh] overflow-y-auto py-2">
                {enterprises.length > 0 ? (
                  enterprises.map(ent => (
                    <button
                      key={ent.id}
                      onClick={() => switchEnterprise(ent.id, ent.name)}
                      className={`w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 transition-colors ${
                        ent.id === currentEnterpriseId ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <Building2 className={`w-4 h-4 shrink-0 ${ent.id === currentEnterpriseId ? 'text-blue-500' : 'text-slate-400'}`} />
                      <span className={`text-sm flex-1 truncate ${ent.id === currentEnterpriseId ? 'font-bold text-blue-600' : 'font-medium text-slate-700'}`}>
                        {ent.name}
                      </span>
                      {ent.id === currentEnterpriseId && (
                        <CheckCircle className="w-4 h-4 text-blue-500 shrink-0" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-slate-500 text-center">暂无可切换企业</div>
                )}
              </div>
              <div className="border-t border-slate-100 p-2">
                <button 
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate('/qualification');
                  }}
                  className="w-full text-left px-2 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  管理资质/新增企业
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-2 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-between"
                >
                  <span>退出登录</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
