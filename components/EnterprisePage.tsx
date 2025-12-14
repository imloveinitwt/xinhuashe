
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Building, ShieldCheck, Zap, Layers, 
  Users, BarChart, FileText, CheckCircle2, ArrowRight,
  Briefcase, Globe, Cpu, ChevronRight, LayoutTemplate,
  PieChart, MessageSquare, Monitor, Star, Quote, Shield,
  Check, X, Lock, Server, Key, HelpCircle, ChevronDown, CheckCircle,
  PlayCircle, MousePointerClick, TrendingUp, Gamepad2, ShoppingBag,
  Rocket
} from 'lucide-react';
import { User, ViewMode } from '../types';
import { MOCK_PROJECT_CASES } from '../constants';

interface EnterprisePageProps {
  onBack: () => void;
  onTriggerLogin?: () => void;
  user?: User | null;
  onNavigate?: (mode: ViewMode) => void;
}

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => (
  <div className="border-b border-slate-200 last:border-0">
    <button 
      className="w-full flex items-center justify-between py-6 text-left focus:outline-none group"
      onClick={onClick}
    >
      <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-800 group-hover:text-indigo-600'}`}>
        {question}
      </span>
      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
    </button>
    <div 
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
    >
      <p className="text-slate-600 leading-relaxed text-base pr-8 pl-4 border-l-2 border-indigo-100">
        {answer}
      </p>
    </div>
  </div>
);

