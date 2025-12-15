
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Briefcase, Search, Filter, DollarSign, Calendar, Clock, 
  MapPin, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Building, X,
  Layers, MessageSquare, FileText, UploadCloud, MoreHorizontal, User as UserIcon,
  Check, Send, Paperclip, Download, ChevronRight, TrendingUp, Zap, Target,
  Heart, Share2, Star, ShieldCheck, Flame, ChevronDown, SlidersHorizontal, MousePointerClick,
  Loader2, Sparkles, Activity
} from 'lucide-react';
import { MOCK_PROJECTS, BUDGET_RANGES, CATEGORIES } from '../constants';
import { Project, User } from '../types';
import ProjectDrawer from './ProjectDrawer';
import ProjectCard from './ProjectCard';

interface ProjectsHubPageProps {
  onBack: () => void;
  onTriggerLogin?: () => void;
  user?: User | null;
}

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = 'https://placehold.co/800x400/f1f5f9/94a3b8?text=Project+Cover';
};

const ProjectsHubPage: React.FC<ProjectsHubPageProps> = ({ onBack, onTriggerLogin, user }) => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'budget_high' | 'budget_low'>('newest');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedBudgetRange, setSelectedBudgetRange] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Filter & Sort Logic
  const filteredProjects = useMemo(() => {
    return MOCK_PROJECTS.filter(project => {
      // 1. Status Filter
      let matchStatus = true;
      if (filterStatus === 'recruiting') matchStatus = project.status === '招募中';
      else if (filterStatus === 'progress') matchStatus = ['进行中', '验收中', '交付中'].includes(project.status);
      else if (filterStatus === 'finished') matchStatus = project.status === '已完结';

      // 2. Search Filter
      const matchSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          project.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      // 3. Category Filter
      const matchCategory = selectedCategory === '全部' || project.category === selectedCategory || (project.tags && project.tags.includes(selectedCategory));

      // 4. Budget Filter
      const budgetRange = BUDGET_RANGES.find(r => r.id === selectedBudgetRange);
      const matchBudget = budgetRange ? (project.budget >= budgetRange.min && project.budget < budgetRange.max) : true;

      return matchStatus && matchSearch && matchCategory && matchBudget;
    }).sort((a, b) => {
       if (sortOrder === 'budget_high') return b.budget - a.budget;
       if (sortOrder === 'budget_low') return a.budget - b.budget;
       return 0; // Default: Newest (mock order)
    });
  }, [filterStatus, searchQuery, selectedCategory, selectedBudgetRange, sortOrder]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(9);
  }, [filterStatus, searchQuery, selectedCategory, selectedBudgetRange, sortOrder]);

  const featuredProjects = MOCK_PROJECTS.filter(p => p.status === '招募中' && p.budget > 10000).slice(0, 5);

  // Mock Stats
  const stats = {
    activeProjects: MOCK_PROJECTS.filter(p => p.status === '招募中').length,
    avgBudget: Math.floor(MOCK_PROJECTS.reduce((acc, curr) => acc + curr.budget, 0) / MOCK_PROJECTS.length),
    newToday: 5
  };

  const handleApply = () => {
    if (!user && onTriggerLogin) {
      onTriggerLogin();
    } else {
      alert("申请已发送！");
      setSelectedProject(null);
    }
  };

  const handlePostProject = () => {
    if (!user && onTriggerLogin) {
        onTriggerLogin();
    } else {
        alert("请点击顶部导航栏的 '发布需求' 按钮进行发布。");
    }
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 6);
      setIsLoadingMore(false);
    }, 600); // Simulate network delay
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-16">
      {selectedProject && (
        <ProjectDrawer 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          onApply={handleApply} 
          user={user}
        />
      )}

      {/* 1. Enhanced Hero Section (Rich Dark Theme) */}
      <div className="relative bg-[#0F172A] text-white overflow-hidden pt-12 pb-24 border-b border-slate-800">
         {/* Animated Background Effects */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none animate-pulse" style={{animationDuration: '8s'}}></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none animate-pulse" style={{animationDuration: '10s'}}></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
         
         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-12">
               <button 
                 onClick={onBack} 
                 className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium group animate-fade-in"
               >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 返回社区
               </button>
               
               <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400 animate-fade-in">
                  <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-500" /> 资金全额托管</span>
                  <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> 企业实名认证</span>
               </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-end gap-16 mb-16">
               <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6 backdrop-blur-md animate-fade-in-up">
                     <Sparkles className="w-3.5 h-3.5 fill-current" /> 连接商业需求与顶尖创意
                  </div>
                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <span className="block mb-2">激发创意潜能</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-cyan-400">
                       交付商业价值
                    </span>
                  </h1>
                  <p className="text-slate-400 text-lg leading-relaxed max-w-2xl animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                     汇聚游戏、品牌、互联网行业的优质外包企划。
                     <br className="hidden md:block" />透明报价，标准合约，让每一次交付都值得信赖。
                  </p>
                  
                  {/* Data Dashboard Strip */}
                  <div className="flex flex-wrap gap-8 mt-10 pt-8 border-t border-white/10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                     <div>
                        <div className="text-3xl font-bold text-white font-mono flex items-baseline gap-1">
                           {stats.activeProjects}
                           <span className="text-sm text-green-500 font-medium ml-2 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> +12%</span>
                        </div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">招募中企划</div>
                     </div>
                     <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                     <div>
                        <div className="text-3xl font-bold text-white font-mono">¥{(stats.avgBudget/1000).toFixed(1)}k</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">平均项目预算</div>
                     </div>
                     <div className="w-px h-10 bg-white/10 hidden md:block"></div>
                     <div>
                        <div className="text-3xl font-bold text-emerald-400 font-mono">+{stats.newToday}</div>
                        <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">今日新增</div>
                     </div>
                  </div>
               </div>
               
               <div className="w-full lg:w-auto flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                 <button 
                   onClick={handlePostProject}
                   className="bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-200 transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2 group w-full lg:w-auto min-w-[240px]"
                 >
                   <UploadCloud className="w-5 h-5 group-hover:scale-110 transition-transform text-indigo-600" />
                   立即发布需求
                 </button>
                 <p className="text-xs text-slate-500 text-center lg:text-right flex items-center justify-center lg:justify-end gap-1">
                    <Activity className="w-3 h-3" /> 平均 10 分钟内获得响应
                 </p>
               </div>
            </div>

            {/* Featured Projects Horizontal Scroll (Glassmorphism) */}
            <div className="relative animate-fade-in-up" style={{ animationDelay: '500ms' }}>
               <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2 text-white font-bold text-lg">
                     <div className="p-1.5 bg-orange-500/20 rounded-lg">
                        <Flame className="w-5 h-5 text-orange-500 fill-current animate-pulse" />
                     </div>
                     急需人才 / 高薪项目
                  </div>
                  <div className="flex gap-2">
                     {/* Optional arrows could go here */}
                  </div>
               </div>
               
               <div className="flex gap-5 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4 md:mx-0 md:px-0">
                  {featuredProjects.map((p, idx) => (
                     <div 
                        key={`feat-${p.id}`} 
                        onClick={() => setSelectedProject(p)}
                        className="min-w-[320px] w-[320px] bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-slate-800/60 transition-all cursor-pointer group relative overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10"
                        style={{ animationDelay: `${500 + idx * 50}ms` }}
                     >
                        {/* Decorative Background Icon */}
                        <div className="absolute -right-6 -top-6 text-white/5 group-hover:text-white/10 transition-colors transform rotate-12">
                           <Zap className="w-32 h-32" />
                        </div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                           <div className="flex justify-between items-start mb-4">
                              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                                {p.category}
                              </span>
                              <span className="text-[10px] text-orange-300 font-bold bg-orange-500/20 px-2 py-1 rounded-md border border-orange-500/30 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> 急招
                              </span>
                           </div>
                           
                           <h4 className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-indigo-400 transition-colors leading-snug h-[3.5rem]">
                             {p.title}
                           </h4>
                           
                           <div className="flex items-center gap-2 text-slate-400 text-xs mb-5">
                              <Building className="w-3.5 h-3.5" /> 
                              <span className="truncate max-w-[180px]">{p.client}</span>
                              <CheckCircle2 className="w-3 h-3 text-blue-500" />
                           </div>
                           
                           <div className="mt-auto pt-4 border-t border-white/5 flex items-end justify-between">
                              <div>
                                 <p className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">项目预算</p>
                                 <p className="text-xl font-bold text-emerald-400 font-mono tracking-tight">¥{p.budget.toLocaleString()}</p>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                                 <ArrowRight className="w-4 h-4" />
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-20">
        
        {/* 2. Advanced Sticky Filter Bar */}
        <div className="sticky top-16 md:top-20 z-30 mb-8 space-y-3">
           
           {/* Primary Filter Row */}
           <div className="bg-white/90 backdrop-blur-xl p-3 rounded-2xl border border-white/50 shadow-lg shadow-slate-200/50 flex flex-col md:flex-row gap-3 items-center ring-1 ring-slate-200/50 transition-all">
              
              {/* Search */}
              <div className="relative w-full md:w-72 group">
                 <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="搜索企划标题、发布方..." 
                   className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-transparent focus:border-indigo-200 rounded-xl py-2.5 pl-9 pr-8 text-sm outline-none transition-all shadow-inner"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                 />
                 {searchQuery && (
                   <button 
                     onClick={() => setSearchQuery('')}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                   >
                     <X className="w-3 h-3" />
                   </button>
                 )}
              </div>
              
              <div className="h-8 w-px bg-slate-200 hidden md:block mx-1"></div>

              {/* Status Tabs */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
                 {[
                    { id: 'all', label: '全部' },
                    { id: 'recruiting', label: '招募中' },
                    { id: 'progress', label: '进行中' },
                    { id: 'finished', label: '已完结' }
                 ].map(tab => (
                    <button 
                      key={tab.id}
                      onClick={() => setFilterStatus(tab.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                        filterStatus === tab.id 
                          ? 'bg-slate-900 text-white shadow-md' 
                          : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {tab.label}
                    </button>
                 ))}
              </div>
              
              <div className="ml-auto flex gap-2 w-full md:w-auto justify-end">
                 {/* Budget Dropdown */}
                 <div className="relative group">
                    <select 
                        className="appearance-none pl-3 pr-8 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors outline-none cursor-pointer shadow-sm"
                        value={selectedBudgetRange}
                        onChange={(e) => setSelectedBudgetRange(e.target.value)}
                    >
                        {BUDGET_RANGES.map(range => (
                            <option key={range.id} value={range.id}>{range.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                 </div>

                 {/* Sort Dropdown */}
                 <div className="relative group">
                    <select 
                        className="appearance-none pl-3 pr-8 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 transition-colors outline-none cursor-pointer shadow-sm"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as any)}
                    >
                        <option value="newest">最新发布</option>
                        <option value="budget_high">预算最高</option>
                        <option value="budget_low">预算最低</option>
                    </select>
                    <SlidersHorizontal className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                 </div>
              </div>
           </div>

           {/* Secondary Filter Row: Categories */}
           <div className="bg-white/80 backdrop-blur-md rounded-xl border border-white/50 p-2 overflow-x-auto no-scrollbar flex items-center gap-2 shadow-sm justify-between">
              <div className="flex items-center gap-2">
                <div className="px-2 text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider flex-shrink-0">
                   <Filter className="w-3 h-3" /> 分类:
                </div>
                {CATEGORIES.map(cat => (
                   <button
                     key={cat}
                     onClick={() => setSelectedCategory(cat)}
                     className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                        selectedCategory === cat
                           ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                           : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200 hover:text-indigo-600'
                     }`}
                   >
                      {cat}
                   </button>
                ))}
              </div>
              
              <div className="text-xs text-slate-400 font-medium whitespace-nowrap px-2 hidden lg:block">
                 共找到 {filteredProjects.length} 个企划
              </div>
           </div>
        </div>

        {/* 3. Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredProjects.slice(0, visibleCount).map((project, idx) => (
             <ProjectCard 
               key={project.id} 
               project={project} 
               onClick={setSelectedProject}
               style={{ animationDelay: `${idx * 50}ms` }}
               className="animate-fade-in-up"
             />
           ))}
        </div>
        
        {/* Empty State */}
        {filteredProjects.length === 0 && (
           <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300 ring-8 ring-slate-50">
                 <Search className="w-10 h-10" />
              </div>
              <h3 className="text-xl text-slate-800 font-bold mb-2">未找到相关企划</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">我们没有找到符合当前筛选条件的企划，尝试调整预算范围或关键词。</p>
              <button 
                onClick={() => { setFilterStatus('all'); setSearchQuery(''); setSelectedCategory('全部'); setSelectedBudgetRange('all'); }}
                className="mt-6 text-white bg-indigo-600 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
              >
                清除所有筛选
              </button>
           </div>
        )}

        {/* Load More Button */}
        {visibleCount < filteredProjects.length && (
          <div className="mt-12 text-center">
             <button 
               onClick={handleLoadMore}
               disabled={isLoadingMore}
               className="bg-white border border-slate-200 text-slate-600 px-8 py-3 rounded-full font-bold hover:bg-slate-50 hover:shadow-md transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
             >
               {isLoadingMore ? (
                 <>
                   <Loader2 className="w-4 h-4 animate-spin" /> 加载中...
                 </>
               ) : (
                 <>
                   加载更多 ({filteredProjects.length - visibleCount})
                   <ChevronDown className="w-4 h-4" />
                 </>
               )}
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectsHubPage;
