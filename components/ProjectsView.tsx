
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, MoreHorizontal, Calendar, MessageSquare, Paperclip, 
  CheckCircle2, Circle, Clock, AlertCircle, Search, Filter,
  X, AlignLeft, Send, User, Tag, ChevronDown, SlidersHorizontal, Archive, LayoutList, Loader2
} from 'lucide-react';
import { ProjectService } from '../services/ProjectService';
import { MOCK_TASKS, MOCK_PROJECT_CASES } from '../constants'; // Tasks still mock for now
import { Project, Task, TaskStatus, TaskPriority } from '../types';

// ... (Retain PriorityBadge, TaskCard, ColumnHeader, TaskDetailModal, FilterButton components as is)
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

const TaskDetailModal = ({ task, onClose }: { task: Task | null; onClose: () => void }) => {
  useEffect(() => {
    if (task) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [task]);

  if (!task) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] animate-scale-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded flex items-center gap-1">
                 <Tag className="w-3 h-3" />
                 任务详情
               </span>
               <span className="text-xs text-slate-400">#{task.id}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 leading-snug">{task.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-0 flex flex-col md:flex-row">
           <div className="flex-1 p-6 space-y-6">
              <div>
                 <h3 className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                   <AlignLeft className="w-4 h-4" /> 任务描述
                 </h3>
                 <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <p>这是一个关于 “{task.title}” 的详细任务描述。需按照项目设计规范执行。</p>
                 </div>
              </div>
           </div>
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
           </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const FilterButton: React.FC<{ label: string; value: string; activeValue: string; onClick: (val: string) => void }> = ({ label, value, activeValue, onClick }) => {
  const isActive = value === activeValue;
  return (
    <button
      onClick={() => onClick(value)}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
        isActive 
          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
          : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-200 hover:text-indigo-600 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
};

const ProjectsView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'kanban' | 'archive'>('kanban');
  const [activeProjectId, setActiveProjectId] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  // Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [archiveYear, setArchiveYear] = useState('all');

  // Load Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [loadedProjects, loadedTasks] = await Promise.all([
          ProjectService.getAllProjects(),
          ProjectService.getTasksByProject('all') // Fetch all tasks initially for demo
        ]);
        setProjects(loadedProjects);
        setTasks(loadedTasks);
      } catch (err) {
        console.error("Failed to load project data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const uniqueAssignees = Array.from(new Set(tasks.map(t => t.assignee)));

  const filteredTasks = tasks.filter(task => {
    const matchProject = activeProjectId === 'all' || task.projectId === activeProjectId;
    const matchSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        task.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchAssignee = filterAssignee === 'all' || task.assignee === filterAssignee;

    return matchProject && matchSearch && matchStatus && matchPriority && matchAssignee;
  });

  const getTasksByStatus = (status: TaskStatus) => filteredTasks.filter(t => t.status === status);
  const activeProject = projects.find(p => p.id === activeProjectId);
  const hasActiveFilters = filterStatus !== 'all' || filterPriority !== 'all' || filterAssignee !== 'all';

  const resetFilters = () => {
    setFilterStatus('all');
    setFilterPriority('all');
    setFilterAssignee('all');
    setSearchQuery('');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/100x100?text=Project';
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span>正在同步项目数据...</span>
        </div>
      </div>
    );
  }

  // ... (Archive View Render Logic remains the same as before)
  const filteredCases = MOCK_PROJECT_CASES.filter(c => 
    archiveYear === 'all' || c.year === archiveYear
  );

  const renderArchive = () => (
    <div className="animate-fade-in space-y-6">
       {/* (Same Archive UI as before) */}
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
               </div>
            </div>
          ))}
       </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}

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
              <div className="flex bg-slate-100 rounded-lg p-1 ml-4 h-8 items-center">
                 <button onClick={() => setViewMode('kanban')} className={`p-1 rounded transition-colors ${viewMode === 'kanban' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                   <LayoutList className="w-4 h-4" />
                 </button>
                 <button onClick={() => setViewMode('archive')} className={`p-1 rounded transition-colors ${viewMode === 'archive' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                   <Archive className="w-4 h-4" />
                 </button>
              </div>
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-xl">
              {viewMode === 'kanban' ? (activeProject ? activeProject.description : '查看所有项目的任务进度与状态') : '浏览企业过往的成功案例与交付成果数据'}
            </p>
          </div>
        </div>

        {viewMode === 'kanban' && (
          <div className="flex items-center gap-3">
            <select 
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 min-w-[200px]"
            >
              <option value="all">全部项目</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" /> 新建任务
            </button>
          </div>
        )}
      </div>

      {viewMode === 'archive' ? renderArchive() : (
        <>
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex flex-col gap-4">
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
                   {hasActiveFilters && (
                    <button onClick={resetFilters} className="flex items-center gap-1 text-slate-500 hover:text-red-500 transition-colors text-xs font-medium bg-slate-100 px-3 py-2 rounded-lg">
                      <X className="w-3 h-3" /> 清除筛选
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                   <span className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1.5 w-20"><Filter className="w-3.5 h-3.5" /> 状态:</span>
                   <div className="flex items-center gap-2">
                     {['all', 'todo', 'in-progress', 'review', 'done'].map(s => (
                       <FilterButton key={s} label={s==='all'?'全部':s} value={s} activeValue={filterStatus} onClick={(v) => setFilterStatus(v as any)} />
                     ))}
                   </div>
                </div>
                {/* ... (Other filters similar structure) ... */}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-x-auto overflow-y-hidden">
            <div className="flex gap-6 min-w-[1000px] h-full pb-4">
              {['todo', 'in-progress', 'review', 'done'].map(status => (
                <div key={status} className="flex-1 flex flex-col bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
                  <ColumnHeader title={status === 'todo' ? '待办' : status === 'in-progress' ? '进行中' : status === 'review' ? '审核' : '完成'} count={getTasksByStatus(status as TaskStatus).length} status={status as TaskStatus} />
                  <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1">
                    {getTasksByStatus(status as TaskStatus).map(task => <TaskCard key={task.id} task={task} onClick={setSelectedTask} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectsView;
