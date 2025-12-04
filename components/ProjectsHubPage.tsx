
import React, { useState } from 'react';
import { 
  Briefcase, Search, Filter, DollarSign, Calendar, Clock, 
  MapPin, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Building, Star
} from 'lucide-react';
import { MOCK_PROJECTS } from '../constants';
import { Project, User } from '../types';

interface ProjectsHubPageProps {
  onBack: () => void;
  onTriggerLogin?: () => void;
  user?: User | null;
}

const ProjectsHubPage: React.FC<ProjectsHubPageProps> = ({ onBack, onTriggerLogin, user }) => {
  const [filterStatus, setFilterStatus] = useState('all'); // all, recruiting, in-progress, completed
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetRange, setBudgetRange] = useState('all');

  // Filter Logic
  const filteredProjects = MOCK_PROJECTS.filter(project => {
    // Status Filter (Map mock statuses to filter keys)
    let matchStatus = true;
    if (filterStatus === 'recruiting') matchStatus = project.status === '招募中' || project.status === '草稿';
    else if (filterStatus === 'in-progress') matchStatus = project.status === '进行中' || project.status === '审核中';
    else if (filterStatus === 'completed') matchStatus = project.status === '已完成';

    // Search Filter
    const matchSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        project.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Budget Filter (Simple logic for demo)
    let matchBudget = true;
    if (budgetRange === 'low') matchBudget = project.budget < 10000;
    else if (budgetRange === 'medium') matchBudget = project.budget >= 10000 && project.budget < 50000;
    else if (budgetRange === 'high') matchBudget = project.budget >= 50000;

    return matchStatus && matchSearch && matchBudget;
  });

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user && onTriggerLogin) {
      onTriggerLogin();
    } else {
      // In a real app, open application modal
      alert("申请功能仅在演示模式下模拟");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-20 px-4 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
           <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回社区
            </button>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
               <div>
                  <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                    <Briefcase className="w-8 h-8 text-indigo-600" />
                    企划大厅
                  </h1>
                  <p className="text-slate-500 mt-2 max-w-2xl">
                    汇聚优质甲方需求，提供资金托管与规范化交易流程。
                    当前共有 <span className="font-bold text-indigo-600">{MOCK_PROJECTS.length}</span> 个项目正在进行或招募中。
                  </p>
               </div>
               {(!user || user.role === 'enterprise') && (
                 <button 
                   onClick={() => onTriggerLogin && onTriggerLogin()}
                   className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                 >
                   <Building className="w-4 h-4" /> 我是甲方，发布需求
                 </button>
               )}
            </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-6 grid grid-cols-1 md:grid-cols-12 gap-4">
           
           {/* Search */}
           <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="搜索企划标题、甲方名称..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 w-full bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
           </div>

           {/* Status Select */}
           <div className="md:col-span-3">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">所有状态</option>
                <option value="recruiting">招募中 / 草稿</option>
                <option value="in-progress">进行中</option>
                <option value="completed">已完成</option>
              </select>
           </div>

           {/* Budget Select */}
           <div className="md:col-span-3">
              <select 
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full h-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">所有预算范围</option>
                <option value="low">¥10k 以下</option>
                <option value="medium">¥10k - ¥50k</option>
                <option value="high">¥50k 以上</option>
              </select>
           </div>
           
           <div className="md:col-span-1 flex items-center justify-center">
              <button className="p-2.5 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors" title="更多筛选">
                 <Filter className="w-5 h-5" />
              </button>
           </div>
        </div>

        {/* Projects List */}
        <div className="space-y-4">
           {filteredProjects.length > 0 ? (
             filteredProjects.map((project, idx) => (
               <div 
                 key={project.id} 
                 className="group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all animate-fade-in-up flex flex-col md:flex-row gap-5"
                 style={{ animationDelay: `${idx * 50}ms` }}
               >
                  {/* Left: Image */}
                  <div className="w-full md:w-48 h-32 md:h-auto flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden relative">
                     <img 
                       src={project.coverImage || "https://placehold.co/200x150?text=Project"} 
                       alt={project.title} 
                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                     <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-bold text-slate-800">
                        {project.phase}
                     </div>
                  </div>

                  {/* Middle: Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                           <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                             {project.title}
                           </h3>
                           {project.status === '招募中' && (
                             <span className="bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                               <Clock className="w-3 h-3" /> 急招
                             </span>
                           )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                           <span className="font-medium text-slate-700">{project.client}</span>
                           <span>•</span>
                           <span>发布于 2天前</span>
                           <span>•</span>
                           <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> 远程</span>
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {project.description || '暂无详细描述...'}
                        </p>
                     </div>
                     
                     <div className="flex flex-wrap gap-2 mt-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">商业约稿</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">全额托管</span>
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">买断制</span>
                     </div>
                  </div>

                  {/* Right: Action & Meta */}
                  <div className="w-full md:w-48 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
                     <div className="text-right w-full flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end">
                        <div className="font-bold text-xl text-indigo-600 flex items-center gap-0.5">
                           <span className="text-sm text-slate-400 font-normal mr-1">预算</span>
                           <span className="text-base">¥</span>{project.budget.toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                           <Calendar className="w-3 h-3" /> 截止: {project.deadline}
                        </div>
                     </div>

                     <div className="w-full mt-4">
                        {project.status === '招募中' || project.status === '草稿' ? (
                          <button 
                            onClick={handleApply}
                            className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-2 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
                          >
                            立即应征 <ArrowRight className="w-4 h-4" />
                          </button>
                        ) : (
                           <button disabled className="w-full bg-slate-100 text-slate-400 font-bold py-2 rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                             {project.status === '已完成' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                             {project.status}
                           </button>
                        )}
                     </div>
                  </div>
               </div>
             ))
           ) : (
             <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">暂无符合条件的企划</p>
                <button onClick={() => { setFilterStatus('all'); setSearchQuery(''); setBudgetRange('all'); }} className="mt-2 text-indigo-600 text-sm hover:underline">
                  重置筛选条件
                </button>
             </div>
           )}
        </div>

      </div>
    </div>
  );
};

export default ProjectsHubPage;
