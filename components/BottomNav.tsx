
import React from 'react';
import { LayoutDashboard, FolderOpen, Briefcase, Wallet, Users, Palette, PieChart } from 'lucide-react';
import { WorkspaceTab, UserRole } from '../types';

interface BottomNavProps {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  role: UserRole;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, role }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: '工作台' },
    { id: 'projects', icon: Briefcase, label: '项目' },
    { 
      id: 'dam', 
      icon: role === 'creator' ? Palette : FolderOpen, 
      label: role === 'creator' ? '作品' : '资产' 
    },
    { 
      id: 'finance', 
      icon: role === 'creator' ? Wallet : PieChart, 
      label: '财务' 
    },
  ];

  // Add Admin item if root_admin
  if (role === 'root_admin') {
      navItems.push({ id: 'admin_users', icon: Users, label: '用户' });
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-30 flex justify-between items-center safe-area-pb">
      {navItems.slice(0, 5).map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id as WorkspaceTab)}
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors min-w-[60px] ${
            activeTab === item.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <item.icon className={`w-6 h-6 mb-1 ${activeTab === item.id ? 'fill-current opacity-20' : ''}`} />
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default BottomNav;
