
import React, { useState } from 'react';
import { 
  Plus, MoreHorizontal, Calendar, MessageSquare, Paperclip, 
  CheckCircle2, Circle, Clock, AlertCircle, Search, Filter 
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_TASKS } from '../constants';
import { Project, Task, TaskStatus } from '../types';

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

const TaskCard = ({ task }: { task: Task }) => (
  <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-all cursor-pointer group">
    <div className="flex justify-between items-start mb-2">
      <PriorityBadge priority={task.priority} />
      <button className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
    <h4 className="text-sm font-semibold text-slate-800 mb-3 leading-snug">{task.title}</h4>
    
    <div className="flex items-center justify-between mt-3">
      <div className="flex items-center gap-3 text-slate-400 text-xs">
        {(task.comments > 0 || task.attachments > 0) && (
          <div className="flex gap-2">
            {task.comments > 0 && (
              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {task.comments}</span>
            )}
            {task.attachments > 0 && (
              <span className="flex items-center gap-1"><Paperclip className="w-3 h-3" /> {task.attachments}</span>
            )}
          </div>
        )}
        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {task.dueDate}</span>
      </div>
      <img src={task.assigneeAvatar} alt={task.assignee} className="w-6 h-6 rounded-full border border-white" />
    </div>
  </div>
);

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

const ProjectsView: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string>('all');

  const filteredTasks = activeProjectId === 'all' 
    ? MOCK_TASKS 
    : MOCK_TASKS.filter(t => t.projectId === activeProjectId);

  const getTasksByStatus = (status: TaskStatus) => filteredTasks.filter(t => t.status === status);

  const activeProject = MOCK_PROJECTS.find(p => p.id === activeProjectId);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">项目看板</h2>
          <p className="text-slate-500 text-sm mt-1">
            {activeProject ? activeProject.description : '查看所有项目的任务进度与状态'}
          </p>
        </div>
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
      </div>

      {/* Filters (Optional visual element) */}
      <div className="flex items-center gap-4 mb-6 text-sm text-slate-500">
        <div className="relative flex-1 max-w-xs">
           <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
           <input type="text" placeholder="搜索任务..." className="pl-9 pr-4 py-2 w-full bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500" />
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
           <Filter className="w-4 h-4" /> 筛选
        </div>
        <div className="flex items-center -space-x-2">
            <img className="w-7 h-7 rounded-full border-2 border-slate-50" src="https://picsum.photos/32/32?random=10" alt="User" />
            <img className="w-7 h-7 rounded-full border-2 border-slate-50" src="https://picsum.photos/32/32?random=11" alt="User" />
            <img className="w-7 h-7 rounded-full border-2 border-slate-50" src="https://picsum.photos/32/32?random=13" alt="User" />
            <div className="w-7 h-7 rounded-full border-2 border-slate-50 bg-slate-100 flex items-center justify-center text-[10px] font-medium">+2</div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-6 min-w-[1000px] h-full pb-4">
          
          {/* Column: Todo */}
          <div className="flex-1 flex flex-col bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
            <ColumnHeader title="待办事项" count={getTasksByStatus('todo').length} status="todo" />
            <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
              {getTasksByStatus('todo').map(task => <TaskCard key={task.id} task={task} />)}
              <button className="w-full py-2 text-slate-400 hover:bg-slate-100 rounded-lg text-sm dashed border border-transparent hover:border-slate-300 transition-all flex items-center justify-center gap-1">
                <Plus className="w-4 h-4" /> 添加任务
              </button>
            </div>
          </div>

          {/* Column: In Progress */}
          <div className="flex-1 flex flex-col bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
            <ColumnHeader title="进行中" count={getTasksByStatus('in-progress').length} status="in-progress" />
            <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
              {getTasksByStatus('in-progress').map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          </div>

          {/* Column: Review */}
          <div className="flex-1 flex flex-col bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
            <ColumnHeader title="审核确认" count={getTasksByStatus('review').length} status="review" />
             <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
              {getTasksByStatus('review').map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          </div>

          {/* Column: Done */}
          <div className="flex-1 flex flex-col bg-slate-50/50 rounded-xl p-3 border border-slate-100/50">
            <ColumnHeader title="已完成" count={getTasksByStatus('done').length} status="done" />
             <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
              {getTasksByStatus('done').map(task => <TaskCard key={task.id} task={task} />)}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectsView;
