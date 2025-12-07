
import React, { useState } from 'react';
import { 
  Bell, Briefcase, User, Wallet, Info, Check, Trash2, 
  ArrowLeft, Search, Filter, MoreHorizontal 
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { Notification, NotificationType, ViewMode } from '../types';

interface MessagesPageProps {
  onBack: () => void;
  onNavigate?: (mode: ViewMode) => void;
}

const NotificationIcon = ({ type }: { type: NotificationType }) => {
  switch (type) {
    case 'system': return <div className="p-2 bg-blue-100 text-blue-600 rounded-full"><Info className="w-5 h-5" /></div>;
    case 'project': return <div className="p-2 bg-indigo-100 text-indigo-600 rounded-full"><Briefcase className="w-5 h-5" /></div>;
    case 'social': return <div className="p-2 bg-pink-100 text-pink-600 rounded-full"><User className="w-5 h-5" /></div>;
    case 'finance': return <div className="p-2 bg-green-100 text-green-600 rounded-full"><Wallet className="w-5 h-5" /></div>;
    default: return <div className="p-2 bg-slate-100 text-slate-600 rounded-full"><Bell className="w-5 h-5" /></div>;
  }
};

const MessagesPage: React.FC<MessagesPageProps> = ({ onBack, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<NotificationType | 'all'>('all');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = notifications.filter(n => {
    const matchesTab = activeTab === 'all' || n.type === activeTab;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const TABS = [
    { id: 'all', label: '全部消息' },
    { id: 'system', label: '系统通知' },
    { id: 'project', label: '项目动态' },
    { id: 'social', label: '互动消息' },
    { id: 'finance', label: '财务通知' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回上一页
            </button>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              消息中心
              {unreadCount > 0 && (
                <span className="text-sm font-bold bg-red-500 text-white px-2 py-0.5 rounded-full shadow-sm">
                  {unreadCount} 未读
                </span>
              )}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={markAllAsRead}
               className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
             >
               <Check className="w-4 h-4" /> 全部已读
             </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Sidebar: Categories */}
          <div className="lg:w-64 flex-shrink-0">
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-24">
                <div className="p-2 space-y-1">
                   {TABS.map(tab => {
                     const count = tab.id === 'all' 
                       ? notifications.filter(n => !n.isRead).length
                       : notifications.filter(n => !n.isRead && n.type === tab.id).length;
                     
                     return (
                       <button
                         key={tab.id}
                         onClick={() => setActiveTab(tab.id as any)}
                         className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                           activeTab === tab.id 
                             ? 'bg-indigo-50 text-indigo-700' 
                             : 'text-slate-600 hover:bg-slate-50'
                         }`}
                       >
                         <span>{tab.label}</span>
                         {count > 0 && (
                           <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                             {count}
                           </span>
                         )}
                       </button>
                     );
                   })}
                </div>
             </div>
          </div>

          {/* Right Content: Notification List */}
          <div className="flex-1 space-y-4">
             {/* Search Bar */}
             <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="搜索通知内容..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                />
             </div>

             {/* List */}
             <div className="space-y-3">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification, index) => (
                    <div 
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`group relative bg-white p-5 rounded-xl border transition-all cursor-pointer hover:shadow-md animate-fade-in-up ${
                        notification.isRead ? 'border-slate-200' : 'border-indigo-200 bg-indigo-50/10'
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                       {/* Unread Dot */}
                       {!notification.isRead && (
                         <div className="absolute top-5 right-5 w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm ring-4 ring-white"></div>
                       )}

                       <div className="flex gap-4">
                          {/* Avatar or Icon */}
                          <div className="flex-shrink-0">
                             {notification.avatar ? (
                               <img src={notification.avatar} className="w-10 h-10 rounded-full border border-slate-200" alt="" />
                             ) : (
                               <NotificationIcon type={notification.type} />
                             )}
                          </div>

                          <div className="flex-1 min-w-0">
                             <div className="flex justify-between items-start mb-1 pr-6">
                                <h3 className={`text-sm font-bold ${notification.isRead ? 'text-slate-700' : 'text-slate-900'}`}>
                                  {notification.title}
                                </h3>
                                <span className="text-xs text-slate-400 whitespace-nowrap">{notification.time}</span>
                             </div>
                             <p className={`text-sm leading-relaxed ${notification.isRead ? 'text-slate-500' : 'text-slate-600'}`}>
                               {notification.content}
                             </p>
                             
                             {(notification.actionLabel || notification.linkTo) && (
                               <div className="mt-3">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                      if (notification.linkTo && onNavigate) onNavigate(notification.linkTo);
                                    }}
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline inline-flex items-center gap-1"
                                  >
                                    {notification.actionLabel || '查看详情'} <ArrowLeft className="w-3 h-3 rotate-180" />
                                  </button>
                               </div>
                             )}
                          </div>
                       </div>

                       {/* Delete Action (Hover) */}
                       <button 
                         onClick={(e) => deleteNotification(notification.id, e)}
                         className="absolute bottom-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                         title="删除通知"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                     <Bell className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                     <p className="text-slate-400">暂无相关消息</p>
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
