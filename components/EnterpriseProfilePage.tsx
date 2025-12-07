
import React, { useState } from 'react';
import { 
  ArrowLeft, MapPin, Globe, Users, Building, Flag, CheckCircle2, Briefcase, 
  Star, Shield, Clock, Award, ChevronRight, Link as LinkIcon, Image as ImageIcon,
  Share2, MoreHorizontal, Filter, Search, Zap, Check, BookOpen, Quote
} from 'lucide-react';
import { MOCK_ENTERPRISE_PROFILE, MOCK_PROJECTS, MOCK_PROJECT_CASES } from '../constants';
import { User, ViewMode } from '../types';

interface EnterpriseProfilePageProps {
  onBack: () => void;
  onTriggerLogin?: () => void;
  user?: User | null;
  onNavigate?: (mode: ViewMode) => void;
}

const EnterpriseProfilePage: React.FC<EnterpriseProfilePageProps> = ({ onBack, onTriggerLogin, user, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'cases' | 'culture'>('overview');
  const [projectFilter, setProjectFilter] = useState<'all' | 'recruiting' | 'progress' | 'finished'>('all');
  
  const profile = MOCK_ENTERPRISE_PROFILE;
  
  // Filter projects for this specific enterprise (Mock logic: matching name or just using a subset)
  const allCompanyProjects = MOCK_PROJECTS.filter(p => p.client === profile.name || p.client.includes('Tech') || Math.random() > 0.7);
  
  const displayedProjects = allCompanyProjects.filter(p => {
    if (projectFilter === 'recruiting') return p.status === '招募中';
    if (projectFilter === 'progress') return ['进行中', '验收中', '交付中'].includes(p.status);
    if (projectFilter === 'finished') return p.status === '已完结';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-16">
       {/* Hero Cover */}
       <div className="h-64 md:h-80 w-full relative bg-slate-900 group overflow-hidden">
          <img 
            src="https://picsum.photos/seed/tech_office_cover/1600/600" 
            alt="Cover" 
            className="w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
          
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-10">
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors bg-black/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/10 hover:bg-black/30"
            >
                <ArrowLeft className="w-4 h-4" /> 返回社区
            </button>
            <div className="flex gap-2">
                <button className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white/90 hover:bg-black/30 border border-white/10 transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white/90 hover:bg-black/30 border border-white/10 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>
          </div>
       </div>

       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-24">
          
          {/* Company Info Header Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden animate-fade-in-up">
             {/* Verified Background Pattern */}
             <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none transform rotate-12 scale-150">
                <Building className="w-64 h-64 text-indigo-900" />
             </div>

             {/* Logo */}
             <div className="w-32 h-32 rounded-2xl bg-white shadow-lg border-4 border-white flex-shrink-0 -mt-16 md:-mt-20 overflow-hidden relative z-10 group">
                <img src={profile.logo} alt="Logo" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
             </div>

             {/* Main Info */}
             <div className="flex-1 min-w-0 pt-1">
                <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                   <div>
                      <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
                        {profile.name}
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold border border-blue-100">
                           <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                           官方认证
                        </div>
                      </h1>
                      <p className="text-slate-500 mt-2 text-lg leading-relaxed max-w-2xl">{profile.industry} 领域的领军企业，致力于用科技改变生活。</p>
                   </div>
                   
                   <div className="flex gap-3 w-full md:w-auto">
                      <button className="flex-1 md:flex-none px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
                         私信
                      </button>
                      <button className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                         + 关注
                      </button>
                   </div>
                </div>

                {/* Meta Tags */}
                <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-600">
                   <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span>{profile.size}</span>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>北京·朝阳区·望京SOHO</span>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 group cursor-pointer hover:border-indigo-200 hover:bg-indigo-50 transition-colors">
                      <Globe className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                      <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className="group-hover:text-indigo-600">{profile.website}</a>
                   </div>
                   <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>入驻：2021年</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Grid Layout: Main + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
             
             {/* Left: Main Content */}
             <div className="lg:col-span-2 space-y-8">
                
                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1.5 flex gap-1 overflow-x-auto no-scrollbar sticky top-20 z-20">
                   {[
                      { id: 'overview', label: '企业概况', icon: Building },
                      { id: 'projects', label: `企划列表 (${allCompanyProjects.length})`, icon: Briefcase },
                      { id: 'cases', label: '成功案例', icon: BookOpen },
                      { id: 'culture', label: '团队文化', icon: Users }
                   ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                           activeTab === tab.id 
                              ? 'bg-slate-900 text-white shadow-md' 
                              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                      >
                         <tab.icon className="w-4 h-4" />
                         {tab.label}
                      </button>
                   ))}
                </div>

                {/* Content Views */}
                <div className="min-h-[400px]">
                   {activeTab === 'overview' && (
                      <div className="space-y-8 animate-fade-in">
                         {/* Stats Cards */}
                         <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
                               <div className="text-3xl font-extrabold text-slate-900 mb-1">{allCompanyProjects.length + 15}</div>
                               <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">累计发布</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
                               <div className="text-3xl font-extrabold text-indigo-600 mb-1">100%</div>
                               <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">结款率</div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center hover:shadow-md transition-shadow">
                               <div className="text-3xl font-extrabold text-amber-500 flex items-center justify-center gap-1 mb-1">
                                  4.9 <Star className="w-5 h-5 fill-current" />
                               </div>
                               <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">画师评分</div>
                            </div>
                         </div>

                         {/* Introduction */}
                         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                               <Users className="w-5 h-5 text-indigo-600" /> 关于我们
                            </h3>
                            <div className="text-slate-600 leading-relaxed space-y-4 text-sm">
                               <p>{profile.description}</p>
                               <p>
                                  作为行业创新者，TechNova 始终坚持技术驱动与设计美学的深度融合。
                                  我们拥有超过 500 人的专业团队，业务覆盖人工智能、大数据分析及企业级 SaaS 服务。
                                  在创意采购方面，我们尊重每一位创作者的劳动成果，承诺 100% 资金托管与 3 个工作日内的极速验收结算。
                               </p>
                            </div>
                            
                            <div className="mt-6 pt-6 border-t border-slate-100">
                               <h4 className="text-sm font-bold text-slate-900 mb-3">专注领域</h4>
                               <div className="flex flex-wrap gap-2">
                                  {profile.coreBusiness.map(tag => (
                                     <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-700 text-xs font-medium rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors cursor-default">
                                        {tag}
                                     </span>
                                  ))}
                               </div>
                            </div>
                         </div>

                         {/* Featured Case Preview */}
                         {MOCK_PROJECT_CASES.length > 0 && (
                           <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                               <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                 <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                     <BookOpen className="w-5 h-5 text-indigo-600" /> 标杆案例
                                 </h3>
                                 <button 
                                   onClick={() => setActiveTab('cases')}
                                   className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                                 >
                                   查看全部 <ChevronRight className="w-3 h-3" />
                                 </button>
                               </div>
                               <div className="p-6 flex flex-col md:flex-row gap-6">
                                   <div className="w-full md:w-1/3 aspect-video bg-slate-100 rounded-xl overflow-hidden relative group cursor-pointer" onClick={() => setActiveTab('cases')}>
                                     <img 
                                         src={MOCK_PROJECT_CASES[0].coverImage} 
                                         alt={MOCK_PROJECT_CASES[0].title}
                                         className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                     />
                                     <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                   </div>
                                   <div className="flex-1">
                                       <div className="flex items-center gap-2 text-xs font-bold mb-2 text-slate-500">
                                           <span className="bg-slate-100 px-2 py-0.5 rounded">{MOCK_PROJECT_CASES[0].year}</span>
                                           <span className="text-indigo-600">{MOCK_PROJECT_CASES[0].category}</span>
                                       </div>
                                       <h4 className="text-xl font-bold text-slate-900 mb-3">{MOCK_PROJECT_CASES[0].title}</h4>
                                       <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                           {MOCK_PROJECT_CASES[0].description}
                                       </p>
                                       <div className="flex gap-4">
                                           {MOCK_PROJECT_CASES[0].results.map((res, i) => (
                                               <div key={i}>
                                                   <div className="text-xl font-extrabold text-indigo-600">{res.value}</div>
                                                   <div className="text-xs text-slate-400 font-bold uppercase">{res.label}</div>
                                               </div>
                                           ))}
                                       </div>
                                   </div>
                               </div>
                           </div>
                         )}

                         {/* History / Milestones */}
                         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                               <Flag className="w-5 h-5 text-indigo-600" /> 发展历程
                            </h3>
                            <div className="relative border-l-2 border-indigo-100 ml-3 space-y-8 pl-8 py-2">
                               {profile.history.map((item, idx) => (
                                  <div key={idx} className="relative group">
                                     <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-white border-4 border-indigo-500 group-hover:scale-125 transition-transform shadow-sm"></div>
                                     <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded mb-2 inline-block">
                                        {item.year}
                                     </span>
                                     <h4 className="text-base font-bold text-slate-900 mb-1">{item.title}</h4>
                                     <p className="text-sm text-slate-500">{item.description}</p>
                                  </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   )}

                   {activeTab === 'projects' && (
                      <div className="space-y-6 animate-fade-in">
                         {/* Project Filters */}
                         <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex gap-1">
                               {[
                                  { id: 'all', label: '全部' },
                                  { id: 'recruiting', label: '招募中' },
                                  { id: 'progress', label: '进行中' },
                                  { id: 'finished', label: '已完结' }
                               ].map((f) => (
                                  <button
                                    key={f.id}
                                    onClick={() => setProjectFilter(f.id as any)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                       projectFilter === f.id 
                                          ? 'bg-slate-100 text-slate-900' 
                                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                                  >
                                     {f.label}
                                  </button>
                               ))}
                            </div>
                            <div className="pr-2">
                               <Search className="w-4 h-4 text-slate-400" />
                            </div>
                         </div>

                         <div className="space-y-4">
                            {displayedProjects.map(project => (
                                <div key={project.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden">
                                   <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                                   
                                   <div className="flex justify-between items-start relative z-10">
                                      <div>
                                         <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs px-2 py-1 rounded font-bold ${
                                               project.status === '招募中' 
                                                  ? 'bg-blue-100 text-blue-700'
                                                  : project.status === '已完结'
                                                  ? 'bg-slate-100 text-slate-500'
                                                  : 'bg-indigo-100 text-indigo-700'
                                            }`}>
                                               {project.status === '招募中' ? '正在招募' : project.status}
                                            </span>
                                            {project.status === '招募中' && (
                                               <span className="text-rose-500 text-xs font-bold flex items-center gap-1 bg-rose-50 px-2 py-1 rounded">
                                                  <Clock className="w-3 h-3" /> {project.deadline} 截止
                                               </span>
                                            )}
                                         </div>
                                         <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                            {project.title}
                                         </h3>
                                         <p className="text-sm text-slate-500 line-clamp-2 max-w-xl mb-4">
                                            {project.description}
                                         </p>
                                         <div className="flex items-center gap-3">
                                            {project.tags?.slice(0, 3).map(t => (
                                               <span key={t} className="px-2 py-1 border border-slate-200 rounded text-xs text-slate-500 bg-slate-50">
                                                  {t}
                                               </span>
                                            ))}
                                         </div>
                                      </div>
                                      <div className="text-right flex flex-col items-end h-full justify-between">
                                         <div>
                                            <div className="text-2xl font-extrabold text-indigo-600">¥{project.budget.toLocaleString()}</div>
                                            <div className="text-xs text-slate-400 mt-1">项目预算</div>
                                         </div>
                                         {project.status === '招募中' && (
                                            <button className="mt-6 bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 transition-colors shadow-sm">
                                               立即应征
                                            </button>
                                         )}
                                      </div>
                                   </div>
                                </div>
                            ))}
                            {displayedProjects.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                                   <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                   <p className="text-slate-500">该分类下暂无企划</p>
                                </div>
                            )}
                         </div>
                      </div>
                   )}

                   {activeTab === 'cases' && (
                      <div className="space-y-6 animate-fade-in">
                          {MOCK_PROJECT_CASES.length === 0 ? (
                             <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                   <BookOpen className="w-8 h-8 text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-700 mb-1">暂无成功案例</h3>
                                <p className="text-slate-500 text-sm">该企业尚未展示相关案例</p>
                             </div>
                          ) : (
                              MOCK_PROJECT_CASES.map(caseItem => (
                                  <div key={caseItem.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                      {/* Image & Header */}
                                      <div className="h-60 w-full relative overflow-hidden">
                                          <img 
                                            src={caseItem.coverImage} 
                                            alt={caseItem.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                          />
                                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                          <div className="absolute bottom-6 left-6 right-6 text-white">
                                              <div className="flex items-center gap-2 text-xs font-bold mb-2">
                                                  <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded border border-white/20">{caseItem.year}</span>
                                                  <span className="bg-indigo-500 px-2 py-0.5 rounded shadow-sm">{caseItem.category}</span>
                                              </div>
                                              <h3 className="text-2xl font-bold leading-tight">{caseItem.title}</h3>
                                          </div>
                                      </div>
                                      
                                      <div className="p-8">
                                          <div className="mb-8">
                                            <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                              <div className="w-1 h-4 bg-indigo-500 rounded-full"></div> 项目背景
                                            </h4>
                                            <p className="text-slate-600 leading-relaxed text-sm">{caseItem.description}</p>
                                          </div>
                                          
                                          {/* Key Results */}
                                          <div className="grid grid-cols-2 gap-4 mb-8">
                                              {caseItem.results.map((res, idx) => (
                                                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center">
                                                      <div className="text-3xl font-extrabold text-indigo-600 mb-1">{res.value}</div>
                                                      <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{res.label}</div>
                                                  </div>
                                              ))}
                                          </div>

                                          {/* Testimonial */}
                                          {caseItem.clientTestimonial && (
                                              <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 relative">
                                                  <Quote className="w-8 h-8 text-indigo-200 absolute top-4 right-4 rotate-180" />
                                                  <p className="text-slate-700 italic relative z-10 mb-4 text-sm leading-relaxed">"{caseItem.clientTestimonial.text}"</p>
                                                  <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                      {caseItem.clientTestimonial.author[0]}
                                                    </div>
                                                    <div className="text-xs font-bold text-indigo-900">{caseItem.clientTestimonial.author}</div>
                                                  </div>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              ))
                          )}
                      </div>
                   )}

                   {activeTab === 'culture' && (
                      <div className="animate-fade-in space-y-6">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 aspect-[21/9] bg-slate-200 rounded-2xl overflow-hidden relative group">
                               <img src="https://picsum.photos/seed/office_culture/800/400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Office Life" />
                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                                  <div className="text-white">
                                     <h4 className="font-bold text-2xl mb-2">开放协作的办公环境</h4>
                                     <p className="text-sm opacity-90 max-w-lg">位于望京核心区的 2000平米 现代化办公空间，配备顶级人体工学椅与升降桌，只为激发无限创意。</p>
                                  </div>
                               </div>
                            </div>
                            <div className="aspect-square bg-slate-200 rounded-2xl overflow-hidden relative group">
                               <img src="https://picsum.photos/seed/team_building/400/400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Team Building" />
                               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                               <div className="absolute bottom-4 left-4 text-white font-bold text-lg drop-shadow-md">季度团建</div>
                            </div>
                            <div className="aspect-square bg-slate-200 rounded-2xl overflow-hidden relative group">
                               <img src="https://picsum.photos/seed/tech_conference/400/400" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Conference" />
                               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                               <div className="absolute bottom-4 left-4 text-white font-bold text-lg drop-shadow-md">技术分享会</div>
                            </div>
                         </div>
                         
                         <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                               <Award className="w-5 h-5 text-amber-500" /> 员工福利
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                               <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors group">
                                  <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">💊</span>
                                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">六险一金</span>
                                  <span className="text-[10px] text-slate-400 mt-1">全额缴纳</span>
                               </div>
                               <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors group">
                                  <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏋️</span>
                                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">免费健身</span>
                                  <span className="text-[10px] text-slate-400 mt-1">私教指导</span>
                               </div>
                               <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors group">
                                  <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">🏖️</span>
                                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">年度旅游</span>
                                  <span className="text-[10px] text-slate-400 mt-1">海外/国内</span>
                               </div>
                               <div className="flex flex-col items-center p-4 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors group">
                                  <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">📈</span>
                                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">期权激励</span>
                                  <span className="text-[10px] text-slate-400 mt-1">共享成长</span>
                               </div>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
             </div>

             {/* Right: Sidebar */}
             <div className="space-y-6">
                
                {/* Credit Score Widget - Optimized Visual */}
                <div 
                  onClick={() => onNavigate?.('credit_score')}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col items-center cursor-pointer hover:shadow-md hover:border-green-200 transition-all group"
                >
                   <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform"></div>
                   
                   <h3 className="font-bold text-slate-900 mb-6 relative z-10 w-full flex items-center gap-2">
                      <Shield className="w-5 h-5 text-green-600" /> 企业信用
                   </h3>
                   
                   {/* Radial Gauge CSS Only */}
                   <div className="relative w-40 h-20 overflow-hidden mb-2">
                      <div className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-slate-100 box-border"></div>
                      <div 
                        className="absolute top-0 left-0 w-40 h-40 rounded-full border-[12px] border-green-500 box-border border-b-transparent border-l-transparent border-r-transparent transform rotate-[-45deg] origin-center"
                        style={{ borderBottomColor: 'transparent', borderRightColor: 'transparent', transform: 'rotate(-45deg)' }} // Simple half circle visual hack
                      ></div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-3xl font-extrabold text-slate-900">{profile.creditScore}</div>
                   </div>
                   
                   <div className={`px-3 py-1 rounded-full text-xs font-bold mb-6 ${
                      profile.creditScore >= 800 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                   }`}>
                      信用极好 (AAA级)
                   </div>

                   <div className="w-full space-y-3 relative z-10 border-t border-slate-100 pt-4">
                      <div className="flex items-center justify-between text-sm">
                         <span className="text-slate-500">实名认证</span>
                         <span className="text-green-600 flex items-center gap-1 font-bold"><CheckCircle2 className="w-4 h-4" /> 已完成</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                         <span className="text-slate-500">保证金</span>
                         <span className="text-green-600 flex items-center gap-1 font-bold"><CheckCircle2 className="w-4 h-4" /> 已缴纳</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                         <span className="text-slate-500">违约记录</span>
                         <span className="text-slate-700 font-medium">无</span>
                      </div>
                   </div>
                </div>

                {/* Similar Enterprises */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-slate-900">相似推荐</h3>
                      <button className="text-xs text-indigo-600 hover:underline">换一批</button>
                   </div>
                   <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                         <div key={i} className="flex items-center gap-3 group cursor-pointer p-2 hover:bg-slate-50 rounded-lg transition-colors -mx-2">
                            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-100">
                               LOG
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">Future Labs {i}</div>
                               <div className="text-xs text-slate-500 truncate">专注于人工智能解决方案</div>
                            </div>
                            <button className="text-xs border border-slate-200 px-2 py-1 rounded text-slate-500 hover:border-indigo-200 hover:text-indigo-600 transition-colors bg-white">
                               关注
                            </button>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Contact */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                   <h3 className="font-bold text-lg mb-2 relative z-10 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-300" /> 有合作意向？
                   </h3>
                   <p className="text-indigo-100 text-sm mb-6 relative z-10 leading-relaxed">
                      如果您对我们的业务感兴趣，或希望成为我们的长期供应商，欢迎联系。
                   </p>
                   <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg relative z-10 flex items-center justify-center gap-2">
                      发起即时沟通
                   </button>
                </div>

             </div>

          </div>
       </div>
    </div>
  );
};

export default EnterpriseProfilePage;
