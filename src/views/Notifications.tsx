import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Filter, Search, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'qualification_success',
    title: '企业资质审核通过',
    content: '您的企业资质「天创工业商城」已通过平台审核，现在可以发布商品了。',
    time: '10分钟前',
    date: '2023-10-25 14:30',
    isRead: false,
    link: '/qualification',
    category: '资质管理'
  },
  {
    id: '2',
    type: 'product_rejected',
    title: '商品上架审核退回',
    content: '您提交的商品「重型工业绝缘手套」因主图不清晰被退回，请修改后重新提交。',
    time: '2小时前',
    date: '2023-10-25 12:45',
    isRead: false,
    link: '/product',
    category: '商品管理'
  },
  {
    id: '3',
    type: 'qualification_warning',
    title: '即将过期资质提醒',
    content: '您的「特种行业经营许可证」将于30天后过期，请尽快更新。',
    time: '1天前',
    date: '2023-10-24 09:15',
    isRead: true,
    link: '/qualification',
    category: '资质管理'
  },
  {
    id: '4',
    type: 'system_info',
    title: '系统升级通知',
    content: '平台将于本周日凌晨2:00-4:00进行系统维护升级，届时部分功能可能受限，给您带来的不便敬请谅解。',
    time: '3天前',
    date: '2023-10-22 10:00',
    isRead: true,
    link: '#',
    category: '系统通知'
  },
  {
    id: '5',
    type: 'order_warning',
    title: '发货超时提醒',
    content: '订单 TCO20231020001 已超过承诺发货时间，请尽快处理发货，以免产生违约金。',
    time: '3天前',
    date: '2023-10-22 08:20',
    isRead: true,
    link: '/order',
    category: '订单管理'
  }
];

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'unread'
  const [searchQuery, setSearchQuery] = useState('');

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleNotificationClick = (id: string, link: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
    if (link !== '#') {
      navigate(link);
    }
  };

  const getNotificationIcon = (type: string) => {
    if (type.includes('success')) return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (type.includes('warning') || type.includes('rejected')) return <AlertCircle className="w-5 h-5 text-blue-500" />;
    return <Info className="w-5 h-5 text-blue-500" />;
  };

  const filteredNotifications = notifications.filter(n => {
    const matchesTab = activeTab === 'all' || (activeTab === 'unread' && !n.isRead);
    const matchesSearch = n.title.includes(searchQuery) || n.content.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">消息通知</h1>
          <p className="mt-1 text-sm text-slate-500">
            查看您所有的系统通知、审核结果和业务提醒
          </p>
        </div>
        <button 
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Check className="w-4 h-4" />
          全部标记为已读
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Filters and Tabs */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`text-sm font-medium transition-colors relative pb-4 -mb-4 ${
                activeTab === 'all' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              全部消息
              {activeTab === 'all' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`text-sm font-medium transition-colors relative pb-4 -mb-4 ${
                activeTab === 'unread' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              未读消息
              <span className="ml-1.5 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px]">
                {notifications.filter(n => !n.isRead).length}
              </span>
              {activeTab === 'unread' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
              )}
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索通知内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all w-64"
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-slate-100">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                onClick={() => handleNotificationClick(notification.id, notification.link)}
                className={`p-5 hover:bg-slate-50 transition-colors cursor-pointer group ${
                  !notification.isRead ? 'bg-blue-50/20' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <span className={`text-base font-medium ${!notification.isRead ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notification.title}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600">
                          {notification.category}
                        </span>
                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                        )}
                      </div>
                      <span className="text-sm text-slate-500 whitespace-nowrap">
                        {notification.date}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed mb-3 pr-12">
                      {notification.content}
                    </p>
                    <div className="flex items-center gap-4">
                      {notification.link !== '#' && (
                        <span className="text-sm text-blue-600 font-medium group-hover:underline">
                          查看详情 {'>'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">暂无通知</h3>
              <p className="text-sm text-slate-500">您目前没有符合条件的通知记录</p>
            </div>
          )}
        </div>
        
        {/* Pagination placeholder if list gets long */}
        {filteredNotifications.length > 0 && (
          <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500 bg-slate-50/50">
            <span>共 {filteredNotifications.length} 条通知</span>
            {/* Pagination controls would go here in a full implementation */}
          </div>
        )}
      </div>
    </div>
  );
}
