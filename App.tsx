
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DiscoveryView from './components/DiscoveryView';
import DashboardView from './components/DashboardView';
import DAMView from './components/DAMView';
import ProjectsView from './components/ProjectsView';
import FinanceView from './components/FinanceView';
import LoginScreen from './components/LoginScreen';
import UploadModal from './components/UploadModal';
import AdminView from './components/AdminView'; // New component
import { ViewMode, WorkspaceTab, UserRole, User } from './types';
import { ROLE_DEFINITIONS } from './constants';

const App: React.FC = () => {
  // Authentication State with User Object
  const [user, setUser] = useState<User | null>(null);
  
  // Navigation State
  const [viewMode, setViewMode] = useState<ViewMode>('discovery');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('dashboard');
  
  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleLogin = (roleCode: UserRole) => {
    // 1. Find Role Definition
    const roleDef = ROLE_DEFINITIONS.find(r => r.code === roleCode);
    
    if (!roleDef) return;

    // 2. Create Mock User with Permissions
    const newUser: User = {
      id: `u_${Math.floor(Math.random() * 1000)}`,
      name: roleCode === 'creator' ? 'ArtMaster' : roleCode === 'root_admin' ? 'SysAdmin' : 'TechCorp_PM',
      avatar: `https://picsum.photos/32/32?random=${roleCode.length}`,
      role: roleCode,
      roleName: roleDef.name,
      permissions: roleDef.defaultPermissions,
      isAuthenticated: true
    };

    setUser(newUser);

    // 3. Set default view based on role
    if (roleCode === 'root_admin' || roleCode === 'platform_admin') {
       setViewMode('workspace');
       setActiveWorkspaceTab('admin_users'); // Default to admin panel for admins
    } else if (roleCode === 'enterprise') {
      setViewMode('workspace');
      setActiveWorkspaceTab('dashboard');
    } else {
      setViewMode('discovery'); // Creators usually start at discovery/feed
    }
  };

  const handleSetUserRole = (role: UserRole) => {
     // Helper for quick switching in Header (demo purpose)
     handleLogin(role);
  };

  // If not authenticated, show the Login Entry Screen
  if (!user || !user.isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Top Header */}
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        userRole={user.role}
        setUserRole={handleSetUserRole}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      {/* Workspace Sidebar - Only in Workspace mode */}
      {viewMode === 'workspace' && (
        <Sidebar 
          activeTab={activeWorkspaceTab} 
          setActiveTab={setActiveWorkspaceTab} 
          user={user}
        />
      )}

      {/* Main Content Area */}
      <main className={`transition-all duration-300 ${
        viewMode === 'workspace' ? 'ml-64 pt-16 h-screen overflow-hidden' : 'pt-0'
      }`}>
        
        {viewMode === 'discovery' ? (
          // === COMMUNITY MODE (All users see the same creative content) ===
          <DiscoveryView />
        ) : (
          // === WORKSPACE MODE (Adapts to Role via RBAC) ===
          <div className="h-full p-6 md:p-8 overflow-y-auto custom-scrollbar">
             {/* Content Switcher based on Sidebar selection */}
             {activeWorkspaceTab === 'dashboard' && <DashboardView userRole={user.role} />}
             {activeWorkspaceTab === 'dam' && <DAMView />}
             {activeWorkspaceTab === 'projects' && <ProjectsView />}
             {activeWorkspaceTab === 'finance' && <FinanceView />}
             
             {/* Admin Views */}
             {(activeWorkspaceTab === 'admin_users' || activeWorkspaceTab === 'admin_roles') && <AdminView />}
          </div>
        )}
      </main>

      {/* Global Modals */}
      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
      />

    </div>
  );
};

export default App;
