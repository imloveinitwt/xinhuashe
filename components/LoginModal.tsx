
import React from 'react';
import { Hexagon, Palette, Briefcase, ArrowRight, X, Globe, Sparkles } from 'lucide-react';
import { UserRole } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (role: UserRole) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative animate-scale-in max-h-[90vh] md:max-h-[600px]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-slate-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Brand & Info */}
        <div className="w-full md:w-2/5 bg-slate-50 p-8 flex flex-col justify-between border-r border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <Hexagon className="w-6 h-6 text-white fill-current" />
              </div>
              <span className="font-bold text-2xl text-slate-900 tracking-tight">薪画社</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight mb-4">
              连接无限创意<br/>
              驱动商业价值
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              深度整合全链路约稿交易、企业级数字资产管理 (DAM) 与 AI 智能创作生态。
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="p-1.5 bg-blue-100 rounded text-blue-600"><Globe className="w-4 h-4" /></div>
                <span>生态整合 · 打通社区与交易</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <div className="p-1.5 bg-purple-100 rounded text-purple-600"><Sparkles className="w-4 h-4" /></div>
                <span>AI 赋能 · 智能辅助创作</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-400">
              点击右侧卡片选择您的身份进行登录或注册。
            </p>
          </div>
        </div>

        {/* Right: Role Selection */}
        <div className="w-full md:w-3/5 p-8 bg-white flex flex-col justify-center overflow-y-auto custom-scrollbar">
          <h3 className="text-xl font-bold text-slate-800 mb-6">请选择您的身份</h3>
          
          <div className="space-y-4">
            {/* Artist Entry */}
            <div 
              onClick={() => onLogin('creator')}
              className="group relative bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-lg hover:border-pink-300 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-pink-100 text-pink-600 rounded-xl group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">我是创作者</h2>
                  <p className="text-slate-500 text-xs">Artist / Designer / Studio</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-slate-600 pl-[4.5rem]">
                展示作品集、参与赛事、接单变现，开启您的创作之旅。
              </p>
            </div>

            {/* Client Entry */}
            <div 
              onClick={() => onLogin('enterprise')}
              className="group relative bg-white p-6 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-lg hover:border-indigo-300 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">我是企业主</h2>
                  <p className="text-slate-500 text-xs">Enterprise / Brand / PM</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 ml-auto group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
              </div>
              <p className="text-sm text-slate-600 pl-[4.5rem]">
                发布需求、招募人才、管理数字资产，构建高效创意供应链。
              </p>
            </div>

            {/* Admin Entry (Small Link) */}
            <div className="pt-4 text-center">
               <button 
                 onClick={() => onLogin('root_admin')}
                 className="text-xs text-slate-400 hover:text-slate-600 underline decoration-slate-300"
               >
                 管理员入口
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
