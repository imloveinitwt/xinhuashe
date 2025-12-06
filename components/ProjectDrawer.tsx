
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Briefcase, Share2, X, ShieldCheck, Building, CheckCircle2, Clock, MapPin, 
  DollarSign, Layers, Zap, Target, Download, Check, UploadCloud, FileText, 
  Send, Paperclip, Heart
} from 'lucide-react';
import { Project, User } from '../types';

interface ProjectDrawerProps {
  project: Project;
  onClose: () => void;
  onApply: () => void;
  user?: User | null;
}

const MOCK_TIMELINE = [
  { id: 1, title: '项目启动', date: '2023-10-01', status: 'completed', desc: '确认合作意向，支付预付款' },
  { id: 2, title: '草稿阶段', date: '2023-10-05', status: 'completed', desc: '提交3版草图方案供选择' },
  { id: 3, title: '线稿细化', date: '2023-10-12', status: 'current', desc: '确定构图，完成精细线稿' },
  { id: 4, title: '上色完稿', date: '2023-10-20', status: 'pending', desc: '完成最终上色与特效' },
  { id: 5, title: '项目验收', date: '2023-10-25', status: 'pending', desc: '交付源文件，支付尾款' },
];

const MOCK_FILES = [
  { name: 'Draft_Concept_v1.jpg', size: '2.4 MB', date: '10-05 14:30', uploader: 'NeonDreamer' },
  { name: 'Draft_Concept_v2.jpg', size: '2.6 MB', date: '10-06 09:15', uploader: 'NeonDreamer' },
  { name: 'Project_Brief.pdf', size: '1.2 MB', date: '10-01 10:00', uploader: 'Client' },
];

const MOCK_COMMENTS = [
  { id: 1, user: 'TechNova 科技', avatar: 'https://ui-avatars.com/api/?name=Tech&bg=random', text: '草稿 v2 的构图我很喜欢，但是希望能把背景的色调再压暗一点，突出人物。', time: '10-06 10:30', isMe: false },
  { id: 2, user: 'NeonDreamer', avatar: 'https://ui-avatars.com/api/?name=Neon&bg=random', text: '收到，我会在细化阶段调整光影对比。', time: '10-06 11:00', isMe: true },
];

