
import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DiscoveryView from './components/DiscoveryView';
import DashboardView from './components/DashboardView';
import DAMView from './components/DAMView';
import ProjectsView from './components/ProjectsView';
import FinanceView from './components/FinanceView';
import { ViewMode, WorkspaceTab } from './types';

const App: React.FC = () => {
  // Global State
  const [viewMode, setViewMode] = useState<ViewMode>('discovery');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<WorkspaceTab>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Top Header - Always present but changes style */}
      <Header viewMode={viewMode} setViewMode={setViewMode} />

      {/* Workspace Sidebar - Only in Workspace mode */}
      {viewMode === 'workspace' && (
        <Sidebar activeTab={activeWorkspaceTab} setActiveTab={setActiveWorkspaceTab} />
      )}

      {/* Main Content Area */}
      <main className={`transition-all duration-300 ${
        viewMode === 'workspace' ? 'ml-64 pt-16 h-screen overflow-hidden' : 'pt-0'
      }`}>
        
        {viewMode === 'discovery' ? (
          // === COMMUNITY MODE ===
          <DiscoveryView />
        ) : (
          // === WORKSPACE MODE ===
          <div className="h-full p-6 md:p-8 overflow-y-auto custom-scrollbar">
             {/* Content Switcher based on Sidebar selection */}
             {activeWorkspaceTab === 'dashboard' && <DashboardView />}
             {activeWorkspaceTab === 'dam' && <DAMView />}
             {activeWorkspaceTab === 'projects' && <ProjectsView />}
             {activeWorkspaceTab === 'finance' && <FinanceView />}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;