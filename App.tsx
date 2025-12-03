import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DiscoveryView from './components/DiscoveryView';
import DashboardView from './components/DashboardView';
import DAMView from './components/DAMView';
import ProjectsView from './components/ProjectsView';
import FinanceView from './components/FinanceView';
import UploadModal from './components/UploadModal';
import LoginModal from './components/LoginModal'; 
import LoginScreen from './components/LoginScreen';
import AdminView from './components/AdminView';
import PersonalSpaceView from './components/PersonalSpaceView'; 
import Footer from './components/Footer';
import { ViewMode, WorkspaceTab, UserRole, User } from './types';
import { ROLE_DEFINITIONS, getProfileById } from './constants';

const App: React.FC = () => {
  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  
  // Navigation State
  const [viewMode, setViewMode] = useState<ViewMode>('discovery');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('dashboard');
  
  // Profile State
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Smooth Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeView, setActiveView] = useState<React.ReactNode>(null);

  const handleLogin = (roleCode: UserRole) => {
    // 1. Find Role Definition
    const roleDef = ROLE_DEFINITIONS.find(r => r.code === roleCode);
    
    if (!roleDef) return;

    // 2. Create Mock User with Permissions
    const mockId = roleCode === 'creator' ? 'u_101' : `u_${Math.floor(Math.random() * 1000)}`;
    const mockName = roleCode === 'creator' ? 'ArtMaster' : roleCode === 'root_admin' ? 'SysAdmin' : 'TechCorp_PM';

    const newUser: User = {
      id: mockId,
      name: mockName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(mockName)}&background=random&color=fff`,
      role: roleCode,
      roleName: roleDef.name,
      permissions: roleDef.defaultPermissions,
      isAuthenticated: true
    };

    setUser(newUser);
    setShowSplash(false);
    setIsLoginModalOpen(false);

    // 3. Set default view based on role
    if (roleCode === 'root_admin' || roleCode === 'platform_admin') {
       changeViewMode('workspace');
       setActiveWorkspaceTab('admin_users'); 
    } else if (roleCode === 'enterprise') {
      changeViewMode('workspace');
      setActiveWorkspaceTab('dashboard');
    } else {
      changeViewMode('discovery'); 
    }
  };

  const handleSetUserRole = (role: UserRole) => {
     handleLogin(role);
  };

  const changeViewMode = (mode: ViewMode) => {
    if (mode === viewMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200); // Wait for fade out
  };

  const handleNavigateToProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    changeViewMode('profile');
  };

  const handleTriggerLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    setUser(null);
    setShowSplash(true);
    changeViewMode('discovery');
  };

  const handleFooterNavigation = (mode: ViewMode) => {
    if (mode === 'workspace' && !user) {
      handleTriggerLogin();
    } else {
      changeViewMode(mode);
    }
  };

  // Render current view content
  const renderContent = () => {
    if (viewMode === 'discovery') {
      return (
        <DiscoveryView 
          onNavigateToProfile={handleNavigateToProfile} 
          onTriggerLogin={handleTriggerLogin}
          user={user}
        />
      );
    } 
    
    if (viewMode === 'profile' && selectedProfileId) {
      return (
        <PersonalSpaceView 
          profile={getProfileById(selectedProfileId)} 
          currentUser={user}
        />
      );
    } 
    
    if (user) {
      // Workspace Views
      return (
        <div className="h-full p-6 md:p-8 overflow-y-auto custom-scrollbar animate-fade-in">
           {activeWorkspaceTab === 'dashboard' && <DashboardView userRole={user.role} />}
           {activeWorkspaceTab === 'dam' && <DAMView />}
           {activeWorkspaceTab === 'projects' && <ProjectsView />}
           {activeWorkspaceTab === 'finance' && <FinanceView user={user} />}
           {(activeWorkspaceTab === 'admin_users' || activeWorkspaceTab === 'admin_roles') && <AdminView />}
        </div>
      );
    } 
    
    // Fallback
    return (
      <div className="flex h-full items-center justify-center flex-col animate-fade-in">
         <h2 className="text-xl font-bold mb-4">请先登录</h2>
         <button onClick={handleTriggerLogin} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">登录 / 注册</button>
      </div>
    );
  };

  // Show Splash Screen for guests initially
  if (!user && showSplash) {
    return (
      <LoginScreen 
        onLogin={handleLogin} 
        onGuestEnter={() => setShowSplash(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* Top Header */}
      <Header 
        viewMode={viewMode} 
        setViewMode={changeViewMode} 
        userRole={user?.role || 'general'} 
        onUploadClick={() => user ? setIsUploadModalOpen(true) : setIsLoginModalOpen(true)}
        currentUser={user}
        onNavigateToProfile={handleNavigateToProfile}
        onLoginClick={handleTriggerLogin}
        onLogout={handleLogout}
      />

      {/* Workspace Sidebar */}
      {viewMode === 'workspace' && user && (
        <Sidebar 
          activeTab={activeWorkspaceTab} 
          setActiveTab={setActiveWorkspaceTab} 
          user={user}
          onRoleChange={handleSetUserRole}
        />
      )}

      {/* Main Content Wrapper */}
      <main className={`flex-1 transition-all duration-300 ${
        viewMode === 'workspace' && user ? 'ml-64 pt-16 h-screen overflow-hidden' : 'pt-0'
      }`}>
        <div className={`h-full w-full transition-opacity duration-200 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
           {renderContent()}
        </div>
      </main>

      {/* Global Footer (Visible in Discovery/Profile) */}
      {(viewMode === 'discovery' || viewMode === 'profile') && !isTransitioning && (
        <Footer 
          onNavigate={handleFooterNavigation}
          onTriggerUpload={() => user ? setIsUploadModalOpen(true) : setIsLoginModalOpen(true)}
        />
      )}

      {/* Global Modals */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        userRole={user?.role}
      />
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

    </div>
  );
};

export default App;