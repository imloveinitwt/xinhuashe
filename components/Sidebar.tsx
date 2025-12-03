import React from 'react';
import { LayoutDashboard, FolderOpen, Briefcase, Wallet, Settings, LogOut, Hexagon } from 'lucide-react';
import { WorkspaceTab } from '../types';

interface SidebarProps {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems: { id: WorkspaceTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: '总览', icon: LayoutDashboard },
    { id: 'projects', label: '项目与任务', icon: Briefcase },
    { id: 'dam', label: '资产库 (DAM)', icon: FolderOpen },
    { id: 'finance', label: '财务与托管', icon: Wallet },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-20 shadow-xl transition-all duration-300">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="bg-indigo-500 p-2 rounded-lg">
          <Hexagon className="w-6 h-6 text-white fill-current" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">UniCreative</h1>
          <p className="text-xs text-slate-400">工作台 (Workspace)</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
              activeTab === item.id
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

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