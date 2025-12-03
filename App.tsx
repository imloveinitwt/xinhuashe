
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DiscoveryView from './components/DiscoveryView';
import DashboardView from './components/DashboardView';
import DAMView from './components/DAMView';
import ProjectsView from './components/ProjectsView';
import FinanceView from './components/FinanceView';
import UploadModal from './components/UploadModal';
import LoginModal from './components/LoginModal'; // New Component
import AdminView from './components/AdminView';
import PersonalSpaceView from './components/PersonalSpaceView'; 
import Footer from './components/Footer';
import { ViewMode, WorkspaceTab, UserRole, User } from './types';
import { ROLE_DEFINITIONS, getProfileById } from './constants';

const App: React.FC = () => {
  // Authentication State: Default to null (Guest)
  const [user, setUser] = useState<User | null>(null);
  
  // Navigation State
  const [viewMode, setViewMode] = useState<ViewMode>('discovery');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('dashboard');
  
  // Profile State
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
    setIsLoginModalOpen(false);

    // 3. Set default view based on role
    if (roleCode === 'root_admin' || roleCode === 'platform_admin') {
       setViewMode('workspace');
       setActiveWorkspaceTab('admin_users'); 
    } else if (roleCode === 'enterprise') {
      setViewMode('workspace');
      setActiveWorkspaceTab('dashboard');
    } else {
      setViewMode('discovery'); 
    }
  };

  const handleSetUserRole = (role: UserRole) => {
     handleLogin(role);
  };

  const handleNavigateToProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    setViewMode('profile');
  };

  const handleTriggerLogin = () => {
    setIsLoginModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      
      {/* Top Header */}
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        userRole={user?.role || 'general'} // Default to general if guest
        setUserRole={handleSetUserRole}
        onUploadClick={() => user ? setIsUploadModalOpen(true) : setIsLoginModalOpen(true)}
        currentUser={user}
        onNavigateToProfile={handleNavigateToProfile}
        onLoginClick={handleTriggerLogin}
      />

      {/* Workspace Sidebar - Only in Workspace mode AND if authenticated */}
      {viewMode === 'workspace' && user && (
        <Sidebar 
          activeTab={activeWorkspaceTab} 
          setActiveTab={setActiveWorkspaceTab} 
          user={user}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${
        viewMode === 'workspace' && user ? 'ml-64 pt-16 h-screen overflow-hidden' : 'pt-0'
      }`}>
        
        {viewMode === 'discovery' ? (
          // === COMMUNITY MODE (Default for Guests) ===
          <DiscoveryView 
            onNavigateToProfile={handleNavigateToProfile} 
            onTriggerLogin={handleTriggerLogin}
            user={user}
          />
        ) : viewMode === 'profile' && selectedProfileId ? (
          // === PERSONAL SPACE MODE ===
          <PersonalSpaceView 
            profile={getProfileById(selectedProfileId)} 
            currentUser={user}
          />
        ) : user ? (
          // === WORKSPACE MODE (Auth Required) ===
          <div className="h-full p-6 md:p-8 overflow-y-auto custom-scrollbar">
             {activeWorkspaceTab === 'dashboard' && <DashboardView userRole={user.role} />}
             {activeWorkspaceTab === 'dam' && <DAMView />}
             {activeWorkspaceTab === 'projects' && <ProjectsView />}
             {activeWorkspaceTab === 'finance' && <FinanceView />}
             {(activeWorkspaceTab === 'admin_users' || activeWorkspaceTab === 'admin_roles') && <AdminView />}
          </div>
        ) : (
          // Fallback if trying to access workspace as guest
          <div className="flex h-full items-center justify-center flex-col">
             <h2 className="text-xl font-bold mb-4">请先登录</h2>
             <button onClick={handleTriggerLogin} className="px-6 py-2 bg-indigo-600 text-white rounded-lg">登录 / 注册</button>
          </div>
        )}
      </main>

      {/* Global Footer (Visible in Discovery/Profile) */}
      {(viewMode === 'discovery' || viewMode === 'profile') && <Footer />}

      {/* Global Modals */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
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