const ProjectDrawer: React.FC<ProjectDrawerProps> = ({ project, onClose, onApply, user }) => {
  const [activeTab, setActiveTab] = useState<'detail' | 'progress' | 'files' | 'chat'>('detail');
  const [newMessage, setNewMessage] = useState('');

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/800x400/f1f5f9/94a3b8?text=Project+Cover';
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=cbd5e1&color=fff';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'detail':
        return (
          <div className="space-y-8 animate-fade-in pb-24">
            {/* Banner Area */}
            <div className="relative h-64 rounded-2xl overflow-hidden group shadow-sm border border-slate-100">
               <img 
                 src={project.coverImage || 'https://placehold.co/800x400/f1f5f9/94a3b8?text=Project+Cover'} 
                 className="w-full h-full object-cover" 
                 alt="" 
                 onError={handleImageError}
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90"></div>
               
               <div className="absolute top-4 right-4 flex gap-2">
                  <span className="bg-emerald-500/20 backdrop-blur-md text-emerald-100 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> 资金已托管
                  </span>
               </div>

               <div className="absolute bottom-6 left-6 right-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-lg border border-white/10">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div>
                       <div className="text-xs text-indigo-200 font-bold uppercase tracking-wider">发布方</div>
                       <div className="text-sm font-bold opacity-95">{project.client}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-xs text-white/90 border border-white/20">
                       <CheckCircle2 className="w-3 h-3" /> 企业认证
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold leading-tight mb-2 drop-shadow-md">{project.title}</h1>
                  <div className="flex gap-4 text-xs text-slate-300 font-medium">
                     <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 截止: {project.deadline}</span>
                     <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> 远程办公</span>
                  </div>
               </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4">
               <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col justify-center text-center relative overflow-hidden">
                  <div className="text-indigo-600 text-xs font-bold uppercase mb-1 flex items-center justify-center gap-1"><DollarSign className="w-3 h-3"/> 项目预算</div>
                  <div className="text-xl font-extrabold text-indigo-900">¥{project.budget.toLocaleString()}</div>
               </div>
               <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-center text-center">
                  <div className="text-slate-500 text-xs font-bold uppercase mb-1 flex items-center justify-center gap-1"><Layers className="w-3 h-3"/> 当前阶段</div>
                  <div className="text-lg font-bold text-slate-800">{project.phase}</div>
               </div>
               <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex flex-col justify-center text-center">
                  <div className="text-orange-600 text-xs font-bold uppercase mb-1 flex items-center justify-center gap-1"><Zap className="w-3 h-3"/> 热度</div>
                  <div className="text-lg font-bold text-orange-900">High</div>
               </div>
            </div>

            {/* Description */}
            <div className="prose prose-sm max-w-none">
               <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                 <div className="w-1 h-5 bg-indigo-600 rounded-full"></div> 需求详情
               </h3>
               <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {project.description || "暂无详细描述。该项目需要专业的设计服务，请参考附件文档或直接联系甲方获取更多信息。"}
               </div>
               
               <div className="mt-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 bg-indigo-600 rounded-full"></div> 具体要求
                  </h3>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-start gap-3">
                       <span className="text-indigo-600 mt-1"><Target className="w-4 h-4" /></span>
                       <p className="text-sm text-slate-600"><strong className="text-slate-900">风格倾向：</strong> 偏向日系厚涂，光影质感强，参考《原神》立绘风格。</p>
                    </div>
                    <div className="flex items-start gap-3">
                       <span className="text-indigo-600 mt-1"><Layers className="w-4 h-4" /></span>
                       <p className="text-sm text-slate-600"><strong className="text-slate-900">规格尺寸：</strong> 4k 分辨率 (3840x2160)，300dpi，CMYK色彩模式。</p>
                    </div>
                    <div className="flex items-start gap-3">
                       <span className="text-indigo-600 mt-1"><Download className="w-4 h-4" /></span>
                       <p className="text-sm text-slate-600"><strong className="text-slate-900">交付内容：</strong> PSD源文件（图层未合并）、高清JPG导出图、透明底PNG角色图。</p>
                    </div>
                    <div className="flex items-start gap-3">
                       <span className="text-indigo-600 mt-1"><ShieldCheck className="w-4 h-4" /></span>
                       <p className="text-sm text-slate-600"><strong className="text-slate-900">版权归属：</strong> 企业买断（含著作财产权），画师保留署名权。</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        );
      
      case 'progress':
        return (
          <div className="animate-fade-in p-2 pb-20">
             <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
               <div className="w-1 h-5 bg-indigo-600 rounded-full"></div> 项目里程碑
             </h3>
             <div className="space-y-0 relative pl-4 border-l-2 border-slate-100 ml-3">
                {MOCK_TIMELINE.map((item, idx) => (
                  <div key={item.id} className="relative pb-10 last:pb-0 group">
                     <div className={`absolute -left-[23px] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors ${
                       item.status === 'completed' ? 'border-green-500 text-green-500' :
                       item.status === 'current' ? 'border-indigo-500 text-indigo-500 scale-110' :
                       'border-slate-300 text-slate-300'
                     }`}>
                        {item.status === 'completed' && <Check className="w-3 h-3" />}
                        {item.status === 'current' && <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>}
                     </div>
                     <div className="pl-6 -mt-1.5">
                        <div className={`p-4 rounded-xl border shadow-sm transition-all ${item.status === 'current' ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-100'}`}>
                          <div className="flex justify-between items-start mb-1">
                             <h4 className={`font-bold text-sm ${item.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{item.title}</h4>
                             <span className="text-xs font-mono text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-100">{item.date}</span>
                          </div>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'files':
        return (
          <div className="animate-fade-in pb-20">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-1 h-5 bg-indigo-600 rounded-full"></div> 交付文件
                </h3>
                <button className="text-xs bg-indigo-600 text-white px-3 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm">
                  <UploadCloud className="w-3 h-3" /> 上传新版本
                </button>
             </div>
             <div className="space-y-3">
                {MOCK_FILES.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                           <FileText className="w-5 h-5" />
                        </div>
                        <div>
                           <div className="font-bold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">{file.name}</div>
                           <div className="text-xs text-slate-400 mt-0.5">{file.size} • {file.date} • {file.uploader}</div>
                        </div>
                     </div>
                     <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-colors">
                        <Download className="w-5 h-5" />
                     </button>
                  </div>
                ))}
             </div>
          </div>
        );

      case 'chat':
        return (
          <div className="flex flex-col h-[calc(100vh-200px)] animate-fade-in bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
             <div className="flex-1 overflow-y-auto space-y-6 p-4 custom-scrollbar">
                {MOCK_COMMENTS.map((msg) => (
                   <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : ''}`}>
                      <img 
                        src={msg.avatar} 
                        className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 shadow-sm border border-white" 
                        alt="" 
                        onError={handleAvatarError}
                      />
                      <div className={`max-w-[85%] flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                         <div className="flex items-baseline gap-2 mb-1 px-1">
                            <span className="font-bold text-xs text-slate-700">{msg.user}</span>
                            <span className="text-[10px] text-slate-400">{msg.time}</span>
                         </div>
                         <div className={`p-3 rounded-2xl text-sm shadow-sm leading-relaxed ${
                           msg.isMe 
                             ? 'bg-indigo-600 text-white rounded-tr-none' 
                             : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                         }`}>
                            {msg.text}
                         </div>
                      </div>
                   </div>
                ))}
             </div>
             <div className="p-3 bg-white border-t border-slate-200">
                <div className="relative">
                   <input 
                     type="text" 
                     value={newMessage}
                     onChange={(e) => setNewMessage(e.target.value)}
                     className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                     placeholder="输入消息..."
                   />
                   <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                      <Send className="w-4 h-4" />
                   </button>
                </div>
                <div className="flex gap-2 mt-2 px-1">
                   <button className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded transition-colors" title="添加附件"><Paperclip className="w-4 h-4" /></button>
                   <button className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded transition-colors" title="上传图片"><UploadCloud className="w-4 h-4" /></button>
                </div>
             </div>
          </div>
        );
    }
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[100] animate-fade-in" onClick={onClose}></div>
      <div className="fixed top-0 right-0 h-full w-full md:w-[720px] bg-white shadow-2xl z-[101] animate-slide-in-right flex flex-col">
         
         {/* Drawer Header */}
         <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white z-20 sticky top-0">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                 <Briefcase className="w-5 h-5" />
              </div>
              项目详情
            </h2>
            <div className="flex items-center gap-2">
               <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><Share2 className="w-5 h-5"/></button>
               <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><X className="w-5 h-5"/></button>
            </div>
         </div>

         {/* Tabs */}
         <div className="px-6 border-b border-slate-100 flex gap-8 overflow-x-auto no-scrollbar bg-white z-10 sticky top-[69px]">
            {[
              { id: 'detail', label: '详情概览' },
              { id: 'progress', label: '进度追踪' },
              { id: 'files', label: '交付文件' },
              { id: 'chat', label: '协作讨论' }
            ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`py-4 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                   activeTab === tab.id 
                     ? 'border-indigo-600 text-indigo-600' 
                     : 'border-transparent text-slate-500 hover:text-slate-800'
                 }`}
               >
                 {tab.label}
               </button>
            ))}
         </div>

         {/* Main Content */}
         <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar">
            {renderTabContent()}
         </div>

         {/* Footer Action - Sticky */}
         <div className="p-5 border-t border-slate-200 bg-white z-20 shadow-[0_-4px_12px_-1px_rgba(0,0,0,0.05)]">
            {user?.role === 'creator' ? (
               <div className="flex gap-4 items-center">
                  <div className="flex-col">
                     <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">期望报价</span>
                     <div className="font-extrabold text-indigo-600 text-2xl leading-none">¥{project.budget.toLocaleString()}</div>
                  </div>
                  <div className="h-8 w-px bg-slate-200 mx-2"></div>
                  <button className="p-3 border border-slate-200 rounded-xl text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-colors">
                     <Heart className="w-6 h-6" />
                  </button>
                  <button onClick={onApply} className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2 active:scale-[0.98]">
                     <Send className="w-4 h-4" /> 立即应征
                  </button>
               </div>
            ) : (
               <div className="flex gap-3">
                  <button className="flex-1 py-3 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                     结束企划
                  </button>
                  <button className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md transition-colors">
                     管理应征者 (3)
                  </button>
               </div>
            )}
         </div>
      </div>
    </>,
    document.body
  );
};

export default ProjectDrawer;
