import React, { useState } from 'react';
import { X, UploadCloud, Image as ImageIcon, Sparkles, Wand2, CheckCircle2, Loader2, Briefcase, Calendar, DollarSign, FileText, Layers } from 'lucide-react';
import { UserRole } from '../types';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: UserRole;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, userRole = 'creator' }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'ai'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  // Enterprise Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    budget: '',
    deadline: '',
    description: '',
    deliverables: ['源文件', 'JPG导出']
  });

  if (!isOpen) return null;

  const handleActionSim = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      setTimeout(() => {
        setUploadComplete(false);
        onClose();
        // Reset state
        setProjectForm({ title: '', budget: '', deadline: '', description: '', deliverables: ['源文件', 'JPG导出'] });
        setActiveTab('upload');
      }, 1500);
    }, 2000);
  };

  const isEnterprise = userRole === 'enterprise';

  const renderSuccessView = () => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-scale-in">
      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isEnterprise ? 'bg-indigo-100' : 'bg-green-100'}`}>
        <CheckCircle2 className={`w-8 h-8 ${isEnterprise ? 'text-indigo-600' : 'text-green-600'}`} />
      </div>
      <h3 className="text-xl font-bold text-slate-800">
        {isEnterprise ? '需求发布成功！' : '作品发布成功！'}
      </h3>
      <p className="text-slate-500 text-center max-w-xs">
        {isEnterprise 
          ? '您的项目需求已推送至创作者大厅，请留意工作台的任务申请通知。' 
          : '您的作品已上传并同步至个人主页，正在进行内容审核。'}
      </p>
    </div>
  );

  const renderCreatorView = () => (
    <>
      {/* Tabs */}
      <div className="flex border-b border-slate-100">
        <button 
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'upload' ? 'border-pink-500 text-pink-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          本地上传
        </button>
        <button 
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'ai' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          AI 辅助创作
        </button>
      </div>

      <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh]">
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* Drag Drop Zone */}
            <div 
              onClick={handleActionSim}
              className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-pink-400 cursor-pointer transition-all group"
            >
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-pink-600 animate-spin" />
                ) : (
                  <UploadCloud className="w-8 h-8 text-pink-600" />
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-1">
                {isUploading ? '正在上传...' : '点击或拖拽作品文件'}
              </h3>
              <p className="text-sm text-slate-400 max-w-xs">
                支持 JPG, PNG, GIF, PSD。最大 50MB。
              </p>
            </div>

            {/* Metadata Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">作品标题</label>
                  <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none" placeholder="给作品起个名字..." />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none">
                    <option>插画</option>
                    <option>UI 设计</option>
                    <option>3D 模型</option>
                    <option>概念原画</option>
                  </select>
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">可见性</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none">
                    <option>公开 (社区可见)</option>
                    <option>私密 (仅自己可见)</option>
                    <option>仅粉丝可见</option>
                  </select>
              </div>
              <div className="col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-slate-700">标签 (AI 推荐)</label>
                    <button className="text-xs text-pink-600 hover:underline flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> 自动分析
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]">
                    <span className="bg-white border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md">#赛博朋克</span>
                    <span className="bg-white border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md">#霓虹</span>
                    <span className="text-slate-400 text-xs py-1 cursor-pointer hover:text-pink-500">+ 添加标签</span>
                  </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-start gap-3">
              <Wand2 className="w-5 h-5 text-purple-600 mt-0.5" />
              <div>
                  <h4 className="font-bold text-purple-900 text-sm">AI 灵感生成</h4>
                  <p className="text-xs text-purple-700 mt-1">
                    基于 Stable Diffusion 模型，输入提示词快速生成草图或参考图。生成的作品将自动打标。
                  </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">提示词 (Prompt)</label>
              <textarea 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none h-24 resize-none"
                placeholder="例如：一位穿着发光盔甲的未来战士，站在雨中的霓虹城市，8k分辨率，电影质感..."
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm hover:border-purple-300 transition-colors cursor-pointer">
                  点击生成预览 1
                </div>
                <div className="aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm hover:border-purple-300 transition-colors cursor-pointer">
                  点击生成预览 2
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  const renderEnterpriseView = () => (
    <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] space-y-6">
      <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-start gap-3">
        <Briefcase className="w-5 h-5 text-indigo-600 mt-0.5" />
        <div>
           <h4 className="font-bold text-indigo-900 text-sm">发布企业项目需求</h4>
           <p className="text-xs text-indigo-700 mt-1">
             需求发布后将进入审核队列，审核通过后展示在“急需人才”板块。
           </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">项目名称</label>
          <input 
            type="text" 
            className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" 
            placeholder="例如：2024年春季品牌宣传主视觉设计" 
            value={projectForm.title}
            onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                 <DollarSign className="w-3.5 h-3.5 text-slate-400" /> 预算范围
              </label>
              <select 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                value={projectForm.budget}
                onChange={(e) => setProjectForm({...projectForm, budget: e.target.value})}
              >
                <option value="">请选择预算</option>
                <option value="5k-10k">¥5,000 - ¥10,000</option>
                <option value="10k-30k">¥10,000 - ¥30,000</option>
                <option value="30k-100k">¥30,000 - ¥100,000</option>
                <option value="100k+">¥100,000+</option>
              </select>
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                 <Calendar className="w-3.5 h-3.5 text-slate-400" /> 期望交付日期
              </label>
              <input 
                type="date" 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-600"
                value={projectForm.deadline}
                onChange={(e) => setProjectForm({...projectForm, deadline: e.target.value})}
              />
           </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> 需求详情描述
           </label>
           <textarea 
             className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32 resize-none"
             placeholder="请详细描述项目背景、设计风格要求、目标受众等..."
             value={projectForm.description}
             onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
           ></textarea>
        </div>

        <div>
           <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-400" /> 交付物要求 (可多选)
           </label>
           <div className="flex flex-wrap gap-2">
              {['源文件 (PSD/AI)', '高清导出图 (JPG/PNG)', '切图资源', '设计规范文档', '3D模型工程', '商用授权书'].map(item => (
                <button 
                  key={item}
                  onClick={() => {
                    const newDeliverables = projectForm.deliverables.includes(item)
                      ? projectForm.deliverables.filter(d => d !== item)
                      : [...projectForm.deliverables, item];
                    setProjectForm({...projectForm, deliverables: newDeliverables});
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    projectForm.deliverables.includes(item)
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {item}
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className={`text-lg font-bold flex items-center gap-2 ${isEnterprise ? 'text-indigo-900' : 'text-slate-800'}`}>
            {isEnterprise ? <Briefcase className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
            {isEnterprise ? '发布项目需求' : '上传创作内容'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {uploadComplete ? renderSuccessView() : (isEnterprise ? renderEnterpriseView() : renderCreatorView())}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          {!uploadComplete && (
            <>
              <button onClick={onClose} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded-lg transition-colors">
                取消
              </button>
              <button 
                onClick={handleActionSim}
                disabled={isUploading}
                className={`px-6 py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2 ${
                  isEnterprise 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                    : activeTab === 'ai' 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200' 
                      : 'bg-pink-600 hover:bg-pink-700 text-white shadow-pink-200'
                }`}
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {isEnterprise 
                  ? '提交审核' 
                  : (activeTab === 'ai' ? '生成并发布' : '确认发布')
                }
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;