import React from 'react';
import { 
  LayoutDashboard, FolderOpen, Briefcase, Wallet, Settings, LogOut, 
  Hexagon, Palette, Users, FileBarChart 
} from 'lucide-react';
import { WorkspaceTab, UserRole } from '../types';

interface SidebarProps {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  userRole: UserRole;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, userRole }) => {
  
  // Define menus for distinct roles based on the Feasibility Plan
  const artistMenu = [
    { id: 'dashboard', label: '画师概览', icon: LayoutDashboard },
    { id: 'projects', label: '我的企划', icon: Briefcase }, // Mihuashi Style
    { id: 'dam', label: '作品集管理', icon: Palette }, // Huashi6 Style
    { id: 'finance', label: '个人钱包', icon: Wallet },
  ];

  const clientMenu = [
    { id: 'dashboard', label: '企业控制台', icon: LayoutDashboard },
    { id: 'projects', label: '项目管理', icon: Briefcase }, // Tezign Style
    { id: 'dam', label: '数字资产库 (DAM)', icon: FolderOpen }, // Tezign/Huajia Style
    { id: 'finance', label: '财务与发票', icon: FileBarChart },
  ];

  const menuItems = userRole === 'artist' ? artistMenu : clientMenu;

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-20 shadow-xl transition-all duration-300">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className={`p-2 rounded-lg ${userRole === 'artist' ? 'bg-pink-500' : 'bg-indigo-500'}`}>
          <Hexagon className="w-6 h-6 text-white fill-current" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">薪画社</h1>
          <p className="text-xs text-slate-400">
            {userRole === 'artist' ? '创作者中心' : '企业工作台'}
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as WorkspaceTab)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              activeTab === item.id
                ? (userRole === 'artist' ? 'bg-pink-600 text-white shadow-lg' : 'bg-indigo-600 text-white shadow-lg')
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Team/Enterprise Context (Only for Client) */}
      {userRole === 'client' && (
        <div className="px-6 py-4">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">团队成员</p>
           <div className="flex -space-x-2 overflow-hidden">
             <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://picsum.photos/32/32?random=1" alt=""/>
             <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://picsum.photos/32/32?random=2" alt=""/>
             <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900" src="https://picsum.photos/32/32?random=3" alt=""/>
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