
import React, { useState } from 'react';
import { 
  Plus, MoreHorizontal, Calendar, MessageSquare, Paperclip, 
  CheckCircle2, Circle, Clock, AlertCircle, Search, Filter,
  X, AlignLeft, Send, User, Tag, ChevronDown, SlidersHorizontal, Archive, LayoutList
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_TASKS, MOCK_PROJECT_CASES } from '../constants';
import { Project, Task, TaskStatus, TaskPriority } from '../types';

const PriorityBadge = ({ priority }: { priority: Task['priority'] }) => {
  const colors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-green-100 text-green-700'
  };
  const labels = {
    high: '高优',
    medium: '中等',
    low: '低优'
  };
  return (
    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${colors[priority]}`}>
      {labels[priority]}
    </span>
  );
};

const TaskCard: React.FC<{ task: Task; onClick: (task: Task) => void }> = ({ task, onClick }) => {
  const statusColors = {
    'todo': 'border-l-slate-300',
    'in-progress': 'border-l-blue-500',
    'review': 'border-l-amber-500',
    'done': 'border-l-emerald-500'
  };

  return (
    <div 
      onClick={() => onClick(task)}
      className={`bg-white p-3 rounded-lg shadow-sm border border-slate-200 border-l-[3px] ${statusColors[task.status]} hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group active:scale-[0.98]`}
    >
      <div className="flex justify-between items-start mb-2">
        <PriorityBadge priority={task.priority} />
        <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <h4 className="text-sm font-semibold text-slate-800 mb-3 leading-snug">{task.title}</h4>
      
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <div className="flex gap-2">
            <span className={`flex items-center gap-1 ${task.comments > 0 ? 'text-slate-500 font-medium' : 'text-slate-300'}`}>
              <MessageSquare className="w-3.5 h-3.5" /> {task.comments}
            </span>
            {task.attachments > 0 && (
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <Paperclip className="w-3.5 h-3.5" /> {task.attachments}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-slate-400"><Calendar className="w-3.5 h-3.5" /> {task.dueDate}</span>
        </div>
        <img src={task.assigneeAvatar} alt={task.assignee} className="w-6 h-6 rounded-full border border-white bg-slate-200" />
      </div>
    </div>
  );
};

const ColumnHeader = ({ title, count, status }: { title: string, count: number, status: TaskStatus }) => {
  const statusColors = {
    'todo': 'bg-slate-200',
    'in-progress': 'bg-blue-200',
    'review': 'bg-amber-200',
    'done': 'bg-green-200'
  };
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${statusColors[status].replace('200', '500')}`}></span>
        <h3 className="font-semibold text-slate-700 text-sm">{title}</h3>
        <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <button className="text-slate-400 hover:text-slate-600"><Plus className="w-4 h-4" /></button>
    </div>
  );
};

