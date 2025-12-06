
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  Briefcase, Search, Filter, DollarSign, Calendar, Clock, 
  MapPin, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Building, X,
  Layers, MessageSquare, FileText, UploadCloud, MoreHorizontal, User as UserIcon,
  Check, Send, Paperclip, Download, ChevronRight, TrendingUp, Zap, Target,
  Heart, Share2, Star, ShieldCheck, Flame, ChevronDown, SlidersHorizontal, MousePointerClick,
  Loader2
} from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';
import { Project, User } from '../types';
import ProjectDrawer from './ProjectDrawer';

interface ProjectsHubPageProps {
  onBack: () => void;
  onTriggerLogin?: () => void;
  user?: User | null;
}

// --- Configuration Constants ---
const CATEGORIES = ['全部', 'UI/UX', '插画', '3D/动画', '平面设计', '游戏原画', '网站设计', '品牌全案'];

const BUDGET_RANGES = [
  { id: 'all', label: '不限预算', min: 0, max: Infinity },
  { id: 'low', label: '5k以下', min: 0, max: 5000 },
  { id: 'mid', label: '5k - 20k', min: 5000, max: 20000 },
  { id: 'high', label: '20k - 50k', min: 20000, max: 50000 },
  { id: 'premium', label: '50k以上', min: 50000, max: Infinity },
];

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

  const featuredProjects = MOCK_PROJECTS.filter(p => p.status === '招募中' && p.budget > 10000).slice(0, 3);

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

  // Interactive tag click
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Check if tag is in categories, otherwise set search
    if (CATEGORIES.includes(tag)) {
      setSelectedCategory(tag);
    } else {
      setSearchQuery(tag);
    }
    // Scroll to filter bar
    window.scrollTo({ top: 400, behavior: 'smooth' });
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

      {/* 1. Enhanced Hero Section */}
      <div className="bg-white border-b border-slate-200 relative overflow-hidden">
         {/* Decorative Background */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-indigo-50 to-blue-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-purple-50 to-pink-50 rounded-full blur-3xl opacity-40 pointer-events-none"></div>
         
         <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10">
            <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium text-sm">
               <ArrowLeft className="w-4 h-4" /> 返回社区
            </button>
            <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-10">
               <div className="max-w-2xl">
                  <h1 className="text-4xl font-extrabold text-slate-900 mb-4 flex items-center gap-3 tracking-tight">
                    <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
                       <Briefcase className="w-8 h-8" />
                    </div>
                    企划大厅
                  </h1>
                  <p className="text-slate-500 text-lg leading-relaxed">
                     汇聚全网优质商业需求，提供 <span className="text-indigo-700 font-bold bg-indigo-50 px-1 rounded">100% 资金托管</span> 保障。
                     <br className="hidden md:block" />让每一次创作都有价值，让每一次交付都更安心。
                  </p>
                  
                  {/* Quick Stats Strip */}
                  <div className="flex gap-6 mt-6 pt-6 border-t border-slate-100">
                     <div>
                        <div className="text-2xl font-bold text-slate-900">{stats.activeProjects}</div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">招募中企划</div>
                     </div>
                     <div className="w-px bg-slate-200 h-10"></div>
                     <div>
                        <div className="text-2xl font-bold text-slate-900">¥{(stats.avgBudget/1000).toFixed(1)}k</div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">平均预算</div>
                     </div>
                     <div className="w-px bg-slate-200 h-10"></div>
                     <div>
                        <div className="text-2xl font-bold text-green-600">+{stats.newToday}</div>
                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">今日新增</div>
                     </div>
                  </div>
               </div>
               
               <div className="flex gap-3">
                 <button 
                   onClick={handlePostProject}
                   className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 flex items-center justify-center gap-2 group"
                 >
                   <UploadCloud className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   发布新企划
                 </button>
               </div>
            </div>

            {/* Featured Projects Scroll */}
            <div className="mb-2">
               <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                     <div className="p-1 bg-rose-100 text-rose-600 rounded"><Flame className="w-3.5 h-3.5" /></div>
                     急需人才 / 高薪项目
                  </div>
               </div>
               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                  {featuredProjects.map(p => (
                     <div 
                        key={`feat-${p.id}`} 
                        onClick={() => setSelectedProject(p)}
                        className="min-w-[280px] bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all relative overflow-hidden group"
                     >
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity"><Zap className="w-24 h-24" /></div>
                        <div className="relative z-10 flex flex-col h-full">
                           <div className="flex justify-between items-start mb-2">
                              <span className="text-[10px] bg-white/10 border border-white/10 px-2 py-0.5 rounded font-medium text-indigo-100 backdrop-blur-sm">{p.client}</span>
                              <span className="text-[10px] text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">急招</span>
                           </div>
                           <h4 className="font-bold text-lg mb-1 line-clamp-1 group-hover:text-indigo-200 transition-colors">{p.title}</h4>
                           <div className="text-xs text-slate-400 mb-6 line-clamp-1">{p.description}</div>
                           
                           <div className="mt-auto flex justify-between items-end border-t border-white/10 pt-3">
                              <div>
                                 <p className="text-[10px] text-slate-400 uppercase font-bold">预算</p>
                                 <p className="text-xl font-bold tracking-tight">¥{p.budget.toLocaleString()}</p>
                              </div>
                              <div className="w-8 h-8 rounded-full bg-white text-indigo-900 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
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

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-20">
        
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
             <div 
               key={project.id} 
               onClick={() => setSelectedProject(project)}
               className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full ring-1 ring-slate-100 hover:ring-indigo-100/50"
               style={{ animationDelay: `${idx * 50}ms` }}
             >
                {/* Image Area */}
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                   <img 
                     src={project.coverImage || 'https://placehold.co/800x400/f1f5f9/94a3b8?text=Project+Cover'} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                     alt=""
                     onError={handleImageError}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-80"></div>
                   
                   {/* Status Badge */}
                   <div className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md border border-white/10 flex items-center gap-1 ${
                      project.status === '招募中' ? 'bg-indigo-600 text-white' : 
                      ['进行中', '验收中'].includes(project.status) ? 'bg-blue-500 text-white' :
                      'bg-slate-500 text-white'
                   }`}>
                      {project.status === '招募中' && <Zap className="w-3 h-3 fill-current" />}
                      {project.status}
                   </div>

                   {/* Deadline Badge */}
                   <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full border border-white/10">
                      <Clock className="w-3 h-3" /> {project.deadline} 截止
                   </div>

                   {/* Title Overlay */}
                   <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-bold text-lg text-white drop-shadow-md line-clamp-1 mb-1 group-hover:text-indigo-200 transition-colors">
                        {project.title}
                      </h3>
                      <div className="flex items-center gap-2 text-white/90 text-xs">
                         <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm">
                            <Building className="w-3 h-3" /> {project.client}
                         </span>
                         {/* Mock Verified */}
                         <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" title="认证企业" />
                      </div>
                   </div>
                </div>
                
                {/* Info Body */}
                <div className="p-5 flex-1 flex flex-col">
                   <div className="mb-4">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                         {project.category && (
                            <button 
                              onClick={(e) => handleTagClick(project.category!, e)}
                              className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-full font-bold hover:bg-indigo-100 transition-colors"
                            >
                               {project.category}
                            </button>
                         )}
                         {project.tags?.slice(0,3).map(tag => (
                            <button 
                              key={tag} 
                              onClick={(e) => handleTagClick(tag, e)}
                              className="text-[10px] bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            >
                               {tag}
                            </button>
                         ))}
                      </div>
                      
                      {/* Description Teaser */}
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                         {project.description || "项目暂无详细描述，请点击查看详情。"}
                      </p>

                      {/* Progress Bar (if active) */}
                      {['进行中', '验收中'].includes(project.status) && (
                         <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1.5 font-medium">
                               <span>交付进度</span>
                               <span className="text-indigo-600 font-bold">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                               <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ width: `${project.progress}%` }}></div>
                            </div>
                         </div>
                      )}
                   </div>

                   {/* Footer Info */}
                   <div className="mt-auto pt-4 border-t border-slate-50 flex items-end justify-between">
                      <div>
                         <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5 flex items-center gap-1">
                            <Target className="w-3 h-3" /> 项目预算
                         </p>
                         <div className={`text-xl font-extrabold font-mono tracking-tight ${project.budget > 20000 ? 'text-indigo-600' : 'text-slate-800'}`}>
                            ¥{project.budget.toLocaleString()}
                         </div>
                      </div>
                      
                      <div className="flex gap-2">
                         <button 
                           onClick={(e) => { e.stopPropagation(); alert('已收藏'); }}
                           className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors"
                         >
                            <Heart className="w-4 h-4" />
                         </button>
                         <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-600 transition-colors shadow-sm flex items-center gap-1">
                            查看 <ArrowRight className="w-3 h-3" />
                         </button>
                      </div>
                   </div>
                </div>
             </div>
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
