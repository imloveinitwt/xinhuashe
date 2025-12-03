
import React from 'react';
import { Hexagon, Palette, Briefcase, ArrowRight, ShieldCheck, Sparkles, Globe, Lock } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Hexagon className="w-6 h-6 text-white fill-current" />
          </div>
          <span className="font-bold text-2xl text-slate-900 tracking-tight">薪画社</span>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-sm text-slate-500 hidden md:block">
            创意众包与数字资产管理一体化平台
          </div>
          <button 
            onClick={() => onLogin('root_admin')}
            className="text-xs font-medium text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
          >
            <Lock className="w-3 h-3" /> 后台管理
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left: Intro Text */}
          <div className="flex flex-col justify-center space-y-6 md:pr-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              连接无限创意<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
                驱动商业价值
              </span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              深度整合<strong>全链路约稿交易</strong>、<strong>企业级数字资产管理 (DAM)</strong> 与 <strong>AI 智能创作生态</strong>。
              为创作者提供安全高效的变现渠道，为企业打造智能化的创意供应链系统。
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Globe className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-bold text-slate-800">生态整合</h3>
                  <p className="text-sm text-slate-500">打通社区与交易链路</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Sparkles className="w-5 h-5" /></div>
                <div>
                  <h3 className="font-bold text-slate-800">AI 赋能</h3>
                  <p className="text-sm text-slate-500">智能打标与辅助创作</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Login Cards */}
          <div className="grid grid-cols-1 gap-4">
            
            {/* Artist Entry */}
            <div 
              onClick={() => onLogin('creator')}
              className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-xl hover:border-pink-300 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="relative flex items-center gap-4 mb-4">
                <div className="p-3 bg-pink-100 text-pink-600 rounded-xl group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <Palette className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">我是创作者</h2>
                  <p className="text-slate-500 text-sm">Artist / Designer / Studio</p>
                </div>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-slate-600">
                <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-pink-400" /> 展示作品集与接单</li>
                <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-pink-400" /> 参与赛事与活动</li>
                <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-pink-400" /> 个人收益钱包管理</li>
              </ul>
              <div className="flex items-center text-pink-600 font-bold group-hover:translate-x-2 transition-transform">
                进入工作台 <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

            {/* Client Entry */}
            <div 
              onClick={() => onLogin('enterprise')}
              className="group relative bg-white p-8 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:shadow-xl hover:border-indigo-300 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
              <div className="relative flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Briefcase className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">我是企业主</h2>
                  <p className="text-slate-500 text-sm">Enterprise / Brand / PM</p>
                </div>
              </div>
              <ul className="space-y-2 mb-6 text-sm text-slate-600">
                <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-indigo-400" /> 发布需求与招募人才</li>
                <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-indigo-400" /> 数字资产管理 (DAM)</li>
                <li className="flex items-center gap-2"><ArrowRight className="w-4 h-4 text-indigo-400" /> 企业级财务与发票</li>
              </ul>
              <div className="flex items-center text-indigo-600 font-bold group-hover:translate-x-2 transition-transform">
                进入控制台 <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>

          </div>
        </div>
      </div>
      
      {/* Footer Logos Mockup */}
      <div className="py-8 text-center border-t border-slate-100">
        <p className="text-xs text-slate-400 mb-4 uppercase tracking-wider">核心生态合作伙伴</p>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 opacity-60">
          <a href="https://huajia.163.com/" target="_blank" rel="noreferrer" className="font-bold text-slate-600 hover:text-indigo-600 hover:opacity-100 transition-all">网易画架</a>
          <a href="https://www.mihuashi.com/" target="_blank" rel="noreferrer" className="font-bold text-slate-600 hover:text-indigo-600 hover:opacity-100 transition-all">米画师</a>
          <a href="https://www.tezign.com/" target="_blank" rel="noreferrer" className="font-bold text-slate-600 hover:text-indigo-600 hover:opacity-100 transition-all">特赞</a>
          <a href="https://www.gracg.com/" target="_blank" rel="noreferrer" className="font-bold text-slate-600 hover:text-indigo-600 hover:opacity-100 transition-all">涂鸦王国</a>
          <a href="https://www.huashi6.com/" target="_blank" rel="noreferrer" className="font-bold text-slate-600 hover:text-indigo-600 hover:opacity-100 transition-all">触站</a>
          <a href="https://www.huashilm.com/" target="_blank" rel="noreferrer" className="font-bold text-slate-600 hover:text-indigo-600 hover:opacity-100 transition-all">画盟网</a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
