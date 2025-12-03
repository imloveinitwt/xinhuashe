
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
import { ViewMode, WorkspaceTab, UserRole } from './types';

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('artist'); 
  
  // Navigation State
  const [viewMode, setViewMode] = useState<ViewMode>('discovery');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('dashboard');
  
  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsAuthenticated(true);
    // Set default view based on role
    if (role === 'client') {
      setViewMode('workspace');
      setActiveWorkspaceTab('dashboard');
    } else {
      setViewMode('discovery');
    }
  };

  // If not authenticated, show the Login Entry Screen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Top Header */}
      <Header 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
        userRole={userRole}
        setUserRole={setUserRole}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      {/* Workspace Sidebar - Only in Workspace mode */}
      {viewMode === 'workspace' && (
        <Sidebar 
          activeTab={activeWorkspaceTab} 
          setActiveTab={setActiveWorkspaceTab} 
          userRole={userRole}
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
          // === WORKSPACE MODE (Adapts to Role) ===
          <div className="h-full p-6 md:p-8 overflow-y-auto custom-scrollbar">
             {/* Content Switcher based on Sidebar selection */}
             {activeWorkspaceTab === 'dashboard' && <DashboardView userRole={userRole} />}
             {activeWorkspaceTab === 'dam' && <DAMView />}
             {activeWorkspaceTab === 'projects' && <ProjectsView />}
             {activeWorkspaceTab === 'finance' && <FinanceView />}
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
