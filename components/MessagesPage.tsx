import React, { useState } from 'react';
import { 
  Bell, Briefcase, User, Wallet, Info, Check, Trash2, 
  ArrowLeft, Search 
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../constants';
import { Notification, NotificationType, ViewMode } from '../types';

interface MessagesPageProps {
  onBack: () => void;
  onNavigate?: (mode: ViewMode) => void;
  isEmbedded?: boolean;
}

const NotificationIcon = ({ type, avatar }: { type: NotificationType; avatar?: string }) => {
  if (type === 'social' && avatar) {
    return <img src={avatar} className="w-9 h-9 rounded-full object-cover border border-slate-200" alt="Avatar" />;
  }
  
  switch (type) {
    case 'system': return <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Info className="w-5 h-5" /></div>;
    case 'project': return <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Briefcase className="w-5 h-5" /></div>;
    case 'social': return <div className="p-2 bg-pink-100 text-pink-600 rounded-lg"><User className="w-5 h-5" /></div>;
    case 'finance': return <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Wallet className="w-5 h-5" /></div>;
    default: return <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Bell className="w-5 h-5" /></div>;
  }
};

const MessagesPage: React.FC<MessagesPageProps> = ({ onBack, onNavigate, isEmbedded = false }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | NotificationType>('all');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = notifications.filter(n => {
    const matchType = activeFilter === 'all' || n.type === activeFilter;
    const matchSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
    if (notification.linkTo && onNavigate) {
      onNavigate(notification.linkTo);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-50 font-sans ${isEmbedded ? '' : 'pt-20 pb-20'}`}>
      <div className={`max-w-4xl mx-auto ${isEmbedded ? '' : 'px-4 sm:px-6 lg:px-8'}`}>
        
        {!isEmbedded && (
          <div className="mb-8">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-4 transition-colors font-medium text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> 返回
            </button>
            <h1 className="text-3xl font-bold text-slate-900">消息中心</h1>
          </div>
        )}

        <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col ${isEmbedded ? 'h-full border-0 shadow-none' : 'min-h-[600px]'}`}>
          
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 bg-slate-50/50">
             <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['all', 'system', 'project', 'social', 'finance'].map(type => (
                   <button
                     key={type}
                     onClick={() => setActiveFilter(type as any)}
                     className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                        activeFilter === type 
                          ? 'bg-slate-900 text-white shadow-md' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                     }`}
                   >
                      {type === 'all' ? '全部' : type === 'system' ? '系统' : type === 'project' ? '项目' : type === 'social' ? '社交' : '财务'}
                   </button>
                ))}
             </div>

             <div className="flex items-center gap-3">
                <div className="relative flex-1 md:flex-none">
                   <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                   <input 
                     type="text" 
                     placeholder="搜索消息..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                   />
                </div>
                <button 
                  onClick={markAllRead}
                  className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all flex-shrink-0"
                  title="全部已读"
                >
                   <Check className="w-5 h-5" />
                </button>
             </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
             {filteredNotifications.length > 0 ? (
               <div className="divide-y divide-slate-50">
                  {filteredNotifications.map(notification => (
                     <div 
                       key={notification.id} 
                       className={`p-5 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer group ${notification.isRead ? 'opacity-70' : 'bg-white'}`}
                       onClick={() => handleNotificationClick(notification)}
                     >
                        <div className="flex-shrink-0 pt-1">
                           <NotificationIcon type={notification.type} avatar={notification.avatar} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-sm font-bold ${notification.isRead ? 'text-slate-600' : 'text-slate-900'}`}>
                                 {notification.title}
                              </h4>
                              <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{notification.time}</span>
                           </div>
                           <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{notification.content}</p>
                           {notification.actionLabel && (
                              <button className="mt-2 text-xs font-bold text-indigo-600 hover:underline">
                                 {notification.actionLabel} &rarr;
                              </button>
                           )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                           {!notification.isRead && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                           <button 
                             onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                             className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
             ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                     <Bell className="w-8 h-8 text-slate-300" />
                  </div>
                  <p>暂无消息</p>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
