
import React from 'react';
import { 
  LayoutDashboard, FolderOpen, Briefcase, Wallet, Settings, LogOut, 
  Hexagon, Palette, Users, FileBarChart, Shield, BookOpen
} from 'lucide-react';
import { WorkspaceTab, User } from '../types';

interface SidebarProps {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  user: User; // Replaced userRole string with full User object for Permission checks
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user }) => {
  
  const hasPermission = (code: string) => user.permissions.includes(code as any);

  // Dynamic menu construction based on permissions
  const menuItems = [
    { 
      id: 'dashboard', 
      label: user.role === 'root_admin' ? '监控中心' : '工作台', 
      icon: LayoutDashboard,
      visible: true 
    },
    { 
      id: 'projects', 
      label: '项目与任务', 
      icon: Briefcase,
      visible: hasPermission('PROJECT_VIEW') || hasPermission('TASK_ASSIGN')
    },
    { 
      id: 'dam', 
      label: user.role === 'creator' ? '作品集管理' : '数字资产 (DAM)', 
      icon: user.role === 'creator' ? Palette : FolderOpen,
      visible: hasPermission('CONTENT_UPLOAD') || hasPermission('CONTENT_REVIEW') || user.role === 'enterprise'
    },
    { 
      id: 'finance', 
      label: '财务与发票', 
      icon: user.role === 'creator' ? Wallet : FileBarChart,
      visible: hasPermission('TRANSACTION_VIEW')
    },
    // Admin Sections
    {
      id: 'admin_users',
      label: '用户管理',
      icon: Users,
      visible: hasPermission('USER_VIEW')
    },
    {
      id: 'admin_roles',
      label: '权限配置',
      icon: Shield,
      visible: hasPermission('ROLE_MANAGE')
    }
  ];

  const visibleItems = menuItems.filter(item => item.visible);

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-20 shadow-xl transition-all duration-300">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className={`p-2 rounded-lg ${
          user.role === 'root_admin' ? 'bg-red-600' :
          user.role === 'creator' ? 'bg-pink-500' : 
          'bg-indigo-500'
        }`}>
          <Hexagon className="w-6 h-6 text-white fill-current" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">薪画社</h1>
          <p className="text-xs text-slate-400 truncate max-w-[120px]" title={user.roleName}>
            {user.roleName}
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as WorkspaceTab)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              activeTab === item.id || (activeTab.startsWith('admin_') && item.id.startsWith('admin_'))
                ? 'bg-slate-800 text-white shadow-sm border-l-4 border-indigo-500'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white border-l-4 border-transparent'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Team Context (Enterprise Only) */}
      {user.role === 'enterprise' && (
        <div className="px-6 py-4">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">团队成员</p>
           <div className="flex -space-x-2 overflow-hidden">
             <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700" src="https://ui-avatars.com/api/?name=Team+A&background=random" alt=""/>
             <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700" src="https://ui-avatars.com/api/?name=Team+B&background=random" alt=""/>
             <div className="h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700 flex items-center justify-center text-xs">+5</div>
           </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-slate-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm">设置</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">退出登录</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
