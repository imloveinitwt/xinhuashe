
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Bell, MessageSquare, Hexagon, Plus, Upload, 
  User as UserIcon, ChevronDown, LogOut, Settings, Menu,
  Info, Briefcase, Wallet
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_NOTIFICATIONS } from '../constants'; 

interface HeaderProps {
  isWorkspace?: boolean;
  onUploadClick: () => void;
  onLoginClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isWorkspace, onUploadClick, onLoginClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=cbd5e1&color=fff';
  };

  const isActive = (path: string) => location.pathname === path;
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;

  return (
    <header className={`fixed top-0 w-full z-30 transition-all duration-300 ${
      isWorkspace 
      ? 'lg:pl-64 bg-white border-b border-slate-200' 
      : 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
    }`}>
      
      <div className="px-6 h-16 flex items-center justify-between">
        
        {/* Left: Branding & Navigation */}
        <div className="flex items-center gap-8">
          {/* Mobile Sidebar Toggle (Workspace Only) */}
          {isWorkspace && (
             <button className="lg:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                <Menu className="w-6 h-6" />
             </button>
          )}

          {!isWorkspace ? (
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                  <div className="bg-indigo-600 p-1.5 rounded-lg">
                    <Hexagon className="w-5 h-5 text-white fill-current" />
                  </div>
                  <span className="font-bold text-xl text-slate-900 tracking-tight hidden sm:block">薪画社</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                  <Link to="/projects" className={`text-sm font-medium transition-colors ${isActive('/projects') ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}>
                      企划大厅
                  </Link>
                  <Link to="/artworks" className={`text-sm font-medium transition-colors ${isActive('/artworks') ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}>
                      作品广场
                  </Link>
                  <Link to="/creators" className={`text-sm font-medium transition-colors ${isActive('/creators') ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}>
                      新锐画师
                  </Link>
                  <Link to="/enterprise" className={`text-sm font-medium transition-colors ${isActive('/enterprise') ? 'text-indigo-600 font-bold' : 'text-slate-600 hover:text-indigo-600'}`}>
                      企业服务
                  </Link>
                </nav>
            </div>
          ) : (
            /* Spacer for workspace mode header title */
            <div className="flex items-center gap-2">
               <span className={`text-xs font-medium px-2 py-1 rounded border ${
                 user?.role === 'enterprise' 
                   ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                   : user?.role === 'root_admin'
                   ? 'bg-red-50 text-red-700 border-red-200'
                   : 'bg-pink-50 text-pink-700 border-pink-200'
               }`}>
                 {user?.role === 'enterprise' ? '企业版 (Tezign集成)' : user?.role === 'root_admin' ? '系统管理后台' : '创作者版 (Mihuashi集成)'}
               </span>
            </div> 
          )}
        </div>

        {/* Center: View Switcher (Visible only if logged in & Desktop) */}
        {user && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden xl:block">
            <div className="bg-slate-100 p-1 rounded-full flex items-center shadow-inner">
              <button
                onClick={() => navigate('/')}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !isWorkspace
                    ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                社区大厅
              </button>
              <button
                onClick={() => navigate('/workspace')}
                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isWorkspace 
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
          
          <button 
            onClick={onUploadClick}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 btn-gradient-animate text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 border border-white/10 hover:scale-105 active:scale-95"
          >
            {user?.role === 'creator' ? <Upload className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {user?.role === 'creator' ? '发布作品' : '发布需求'}
          </button>

          {/* Mobile Menu Toggle (Community Mode) */}
          {!isWorkspace && (
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          )}

          {user ? (
            <>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => navigate('/messages')}
                  className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors hidden sm:block"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                
                {/* Notification Dropdown */}
                <div className="relative" ref={notificationRef}>
                  <button 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className={`relative p-2 rounded-full transition-colors hidden sm:block ${
                      isNotificationsOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-scale-in origin-top-right z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-sm">通知中心</h3>
                        {unreadCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{unreadCount} 未读</span>}
                      </div>
                      
                      <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {MOCK_NOTIFICATIONS.slice(0, 5).map(notification => (
                          <div 
                            key={notification.id} 
                            onClick={() => {
                              navigate('/messages');
                              setIsNotificationsOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer flex gap-3 items-start"
                          >
                              <div className="flex-shrink-0 mt-0.5">
                                <div className={`p-1.5 rounded-full bg-slate-100`}>
                                  {notification.type === 'system' && <Info className="w-3.5 h-3.5 text-blue-500" />}
                                  {notification.type === 'project' && <Briefcase className="w-3.5 h-3.5 text-indigo-500" />}
                                  {notification.type === 'social' && <UserIcon className="w-3.5 h-3.5 text-pink-500" />}
                                  {notification.type === 'finance' && <Wallet className="w-3.5 h-3.5 text-green-500" />}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-xs font-medium truncate ${notification.isRead ? 'text-slate-600' : 'text-slate-900'}`}>{notification.title}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5">{notification.time}</p>
                              </div>
                              {!notification.isRead && <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>}
                          </div>
                        ))}
                      </div>

                      <div className="p-2 border-t border-slate-50 bg-slate-50/50">
                        <button 
                          onClick={() => {
                            navigate('/messages');
                            setIsNotificationsOpen(false);
                          }}
                          className="w-full py-2 text-center text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          进入消息中心
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* User Dropdown Menu */}
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 py-1 px-1 rounded-lg transition-colors group focus:outline-none"
                >
                  <img 
                    src={user.avatar}
                    alt="User" 
                    className="w-8 h-8 rounded-full border border-slate-200 group-hover:border-indigo-400 bg-slate-200 object-cover"
                    onError={handleAvatarError}
                  />
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-scale-in origin-top-right z-50">
                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                      <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${
                          user.role === 'enterprise' ? 'bg-indigo-500' : 
                          user.role === 'root_admin' ? 'bg-red-500' : 
                          'bg-pink-500'
                        }`}></span>
                        <p className="text-xs text-slate-500 truncate">{user.roleName}</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        const targetProfile = user.role === 'creator' ? 'p_artmaster' : 'p_neon';
                        navigate(`/profile/${targetProfile}`);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-3 transition-colors"
                    >
                      <UserIcon className="w-4 h-4" /> 个人空间
                    </button>
                    
                    <button 
                      onClick={() => {
                        navigate(isWorkspace ? '/' : '/workspace');
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 flex items-center gap-3 transition-colors xl:hidden"
                    >
                      <Settings className="w-4 h-4" /> 
                      {isWorkspace ? '切换至社区大厅' : '切换至工作台'}
                    </button>

                    <button 
                      onClick={() => { setIsMenuOpen(false); }}
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
                 className="text-slate-600 font-medium text-sm hover:text-indigo-600 px-3 py-2 hidden sm:block"
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

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && !isWorkspace && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-fade-in-up">
          <nav className="flex flex-col p-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-left text-sm font-medium ${isActive('/') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}
            >
              社区首页
            </Link>
            <Link 
              to="/projects"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-left text-sm font-medium ${isActive('/projects') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}
            >
              企划大厅
            </Link>
            <Link 
              to="/artworks"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-left text-sm font-medium ${isActive('/artworks') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}
            >
              作品广场
            </Link>
            <Link 
              to="/enterprise"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-left text-sm font-medium ${isActive('/enterprise') ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600'}`}
            >
              企业服务
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
