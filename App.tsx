
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
import EnterpriseProfilePage from './components/EnterpriseProfilePage';
import MessagesPage from './components/MessagesPage'; 
import MembershipPage from './components/MembershipPage'; 
import CreditScorePage from './components/CreditScorePage';
import Footer from './components/Footer';
import { ViewMode, WorkspaceTab, UserRole, User, MembershipLevel } from './types';
import { getProfileById } from './constants';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Separate inner component to use the context
const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading: isAuthLoading, login, logout, updateUser } = useAuth();
  
  // UI State
  const [showSplash, setShowSplash] = useState(true); 
  const [viewMode, setViewMode] = useState<ViewMode>('discovery');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('dashboard');
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  
  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Sync Splash State with Auth
  useEffect(() => {
    if (!isAuthLoading) {
      if (isAuthenticated) {
        setShowSplash(false);
      }
    }
  }, [isAuthLoading, isAuthenticated]);

  const handleLoginSuccess = () => {
    setShowSplash(false);
    setIsLoginModalOpen(false);

    // Set default view based on role
    if (user?.role === 'root_admin' || user?.role === 'platform_admin') {
       changeViewMode('workspace');
       setActiveWorkspaceTab('admin_users'); 
    } else if (user?.role === 'enterprise') {
      changeViewMode('workspace');
      setActiveWorkspaceTab('dashboard');
    } else {
      changeViewMode('discovery'); 
    }
  };

  const handleSetUserRole = async (role: UserRole) => {
     // In real app, this would be switching org context or similar
     // For demo, we just update the user object locally via context
     updateUser({ 
       role, 
       roleName: role === 'creator' ? '创作者' : role === 'enterprise' ? '企业主' : '管理员' 
     });
  };

  const handleUpgradeMembership = (level: MembershipLevel) => {
    updateUser({ membershipLevel: level });
  };

  const changeViewMode = (mode: ViewMode) => {
    if (mode === viewMode) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setViewMode(mode);
      setIsTransitioning(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 200);
  };

  const handleNavigateToProfile = (profileId: string) => {
    setSelectedProfileId(profileId);
    changeViewMode('profile');
  };

  const handleTriggerLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleFooterNavigation = (mode: ViewMode) => {
    if (mode === 'workspace' && !isAuthenticated) {
      handleTriggerLogin();
    } else {
      changeViewMode(mode);
    }
  };

  // Render Content Logic
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

    if (viewMode === 'membership') {
      return (
        <MembershipPage 
          onBack={() => changeViewMode('discovery')}
          user={user}
          onUpgrade={handleUpgradeMembership}
          onTriggerLogin={handleTriggerLogin}
        />
      );
    }

    if (viewMode === 'credit_score') {
      return (
        <CreditScorePage 
          onBack={() => {
            if (activeWorkspaceTab === 'dashboard') {
              changeViewMode('workspace');
            } else {
              changeViewMode('discovery');
            }
          }}
          user={user}
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
          onNavigate={changeViewMode}
        />
      );
    }

    if (viewMode === 'enterprise_profile') {
      return (
        <EnterpriseProfilePage 
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
      return <HelpCenterPage onBack={() => changeViewMode('discovery')} />;
    }

    if (viewMode === 'painter_guide_full') {
      return <PainterGuidePage onBack={() => changeViewMode('discovery')} />;
    }

    if (viewMode === 'employer_guide_full') {
      return <EmployerGuidePage onBack={() => changeViewMode('discovery')} />;
    }

    if (viewMode === 'terms_service_full') {
      return <TermsServicePage onBack={() => changeViewMode('discovery')} />;
    }
    
    if (viewMode === 'profile' && selectedProfileId) {
      return (
        <PersonalSpaceView 
          profile={getProfileById(selectedProfileId)} 
          currentUser={user}
        />
      );
    } 
    
    if (isAuthenticated && user) {
      return (
        <div className="h-full p-6 md:p-8 overflow-y-auto custom-scrollbar animate-fade-in">
           {activeWorkspaceTab === 'dashboard' && (
             <DashboardView 
               user={user} 
               onNavigate={changeViewMode}
             />
           )}
           {activeWorkspaceTab === 'dam' && <DAMView />}
           {activeWorkspaceTab === 'projects' && <ProjectsView />}
           {activeWorkspaceTab === 'finance' && <FinanceView user={user} />}
           {(activeWorkspaceTab === 'admin_users' || activeWorkspaceTab === 'admin_roles') && <AdminView />}
           {activeWorkspaceTab === 'membership' && (
             <div className="-m-6 md:-m-8">
               <MembershipPage 
                 user={user} 
                 onUpgrade={handleUpgradeMembership} 
                 onTriggerLogin={() => {}} 
                 onBack={() => setActiveWorkspaceTab('dashboard')} 
                 isEmbedded={true}
               />
             </div>
           )}
        </div>
      );
    } 
    
    // Fallback for unauthenticated access to workspace
    return (
      <div className="flex h-full items-center justify-center flex-col animate-fade-in">
         <h2 className="text-xl font-bold mb-4">请先登录</h2>
         <button onClick={handleTriggerLogin} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">登录 / 注册</button>
      </div>
    );
  };

  // Loading State
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

  // Splash Screen
  if (!isAuthenticated && showSplash) {
    return (
      <LoginScreen 
        onLogin={(role) => {
          login(`${role}_demo@xinhuashe.com`, role).then(handleLoginSuccess);
        }} 
        onGuestEnter={() => setShowSplash(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Header 
        viewMode={viewMode} 
        setViewMode={changeViewMode} 
        userRole={user?.role || 'general'} 
        onUploadClick={() => isAuthenticated ? setIsUploadModalOpen(true) : setIsLoginModalOpen(true)}
        currentUser={user}
        onNavigateToProfile={handleNavigateToProfile}
        onLoginClick={handleTriggerLogin}
        onLogout={logout}
      />

      {viewMode === 'workspace' && isAuthenticated && user && (
        <Sidebar 
          activeTab={activeWorkspaceTab} 
          setActiveTab={setActiveWorkspaceTab} 
          user={user}
          onRoleChange={handleSetUserRole}
        />
      )}

      <main className={`flex-1 transition-all duration-300 ${
        viewMode === 'workspace' && isAuthenticated ? 'ml-64 pt-16 h-screen overflow-hidden' : 'pt-0'
      }`}>
        <div className={`h-full w-full transition-opacity duration-200 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
           {renderContent()}
        </div>
      </main>

      {(viewMode !== 'workspace') && !isTransitioning && (
        <Footer 
          onNavigate={handleFooterNavigation}
          onTriggerUpload={() => isAuthenticated ? setIsUploadModalOpen(true) : setIsLoginModalOpen(true)}
        />
      )}

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        userRole={user?.role}
      />
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={(loggedInUser) => {
           // We already called login via context inside the modal or trigger, 
           // here we just handle the UI transition
           handleLoginSuccess();
        }} 
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
