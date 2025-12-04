import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';

// Layout Components
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import UploadModal from './components/UploadModal';
import LoginScreen from './components/LoginScreen';

// Lazy Loaded Pages for Performance
const DiscoveryView = lazy(() => import('./components/DiscoveryView'));
const DashboardView = lazy(() => import('./components/DashboardView'));
const DAMView = lazy(() => import('./components/DAMView'));
const ProjectsView = lazy(() => import('./components/ProjectsView'));
const FinanceView = lazy(() => import('./components/FinanceView'));
const AdminView = lazy(() => import('./components/AdminView'));
const PersonalSpaceView = lazy(() => import('./components/PersonalSpaceView'));
const ArtworksPage = lazy(() => import('./components/ArtworksPage'));
const ProjectsHubPage = lazy(() => import('./components/ProjectsHubPage'));
const RisingCreatorsPage = lazy(() => import('./components/RisingCreatorsPage'));
const RankingsPage = lazy(() => import('./components/RankingsPage'));
const HelpCenterPage = lazy(() => import('./components/HelpCenterPage'));
const PainterGuidePage = lazy(() => import('./components/PainterGuidePage'));
const EmployerGuidePage = lazy(() => import('./components/EmployerGuidePage'));
const TermsServicePage = lazy(() => import('./components/TermsServicePage'));
const EnterprisePage = lazy(() => import('./components/EnterprisePage'));
const MessagesPage = lazy(() => import('./components/MessagesPage'));

// --- Layout Wrappers ---

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Check if we are in workspace mode based on URL
  const isWorkspace = location.pathname.startsWith('/workspace') && !!user;

  // Handler for global navigation actions
  const handleUpload = () => user ? setIsUploadOpen(true) : setIsLoginOpen(true);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Header 
        isWorkspace={isWorkspace}
        onLoginClick={() => setIsLoginOpen(true)}
        onUploadClick={handleUpload}
      />
      
      {isWorkspace && user && <Sidebar />}

      <main className={`flex-1 transition-all duration-300 ${isWorkspace ? 'lg:ml-64 pt-16 h-[calc(100vh-64px)] overflow-hidden' : 'pt-0'}`}>
        <Suspense fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        }>
          {/* Inject onTriggerLogin to children if they accept it */}
          {React.Children.map(children, child => {
             if (React.isValidElement(child)) {
               // @ts-ignore - Dynamic prop injection
               return React.cloneElement(child, { onTriggerLogin: () => setIsLoginOpen(true) });
             }
             return child;
          })}
        </Suspense>
      </main>

      {!isWorkspace && (
        <Footer 
          onNavigate={(mode) => {
             // Map legacy viewMode to routes
             const routes: Record<string, string> = {
               'workspace': '/workspace',
               'help_center': '/help',
               'painter_guide_full': '/guide/painter',
               'employer_guide_full': '/guide/employer',
               'terms_service_full': '/terms'
             };
             navigate(routes[mode] || '/');
          }}
          onTriggerUpload={handleUpload}
        />
      )}

      {/* Global Modals */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
        onLogin={() => setIsLoginOpen(false)} 
      />
      <UploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        userRole={user?.role}
      />
    </div>
  );
};

// --- Protected Route Wrapper ---
const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null; // Or a spinner

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// --- Main App Component ---
const App: React.FC = () => {
  const { user, isLoading, login } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  // Handle Splash Screen Logic
  if (isLoading) return null;

  if (!user && showSplash) {
    return (
      <LoginScreen 
        onLogin={async (role) => {
          await login(`${role}_demo@xinhuashe.com`, role);
          setShowSplash(false);
        }} 
        onGuestEnter={() => setShowSplash(false)}
      />
    );
  }

  return (
    <MainLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<DiscoveryView />} />
        <Route path="/artworks" element={<ArtworksPage onBack={() => window.history.back()} />} />
        <Route path="/projects" element={<ProjectsHubPage onBack={() => window.history.back()} />} />
        <Route path="/creators" element={<RisingCreatorsPage onBack={() => window.history.back()} />} />
        <Route path="/rankings" element={<RankingsPage onBack={() => window.history.back()} />} />
        <Route path="/enterprise" element={<EnterprisePage onBack={() => window.history.back()} />} />
        <Route path="/help" element={<HelpCenterPage onBack={() => window.history.back()} />} />
        <Route path="/guide/painter" element={<PainterGuidePage onBack={() => window.history.back()} />} />
        <Route path="/guide/employer" element={<EmployerGuidePage onBack={() => window.history.back()} />} />
        <Route path="/terms" element={<TermsServicePage onBack={() => window.history.back()} />} />
        <Route path="/profile/:id" element={<PersonalSpaceView profile={user ? { ...user, displayName: user.name, userId: user.id } as any : {} as any} currentUser={user} />} />

        {/* Protected Routes (Workspace) */}
        <Route path="/messages" element={<ProtectedRoute><MessagesPage onBack={() => window.history.back()} /></ProtectedRoute>} />
        
        <Route path="/workspace" element={<ProtectedRoute><DashboardView userRole={user?.role || 'creator'} /></ProtectedRoute>} />
        <Route path="/workspace/projects" element={<ProtectedRoute><ProjectsView /></ProtectedRoute>} />
        <Route path="/workspace/dam" element={<ProtectedRoute><DAMView /></ProtectedRoute>} />
        <Route path="/workspace/finance" element={<ProtectedRoute><FinanceView user={user!} /></ProtectedRoute>} />
        <Route path="/workspace/admin/users" element={<ProtectedRoute><AdminView /></ProtectedRoute>} />
        <Route path="/workspace/admin/roles" element={<ProtectedRoute><AdminView /></ProtectedRoute>} />

        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};

export default App;