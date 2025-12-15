
import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, FolderOpen, Briefcase, Wallet, Settings, LogOut, 
  Hexagon, Palette, Users, PieChart, Shield, ChevronsUpDown, Check, CheckCircle2,
  Crown, Globe, Building, Activity, UserCheck, Layout, Code, MessageSquare, BarChart2
} from 'lucide-react';
import { WorkspaceTab, User, UserRole, ViewMode } from '../types';
import { ROLE_DEFINITIONS, getAvatar } from '../constants'; // Import getAvatar
import { useToast } from '../contexts/ToastContext';

interface SidebarProps {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  user: User;
  onRoleChange: (role: UserRole) => void;
  onNavigate?: (mode: ViewMode) => void;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onRoleChange, onNavigate, onLogout }) => {
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  
  const hasPermission = (code: string) => user.permissions.includes(code as any);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (roleCode: UserRole) => {
    if (roleCode === user.role) {
      setIsRoleMenuOpen(false);
      return;
    }
    
    // Execute switch
    onRoleChange(roleCode);
    showToast(`身份已切换为 ${ROLE_DEFINITIONS.find(r => r.code === roleCode)?.name}`, 'success');
    setIsRoleMenuOpen(false);
  };

  // Demo roles available for switching
  const availableRoles: UserRole[] = ['creator', 'enterprise', 'root_admin'];

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
      icon: user.role === 'creator' ? Wallet : PieChart,
      visible: hasPermission('TRANSACTION_VIEW')
    },
    {
      id: 'messages',
      label: '消息中心',
      icon: MessageSquare,
      visible: true
    },
    {
      id: 'team',
      label: '团队协作',
      icon: Users,
      visible: user.role === 'enterprise' || user.role === 'root_admin'
    },
    {
      id: 'analytics',
      label: '数据分析',
      icon: BarChart2,
      visible: user.role === 'enterprise' || (user.role === 'creator' && user.membershipLevel !== 'none')
    },
    {
      id: 'membership',
      label: '会员权益',
      icon: Crown,
      visible: user.role !== 'root_admin' // Admins don't need membership plans usually
    },
    
    // --- Admin Sections ---
    {
      id: 'admin_monitor',
      label: '系统监控',
      icon: Activity,
      visible: user.role === 'root_admin'
    },
    {
      id: 'admin_audit',
      label: '认证审核',
      icon: UserCheck,
      visible: hasPermission('USER_AUTH_REVIEW')
    },
    {
      id: 'admin_content',
      label: '内容管理',
      icon: Layout,
      visible: hasPermission('CONTENT_REVIEW')
    },
    {
      id: 'admin_users',
      label: '用户与权限',
      icon: Users,
      visible: hasPermission('USER_VIEW')
    },
    {
      id: 'admin_settings',
      label: '系统设置',
      icon: Settings,
      visible: hasPermission('SYSTEM_CONFIG')
    },
    {
      id: 'admin_dev',
      label: '开发者中心',
      icon: Code,
      visible: user.role === 'root_admin'
    }
  ];

  const visibleItems = menuItems.filter(item => item.visible);

  return (
    <div className="hidden md:flex w-64 h-screen bg-slate-900 text-white flex-col fixed left-0 top-0 z-20 shadow-xl transition-all duration-300 font-sans">
      
      {/* Brand & Identity Switcher */}
      <div className="p-4" ref={menuRef}>
        <button 
          onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 group relative"
        >
          <div className={`p-2 rounded-lg shadow-sm transition-colors ${
            user.role === 'root_admin' ? 'bg-red-600 group-hover:bg-red-500' :
            user.role === 'creator' ? 'bg-pink-50 group-hover:bg-pink-400' : 
            'bg-indigo-500 group-hover:bg-indigo-400'
          }`}>
            <Hexagon className="w-6 h-6 text-white fill-current" />
          </div>
          <div className="flex-1 text-left">
            <h1 className="font-bold text-base tracking-tight leading-none mb-1">薪画社</h1>
            <p className="text-xs text-slate-400 group-hover:text-slate-300 truncate max-w-[100px]" title={user.roleName}>
              {user.roleName}
            </p>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
        </button>

        {/* Dropdown Menu */}
        {isRoleMenuOpen && (
          <div className="absolute top-20 left-4 right-4 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden z-50 animate-scale-in origin-top">
             <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-900/50">
               切换身份视角
             </div>
             <div className="p-1">
               {availableRoles.map(role => {
                 const def = ROLE_DEFINITIONS.find(r => r.code === role);
                 const isActive = user.role === role;
                 return (
                   <button
                     key={role}
                     onClick={() => handleRoleSelect(role)}
                     className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
                       isActive 
                         ? 'bg-slate-700 text-white' 
                         : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
                     }`}
                   >
                     <span className="flex items-center gap-2">
                       {role === 'creator' && <Palette className="w-3.5 h-3.5" />}
                       {role === 'enterprise' && <Briefcase className="w-3.5 h-3.5" />}
                       {role === 'root_admin' && <Shield className="w-3.5 h-3.5" />}
                       {def?.name}
                     </span>
                     {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                   </button>
                 );
               })}
             </div>
          </div>
        )}
      </div>

      <div className="h-px bg-slate-800 mx-4 mb-2"></div>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {visibleItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as WorkspaceTab)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              activeTab === item.id
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-colors ${
              activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-white'
            }`} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
        
        {/* Enterprise Profile Link in Sidebar */}
        {user.role === 'enterprise' && (
           <a 
             href="#" 
             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all duration-200 group"
             onClick={(e) => { 
               e.preventDefault(); 
               if (onNavigate) onNavigate('enterprise_profile');
             }}
           >
             <Globe className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
             <span className="font-medium text-sm">企业主页预览</span>
           </a>
        )}
      </nav>

      {/* Team Context (Enterprise Only) */}
      {user.role === 'enterprise' && (
        <div className="px-6 py-4">
           <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">团队成员</p>
           <div className="flex -space-x-2 overflow-hidden pl-1">
             <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700" src={getAvatar('Team A')} alt=""/>
             <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700" src={getAvatar('Team B')} alt=""/>
             <div className="h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-400 font-medium">+5</div>
           </div>
        </div>
      )}

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">设置</span>
        </button>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">退出登录</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
