
import React from 'react';
import { 
  ArrowLeft, Building, ShieldCheck, Zap, Layers, 
  Users, BarChart, FileText, CheckCircle2, ArrowRight,
  Briefcase, Globe, Cpu
} from 'lucide-react';
import { User } from '../types';

interface EnterprisePageProps {
  onBack: () => void;
  onTriggerLogin?: () => void;
  user?: User | null;
}

const EnterprisePage: React.FC<EnterprisePageProps> = ({ onBack, onTriggerLogin, user }) => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-16">
      
      {/* 1. Hero Section */}
      <div className="relative bg-indigo-900 text-white overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600 rounded-full opacity-20 blur-3xl -mr-40 -mt-40"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600 rounded-full opacity-20 blur-3xl -ml-20 -mb-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 pb-24">
          <button 
            onClick={onBack}
            className="absolute top-8 left-4 md:left-8 flex items-center gap-2 text-indigo-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回社区
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800 border border-indigo-700 text-indigo-200 text-xs font-bold">
                <Building className="w-3 h-3" /> 企业级解决方案
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                构建智能化<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-pink-300">
                  创意供应链
                </span>
              </h1>
              <p className="text-lg text-indigo-100 max-w-xl leading-relaxed">
                薪画社为企业提供从需求发布、人才匹配、项目管理到数字资产沉淀（DAM）的一站式服务。
                解决传统外包流程不透明、资产复用难、财务合规繁琐等痛点。
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => onTriggerLogin && onTriggerLogin()}
                  className="bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  免费试用企业版 <ArrowRight className="w-4 h-4" />
                </button>
                <button className="bg-indigo-800/50 border border-indigo-700 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-800 transition-colors backdrop-blur-sm">
                  联系销售团队
                </button>
              </div>
              <div className="flex items-center gap-6 text-sm text-indigo-300 pt-4">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> 免费入驻</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> 增值税专票</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-400" /> 专属客户经理</span>
              </div>
            </div>

            {/* Right: Dashboard Preview Mockup */}
            <div className="relative hidden lg:block animate-scale-in delay-100">
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl rotate-3 blur-sm opacity-50"></div>
               <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-indigo-200">
                  <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full bg-red-400"></div>
                     <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                     <div className="w-3 h-3 rounded-full bg-green-400"></div>
                     <div className="ml-4 h-6 w-64 bg-slate-200 rounded-md"></div>
                  </div>
                  <img 
                    src="https://placehold.co/800x500/f8fafc/cbd5e1?text=Enterprise+Dashboard+Preview" 
                    alt="Dashboard" 
                    className="w-full h-auto object-cover opacity-90" 
                  />
                  {/* Floating Cards */}
                  <div className="absolute bottom-8 -left-8 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 animate-float">
                     <div className="p-3 bg-green-100 text-green-600 rounded-lg"><ShieldCheck className="w-6 h-6" /></div>
                     <div>
                        <div className="text-xs text-slate-500 font-bold">资金安全</div>
                        <div className="text-sm font-bold text-slate-800">100% 托管担保</div>
                     </div>
                  </div>
                  <div className="absolute top-20 -right-8 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center gap-4 animate-float delay-700">
                     <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Layers className="w-6 h-6" /></div>
                     <div>
                        <div className="text-xs text-slate-500 font-bold">资产管理</div>
                        <div className="text-sm font-bold text-slate-800">AI 智能打标</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Core Solutions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
         <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">全链路创意管理解决方案</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
               不仅仅是外包平台，更是企业的外部创意部门。我们通过技术手段，将分散的创意产能组织化、标准化。
            </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
               <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                  <Users className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">人才供应链</h3>
               <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  聚合 10万+ 认证创作者，覆盖插画、UI、3D、动画等全品类。支持按项目组建虚拟团队，弹性扩容，随需随用。
               </p>
               <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 实名认证与技能考核</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 历史信用数据透明</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 平台顾问辅助选人</li>
               </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
               <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                  <Zap className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">项目协作 SaaS</h3>
               <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  专为创意验收设计的协作工具。支持在线批注、版本对比、分阶段验收。所有沟通记录与文件传输全程留痕。
               </p>
               <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> 看板式进度管理</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> 在线红字批注反馈</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-purple-500" /> 资金分阶段托管</li>
               </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
               <div className="w-14 h-14 bg-pink-50 rounded-xl flex items-center justify-center text-pink-600 mb-6">
                  <Layers className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-3">企业数字资产库 (DAM)</h3>
               <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  验收通过的文件自动归档至企业 DAM 系统。利用 Gemini AI 自动打标，实现资产的快速检索与复用，避免重复采购。
               </p>
               <ul className="space-y-2 text-sm text-slate-500">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> 源文件云端备份</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> AI 智能标签分类</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-pink-500" /> 团队权限分级管理</li>
               </ul>
            </div>
         </div>
      </div>

      {/* 3. Industry Scenarios */}
      <div className="bg-slate-100 py-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row gap-12 items-center">
               <div className="flex-1">
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">多行业场景覆盖</h2>
                  <p className="text-slate-600 mb-8 leading-relaxed">
                     无论您是游戏开发商、品牌方还是电商企业，薪画社都能提供适配的创意解决方案。
                  </p>
                  
                  <div className="space-y-4">
                     <div className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1"><Cpu className="w-5 h-5" /></div>
                        <div>
                           <h4 className="font-bold text-slate-900">游戏研发</h4>
                           <p className="text-sm text-slate-500 mt-1">角色原画、场景概念、UI图标、Spine动画、3D建模。</p>
                        </div>
                     </div>
                     <div className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-4">
                        <div className="p-2 bg-orange-100 rounded-lg text-orange-600 mt-1"><Briefcase className="w-5 h-5" /></div>
                        <div>
                           <h4 className="font-bold text-slate-900">品牌营销</h4>
                           <p className="text-sm text-slate-500 mt-1">KV海报、吉祥物设计、包装设计、企业VI升级。</p>
                        </div>
                     </div>
                     <div className="bg-white p-4 rounded-xl shadow-sm flex items-start gap-4">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600 mt-1"><Globe className="w-5 h-5" /></div>
                        <div>
                           <h4 className="font-bold text-slate-900">跨境电商</h4>
                           <p className="text-sm text-slate-500 mt-1">产品精修、详情页设计、海外社媒素材、短视频剪辑。</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="flex-1 relative">
                  <div className="grid grid-cols-2 gap-4">
                     <img src="https://image.pollinations.ai/prompt/game%20character%20design%20concept%20art?width=400&height=500&nologo=true" className="rounded-2xl shadow-lg translate-y-8" alt="" />
                     <img src="https://image.pollinations.ai/prompt/modern%20brand%20packaging%20design%20mockup?width=400&height=500&nologo=true" className="rounded-2xl shadow-lg -translate-y-8" alt="" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 4. Compliance & Trust */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
         <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-3xl p-12 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
               <h2 className="text-3xl font-bold mb-6">合规透明，交易无忧</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                     <FileText className="w-8 h-8 mx-auto mb-3 text-indigo-300" />
                     <h4 className="font-bold mb-1">合规发票</h4>
                     <p className="text-xs text-indigo-200">支持开具增值税专用发票，解决个人画师无法开票难题。</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                     <ShieldCheck className="w-8 h-8 mx-auto mb-3 text-indigo-300" />
                     <h4 className="font-bold mb-1">版权保护</h4>
                     <p className="text-xs text-indigo-200">标准化的版权转让协议，明确买断或授权范围，法律效力有保障。</p>
                  </div>
                  <div className="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/10">
                     <BarChart className="w-8 h-8 mx-auto mb-3 text-indigo-300" />
                     <h4 className="font-bold mb-1">财务透明</h4>
                     <p className="text-xs text-indigo-200">每一笔资金流向可追溯，企业账户支持子账号额度管理。</p>
                  </div>
               </div>
               <button 
                 onClick={() => onTriggerLogin && onTriggerLogin()}
                 className="bg-white text-indigo-900 px-8 py-3 rounded-full font-bold hover:bg-indigo-50 transition-colors"
               >
                 立即注册企业账号
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};

export default EnterprisePage;
