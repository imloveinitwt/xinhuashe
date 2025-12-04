
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, FolderOpen, Briefcase, Wallet, Settings, LogOut, 
  Hexagon, Palette, Users, PieChart, Shield, ChevronsUpDown, Check, CheckCircle2, Menu, X
} from 'lucide-react';
import { UserRole } from '../types';
import { ROLE_DEFINITIONS } from '../constants';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { user, updateUserRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  // Mobile drawer state is controlled by CSS media queries mostly, but we can add a toggle if needed by Layout.
  // Ideally, layout passes `isOpen` prop, but for self-containment we'll rely on large screen visibility.
  
  const menuRef = useRef<HTMLDivElement>(null);
  
  if (!user) return null;

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
    
    // Trigger visual feedback
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    
    // Execute switch
    updateUserRole(roleCode);
    setIsRoleMenuOpen(false);
    navigate('/workspace'); // Reset to dashboard
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Demo roles available for switching
  const availableRoles: UserRole[] = ['creator', 'enterprise', 'root_admin'];

  // Dynamic menu construction based on permissions
  const menuItems = [
    { 
      path: '/workspace', 
      label: user.role === 'root_admin' ? '监控中心' : '工作台', 
      icon: LayoutDashboard,
      exact: true,
      visible: true 
    },
    { 
      path: '/workspace/projects', 
      label: '项目与任务', 
      icon: Briefcase,
      visible: hasPermission('PROJECT_VIEW') || hasPermission('TASK_ASSIGN')
    },
    { 
      path: '/workspace/dam', 
      label: user.role === 'creator' ? '作品集管理' : '数字资产 (DAM)', 
      icon: user.role === 'creator' ? Palette : FolderOpen,
      visible: hasPermission('CONTENT_UPLOAD') || hasPermission('CONTENT_REVIEW') || user.role === 'enterprise'
    },
    { 
      path: '/workspace/finance', 
      label: '财务与发票', 
      icon: user.role === 'creator' ? Wallet : PieChart,
      visible: hasPermission('TRANSACTION_VIEW')
    },
    // Admin Sections
    {
      path: '/workspace/admin/users',
      label: '用户管理',
      icon: Users,
      visible: hasPermission('USER_VIEW')
    },
    {
      path: '/workspace/admin/roles',
      label: '权限配置',
      icon: Shield,
      visible: hasPermission('ROLE_MANAGE')
    }
  ];

  const visibleItems = menuItems.filter(item => item.visible);

  return (
    <>
      {/* Mobile Drawer Backdrop - Hidden on desktop */}
      <div className="lg:hidden fixed inset-0 z-10 bg-black/50 hidden" id="mobile-backdrop"></div>

      <div className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-20 shadow-xl transition-transform duration-300 transform -translate-x-full lg:translate-x-0 font-sans" id="sidebar">
        
        {/* Toast Feedback */}
        <div className={`absolute top-4 left-6 right-6 bg-emerald-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-500 z-50 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
           <CheckCircle2 className="w-4 h-4" />
           <span className="text-xs font-bold">已切换至 {user.roleName}</span>
        </div>

        {/* Brand & Identity Switcher */}
        <div className="p-4" ref={menuRef}>
          <button 
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700 group relative"
          >
            <div className={`p-2 rounded-lg shadow-sm transition-colors ${
              user.role === 'root_admin' ? 'bg-red-600 group-hover:bg-red-500' :
              user.role === 'creator' ? 'bg-pink-500 group-hover:bg-pink-400' : 
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
          {visibleItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);
              
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'
                }`} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Team Context (Enterprise Only) */}
        {user.role === 'enterprise' && (
          <div className="px-6 py-4">
             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">团队成员</p>
             <div className="flex -space-x-2 overflow-hidden pl-1">
               <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700" src="https://ui-avatars.com/api/?name=Team+A&background=random" alt=""/>
               <img className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-700" src="https://ui-avatars.com/api/?name=Team+B&background=random" alt=""/>
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
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">退出登录</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
