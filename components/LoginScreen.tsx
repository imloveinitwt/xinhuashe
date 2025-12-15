
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Hexagon, Palette, Briefcase, ArrowRight, ShieldCheck, Sparkles, Globe, Lock, Compass, Zap, Layout, X } from 'lucide-react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
  onGuestEnter: () => void;
}

const RoleSelectionModal = ({ isOpen, onClose, onSelect }: { isOpen: boolean; onClose: () => void; onSelect: (role: UserRole) => void }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-600 bg-white/50 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6"/>
        </button>
        
        <div className="p-8 md:p-12 text-center pb-2 bg-slate-50/50 border-b border-slate-100">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-3">选择您的身份角色</h2>
            <p className="text-slate-500">为您定制专属的工作台与功能体验</p>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                {/* Creator Card */}
                <div 
                    onClick={() => onSelect('creator')}
                    className="group relative bg-white rounded-2xl p-8 cursor-pointer border-2 border-slate-100 hover:border-pink-300 hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 flex flex-col overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-pink-50 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="w-14 h-14 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <Palette className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">我是个人创作者</h3>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            建立专业作品集，接取全球商业订单，享受极速结算与版权保护。
                        </p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm text-slate-600">
                                <Zap className="w-4 h-4 text-pink-500" /> 0手续费提现，T+1 到账
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-600">
                                <Globe className="w-4 h-4 text-pink-500" /> 专属个人主页与作品集
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-600">
                                <ShieldCheck className="w-4 h-4 text-pink-500" /> 交易全额担保与合同支持
                            </li>
                        </ul>
                        <div className="mt-auto pt-4 border-t border-slate-100 w-full">
                            <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl group-hover:bg-pink-600 group-hover:text-white group-hover:border-pink-600 transition-all flex items-center justify-center gap-2">
                                进入创作者工作台 <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enterprise Card */}
                <div 
                    onClick={() => onSelect('enterprise')}
                    className="group relative bg-slate-900 rounded-2xl p-8 cursor-pointer border-2 border-slate-800 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-900/20 transition-all duration-300 flex flex-col overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-900/50 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>

                    <div className="relative z-10 flex flex-col h-full text-white">
                        <div className="w-14 h-14 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                            <Briefcase className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">我是企业/团队</h3>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            一站式解决创意采购、人才管理与数字资产沉淀 (DAM)。
                        </p>
                        <ul className="space-y-3 mb-8 flex-1">
                            <li className="flex items-center gap-2 text-sm text-slate-300">
                                <Layout className="w-4 h-4 text-indigo-400" /> 企业级数字资产库 (DAM)
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-300">
                                <ShieldCheck className="w-4 h-4 text-indigo-400" /> 合规发票与对公结算
                            </li>
                            <li className="flex items-center gap-2 text-sm text-slate-300">
                                <Sparkles className="w-4 h-4 text-indigo-400" /> AI 辅助需求梳理与人才匹配
                            </li>
                        </ul>
                        <div className="mt-auto pt-4 border-t border-white/10 w-full">
                            <button className="w-full py-3 bg-white/10 border border-white/10 text-white font-bold rounded-xl group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all flex items-center justify-center gap-2">
                                进入企业控制台 <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onGuestEnter }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
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
        <div className="text-center max-w-4xl mx-auto mb-12 animate-fade-in-up">
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

        {/* Primary CTA - Replaces the cards */}
        <div className="flex flex-col items-center gap-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <button 
                onClick={() => setIsRoleModalOpen(true)}
                className="group relative px-10 py-5 bg-slate-900 text-white text-xl font-bold rounded-full shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all overflow-hidden flex items-center gap-3"
            >
                <span className="relative z-10 flex items-center gap-2">
                    立即开启探索 <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                {/* Shine effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            </button>

            <button 
              onClick={onGuestEnter}
              className="flex items-center gap-2 px-6 py-3 text-slate-500 font-bold text-sm hover:text-indigo-600 transition-all group"
            >
              <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              我是游客，先逛逛社区
            </button>
        </div>

      </div>
      
      {/* Footer Logos */}
      <div className="relative z-10 py-8 border-t border-slate-100 bg-white/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted by Industry Leaders</p>
          <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2"><div className="w-4 h-4 bg-slate-800 rounded-full"></div>Tencent</span>
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2"><div className="w-4 h-4 bg-red-600 rounded-full"></div>NetEase</span>
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2"><div className="w-4 h-4 bg-blue-500 rounded-full"></div>ByteDance</span>
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2"><div className="w-4 h-4 bg-orange-500 rounded-full"></div>Alibaba</span>
             <span className="font-bold text-slate-800 text-lg flex items-center gap-2"><div className="w-4 h-4 bg-pink-500 rounded-full"></div>Bilibili</span>
          </div>
        </div>
      </div>

      <RoleSelectionModal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
        onSelect={(role) => {
            onLogin(role);
            setIsRoleModalOpen(false);
        }} 
      />

    </div>
  );
};

export default LoginScreen;
