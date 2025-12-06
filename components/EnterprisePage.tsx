
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Building, ShieldCheck, Zap, Layers, 
  Users, BarChart, FileText, CheckCircle2, ArrowRight,
  Briefcase, Globe, Cpu, ChevronRight, LayoutTemplate,
  PieChart, MessageSquare, Monitor, Star, Quote, Shield,
  Check, X, Lock, Server, Key, HelpCircle, ChevronDown, CheckCircle,
  PlayCircle, MousePointerClick, TrendingUp, Gamepad2, ShoppingBag
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
      className="w-full flex items-center justify-between py-5 text-left focus:outline-none group"
      onClick={onClick}
    >
      <span className={`font-bold text-lg transition-colors ${isOpen ? 'text-indigo-600' : 'text-slate-800 group-hover:text-indigo-600'}`}>
        {question}
      </span>
      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
    </button>
    <div 
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100 mb-5' : 'max-h-0 opacity-0'}`}
    >
      <p className="text-slate-600 leading-relaxed text-sm md:text-base pr-8">
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
      
      // Simple scroll spy
      const sections = ['hero', 'solutions', 'workflow', 'value', 'security', 'faq'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < 300) {
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
    <div className="min-h-screen bg-slate-50 font-sans pb-0 pt-16">
      
      {/* Sticky Navigation Bar */}
      <div className={`sticky top-16 z-40 transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur-md border-slate-200 shadow-sm py-2' : 'bg-slate-900 border-white/10 py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
           <div className={`font-bold text-lg tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
              Enterprise <span className="text-indigo-500">Pro</span>
           </div>
           <div className="flex gap-1 md:gap-2 overflow-x-auto no-scrollbar">
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
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeSection === item.id
                      ? (isScrolled ? 'bg-indigo-600 text-white' : 'bg-white/20 text-white')
                      : (isScrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:text-white hover:bg-white/10')
                  }`}
                >
                  {item.label}
                </button>
              ))}
           </div>
           <div className="hidden md:block">
              <button 
                onClick={() => onTriggerLogin && onTriggerLogin()}
                className={`text-sm font-bold px-4 py-1.5 rounded-lg transition-colors ${
                  isScrolled 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'bg-white text-indigo-900 hover:bg-indigo-50'
                }`}
              >
                免费试用
              </button>
           </div>
        </div>
      </div>

      {/* 1. Hero Section */}
      <div id="hero" className="relative bg-[#0B0F19] text-white overflow-hidden pt-12 pb-32">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full opacity-30 blur-[120px] -mr-40 -mt-40 pointer-events-none animate-pulse" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full opacity-20 blur-[100px] -ml-20 -mb-20 pointer-events-none animate-pulse" style={{animationDuration: '10s'}}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 animate-fade-in-up">
            <button 
              onClick={onBack}
              className="absolute top-0 left-4 md:left-0 flex items-center gap-2 text-indigo-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回社区
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold backdrop-blur-md mt-10">
              <Building className="w-3 h-3" /> 企业级创意供应链解决方案
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              构建智能化<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-purple-300">
                数字创意中台
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              一站式解决企业内容生产痛点。从海量人才匹配、敏捷项目管理到数字资产沉淀，
              让创意的流转像代码一样高效、可控。
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4 w-full sm:w-auto">
              <button 
                onClick={() => onTriggerLogin && onTriggerLogin()}
                className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 text-lg w-full sm:w-auto"
              >
                免费试用企业版 <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('enterprise_profile')}
                className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors backdrop-blur-sm flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <PlayCircle className="w-5 h-5" /> 查看演示主页
              </button>
            </div>

            {/* Trusted By Strip */}
            <div className="pt-16 border-t border-white/5 mt-16 w-full">
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-8">深受 500+ 创新企业信赖</p>
               <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                  {['Tencent 腾讯', 'NetEase 网易', 'ByteDance', 'MiHoYo', 'Alibaba Design'].map((brand, i) => (
                     <div key={i} className="text-xl font-bold font-mono text-white flex items-center gap-2 cursor-default hover:text-indigo-300 transition-colors">
                        <Building className="w-6 h-6 text-white/30" /> {brand}
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Value Stats Bar (Floating) */}
      <div className="-mt-16 relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex flex-col items-center text-center px-4 group">
               <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6" />
               </div>
               <div className="text-4xl font-extrabold text-slate-900 mb-2 group-hover:text-green-600 transition-colors">30%</div>
               <div className="text-sm font-bold text-slate-800">降低采购成本</div>
               <p className="text-xs text-slate-500 mt-1">通过直连创作者与透明报价体系</p>
            </div>
            <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0 group">
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
               </div>
               <div className="text-4xl font-extrabold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">3x</div>
               <div className="text-sm font-bold text-slate-800">提升交付效率</div>
               <p className="text-xs text-slate-500 mt-1">标准化的在线验收与反馈流程</p>
            </div>
            <div className="flex flex-col items-center text-center px-4 pt-8 md:pt-0 group">
               <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
               </div>
               <div className="text-4xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">100%</div>
               <div className="text-sm font-bold text-slate-800">合规与安全</div>
               <p className="text-xs text-slate-500 mt-1">资金托管担保与增值税专票支持</p>
            </div>
         </div>
      </div>

      {/* 3. Core Solutions (Bento Grid) */}
      <div id="solutions" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
            <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">全链路创意管理闭环</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">
               打通需求、供给、协作与资产管理，重塑企业外部创意合作流。
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
            
            {/* Feature 1: Talent */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-white rounded-3xl border border-indigo-100 p-8 flex flex-col md:flex-row items-center gap-8 group hover:shadow-lg transition-all relative overflow-hidden">
               <div className="flex-1 space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                     <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">弹性人才供应链</h3>
                  <p className="text-slate-600 leading-relaxed">
                     聚合 10万+ 认证创作者，覆盖插画、UI、3D等全品类。支持按项目组建虚拟团队，解决企业用人波峰波谷难题。
                  </p>
                  <ul className="space-y-2 text-sm text-slate-500 pt-2">
                     <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 实名认证与技能考核体系</li>
                     <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 平台顾问辅助选人组队</li>
                  </ul>
               </div>
               <div className="w-full md:w-1/2 aspect-video bg-white rounded-xl shadow-sm border border-slate-100 p-2 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                  <div className="h-full w-full bg-slate-50 rounded-lg overflow-hidden relative">
                     <div className="absolute top-3 left-3 right-3 flex gap-2">
                        <div className="h-2 w-8 bg-slate-200 rounded"></div>
                        <div className="h-2 w-16 bg-slate-200 rounded"></div>
                     </div>
                     <div className="absolute top-10 left-3 right-3 grid grid-cols-3 gap-2">
                        {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-square bg-slate-200 rounded-md"></div>)}
                     </div>
                  </div>
               </div>
            </div>

            {/* Feature 2: Compliance */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between hover:shadow-lg transition-all group">
               <div>
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">财务合规风控</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                     公对公结算，统一开具增值税专票，解决个人画师无法开票难题。标准化的版权转让协议，规避法律风险。
                  </p>
               </div>
               <div className="mt-6 flex items-center justify-between text-xs font-bold text-slate-400 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1"><FileText className="w-4 h-4" /> 电子合同</div>
                  <div className="w-px h-3 bg-slate-300"></div>
                  <div className="flex items-center gap-1"><Shield className="w-4 h-4" /> 版权证书</div>
               </div>
            </div>

            {/* Feature 3: SaaS Collaboration */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col justify-between hover:shadow-lg transition-all group">
               <div>
                  <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                     <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">可视化项目协作</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                     专为创意验收设计的协作工具。支持在线红字批注、版本对比、分阶段验收。沟通记录全程留痕，避免扯皮。
                  </p>
               </div>
               <div className="mt-6 relative h-16 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
                  <div className="absolute top-3 left-3 bg-white border border-slate-200 shadow-sm px-2 py-1 rounded text-[10px] text-purple-600 font-bold flex items-center gap-1 animate-pulse">
                     <MessageSquare className="w-3 h-3" /> 修改意见: 颜色加深
                  </div>
               </div>
            </div>

            {/* Feature 4: DAM */}
            <div className="md:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-8 flex flex-col md:flex-row items-center gap-8 group overflow-hidden relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <div className="flex-1 space-y-4 relative z-10">
                  <div className="w-12 h-12 bg-white/10 text-white rounded-xl flex items-center justify-center backdrop-blur-sm">
                     <Layers className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">企业数字资产库 (DAM)</h3>
                  <p className="text-slate-400 leading-relaxed">
                     验收通过的文件自动归档。集成 Gemini AI 视觉大模型，自动为素材打标分类。
                     支持以图搜图，实现企业内部资产的快速检索与复用，避免重复采购浪费。
                  </p>
                  <div className="flex gap-2 pt-2">
                     <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded border border-indigo-500/30">AI 自动标签</span>
                     <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded border border-indigo-500/30">源文件版本管理</span>
                  </div>
               </div>
               <div className="w-full md:w-1/2 relative z-10">
                  <div className="bg-slate-800/50 backdrop-blur border border-white/10 rounded-xl p-4 flex gap-3">
                     <div className="w-1/3 aspect-[3/4] bg-slate-700 rounded-lg animate-pulse"></div>
                     <div className="flex-1 space-y-2">
                        <div className="h-4 w-1/2 bg-slate-700 rounded"></div>
                        <div className="h-3 w-full bg-slate-700 rounded"></div>
                        <div className="h-3 w-2/3 bg-slate-700 rounded"></div>
                        <div className="flex gap-1 mt-2">
                           <div className="h-5 w-12 bg-indigo-500/40 rounded"></div>
                           <div className="h-5 w-12 bg-indigo-500/40 rounded"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

         </div>
      </div>

      {/* 4. Workflow Visualization */}
      <div id="workflow" className="bg-white py-24 border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <span className="text-slate-400 font-bold tracking-wider uppercase text-sm mb-2 block">Process</span>
               <h2 className="text-3xl font-bold text-slate-900 mb-4">标准化作业流程 (SOP)</h2>
               <p className="text-slate-500">规范的交付标准，确保每一个项目都能按时、按质交付</p>
            </div>

            <div className="relative">
               {/* Connecting Line */}
               <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>
               
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                  {[
                     { icon: FileText, title: '发布需求', desc: 'AI 辅助梳理需求，明确交付标准与预算范围' },
                     { icon: Users, title: '智能匹配', desc: '系统算法推荐 + 顾问人工筛选，精准匹配候选人' },
                     { icon: LayoutTemplate, title: '过程管理', desc: '分阶段资金托管，节点式验收，进度透明可控' },
                     { icon: Briefcase, title: '交付结算', desc: '源文件自动归档 DAM，自动生成合规发票' }
                  ].map((step, i) => (
                     <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center group hover:border-indigo-300 transition-colors">
                        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors relative">
                           <step.icon className="w-8 h-8" />
                           <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                              {i + 1}
                           </div>
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                        <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* 5. Industry Scenarios */}
      <div className="bg-slate-50 py-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-12 items-center">
               <div className="flex-1 space-y-8">
                  <h2 className="text-3xl font-bold text-slate-900">多行业场景覆盖</h2>
                  <p className="text-slate-600 leading-relaxed text-lg">
                     无论您是游戏开发商、品牌方还是电商企业，薪画社都能提供适配的创意解决方案。
                  </p>
                  
                  <div className="space-y-4">
                     {[
                        { icon: Cpu, color: 'bg-blue-100 text-blue-600', title: '游戏研发', desc: '角色原画、场景概念、UI图标、Spine动画、3D建模' },
                        { icon: Briefcase, color: 'bg-orange-100 text-orange-600', title: '品牌营销', desc: 'KV海报、吉祥物设计、包装设计、企业VI升级' },
                        { icon: Globe, color: 'bg-green-100 text-green-600', title: '跨境电商', desc: '产品精修、详情页设计、海外社媒素材、短视频剪辑' }
                     ].map((item, idx) => (
                        <div key={idx} className="bg-white p-5 rounded-xl shadow-sm flex items-start gap-4 border border-slate-100 hover:border-indigo-200 transition-colors group">
                           <div className={`p-3 rounded-lg ${item.color} group-hover:scale-110 transition-transform`}>
                              <item.icon className="w-6 h-6" />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                              <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               
               <div className="flex-1 relative h-[500px] w-full">
                  <div className="absolute top-8 right-8 left-8 bottom-8 bg-indigo-100 rounded-3xl transform rotate-3"></div>
                  <div className="absolute inset-0 grid grid-cols-2 gap-4">
                     <img src="https://image.pollinations.ai/prompt/game%20character%20design%20concept%20art?width=400&height=600&nologo=true" className="w-full h-full object-cover rounded-2xl shadow-lg translate-y-8" alt="Game Art" />
                     <img src="https://image.pollinations.ai/prompt/modern%20brand%20packaging%20design%20mockup?width=400&height=600&nologo=true" className="w-full h-full object-cover rounded-2xl shadow-lg -translate-y-8" alt="Brand Design" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 6. Comparison Table */}
      <div id="value" className="py-24 bg-white border-t border-slate-100 scroll-mt-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm mb-2 block">Value Proposition</span>
               <h2 className="text-3xl font-bold text-slate-900 mb-4">为什么选择薪画社企业版？</h2>
            </div>
            
            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-xl">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 text-slate-800">
                        <th className="p-6 w-1/4 font-bold border-b border-r border-slate-200">对比维度</th>
                        <th className="p-6 w-1/4 text-slate-500 border-b border-slate-200 font-medium bg-slate-50/50">传统线下外包</th>
                        <th className="p-6 w-1/4 text-slate-500 border-b border-slate-200 font-medium bg-slate-50/50">普通约稿平台</th>
                        <th className="p-6 w-1/4 text-indigo-600 bg-indigo-50/80 border-b border-indigo-100 font-bold text-lg">薪画社企业版</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm">
                     <tr>
                        <td className="p-6 font-bold text-slate-700 border-b border-r border-slate-100">人才匹配效率</td>
                        <td className="p-6 text-slate-600 border-b border-slate-100">低 (依靠人工，周期长)</td>
                        <td className="p-6 text-slate-600 border-b border-slate-100">中 (海量筛选，质量参差)</td>
                        <td className="p-6 bg-indigo-50/30 border-b border-indigo-50 font-medium text-slate-800">
                           <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> 高 (AI 智能推荐 + 顾问精选)</div>
                        </td>
                     </tr>
                     <tr>
                        <td className="p-6 font-bold text-slate-700 border-b border-r border-slate-100">合规与发票</td>
                        <td className="p-6 text-slate-600 border-b border-slate-100">繁琐 (需逐个供应商处理)</td>
                        <td className="p-6 text-slate-600 border-b border-slate-100">困难 (个人画师难开票)</td>
                        <td className="p-6 bg-indigo-50/30 border-b border-indigo-50 font-medium text-slate-800">
                           <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> 完美 (平台统一开具专票)</div>
                        </td>
                     </tr>
                     <tr>
                        <td className="p-6 font-bold text-slate-700 border-b border-r border-slate-100">项目管理与协作</td>
                        <td className="p-6 text-slate-600 border-b border-slate-100">黑盒 (邮件/微信沟通，难追溯)</td>
                        <td className="p-6 text-slate-600 border-b border-slate-100">基础 (仅提供简单的IM)</td>
                        <td className="p-6 bg-indigo-50/30 border-b border-indigo-50 font-medium text-slate-800">
                           <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> 专业 (SaaS 全流程可视化，在线批注)</div>
                        </td>
                     </tr>
                     <tr>
                        <td className="p-6 font-bold text-slate-700 border-b border-r border-slate-100">资产沉淀 (DAM)</td>
                        <td className="p-6 text-slate-600 border-b border-slate-100">无 (散落在硬盘/网盘)</td>
                        <td className="p-6 text-slate-600 border-b border-slate-100">无 (交易结束即终止)</td>
                        <td className="p-6 bg-indigo-50/30 border-b border-indigo-50 font-medium text-slate-800">
                           <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> 强大 (AI 自动打标，企业级资产库)</div>
                        </td>
                     </tr>
                     <tr>
                        <td className="p-6 font-bold text-slate-700 border-r border-slate-100">综合成本</td>
                        <td className="p-6 text-slate-600">高 (包含高额中介溢价)</td>
                        <td className="p-6 text-slate-600">中 (沟通试错成本高)</td>
                        <td className="p-6 bg-indigo-50/30 font-medium text-slate-800">
                           <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500"/> 优 (去中介化，透明报价)</div>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </div>
         </div>
      </div>

      {/* 7. Enterprise Security & Integration */}
      <div id="security" className="py-24 bg-slate-900 text-white relative overflow-hidden scroll-mt-20">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
               <h2 className="text-3xl font-bold mb-4">企业级安全与生态集成</h2>
               <p className="text-slate-400 max-w-2xl mx-auto">
                  按照金融级安全标准构建，支持私有化部署与主流办公软件打通，无缝融入您的工作流。
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:text-indigo-400 text-slate-400">
                     <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">数据安全合规</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                     通过 ISO 27001 信息安全认证，支持数据加密存储与传输，全链路保障企业商业机密。
                  </p>
               </div>
               <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:text-indigo-400 text-slate-400">
                     <Key className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">权限管控体系</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                     支持 SSO 单点登录，细粒度的 RBAC 权限管理，确保人员离职后资产不流失。
                  </p>
               </div>
               <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:text-indigo-400 text-slate-400">
                     <Server className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">混合云部署</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                     支持 SaaS、私有云及混合云部署模式，满足集团型企业对数据物理隔离的严苛要求。
                  </p>
               </div>
               <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-colors group">
                  <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-4 group-hover:text-indigo-400 text-slate-400">
                     <Globe className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">生态应用集成</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">
                     已打通飞书、钉钉、企业微信及 Jira，消息实时同步，审批流自动对接。
                  </p>
               </div>
            </div>
         </div>
      </div>

      {/* 8. Testimonials */}
      <div className="py-24 bg-white border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-16">客户成功故事</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {[
                  { quote: "薪画社帮我们在 3 天内组建了一支高水平的原画团队，不仅按时完成了《星际》项目的资产制作，质量更是超出了预期。", author: "张总", role: "某知名游戏公司 制作人", logo: "GAME" },
                  { quote: "作为一家初创品牌，我们很难招到全职的高级设计师。通过平台，我们以非常灵活的方式完成了全套 VI 升级，成本降低了 40%。", author: "李女士", role: "新消费品牌 创始人", logo: "BRAND" },
                  { quote: "DAM 系统太好用了！以前素材都在硬盘里吃灰，现在通过 AI 标签，团队能快速复用过往资产，效率提升显著。", author: "王总监", role: "电商代运营 设计主管", logo: "SHOP" }
               ].map((t, i) => (
                  <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative shadow-sm hover:shadow-md transition-shadow">
                     <Quote className="w-10 h-10 text-indigo-100 absolute top-6 left-6" />
                     <p className="text-slate-600 italic mb-6 relative z-10 leading-relaxed">"{t.quote}"</p>
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                           {t.logo === 'GAME' && <Gamepad2 className="w-5 h-5" />}
                           {t.logo === 'BRAND' && <Briefcase className="w-5 h-5" />}
                           {t.logo === 'SHOP' && <ShoppingBag className="w-5 h-5" />}
                        </div>
                        <div>
                           <div className="font-bold text-slate-900 text-sm">{t.author}</div>
                           <div className="text-xs text-slate-500">{t.role}</div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 9. FAQ Section */}
      <div id="faq" className="py-24 bg-slate-50 scroll-mt-20">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-2">
                  <HelpCircle className="w-8 h-8 text-indigo-600" /> 常见问题
               </h2>
               <p className="text-slate-500">解答您关于企业服务的疑问</p>
            </div>
            
            <div className="space-y-2">
               {[
                  { q: "企业版是否支持免费试用？", a: "支持。您可以点击页面上方的“免费试用”按钮，填写企业信息后，我们将为您开通 14 天的企业高级版试用权限，包含 5 个子账号及 50GB DAM 空间。" },
                  { q: "平台如何保障交付质量？", a: "我们通过三重机制保障：1. 严格的画师准入与分级认证；2. 资金托管机制，验收满意后才付款；3. 争议仲裁服务，若作品严重不符，支持退款或重做。" },
                  { q: "能否开具增值税专用发票？", a: "可以。企业认证用户在充值或支付项目款项后，可在财务中心申请开具增值税专用发票（6% 技术服务费或设计费），通常在 3-5 个工作日内寄出。" },
                  { q: "对于大型项目，是否提供项目经理介入服务？", a: "是的。对于预算超过 10万 的项目或企业旗舰版客户，我们将提供专属的项目经理（PM），协助您梳理需求、筛选画师及跟进进度，确保项目按期交付。" },
                  { q: "是否支持 API 对接内部 OA 系统？", a: "支持。企业版提供完善的 Open API 文档，您可以将薪画社的采购流程、资产库无缝集成到自有的 OA、ERP 或项目管理系统中。" }
               ].map((faq, idx) => (
                  <FAQItem 
                     key={idx} 
                     question={faq.q} 
                     answer={faq.a} 
                     isOpen={openFaqIndex === idx} 
                     onClick={() => toggleFaq(idx)} 
                  />
               ))}
            </div>
         </div>
      </div>

      {/* 10. Final CTA */}
      <div className="bg-[#0B0F19] py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
         <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
               准备好升级您的创意生产力了吗？
            </h2>
            <p className="text-slate-400 mb-10 text-lg">
               加入 3000+ 领先企业，开启敏捷、合规、高效的创意协作新时代。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <button 
                 onClick={() => onTriggerLogin && onTriggerLogin()}
                 className="bg-indigo-600 text-white px-10 py-4 rounded-full font-bold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/50 text-lg flex items-center justify-center gap-2"
               >
                 立即免费注册 <MousePointerClick className="w-5 h-5" />
               </button>
               <button className="bg-transparent border border-slate-700 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
                 联系销售顾问
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default EnterprisePage;
