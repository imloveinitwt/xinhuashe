
import React from 'react';
import { Bell, MessageSquare, Hexagon, Briefcase, Palette, Plus, Upload, User as UserIcon } from 'lucide-react';
import { ViewMode, UserRole, User } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onUploadClick: () => void;
  currentUser: User | null;
  onNavigateToProfile?: (profileId: string) => void;
  onLoginClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  viewMode, setViewMode, userRole, setUserRole, onUploadClick, currentUser, onNavigateToProfile, onLoginClick 
}) => {
  
  const handleAvatarClick = () => {
    if (onNavigateToProfile && currentUser) {
      const targetProfileId = currentUser.role === 'creator' ? 'p_artmaster' : 'p_neon';
      onNavigateToProfile(targetProfileId);
    }
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
                 : 'bg-pink-50 text-pink-700 border-pink-200'
             }`}>
               {userRole === 'enterprise' ? '企业版 (Tezign集成)' : '创作者版 (Mihuashi集成)'}
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

        {/* Right: User Actions & Role Switcher */}
        <div className="flex items-center gap-3 md:gap-4">
          
          {/* Create/Upload Button (Always visible but triggers login if guest) */}
          <button 
            onClick={onUploadClick}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-sm font-medium transition-colors shadow-sm"
          >
            {userRole === 'creator' ? <Upload className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {userRole === 'creator' ? '发布作品' : '发布需求'}
          </button>

          {currentUser ? (
            <>
              {/* Role Toggle */}
              <button 
                onClick={() => setUserRole(userRole === 'creator' ? 'enterprise' : 'creator')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  userRole === 'creator' 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100' 
                    : 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100'
                }`}
                title={userRole === 'creator' ? "切换为企业主视角" : "切换为创作者视角"}
              >
                 {userRole === 'creator' ? <Briefcase className="w-3 h-3" /> : <Palette className="w-3 h-3" />}
                 <span className="hidden sm:inline">{userRole === 'creator' ? '切换为企业' : '切换为画师'}</span>
              </button>

              <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

              <div className="flex items-center gap-1">
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
              </div>
              
              <div 
                className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 py-1 px-1 rounded-lg transition-colors group"
                onClick={handleAvatarClick}
                title="前往个人空间"
              >
                <img 
                  src={currentUser.avatar}
                  alt="User" 
                  className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-indigo-400 bg-slate-200"
                  onError={handleAvatarError}
                />
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
