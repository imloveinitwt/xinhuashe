import React from 'react';
import { Bell, MessageSquare, Hexagon } from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode }) => {
  return (
    <header className={`fixed top-0 w-full z-30 transition-all duration-300 ${
      viewMode === 'workspace' 
      ? 'pl-64 bg-white border-b border-slate-200' 
      : 'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm'
    }`}>
      <div className="px-6 h-16 flex items-center justify-between">
        
        {/* Left: Branding (Only visible in discovery mode) */}
        {viewMode === 'discovery' ? (
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Hexagon className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">UniCreative</span>
          </div>
        ) : (
          /* Spacer for workspace mode */
          <div></div> 
        )}

        {/* Center: Mode Switcher (The Core Feature) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="bg-slate-100 p-1 rounded-full flex items-center">
            <button
              onClick={() => setViewMode('discovery')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                viewMode === 'discovery' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              社区
            </button>
            <button
              onClick={() => setViewMode('workspace')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                viewMode === 'workspace' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              工作台
            </button>
          </div>
        </div>

        {/* Right: User Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <MessageSquare className="w-5 h-5" />
          </button>
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-px bg-slate-200 mx-1"></div>
          <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 py-1 px-2 rounded-lg transition-colors">
            <img 
              src="https://picsum.photos/32/32?random=99" 
              alt="User" 
              className="w-8 h-8 rounded-full border border-slate-200"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-800 leading-none">Alex Chen</p>
              <p className="text-xs text-slate-500 mt-1 leading-none">艺术总监</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;