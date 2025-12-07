
import React, { useState } from 'react';
import { 
  ArrowLeft, Building, ChevronRight, Star, TrendingUp, 
  Users, Zap, Quote, Tag, ArrowUpRight, CheckCircle2, ArrowRight
} from 'lucide-react';
import { MOCK_PROJECT_CASES } from '../constants';
import { User, ViewMode } from '../types';

interface ProjectCasesPageProps {
  onBack: () => void;
  onNavigate?: (mode: ViewMode) => void;
  onTriggerLogin?: () => void;
}

const ProjectCasesPage: React.FC<ProjectCasesPageProps> = ({ onBack, onNavigate, onTriggerLogin }) => {
  const [activeIndustry, setActiveIndustry] = useState('全部');

  const industries = ['全部', '游戏娱乐', '品牌设计', '3D/动画', '插画绘本', 'UI/UX', '营销素材'];

  const filteredCases = MOCK_PROJECT_CASES.filter(c => 
    activeIndustry === '全部' || c.category === activeIndustry
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-16">
      
      {/* 1. Hero Section */}
      <div className="bg-[#0B0F19] text-white relative overflow-hidden pt-20 pb-32">
         {/* Background Decoration */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-900/30 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
         <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/abstract_tech_bg/1600/900')] opacity-10 pointer-events-none mix-blend-overlay bg-cover bg-center"></div>

         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> 返回
            </button>

            <div className="max-w-3xl">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6">
                  <Star className="w-3 h-3 fill-current" /> 标杆客户案例
               </div>
               <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight mb-6">
                  见证创意的<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-blue-300">
                    商业变革力量
                  </span>
               </h1>
               <p className="text-xl text-slate-400 leading-relaxed max-w-2xl">
                  探索领先企业如何利用薪画社的人才供应链与协作工具，突破产能瓶颈，实现业务指数级增长。
               </p>
            </div>
         </div>
      </div>

      {/* 2. Filter Bar */}
      <div className="sticky top-16 z-20 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
            <div className="flex gap-2">
               {industries.map(ind => (
                  <button
                    key={ind}
                    onClick={() => setActiveIndustry(ind)}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                       activeIndustry === ind 
                          ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                     {ind}
                  </button>
               ))}
            </div>
            <div className="text-sm text-slate-500 font-medium hidden md:block whitespace-nowrap">
               共 {filteredCases.length} 个标杆案例
            </div>
         </div>
      </div>

      {/* 3. Case Studies List */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
         {filteredCases.map((caseItem, idx) => (
            <div key={caseItem.id} className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-lg transition-all group">
               <div className={`flex flex-col gap-12 ${idx % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center`}>
                  
                  {/* Image Side */}
                  <div className="w-full lg:w-1/2 relative">
                     <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm relative z-10 border border-slate-100">
                        <img 
                          src={caseItem.coverImage} 
                          alt={caseItem.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-indigo-900/0 group-hover:bg-indigo-900/10 transition-colors duration-500"></div>
                     </div>
                  </div>

                  {/* Content Side */}
                  <div className="w-full lg:w-1/2 lg:px-4">
                     <div className="flex items-center gap-3 mb-4">
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
                           {caseItem.category}
                        </span>
                        <span className="text-xs font-medium text-slate-400 border-l border-slate-200 pl-3">
                           {caseItem.year} 年度案例
                        </span>
                     </div>
                     
                     <h2 className="text-3xl font-bold text-slate-900 mb-6 leading-tight group-hover:text-indigo-600 transition-colors">
                        {caseItem.title}
                     </h2>
                     
                     <p className="text-slate-600 text-lg leading-relaxed mb-8">
                        {caseItem.description}
                     </p>

                     {/* Key Results Grid */}
                     <div className="grid grid-cols-2 gap-6 mb-8 border-t border-b border-slate-100 py-6">
                        {caseItem.results.map((res, i) => (
                           <div key={i} className="flex flex-col">
                              <div className="flex items-baseline gap-2 mb-1">
                                 <span className="text-4xl font-extrabold text-indigo-600 tracking-tight">{res.value}</span>
                                 <span className="text-green-500 bg-green-50 rounded-full p-0.5"><TrendingUp className="w-3 h-3" /></span>
                              </div>
                              <div className="text-sm text-slate-500 font-bold">{res.label}</div>
                           </div>
                        ))}
                     </div>

                     {/* Testimonial */}
                     {caseItem.clientTestimonial && (
                        <div className="bg-slate-50 p-6 rounded-xl relative mb-8 border border-slate-100">
                           <Quote className="w-8 h-8 text-indigo-200 absolute -top-3 -left-2 fill-current transform -scale-x-100" />
                           <p className="text-slate-700 italic relative z-10 mb-4 text-sm leading-relaxed">
                              "{caseItem.clientTestimonial.text}"
                           </p>
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-indigo-600 text-sm shadow-sm border border-slate-100">
                                 {caseItem.clientTestimonial.author[0]}
                              </div>
                              <div>
                                 <div className="text-sm font-bold text-slate-900">{caseItem.clientTestimonial.author}</div>
                                 <div className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">项目负责人</div>
                              </div>
                           </div>
                        </div>
                     )}

                     <button className="group flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors text-base">
                        阅读完整案例 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* 4. CTA Section */}
      <div className="bg-slate-900 py-20 mt-12 relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/business_handshake/1600/900')] opacity-5 bg-cover bg-center"></div>
         <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">准备好书写您的成功故事了吗？</h2>
            <p className="text-slate-400 mb-8 text-lg">
               加入 3000+ 领先企业，开启敏捷、合规、高效的创意协作新时代。
            </p>
            <button 
               onClick={() => onTriggerLogin && onTriggerLogin()}
               className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-indigo-900/50 transition-all hover:-translate-y-1 flex items-center gap-2 mx-auto"
            >
               立即咨询专家 <ArrowUpRight className="w-5 h-5" />
            </button>
         </div>
      </div>

    </div>
  );
};

export default ProjectCasesPage;