// --- Task Detail Modal ---
const TaskDetailModal = ({ task, onClose }: { task: Task | null; onClose: () => void }) => {
  if (!task) return null;

  const project = MOCK_PROJECTS.find(p => p.id === task.projectId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-scale-in overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                 <Tag className="w-3 h-3" />
                 {project?.title || '未知项目'}
               </span>
               <span className="text-xs text-slate-400">#{task.id}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 leading-snug">{task.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-0 flex flex-col md:flex-row">
           
           {/* Left: Main Details */}
           <div className="flex-1 p-6 space-y-6">
              
              {/* Description */}
              <div>
                 <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                   <AlignLeft className="w-4 h-4" /> 任务描述
                 </h3>
                 <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p>这是一个关于 “{task.title}” 的详细任务描述。需按照项目设计规范执行，确保所有交付物符合 {project?.client || '客户'} 的验收标准。</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>确保图层命名规范</li>
                      <li>输出格式参考项目文档 v2.0</li>
                      <li>在 {task.dueDate} 前完成初稿</li>
                    </ul>
                 </div>
              </div>

              {/* Attachments */}
              <div>
                 <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                   <Paperclip className="w-4 h-4" /> 附件 ({task.attachments})
                 </h3>
                 <div className="space-y-2">
                    {Array.from({ length: Math.max(1, task.attachments) }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer group">
                         <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center font-bold text-xs">
                           PSD
                         </div>
                         <div className="flex-1">
                            <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-600">Design_Asset_v{i+1}.psd</p>
                            <p className="text-xs text-slate-400">12.5 MB • 2小时前</p>
                         </div>
                         <button className="text-xs text-indigo-600 font-medium hover:underline">下载</button>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Comments */}
              <div>
                 <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                   <MessageSquare className="w-4 h-4" /> 评论 ({task.comments})
                 </h3>
                 
                 <div className="space-y-4 mb-4">
                    {/* Simulated Comments */}
                    <div className="flex gap-3">
                       <img src={task.assigneeAvatar} className="w-8 h-8 rounded-full bg-slate-200" alt="User" />
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className="text-sm font-bold text-slate-800">{task.assignee}</span>
                             <span className="text-xs text-slate-400">昨天 14:30</span>
                          </div>
                          <p className="text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg rounded-tl-none">
                             已经更新了最新版本的草图，请查收附件。
                          </p>
                       </div>
                    </div>
                    {task.comments > 1 && (
                      <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">PM</div>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-sm font-bold text-slate-800">Project Manager</span>
                               <span className="text-xs text-slate-400">今天 09:15</span>
                            </div>
                            <p className="text-sm text-slate-600 bg-slate-50 p-2.5 rounded-lg rounded-tl-none">
                               收到，色彩感觉不错，细节部分还需要再调整一下。
                            </p>
                         </div>
                      </div>
                    )}
                 </div>

                 {/* Comment Input */}
                 <div className="flex gap-2 relative">
                    <img src="https://ui-avatars.com/api/?name=Me&background=cbd5e1&color=fff" className="w-8 h-8 rounded-full bg-slate-200" alt="Me" />
                    <div className="flex-1 relative">
                       <input 
                         type="text" 
                         placeholder="发表评论..." 
                         className="w-full border border-slate-200 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                       />
                       <button className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 p-1">
                         <Send className="w-4 h-4" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>

           {/* Right: Meta Sidebar */}
           <div className="w-full md:w-72 bg-slate-50 border-l border-slate-100 p-6 space-y-6">
              
              <div>
                 <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">状态</label>
                 <select 
                   defaultValue={task.status} 
                   className="w-full bg-white border border-slate-200 text-slate-700 text-sm rounded-lg p-2.5 focus:ring-indigo-500 focus:border-indigo-500"
                 >
                   <option value="todo">待办事项</option>
                   <option value="in-progress">进行中</option>
                   <option value="review">审核确认</option>
                   <option value="done">已完成</option>
                 </select>
              </div>

              <div>
                 <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">优先级</label>
                 <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} />
                 </div>
              </div>

              <div>
                 <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">执行人</label>
                 <div className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-lg">
                    <img src={task.assigneeAvatar} className="w-6 h-6 rounded-full" alt="" />
                    <span className="text-sm font-medium text-slate-700">{task.assignee}</span>
                 </div>
              </div>

              <div>
                 <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">截止日期</label>
                 <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {task.dueDate}
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                 <button className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                   标记完成
                 </button>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'kanban' | 'archive'>('kanban');
  const [activeProjectId, setActiveProjectId] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');

  // Archive Filter State
  const [archiveYear, setArchiveYear] = useState('all');

  // Compute Unique Assignees for Dropdown
  const uniqueAssignees = Array.from(new Set(MOCK_TASKS.map(t => t.assignee)));

  // Master Filter Function (Kanban)
  const filteredTasks = MOCK_TASKS.filter(task => {
    // 1. Project Filter
    const matchProject = activeProjectId === 'all' || task.projectId === activeProjectId;
    
    // 2. Search Filter
    const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        task.assignee.toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Status Filter
    const matchStatus = filterStatus === 'all' || task.status === filterStatus;

    // 4. Priority Filter
    const matchPriority = filterPriority === 'all' || task.priority === filterPriority;

    // 5. Assignee Filter
    const matchAssignee = filterAssignee === 'all' || task.assignee === filterAssignee;

    return matchProject && matchSearch && matchStatus && matchPriority && matchAssignee;
  });

  // Archive Filter Function
  const filteredCases = MOCK_PROJECT_CASES.filter(c => 
    archiveYear === 'all' || c.year === archiveYear
  );

  const getTasksByStatus = (status: TaskStatus) => filteredTasks.filter(t => t.status === status);

  const activeProject = MOCK_PROJECTS.find(p => p.id === activeProjectId);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/100x100?text=Project';
  };

  const hasActiveFilters = filterStatus !== 'all' || filterPriority !== 'all' || filterAssignee !== 'all';

  const resetFilters = () => {
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterAssignee('all');
    setSearchQuery('');
  };

  // Render Archive View
  const renderArchive = () => (
    <div className="animate-fade-in space-y-6">
       <div className="flex gap-2 items-center mb-4">
          <span className="text-sm font-medium text-slate-600">筛选年份:</span>
          {['all', '2023', '2022', '2021', '2020'].map(year => (
            <button
              key={year}
              onClick={() => setArchiveYear(year)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                archiveYear === year ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {year === 'all' ? '全部' : year}
            </button>
          ))}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map(c => (
            <div key={c.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all group cursor-pointer">
               <div className="h-40 overflow-hidden relative">
                  <img src={c.coverImage} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={c.title} />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded">
                    {c.year}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {c.category}
                  </div>
               </div>
               <div className="p-5">
                  <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">{c.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-3 mb-4">{c.description}</p>
                  
                  <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-lg p-3 mb-4">
                     {c.results.map((r, i) => (
                       <div key={i} className="text-center">
                          <div className="text-sm font-bold text-indigo-600">{r.value}</div>
                          <div className="text-[10px] text-slate-400">{r.label}</div>
                       </div>
                     ))}
                  </div>

                  {c.clientTestimonial && (
                    <div className="text-xs text-slate-500 italic border-l-2 border-indigo-200 pl-2">
                       "{c.clientTestimonial.text}"
                       <div className="text-right mt-1 font-medium not-italic">— {c.clientTestimonial.author}</div>
                    </div>
                  )}
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Detail Modal */}
      {selectedTask && (
        <TaskDetailModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex gap-4 items-center">
          {viewMode === 'kanban' && activeProject && (
            <img 
              src={activeProject.coverImage || "https://placehold.co/100x100?text=Cover"} 
              alt={activeProject.title} 
              className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
              onError={handleImageError}
            />
          )}
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              {viewMode === 'kanban' ? (activeProject ? activeProject.title : '项目看板') : '历史项目归档'}
              {/* View Switcher */}
              <div className="flex bg-slate-100 rounded-lg p-1 ml-4 h-8 items-center">
                 <button 
                  onClick={() => setViewMode('kanban')}
                  className={`p-1 rounded transition-colors ${viewMode === 'kanban' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="任务看板"
                 >
                   <LayoutList className="w-4 h-4" />
                 </button>
                 <button 
                  onClick={() => setViewMode('archive')}
                  className={`p-1 rounded transition-colors ${viewMode === 'archive' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  title="项目归档"
                 >
                   <Archive className="w-4 h-4" />
                 </button>
              </div>
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-xl">
              {viewMode === 'kanban' 
                ? (activeProject ? activeProject.description : '查看所有项目的任务进度与状态')
                : '浏览企业过往的成功案例与交付成果数据'
              }
            </p>
          </div>
        </div>

        {viewMode === 'kanban' && (
          <div className="flex items-center gap-3">
            {/* Project Switcher */}
            <select 
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 min-w-[200px]"
            >
              <option value="all">全部项目</option>
              {MOCK_PROJECTS.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              新建任务
            </button>
          </div>
        )}
      </div>

      {viewMode === 'archive' ? (
        renderArchive()
      ) : (
        <>
          {/* Integrated Filter Control Panel */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex flex-col gap-4">
              
              {/* Top Row: Search & Actions */}
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative flex-1 w-full md:max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="搜索任务标题..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2.5 w-full bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm" 
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                   {/* Stack */}
                   <div className="flex items-center -space-x-2">
                      <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" src="https://ui-avatars.com/api/?name=User+A&background=random" alt="User" />
                      <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" src="https://ui-avatars.com/api/?name=User+B&background=random" alt="User" />
                      <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-medium text-slate-500">+3</div>
                   </div>
                   
                   {hasActiveFilters && (
                    <button 
                      onClick={resetFilters}
                      className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors text-xs font-medium bg-slate-100 px-3 py-2 rounded-lg"
                    >
                      <X className="w-3 h-3" /> 清除筛选
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom Row: Dropdowns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                 {/* Status */}
                 <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 whitespace-nowrap">状态</span>
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="bg-transparent border-none text-sm text-slate-700 focus:ring-0 w-full cursor-pointer outline-none"
                      >
                        <option value="all">全部</option>
                        <option value="todo">待办</option>
                        <option value="in-progress">进行中</option>
                        <option value="review">审核</option>
                        <option value="done">完成</option>
                      </select>
                 </div>

                 {/* Priority */}
                 <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 whitespace-nowrap">优先级</span>
                    <select 
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value as any)}
                        className="bg-transparent border-none text-sm text-slate-700 focus:ring-0 w-full cursor-pointer outline-none"
                      >
                        <option value="all">全部</option>
                        <option value="high">高优</option>
                        <option value="medium">中等</option>
                        <option value="low">低优</option>
                      </select>
                 </div>

                 {/* Assignee */}
                 <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 border border-slate-200">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 whitespace-nowrap">负责人</span>
                    <select 
                        value={filterAssignee}
                        onChange={(e) => setFilterAssignee(e.target.value)}
                        className="bg-transparent border-none text-sm text-slate-700 focus:ring-0 w-full cursor-pointer outline-none"
                      >
                        <option value="all">全部</option>
                        {uniqueAssignees.map(a => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                 </div>
              </div>

            </div>
          </div>

          {/* Kanban Board */}
          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-6 min-w-[1000px] h-full pb-4">
              
              {/* Column: Todo */}
              <div className="flex-1 flex flex-col bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
                <ColumnHeader title="待办事项" count={getTasksByStatus('todo').length} status="todo" />
                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
                  {getTasksByStatus('todo').length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic">暂无任务</div>
                  ) : (
                    getTasksByStatus('todo').map(task => <TaskCard key={task.id} task={task} onClick={setSelectedTask} />)
                  )}
                  <button className="w-full py-2 text-slate-400 hover:bg-slate-100 rounded-lg text-sm dashed border border-transparent hover:border-slate-300 transition-all flex items-center justify-center gap-1">
                    <Plus className="w-4 h-4" /> 添加任务
                  </button>
                </div>
              </div>

              {/* Column: In Progress */}
              <div className="flex-1 flex flex-col bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
                <ColumnHeader title="进行中" count={getTasksByStatus('in-progress').length} status="in-progress" />
                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
                  {getTasksByStatus('in-progress').length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic">暂无任务</div>
                  ) : (
                    getTasksByStatus('in-progress').map(task => <TaskCard key={task.id} task={task} onClick={setSelectedTask} />)
                  )}
                </div>
              </div>

              {/* Column: Review */}
              <div className="flex-1 flex flex-col bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
                <ColumnHeader title="审核确认" count={getTasksByStatus('review').length} status="review" />
                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
                  {getTasksByStatus('review').length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic">暂无任务</div>
                  ) : (
                    getTasksByStatus('review').map(task => <TaskCard key={task.id} task={task} onClick={setSelectedTask} />)
                  )}
                </div>
              </div>

              {/* Column: Done */}
              <div className="flex-1 flex flex-col bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
                <ColumnHeader title="已完成" count={getTasksByStatus('done').length} status="done" />
                <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
                  {getTasksByStatus('done').length === 0 ? (
                    <div className="text-center py-8 text-slate-400 text-xs italic">暂无任务</div>
                  ) : (
                    getTasksByStatus('done').map(task => <TaskCard key={task.id} task={task} onClick={setSelectedTask} />)
                  )}
                </div>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectsView;