const EnterprisePage: React.FC<EnterprisePageProps> = ({ onBack, onTriggerLogin, user, onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
      
      // Improved Scroll Spy with offset
      const sections = ['hero', 'solutions', 'workflow', 'value', 'security', 'faq'];
      const scrollPos = window.scrollY + 200; // Offset for sticky header

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 140; // Adjust for headers
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-0 pt-16 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Sticky Navigation Bar */}
      <div className={`sticky top-16 z-40 transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur-xl border-slate-200 shadow-sm py-3' : 'bg-slate-900 border-white/10 py-4'}`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
           <div className="flex items-center gap-8">
             <div className={`font-extrabold text-xl tracking-tight flex items-center gap-2 ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
                <Building className={`w-5 h-5 ${isScrolled ? 'text-indigo-600' : 'text-indigo-400'}`} />
                Enterprise <span className="text-indigo-500 font-medium px-1.5 py-0.5 bg-indigo-500/10 rounded text-sm border border-indigo-500/20">PRO</span>
             </div>
             <div className="hidden md:flex gap-1">
                {[
                  { id: 'hero', label: '首页' },
                  { id: 'solutions', label: '解决方案' },
                  { id: 'workflow', label: '工作流' },
                  { id: 'value', label: '价值对比' },
                  { id: 'security', label: '安全合规' },
                  { id: 'faq', label: 'FAQ' }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                      activeSection === item.id
                        ? (isScrolled ? 'bg-indigo-600 text-white shadow-md' : 'bg-white/20 text-white backdrop-blur-sm')
                        : (isScrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/10')
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
             </div>
           </div>
           
           <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className={`hidden lg:flex items-center gap-2 text-sm font-medium transition-colors ${isScrolled ? 'text-slate-500 hover:text-indigo-600' : 'text-slate-400 hover:text-white'}`}
              >
                返回社区
              </button>
              <button 
                onClick={() => onTriggerLogin && onTriggerLogin()}
                className={`text-sm font-bold px-5 py-2 rounded-lg transition-all shadow-sm ${
                  isScrolled 
                    ? 'bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5' 
                    : 'bg-white text-indigo-900 hover:bg-indigo-50 hover:shadow-indigo-500/20'
                }`}
              >
                免费试用
              </button>
           </div>
        </div>
      </div>

      {/* 1. Hero Section */}
      <div id="hero" className="relative bg-[#0B0F19] text-white overflow-hidden pt-20 pb-40 lg:pt-32 lg:pb-48">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-indigo-600/20 rounded-full opacity-40 blur-[120px] -mr-40 -mt-40 pointer-events-none animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full opacity-30 blur-[100px] -ml-20 -mb-20 pointer-events-none animate-pulse" style={{animationDuration: '10s'}}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto space-y-8 animate-fade-in-up">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-bold backdrop-blur-md shadow-lg shadow-indigo-900/20">
              <Rocket className="w-4 h-4 fill-current" /> 企业级创意供应链解决方案
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
              构建智能化<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300 drop-shadow-sm">
                数字创意中台
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              一站式解决企业内容生产痛点。从<span className="text-white font-medium">海量人才匹配</span>、<span className="text-white font-medium">敏捷项目管理</span>到<span className="text-white font-medium">数字资产沉淀</span>，
              让创意的流转像代码一样高效、可控。
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-5 pt-8 w-full sm:w-auto">
              <button 
                onClick={() => onTriggerLogin && onTriggerLogin()}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 text-lg w-full sm:w-auto hover:-translate-y-1"
              >
                免费试用企业版 <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('enterprise_profile')}
                className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors backdrop-blur-sm flex items-center justify-center gap-2 w-full sm:w-auto hover:-translate-y-1"
              >
                <PlayCircle className="w-5 h-5" /> 查看演示主页
              </button>
            </div>

            {/* Trusted By Strip */}
            <div className="pt-20 border-t border-white/5 mt-12 w-full max-w-4xl">
               <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-8">深受 500+ 创新企业信赖</p>
               <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                  {['Tencent 腾讯', 'NetEase 网易', 'ByteDance', 'MiHoYo', 'Alibaba Design', 'Bilibili'].map((brand, i) => (
                     <div key={i} className="text-lg font-bold font-mono text-white flex items-center gap-2 cursor-default hover:text-indigo-300 transition-colors">
                        <Building className="w-5 h-5 text-white/50" /> {brand}
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Value Stats Bar (Floating) */}
      <div className="-mt-24 relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-10 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex flex-col items-center text-center px-4 group hover:-translate-y-1 transition-transform duration-300">
               <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                  <TrendingUp className="w-7 h-7" />
               </div>
               <div className="text-5xl font-black text-slate-900 mb-2 group-hover:text-green-600 transition-colors tracking-tight">30%</div>
               <div className="text-base font-bold text-slate-800">降低采购成本</div>
               <p className="text-sm text-slate-500 mt-1 max-w-[200px]">通过直连创作者与透明报价体系，去除中间商溢价</p>
            </div>
            <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0 group hover:-translate-y-1 transition-transform duration-300">
               <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                  <Zap className="w-7 h-7" />
               </div>
               <div className="text-5xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors tracking-tight">3x</div>
               <div className="text-base font-bold text-slate-800">提升交付效率</div>
               <p className="text-sm text-slate-500 mt-1 max-w-[200px]">标准化的在线验收与实时反馈流程，缩短项目周期</p>
            </div>
            <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0 group hover:-translate-y-1 transition-transform duration-300">
               <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm">
                  <ShieldCheck className="w-7 h-7" />
               </div>
               <div className="text-5xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors tracking-tight">100%</div>
               <div className="text-base font-bold text-slate-800">合规与安全</div>
               <p className="text-sm text-slate-500 mt-1 max-w-[200px]">资金托管担保、版权存证与增值税专票支持</p>
            </div>
         </div>
      </div>

      {/* 3. Core Solutions (Bento Grid) */}
      <div id="solutions" className="py-32 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-20">
            <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-3 block">Core Solutions</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">全链路创意管理闭环</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-xl leading-relaxed">
               打通需求、供给、协作与资产管理，重塑企业外部创意合作流。
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[minmax(320px,auto)]">
            
            {/* Feature 1: Talent */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 via-white to-white rounded-[2.5rem] border border-indigo-100 p-10 flex flex-col md:flex-row items-center gap-10 group hover:shadow-2xl hover:shadow-indigo-100/50 transition-all relative overflow-hidden">
               <div className="flex-1 space-y-6 relative z-10">
                  <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                     <Users className="w-7 h-7" />
                  </div>
                  <div>
                     <h3 className="text-3xl font-bold text-slate-900 mb-3">弹性人才供应链</h3>
                     <p className="text-slate-600 leading-relaxed text-lg">
                        聚合 10万+ 认证创作者，覆盖插画、UI、3D等全品类。支持按项目组建虚拟团队，解决企业用人波峰波谷难题。
                     </p>
                  </div>
                  <ul className="space-y-3 text-sm font-medium text-slate-600">
                     <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" /> 实名认证与技能考核体系</li>
                     <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" /> 平台顾问辅助选人组队</li>
                  </ul>
               </div>
               <div className="w-full md:w-1/2 aspect-video bg-white rounded-2xl shadow-xl border border-slate-200/50 p-3 rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 ease-out">
                  <div className="h-full w-full bg-slate-50 rounded-xl overflow-hidden relative">
                     <div className="absolute top-4 left-4 right-4 flex gap-2">
                        <div className="h-2.5 w-12 bg-slate-200 rounded-full"></div>
                        <div className="h-2.5 w-24 bg-slate-200 rounded-full"></div>
                     </div>
                     <div className="absolute top-12 left-4 right-4 grid grid-cols-3 gap-3">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-slate-200 rounded-lg animate-pulse" style={{animationDelay: `${i*100}ms`}}></div>)}
                     </div>
                  </div>
               </div>
            </div>

            {/* Feature 2: Compliance */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all group">
               <div>
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform shadow-sm">
                     <ShieldCheck className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">财务合规风控</h3>
                  <p className="text-slate-500 leading-relaxed">
                     公对公结算，统一开具增值税专票，解决个人画师无法开票难题。标准化的版权转让协议，规避法律风险。
                  </p>
               </div>
               <div className="mt-8 flex items-center justify-between text-xs font-bold text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /> 电子合同</div>
                  <div className="w-px h-4 bg-slate-300"></div>
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-slate-400" /> 版权证书</div>
               </div>
            </div>

            {/* Feature 3: SaaS Collaboration */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all group">
               <div>
                  <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform shadow-sm">
                     <Zap className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">可视化项目协作</h3>
                  <p className="text-slate-500 leading-relaxed">
                     专为创意验收设计的协作工具。支持在线红字批注、版本对比、分阶段验收。沟通记录全程留痕，避免扯皮。
                  </p>
               </div>
               <div className="mt-8 relative h-20 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                  <div className="absolute top-4 left-4 bg-white border border-slate-200 shadow-md px-3 py-2 rounded-lg text-xs text-purple-700 font-bold flex items-center gap-2 animate-bounce">
                     <MessageSquare className="w-4 h-4" /> 修改意见: 颜色加深
                  </div>
               </div>
            </div>

            {/* Feature 4: DAM */}
            <div className="md:col-span-2 bg-[#0F172A] rounded-[2.5rem] border border-slate-800 p-10 flex flex-col md:flex-row items-center gap-10 group overflow-hidden relative">
               <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[80px] -mr-20 -mt-20"></div>
               <div className="flex-1 space-y-6 relative z-10">
                  <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner border border-white/10">
                     <Layers className="w-7 h-7" />
                  </div>
                  <div>
                     <h3 className="text-3xl font-bold text-white mb-3">企业数字资产库 (DAM)</h3>
                     <p className="text-slate-400 leading-relaxed text-lg">
                        验收通过的文件自动归档。集成 Gemini AI 视觉大模型，自动为素材打标分类。
                        支持以图搜图，实现企业内部资产的快速检索与复用。
                     </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                     <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/30">AI 自动标签</span>
                     <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1.5 rounded-lg border border-indigo-500/30">源文件版本管理</span>
                  </div>
               </div>
               <div className="w-full md:w-1/2 relative z-10">
                  <div className="bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex gap-4 shadow-2xl transform rotate-2 group-hover:rotate-0 transition-all duration-500">
                     <div className="w-1/3 aspect-[3/4] bg-slate-700 rounded-xl animate-pulse"></div>
                     <div className="flex-1 space-y-3 py-2">
                        <div className="h-4 w-1/2 bg-slate-700 rounded-full"></div>
                        <div className="h-3 w-full bg-slate-700 rounded-full opacity-60"></div>
                        <div className="h-3 w-2/3 bg-slate-700 rounded-full opacity-60"></div>
                        <div className="flex gap-2 mt-4">
                           <div className="h-6 w-16 bg-indigo-500/40 rounded-md border border-indigo-500/20"></div>
                           <div className="h-6 w-16 bg-indigo-500/40 rounded-md border border-indigo-500/20"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>

      {/* 4. Workflow Visualization */}
      <div id="workflow" className="bg-white py-32 border-y border-slate-100">
         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
               <span className="text-slate-400 font-bold tracking-widest uppercase text-xs mb-3 block">Process</span>
               <h2 className="text-4xl font-extrabold text-slate-900 mb-4">标准化作业流程 (SOP)</h2>
               <p className="text-slate-500 text-lg">规范的交付标准，确保每一个项目都能按时、按质交付</p>
            </div>

            <div className="relative">
               {/* Connecting Line */}
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                  {[
                     { icon: FileText, title: '发布需求', desc: 'AI 辅助梳理需求，明确交付标准与预算范围' },
                     { icon: Users, title: '智能匹配', desc: '系统算法推荐 + 顾问人工筛选，精准匹配候选人' },
                     { icon: LayoutTemplate, title: '过程管理', desc: '分阶段资金托管，节点式验收，进度透明可控' },
                     { icon: Briefcase, title: '交付结算', desc: '源文件自动归档 DAM，自动生成合规发票' }
                  ].map((step, i) => (
                     <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm text-center group hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
                        <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-md group-hover:bg-indigo-600 group-hover:text-white transition-colors relative transform group-hover:rotate-6 duration-300">
                           <step.icon className="w-9 h-9" />
                           <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full border border-slate-100 flex items-center justify-center text-sm font-bold text-slate-400 shadow-sm">
                              {i + 1}
                           </div>
                        </div>
                        <h4 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h4>
                        <p className="text-slate-500 leading-relaxed text-sm">{step.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* 5. Industry Scenarios */}
      <div className="bg-slate-50 py-32">
         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="flex-1 space-y-10">
                  <div>
                     <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-3 block">Use Cases</span>
                     <h2 className="text-4xl font-extrabold text-slate-900 mb-6">多行业场景覆盖</h2>
                     <p className="text-slate-600 leading-relaxed text-xl">
                        无论您是游戏开发商、品牌方还是电商企业，薪画社都能提供适配的创意解决方案。
                     </p>
                  </div>
                  
                  <div className="space-y-6">
                     {[
                        { icon: Gamepad2, color: 'bg-blue-100 text-blue-600', title: '游戏研发', desc: '角色原画、场景概念、UI图标、Spine动画、3D建模' },
                        { icon: ShoppingBag, color: 'bg-orange-100 text-orange-600', title: '品牌营销', desc: 'KV海报、吉祥物设计、包装设计、企业VI升级' },
                        { icon: Globe, color: 'bg-green-100 text-green-600', title: '跨境电商', desc: '产品精修、详情页设计、海外社媒素材、短视频剪辑' }
                     ].map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm flex items-start gap-6 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all group cursor-default">
                           <div className={`p-4 rounded-xl ${item.color} group-hover:scale-110 transition-transform`}>
                              <item.icon className="w-7 h-7" />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900 text-xl mb-2">{item.title}</h4>
                              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="flex-1 relative h-[600px] w-full lg:w-auto">
                  <div className="absolute top-10 right-10 left-10 bottom-10 bg-indigo-200/50 rounded-[3rem] transform rotate-6"></div>
                  <div className="absolute inset-0 grid grid-cols-2 gap-6">
                     <img src="https://picsum.photos/seed/game_concept/500/700" className="w-full h-full object-cover rounded-3xl shadow-2xl translate-y-12 border-4 border-white" alt="Game Art" />
                     <img src="https://picsum.photos/seed/branding_mockup/500/700" className="w-full h-full object-cover rounded-3xl shadow-2xl -translate-y-12 border-4 border-white" alt="Brand Design" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 6. Comparison Table */}
      <div id="value" className="py-32 bg-white border-t border-slate-100 scroll-mt-20">
         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
               <span className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-3 block">Why Choose Us</span>
               <h2 className="text-4xl font-extrabold text-slate-900 mb-6">为什么选择薪画社企业版？</h2>
            </div>
            
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 shadow-2xl">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 text-slate-800">
                        <th className="p-8 w-1/4 font-bold border-b border-r border-slate-200 text-lg">对比维度</th>
                        <th className="p-8 w-1/4 text-slate-500 border-b border-slate-200 font-bold bg-slate-50/50">传统线下外包</th>
                        <th className="p-8 w-1/4 text-slate-500 border-b border-slate-200 font-bold bg-slate-50/50">普通约稿平台</th>
                        <th className="p-8 w-1/4 text-indigo-600 bg-indigo-50/80 border-b border-indigo-100 font-extrabold text-xl relative">
                           薪画社企业版
                           <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">RECOMMENDED</div>
                        </th>
                     </tr>
                  </thead>
                  <tbody className="text-base">
                     <tr>
                        <td className="p-8 font-bold text-slate-700 border-b border-r border-slate-100">人才匹配效率</td>
                        <td className="p-8 text-slate-500 border-b border-slate-100">低 (依靠人工，周期长)</td>
                        <td className="p-8 text-slate-500 border-b border-slate-100">中 (海量筛选，质量参差)</td>
                        <td className="p-8 bg-indigo-50/30 border-b border-indigo-50 font-bold text-slate-900">
                           <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 fill-current text-white"/> 高 (AI 智能推荐 + 顾问精选)</div>
                        </td>
                     </tr>
                     <tr>
                        <td className="p-8 font-bold text-slate-700 border-b border-r border-slate-100">合规与发票</td>
                        <td className="p-8 text-slate-500 border-b border-slate-100">繁琐 (需逐个供应商处理)</td>
                        <td className="p-8 text-slate-500 border-b border-slate-100">困难 (个人画师难开票)</td>
                        <td className="p-8 bg-indigo-50/30 border-b border-indigo-50 font-bold text-slate-900">
                           <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 fill-current text-white"/> 完美 (平台统一开具专票)</div>
                        </td>
                     </tr>
                     <tr>
                        <td className="p-8 font-bold text-slate-700 border-b border-r border-slate-100">项目管理与协作</td>
                        <td className="p-8 text-slate-500 border-b border-slate-100">黑盒 (邮件/微信沟通，难追溯)</td>
                        <td className="p-8 text-slate-500 border-b border-slate-100">基础 (仅提供简单的IM)</td>
                        <td className="p-8 bg-indigo-50/30 border-b border-indigo-50 font-bold text-slate-900">
                           <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 fill-current text-white"/> 专业 (SaaS 全流程可视化)</div>
                        </td>
                     </tr>
                     <tr>
                        <td className="p-8 font-bold text-slate-700 border-b border-r border-slate-100">资产沉淀 (DAM)</td>
                        <td className="p-8 text-slate-500 border-b border-slate-100">无 (散落在硬盘/网盘)</td>
                        <td className="p-8 text-slate-500 border-b border-slate-100">无 (交易结束即终止)</td>
                        <td className="p-8 bg-indigo-50/30 border-b border-indigo-50 font-bold text-slate-900">
                           <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 fill-current text-white"/> 强大 (AI 自动打标，企业级资产库)</div>
                        </td>
                     </tr>
                     <tr>
                        <td className="p-8 font-bold text-slate-700 border-r border-slate-100">综合成本</td>
                        <td className="p-8 text-slate-500">高 (包含高额中介溢价)</td>
                        <td className="p-8 text-slate-500">中 (沟通试错成本高)</td>
                        <td className="p-8 bg-indigo-50/30 font-bold text-slate-900">
                           <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-500 fill-current text-white"/> 优 (去中介化，透明报价)</div>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* 7. Enterprise Security & Integration */}
      <div id="security" className="py-32 bg-slate-900 text-white relative overflow-hidden scroll-mt-20">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
               <h2 className="text-4xl font-bold mb-6">企业级安全与生态集成</h2>
               <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
                  按照金融级安全标准构建，支持私有化部署与主流办公软件打通，无缝融入您的工作流。
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:text-indigo-400 text-slate-400 shadow-inner border border-slate-800">
                     <Lock className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-xl mb-3">数据安全合规</h4>
                  <p className="text-slate-400 leading-relaxed">
                     通过 ISO 27001 信息安全认证，支持数据加密存储与传输，全链路保障企业商业机密。
                  </p>
               </div>
               <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:text-indigo-400 text-slate-400 shadow-inner border border-slate-800">
                     <Server className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-xl mb-3">私有化部署</h4>
                  <p className="text-slate-400 leading-relaxed">
                     支持私有云及混合云部署方案，数据自主可控，满足大型集团企业IT管控要求。
                  </p>
               </div>
               <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:text-indigo-400 text-slate-400 shadow-inner border border-slate-800">
                     <Key className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-xl mb-3">SSO 单点登录</h4>
                  <p className="text-slate-400 leading-relaxed">
                     预置主流 OA 系统 (钉钉/企业微信/飞书) 接口，账号体系一键打通，降低管理成本。
                  </p>
               </div>
               <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 group-hover:text-indigo-400 text-slate-400 shadow-inner border border-slate-800">
                     <MousePointerClick className="w-7 h-7" />
                  </div>
                  <h4 className="font-bold text-xl mb-3">API 开放平台</h4>
                  <p className="text-slate-400 leading-relaxed">
                     提供丰富的 Open API 接口，支持将创意资产库与内部 ERP/CMS 系统深度集成。
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* 8. FAQ Section */}
      <div id="faq" className="py-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
         <h2 className="text-4xl font-bold text-slate-900 text-center mb-16">常见问题</h2>
         <div className="space-y-4">
            <FAQItem 
               question="企业版和普通版有什么区别？"
               answer="企业版提供专属的资金管理账户、增值税专票开具、多账号协作权限以及企业级资产库(DAM)等功能，更适合团队使用。"
               isOpen={openFaqIndex === 0}
               onClick={() => toggleFaq(0)}
            />
            <FAQItem 
               question="如何进行对公打款充值？"
               answer="在企业控制台的财务中心，您可以获取专属的对公转账账号。转账后系统会自动核销并在 1 小时内入账到企业余额。"
               isOpen={openFaqIndex === 1}
               onClick={() => toggleFaq(1)}
            />
            <FAQItem 
               question="是否支持先票后款？"
               answer="针对年框签约客户，我们提供一定的信用额度支持先票后款。具体请咨询您的专属客户经理。"
               isOpen={openFaqIndex === 2}
               onClick={() => toggleFaq(2)}
            />
            <FAQItem 
               question="可以邀请外部画师加入企业项目吗？"
               answer="可以。您可以通过链接邀请外部合作画师注册并加入您的项目，统一进行管理和结算，享受平台的工具与合规服务。"
               isOpen={openFaqIndex === 3}
               onClick={() => toggleFaq(3)}
            />
         </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 py-32 text-center text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
         <div className="max-w-4xl mx-auto px-6 relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">准备好升级您的创意供应链了吗？</h2>
            <p className="text-indigo-200 mb-12 text-xl font-light">立即注册企业账号，获得 14 天高级版免费试用权益。</p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
               <button 
                  onClick={() => onTriggerLogin && onTriggerLogin()}
                  className="bg-white text-indigo-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all hover:-translate-y-1 shadow-xl"
               >
                  免费注册
               </button>
               <button className="border-2 border-white/20 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all hover:-translate-y-1">
                  联系销售
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default EnterprisePage;
