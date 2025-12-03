
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, MessageSquare, Hexagon, Plus, Upload, 
  User as UserIcon, ChevronDown, LogOut, Settings
} from 'lucide-react';
import { ViewMode, UserRole, User } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  userRole: UserRole;
  onUploadClick: () => void;
  currentUser: User | null;
  onNavigateToProfile?: (profileId: string) => void;
  onLoginClick?: () => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  viewMode, setViewMode, userRole, onUploadClick, currentUser, onNavigateToProfile, onLoginClick, onLogout 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleProfileClick = () => {
    if (onNavigateToProfile && currentUser) {
      // Demo logic: map roles to specific demo profiles
      const targetProfileId = currentUser.role === 'creator' ? 'p_artmaster' : 'p_neon';
      onNavigateToProfile(targetProfileId);
    }
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    setIsMenuOpen(false);
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=cbd5e1&color=fff';
  };

  return (
    <header className={`fixed top-0 w-full z-30 transition-all duration-300 ${
      viewMode === 'workspace' 
      ? 'pl-64 bg-white border-b border-slate-200' 
      : 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
    }`}>
      
      <div className="px-6 h-16 flex items-center justify-between">
        
        {/* Left: Branding */}
        {(viewMode === 'discovery' || viewMode === 'profile') ? (
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setViewMode('discovery')}>
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Hexagon className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">薪画社</span>
          </div>
        ) : (
          /* Spacer for workspace mode */
          <div className="flex items-center gap-2">
             <span className={`text-xs font-medium px-2 py-1 rounded border ${
               userRole === 'enterprise' 
                 ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                 : userRole === 'root_admin'
                 ? 'bg-red-50 text-red-700 border-red-200'
                 : 'bg-pink-50 text-pink-700 border-pink-200'
             }`}>
               {userRole === 'enterprise' ? '企业版 (Tezign集成)' : userRole === 'root_admin' ? '系统管理后台' : '创作者版 (Mihuashi集成)'}
             </span>
          </div> 
        )}

        {/* Center: View Switcher (Visible only if logged in or navigating context) */}
        {currentUser && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block">
            <div className="bg-slate-100 p-1 rounded-full flex items-center shadow-inner">
              <button
                onClick={() => setViewMode('discovery')}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'discovery' || viewMode === 'profile'
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                社区大厅
              </button>
              <button
                onClick={() => setViewMode('workspace')}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'workspace' 
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                我的工作台
              </button>
            </div>
          </div>
        )}

        {/* Right: User Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Create/Upload Button (Primary CTA) */}
          <button 
            onClick={onUploadClick}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 btn-gradient-animate text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 border border-white/10 hover:scale-105 active:scale-95"
          >
            {userRole === 'creator' ? <Upload className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {userRole === 'creator' ? '发布作品' : '发布需求'}
          </button>

          {currentUser ? (
            <>
              <div className="flex items-center gap-1">
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
              </div>
              
              {/* User Dropdown Menu */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 py-1 px-1 rounded-lg transition-colors group focus:outline-none"
                >
                  <img 
                    src={currentUser.avatar}
                    alt="User" 
                    className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-indigo-400 bg-slate-200 object-cover"
                    onError={handleAvatarError}
                  />
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-scale-in origin-top-right z-50">
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                      <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${
                          userRole === 'enterprise' ? 'bg-indigo-500' : 
                          userRole === 'root_admin' ? 'bg-red-500' : 
                          'bg-pink-500'
                        }`}></span>
                        <p className="text-xs text-slate-500 truncate">{currentUser.roleName}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" /> 个人空间
                    </button>
                    
                    <button 
                      onClick={() => { setIsMenuOpen(false); /* Settings logic */ }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                    >
                      <Settings className="w-4 h-4" /> 账号设置
                    </button>
                    
                    <div className="border-t border-slate-50 my-2 pt-1"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> 退出登录
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Guest State */
            <div className="flex items-center gap-3">
               <button 
                 onClick={onLoginClick}
                 className="text-slate-600 font-medium text-sm hover:text-indigo-600 px-3 py-2"
               >
                 登录
               </button>
               <button 
                 onClick={onLoginClick}
                 className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-indigo-700 shadow-sm transition-colors"
               >
                 免费注册
               </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
