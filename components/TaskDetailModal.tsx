
import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, AlignLeft, Send, MessageSquare, Paperclip, 
  Calendar, Download, Image as ImageIcon, Plus
} from 'lucide-react';
import { Task } from '../types';
import { getAvatar } from '../mockData'; // Import local avatar generator

// ... existing helper components ...
const PriorityBadge = ({ priority }: { priority: Task['priority'] }) => {
  const colors = {
    high: 'bg-red-100 text-red-700',
    medium: 'bg-amber-100 text-amber-700',
    low: 'bg-green-100 text-green-700'
  };
  const labels = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  };
  return <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${colors[priority]}`}>{labels[priority]}</span>;
};

const TaskDetailModal = ({ task, onClose }: { task: Task; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState<'comments' | 'attachments'>('comments');
  const [newComment, setNewComment] = useState('');

  // Mock Data for the modal
  const description = "根据项目需求文档，完成该阶段的核心设计任务。请确保遵循品牌视觉规范，并及时同步进度。建议参考项目附件中的设计指南。";
  
  const [mockComments, setMockComments] = useState([
    { id: 1, user: '项目经理', avatar: getAvatar('PM'), text: '请注意截止日期，客户希望周五前看到初稿。', time: '2小时前' },
    { id: 2, user: task.assignee, avatar: task.assigneeAvatar, text: '收到，目前进度正常，预计明天提交。', time: '1小时前' }
  ]);
  
  const mockAttachments = [
    { name: '需求文档_v1.pdf', size: '2.4MB', type: 'doc' },
    { name: '参考图_01.jpg', size: '1.8MB', type: 'image' },
    { name: '设计规范.sketch', size: '15MB', type: 'file' }
  ];

  const statusMap: Record<string, string> = {
    'todo': '待处理',
    'in-progress': '进行中',
    'review': '审核中',
    'done': '已完成'
  };

  const handleSendComment = () => {
    if (!newComment.trim()) return;
    setMockComments([...mockComments, {
      id: Date.now(),
      user: '我',
      avatar: getAvatar('Me'),
      text: newComment,
      time: '刚刚'
    }]);
    setNewComment('');
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
             <div>
                <div className="flex items-center gap-2 mb-2">
                   <PriorityBadge priority={task.priority} />
                   <span className="text-xs text-slate-400 font-mono">#{task.id}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 leading-tight">{task.title}</h2>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
               <X className="w-5 h-5" />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
             {/* Meta Row */}
             <div className="flex flex-wrap gap-6 text-sm bg-white border border-slate-100 p-4 rounded-xl shadow-sm">
                <div>
                   <span className="text-slate-400 block text-xs mb-1 font-bold uppercase">负责人</span>
                   <div className="flex items-center gap-2">
                      <img src={task.assigneeAvatar} className="w-6 h-6 rounded-full object-cover" alt="" />
                      <span className="font-bold text-slate-700">{task.assignee}</span>
                   </div>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div>
                   <span className="text-slate-400 block text-xs mb-1 font-bold uppercase">截止日期</span>
                   <div className="flex items-center gap-2 font-bold text-slate-700">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {task.dueDate}
                   </div>
                </div>
                <div className="w-px bg-slate-200"></div>
                <div>
                   <span className="text-slate-400 block text-xs mb-1 font-bold uppercase">当前状态</span>
                   <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-xs font-bold text-slate-600">
                      {statusMap[task.status]}
                   </span>
                </div>
             </div>

             {/* Description */}
             <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                   <AlignLeft className="w-4 h-4 text-indigo-500" /> 任务描述
                </h3>
                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 leading-relaxed border border-slate-100">
                   {description}
                </div>
             </div>

             {/* Tabs Area */}
             <div>
                <div className="flex gap-6 border-b border-slate-100 mb-4">
                   <button
                     onClick={() => setActiveTab('comments')}
                     className={`pb-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'comments' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                   >
                      评论 ({mockComments.length})
                   </button>
                   <button
                     onClick={() => setActiveTab('attachments')}
                     className={`pb-2 text-sm font-bold transition-colors border-b-2 ${activeTab === 'attachments' ? 'text-indigo-600 border-indigo-600' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                   >
                      附件 ({mockAttachments.length})
                   </button>
                </div>

                {activeTab === 'comments' ? (
                   <div className="space-y-4 animate-fade-in">
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {mockComments.map(c => (
                           <div key={c.id} className="flex gap-3 group">
                              <img src={c.avatar} className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 object-cover" alt="" />
                              <div className="flex-1">
                                 <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-800">{c.user}</span>
                                    <span className="text-[10px] text-slate-400">{c.time}</span>
                                 </div>
                                 <div className="bg-slate-50 p-3 rounded-r-xl rounded-bl-xl text-sm text-slate-600 border border-slate-100">
                                    {c.text}
                                 </div>
                              </div>
                           </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 pt-2 border-t border-slate-100 mt-2">
                         <input
                           type="text"
                           value={newComment}
                           onChange={e => setNewComment(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                           className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                           placeholder="写下你的评论..."
                         />
                         <button 
                           onClick={handleSendComment}
                           disabled={!newComment.trim()}
                           className="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                            <Send className="w-4 h-4" />
                         </button>
                      </div>
                   </div>
                ) : (
                   <div className="space-y-2 animate-fade-in">
                      {mockAttachments.map((file, i) => (
                         <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                  {file.type === 'image' ? <ImageIcon className="w-4 h-4" /> : <Paperclip className="w-4 h-4" />}
                               </div>
                               <div>
                                  <div className="text-sm font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{file.name}</div>
                                  <div className="text-xs text-slate-400">{file.size}</div>
                               </div>
                            </div>
                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                               <Download className="w-4 h-4" />
                            </button>
                         </div>
                      ))}
                      <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors flex items-center justify-center gap-2 font-medium">
                         <Plus className="w-4 h-4" /> 上传新附件
                      </button>
                   </div>
                )}
             </div>
          </div>
       </div>
    </div>,
    document.body
  );
};

export default TaskDetailModal;
