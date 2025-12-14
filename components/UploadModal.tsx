
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, UploadCloud, Image as ImageIcon, Sparkles, Wand2, CheckCircle2, Loader2, Briefcase, Calendar, DollarSign, FileText, Layers, AlertCircle, RefreshCw, LayoutTemplate, Palette } from 'lucide-react';
import { UserRole } from '../types';
import { AIService, ImageGenerationOptions } from '../services/AIService';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: UserRole;
}

const ASPECT_RATIOS = [
  { label: '1:1', value: '1:1', icon: 'Square' },
  { label: '16:9', value: '16:9', icon: 'RectangleHorizontal' },
  { label: '9:16', value: '9:16', icon: 'RectangleVertical' },
  { label: '4:3', value: '4:3', icon: 'RectangleHorizontal' },
  { label: '3:4', value: '3:4', icon: 'RectangleVertical' },
];

const ART_STYLES = [
  '无风格 (None)', '赛博朋克 (Cyberpunk)', '水彩画 (Watercolor)', '3D 渲染 (3D Render)', 
  '二次元 (Anime)', '超写实 (Realistic)', '油画 (Oil Painting)', '极简主义 (Minimalist)', '像素艺术 (Pixel Art)'
];

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, userRole = 'creator' }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'ai'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  
  // AI Gen State
  const [prompt, setPrompt] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState(''); 
  
  // AI Image Gen Settings
  const [aspectRatio, setAspectRatio] = useState<ImageGenerationOptions['aspectRatio']>('1:1');
  const [selectedStyle, setSelectedStyle] = useState<string>('None');

  // AI Image Gen State
  const [generatedImages, setGeneratedImages] = useState<(string | null)[]>([null, null]);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean[]>([false, false]);

  // Enterprise Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    budget: '',
    deadline: '',
    description: '',
    deliverables: ['源文件', 'JPG导出']
  });
  
  // Enterprise Cover Gen State
  const [enterpriseCover, setEnterpriseCover] = useState<string | null>(null);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

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
        setEnterpriseCover(null);
        setActiveTab('upload');
        setPrompt('');
        setGeneratedPrompt('');
        setGeneratedImages([null, null]);
        setAspectRatio('1:1');
        setSelectedStyle('None');
      }, 1500);
    }, 2000);
  };

  const handlePromptOptimization = async () => {
    if (!prompt.trim()) return;
    setIsGeneratingPrompt(true);
    try {
      const optimized = await AIService.expandCreativePrompt(prompt);
      setGeneratedPrompt(optimized);
      setPrompt(optimized); // Directly update the input for better UX
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleGenerateImage = async (index: number) => {
    const promptToUse = prompt; // Use what the user sees
    if (!promptToUse.trim()) return;

    const newIsGenerating = [...isGeneratingImage];
    newIsGenerating[index] = true;
    setIsGeneratingImage(newIsGenerating);

    // Parse style value (remove Chinese prefix for API if needed, or keep for visual context)
    // The API prompt construction handles the style string simply.
    const styleValue = selectedStyle.includes('(') ? selectedStyle.split('(')[1].replace(')', '') : selectedStyle;

    try {
      const imageUrl = await AIService.generateImage(promptToUse, {
        aspectRatio: aspectRatio,
        style: styleValue === 'None' ? undefined : styleValue
      });
      const newImages = [...generatedImages];
      newImages[index] = imageUrl;
      setGeneratedImages(newImages);
    } catch (e) {
      console.error(e);
    } finally {
      // Functional update to avoid stale state issues
      setIsGeneratingImage(prev => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }
  };

  const handleGenerateEnterpriseCover = async () => {
    const basePrompt = projectForm.title 
      ? `Project cover for: ${projectForm.title}. ${projectForm.description}` 
      : "Professional business project cover, corporate style, high quality 3D render";
    
    setIsGeneratingCover(true);
    try {
      // Use Nano Banana (gemini-2.5-flash-image) via service
      const imageUrl = await AIService.generateImage(basePrompt, {
        aspectRatio: '16:9',
        style: '3D Render' // Default style for enterprise
      });
      setEnterpriseCover(imageUrl);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingCover(false);
    }
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
          AI 灵感创作
        </button>
      </div>

      <div className="p-6 md:p-8 overflow-y-auto max-h-[60vh] custom-scrollbar">
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
                  <h4 className="font-bold text-purple-900 text-sm">Gemini (Nano Banana) 灵感创作</h4>
                  <p className="text-xs text-purple-700 mt-1">
                    输入想法，AI 将自动分析核心元素，生成构图合理、风格统一的专业图像。
                  </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">创意描述 (Prompt)</label>
              <div className="relative">
                <textarea 
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none h-24 resize-none pr-14"
                  placeholder="例如：未来的机器人，下雨，霓虹灯..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
                <button 
                  onClick={handlePromptOptimization}
                  disabled={!prompt || isGeneratingPrompt}
                  className="absolute bottom-2 right-2 p-1.5 bg-purple-100 hover:bg-purple-200 rounded-lg text-purple-700 transition-colors disabled:opacity-50 flex flex-col items-center justify-center gap-0.5 w-10"
                  title="AI 智能优化"
                >
                  {isGeneratingPrompt ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span className="text-[9px] font-bold">优化</span>
                </button>
              </div>
            </div>

            {/* Config Row */}
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                     <LayoutTemplate className="w-3.5 h-3.5" /> 画幅比例
                  </label>
                  <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
                     {ASPECT_RATIOS.map(ratio => (
                        <button
                           key={ratio.value}
                           onClick={() => setAspectRatio(ratio.value as any)}
                           className={`px-2 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all border ${
                              aspectRatio === ratio.value 
                                 ? 'bg-purple-600 text-white border-purple-600' 
                                 : 'bg-white text-slate-500 border-slate-200 hover:border-purple-300'
                           }`}
                        >
                           {ratio.label}
                        </button>
                     ))}
                  </div>
               </div>
               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                     <Palette className="w-3.5 h-3.5" /> 艺术风格
                  </label>
                  <select 
                     value={selectedStyle}
                     onChange={(e) => setSelectedStyle(e.target.value)}
                     className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white text-slate-700"
                  >
                     {ART_STYLES.map(style => (
                        <option key={style} value={style}>{style}</option>
                     ))}
                  </select>
               </div>
            </div>

            {/* Generated Suggestion Preview (Optional visual feedback) */}
            {generatedPrompt && prompt !== generatedPrompt && (
              <div className="animate-fade-in bg-slate-50 border border-slate-200 rounded-lg p-3">
                 <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-500 uppercase">AI 优化结果</span>
                    <button 
                      onClick={() => setPrompt(generatedPrompt)}
                      className="text-xs text-purple-600 hover:underline font-medium"
                    >
                      恢复
                    </button>
                 </div>
                 <p className="text-xs text-slate-500 leading-relaxed italic line-clamp-2">
                    "{generatedPrompt}"
                 </p>
              </div>
            )}

            <div className="border-t border-slate-100 pt-4">
               <label className="block text-sm font-medium text-slate-700 mb-2">生成预览</label>
               <div className="grid grid-cols-2 gap-4">
                  {[0, 1].map((index) => (
                    <div 
                      key={index}
                      onClick={() => !isGeneratingImage[index] && handleGenerateImage(index)}
                      className={`relative bg-slate-100 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm hover:border-purple-300 transition-colors cursor-pointer group overflow-hidden ${isGeneratingImage[index] ? 'cursor-not-allowed' : ''}`}
                      style={{ aspectRatio: aspectRatio.replace(':', '/') }}
                    >
                      {generatedImages[index] ? (
                        <>
                          <img src={generatedImages[index]!} alt="Generated" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <span className="text-white font-medium flex items-center gap-1">
                               <RefreshCw className="w-4 h-4" /> 重新生成
                             </span>
                          </div>
                        </>
                      ) : (
                        <>
                          {isGeneratingImage[index] ? (
                            <div className="flex flex-col items-center gap-2">
                               <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
                               <span className="text-xs text-purple-500">生成中...</span>
                            </div>
                          ) : (
                            <>
                              <span className="relative z-10 group-hover:text-purple-500 transition-colors font-medium flex flex-col items-center gap-1 p-2 text-center">
                                 <ImageIcon className="w-6 h-6" />
                                 <span className="text-xs">点击生成预览 {index + 1}</span>
                              </span>
                              <div className="absolute inset-0 bg-purple-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  ))}
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

        {/* Enterprise Cover Image Generation */}
        <div>
           <label className="block text-sm font-medium text-slate-700 mb-2">项目封面图 (AI 辅助)</label>
           <div className="relative aspect-[16/9] bg-slate-50 rounded-xl overflow-hidden border-2 border-dashed border-slate-200 flex items-center justify-center group hover:border-indigo-300 transition-colors">
              {enterpriseCover ? (
                 <>
                    <img src={enterpriseCover} className="w-full h-full object-cover" alt="Project Cover" />
                    <button 
                       onClick={handleGenerateEnterpriseCover}
                       className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold gap-2"
                    >
                       <RefreshCw className="w-4 h-4" /> 重新生成
                    </button>
                 </>
              ) : (
                 <div className="text-center">
                    <button 
                       onClick={handleGenerateEnterpriseCover}
                       disabled={isGeneratingCover}
                       className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mx-auto"
                    >
                       {isGeneratingCover ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                       {isGeneratingCover ? '生成中...' : '使用 Nano Banana 生成封面'}
                    </button>
                    <p className="text-xs text-slate-400 mt-2 max-w-[200px] mx-auto">
                       基于项目名称自动生成专业风格的 3D 渲染或概念图
                    </p>
                 </div>
              )}
           </div>
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
           <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-slate-700 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" /> 需求详情描述
              </label>
              <button 
                onClick={() => {
                   if(projectForm.description) {
                      // Mock AI refinement for enterprise
                      setProjectForm({...projectForm, description: projectForm.description + "\n\n[AI 建议补充]: 建议明确具体的交付格式（如PSD分层文件）以及是否需要提供 mood board 参考图。"});
                   }
                }}
                className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
              >
                 <Sparkles className="w-3 h-3" /> AI 润色
              </button>
           </div>
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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
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
    </div>,
    document.body
  );
};

export default UploadModal;
