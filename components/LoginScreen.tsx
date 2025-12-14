
import React, { useState, useRef, useEffect } from 'react';
import { Hexagon, Palette, Briefcase, ArrowRight, ShieldCheck, Sparkles, Globe, Lock, Compass, Zap, Layout } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
  onGuestEnter: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGuestEnter }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        setMousePos({
          x: e.clientX,
          y: e.clientY
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const calculateParallax = (factor: number) => {
    const x = (mousePos.x - window.innerWidth / 2) * factor;
    const y = (mousePos.y - window.innerHeight / 2) * factor;
    return `translate(${x}px, ${y}px)`;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-hidden relative">
      
      {/* Background Decor - Interactive Parallax */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-indigo-200/20 rounded-full blur-[120px] mix-blend-multiply transition-transform duration-100 ease-out"
          style={{ transform: calculateParallax(0.02) }}
        ></div>
        <div 
          className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-pink-200/20 rounded-full blur-[120px] mix-blend-multiply transition-transform duration-100 ease-out"
          style={{ transform: calculateParallax(-0.03) }}
        ></div>
        <div 
          className="absolute -bottom-32 left-1/3 w-[800px] h-[800px] bg-blue-200/20 rounded-full blur-[120px] mix-blend-multiply transition-transform duration-100 ease-out"
          style={{ transform: calculateParallax(0.04) }}
        ></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-20 px-6 md:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
            <Hexagon className="w-6 h-6 text-white fill-current" />
          </div>
          <span className="font-extrabold text-2xl text-slate-900 tracking-tight">薪画社</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
             <span>创意众包</span>
             <span>•</span>
             <span>数字资产管理 (DAM)</span>
             <span>•</span>
             <span>AI 赋能</span>
          </div>
          <button 
            onClick={() => onLogin('root_admin')}
            className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1.5 transition-colors bg-white/50 hover:bg-white px-3 py-1.5 rounded-full border border-transparent hover:border-slate-200"
          >
            <Lock className="w-3 h-3" /> 管理员入口
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 py-12 md:py-0">
        
        {/* Headline */}
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-6 shadow-sm">
            <Sparkles className="w-3 h-3" /> 全新 2.0 版本上线
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
            连接无限创意
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
              驱动商业价值
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            专为创作者与企业打造的一站式生态系统。
            <br className="hidden md:block"/>
            整合全链路约稿交易、企业级资产管理与 AI 智能创作工具。
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl mx-auto px-4">
          
          {/* Creator Card */}
          <div 
            onClick={() => onLogin('creator')}
            className="group relative bg-white rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 cursor-pointer transition-all duration-500 overflow-hidden hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-500/10"
          >
            {/* Hover Spotlight Gradient */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(244, 114, 182, 0.05), transparent 40%)` }}
            ></div>
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 bg-pink-50 text-pink-600 rounded-2xl group-hover:bg-pink-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-pink-200">
                  <Palette className="w-8 h-8" />
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500 group-hover:bg-pink-100 group-hover:text-pink-700 transition-colors">
                  我是创作者
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-2">个人创作者</h2>
              <p className="text-slate-500 mb-8 h-12">展示作品集，接取全球商业订单，享受极速结算与版权保护。</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0"><Zap className="w-3.5 h-3.5" /></div>
                  <span className="font-medium">0手续费提现，T+1 到账</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0"><Globe className="w-3.5 h-3.5" /></div>
                  <span className="font-medium">专属个人主页与作品集</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center flex-shrink-0"><ShieldCheck className="w-3.5 h-3.5" /></div>
                  <span className="font-medium">交易全额担保与合同支持</span>
                </li>
              </ul>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center text-pink-600 font-bold group-hover:gap-2 transition-all">
                进入工作台 <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </div>

          {/* Enterprise Card */}
          <div 
            onClick={() => onLogin('enterprise')}
            className="group relative bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-xl shadow-slate-900/20 cursor-pointer transition-all duration-500 overflow-hidden text-white hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.15), transparent 40%)` }}
            ></div>

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-8">
                <div className="p-4 bg-white/10 text-indigo-300 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 backdrop-blur-md border border-white/10 group-hover:border-indigo-500">
                  <Briefcase className="w-8 h-8" />
                </div>
                <div className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-slate-300 border border-white/10 group-hover:bg-indigo-500/20 group-hover:text-indigo-200 transition-colors">
                  我是企业主
                </div>
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-2">企业/团队</h2>
              <p className="text-slate-400 mb-8 h-12">一站式解决创意采购、人才管理与数字资产沉淀 (DAM)。</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0 border border-indigo-500/30"><Layout className="w-3.5 h-3.5" /></div>
                  <span className="font-medium">企业级数字资产库 (DAM)</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0 border border-indigo-500/30"><ShieldCheck className="w-3.5 h-3.5" /></div>
                  <span className="font-medium">合规发票与对公结算</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center flex-shrink-0 border border-indigo-500/30"><Sparkles className="w-3.5 h-3.5" /></div>
                  <span className="font-medium">AI 辅助需求梳理与人才匹配</span>
                </li>
              </ul>

              <div className="mt-auto pt-6 border-t border-white/10 flex items-center text-indigo-300 font-bold group-hover:gap-2 transition-all group-hover:text-white">
                进入控制台 <ArrowRight className="w-5 h-5 ml-2" />
              </div>
            </div>
          </div>

        </div>

        {/* Guest Action */}
        <div className="mt-12 md:mt-16 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <button 
            onClick={onGuestEnter}
            className="group flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-full text-slate-500 font-bold text-sm hover:border-slate-300 hover:text-slate-800 hover:shadow-md transition-all"
          >
            <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform text-slate-400 group-hover:text-indigo-500" />
            我是游客，先逛逛社区
          </button>
        </div>

      </div>
      
      {/* Footer Logos */}
      <div className="relative z-10 py-8 border-t border-slate-100 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted by Industry Leaders</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Mock Logos using text for simplicity in this demo, replace with SVGs in prod */}
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2"><div className="w-4 h-4 bg-slate-800 rounded-full"></div>Tencent</span>
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2"><div className="w-4 h-4 bg-red-600 rounded-full"></div>NetEase</span>
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded-full"></div>ByteDance</span>
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2"><div className="w-4 h-4 bg-orange-500 rounded-full"></div>Alibaba</span>
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2"><div className="w-4 h-4 bg-pink-500 rounded-full"></div>Bilibili</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginScreen;
