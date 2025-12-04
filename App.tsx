
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
import ArtworksPage from './components/ArtworksPage'; 
import ProjectsHubPage from './components/ProjectsHubPage'; 
import RisingCreatorsPage from './components/RisingCreatorsPage';
import RankingsPage from './components/RankingsPage';
import HelpCenterPage from './components/HelpCenterPage';
import PainterGuidePage from './components/PainterGuidePage';
import EmployerGuidePage from './components/EmployerGuidePage'; 
import TermsServicePage from './components/TermsServicePage'; 
import EnterprisePage from './components/EnterprisePage';
import MessagesPage from './components/MessagesPage'; // Import new page
import Footer from './components/Footer';
import { ViewMode, WorkspaceTab, UserRole, User } from './types';
import { getProfileById } from './constants';
import { AuthService } from './services/AuthService';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  // Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // New loading state
  const [showSplash, setShowSplash] = useState(false); // Changed default to false, handle in useEffect
  
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

  // === INITIALIZATION: Check Session ===
  useEffect(() => {
    const initSession = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // If user exists, stay on current logic or default
          setShowSplash(false);
        } else {
          setShowSplash(true);
        }
      } catch (error) {
        console.error("Session restore failed", error);
        setShowSplash(true);
      } finally {
        setIsAuthLoading(false);
      }
    };
    initSession();
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowSplash(false);
    setIsLoginModalOpen(false);

    // Set default view based on role
    if (loggedInUser.role === 'root_admin' || loggedInUser.role === 'platform_admin') {
       changeViewMode('workspace');
       setActiveWorkspaceTab('admin_users'); 
    } else if (loggedInUser.role === 'enterprise') {
      changeViewMode('workspace');
      setActiveWorkspaceTab('dashboard');
    } else {
      changeViewMode('discovery'); 
    }
  };

  const handleSetUserRole = async (role: UserRole) => {
     // Switch role simulation (In real app, this might be switching organizations)
     const tempUser = AuthService.createMockUser(role, user?.name || 'User');
     setUser(tempUser);
     // Update session in storage (optional for demo)
     // StorageService.setSession(tempUser); 
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

  const handleLogout = async () => {
    await AuthService.logout();
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
          onNavigate={changeViewMode}
        />
      );
    }

    if (viewMode === 'messages') {
      return (
        <MessagesPage 
          onBack={() => changeViewMode('discovery')}
          onNavigate={changeViewMode}
        />
      );
    }

    if (viewMode === 'enterprise_showcase') {
      return (
        <EnterprisePage 
          onBack={() => changeViewMode('discovery')}
          onTriggerLogin={handleTriggerLogin}
          user={user}
        />
      );
    }

    if (viewMode === 'artworks') {
      return (
        <ArtworksPage 
          onBack={() => changeViewMode('discovery')}
          onNavigateToProfile={handleNavigateToProfile}
          onTriggerLogin={handleTriggerLogin}
          user={user}
        />
      );
    }

    if (viewMode === 'projects_hub') {
      return (
        <ProjectsHubPage 
          onBack={() => changeViewMode('discovery')}
          onTriggerLogin={handleTriggerLogin}
          user={user}
        />
      );
    }

    if (viewMode === 'rising_creators') {
      return (
        <RisingCreatorsPage 
          onBack={() => changeViewMode('discovery')}
          onNavigateToProfile={handleNavigateToProfile}
          onTriggerLogin={handleTriggerLogin}
          user={user}
        />
      );
    }

    if (viewMode === 'rankings') {
      return (
        <RankingsPage 
          onBack={() => changeViewMode('discovery')}
          onNavigateToProfile={handleNavigateToProfile}
          onTriggerLogin={handleTriggerLogin}
          user={user}
        />
      );
    }

    if (viewMode === 'help_center') {
      return (
        <HelpCenterPage 
          onBack={() => changeViewMode('discovery')}
        />
      );
    }

    if (viewMode === 'painter_guide_full') {
      return (
        <PainterGuidePage 
          onBack={() => changeViewMode('discovery')}
        />
      );
    }

    if (viewMode === 'employer_guide_full') {
      return (
        <EmployerGuidePage 
          onBack={() => changeViewMode('discovery')}
        />
      );
    }

    if (viewMode === 'terms_service_full') {
      return (
        <TermsServicePage 
          onBack={() => changeViewMode('discovery')}
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

  // Global Loading State
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">正在加载薪画社...</p>
        </div>
      </div>
    );
  }

  // Show Splash Screen for guests initially
  if (!user && showSplash) {
    return (
      <LoginScreen 
        onLogin={(role) => {
          // Quick login for splash screen demo
          AuthService.login(`${role}_demo@xinhuashe.com`, role).then(handleLoginSuccess);
        }} 
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

      {/* Global Footer (Visible in Discovery/Profile/Pages) */}
      {(viewMode === 'discovery' || viewMode === 'profile' || viewMode === 'artworks' || viewMode === 'projects_hub' || viewMode === 'rising_creators' || viewMode === 'rankings' || viewMode === 'help_center' || viewMode === 'painter_guide_full' || viewMode === 'employer_guide_full' || viewMode === 'terms_service_full' || viewMode === 'enterprise_showcase' || viewMode === 'messages') && !isTransitioning && (
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
        onLogin={(user) => handleLoginSuccess(user as any)} // Callback adapter
      />

    </div>
  );
};

export default App;