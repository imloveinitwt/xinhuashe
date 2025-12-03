
import React, { useState } from 'react';
import { X, UploadCloud, Image as ImageIcon, Sparkles, Wand2, CheckCircle2, Loader2 } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'ai'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  if (!isOpen) return null;

  const handleUploadSim = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setUploadComplete(true);
      setTimeout(() => {
        setUploadComplete(false);
        onClose();
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">发布作品</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'upload' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
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

        {/* Content */}
        <div className="p-6 md:p-8 overflow-y-auto">
          
          {uploadComplete ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 animate-scale-in">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">发布成功！</h3>
              <p className="text-slate-500">您的作品已上传并同步至作品集。</p>
            </div>
          ) : (
            <>
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  {/* Drag Drop Zone */}
                  <div 
                    onClick={handleUploadSim}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-slate-50 hover:border-indigo-400 cursor-pointer transition-all group"
                  >
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {isUploading ? (
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                      ) : (
                        <UploadCloud className="w-8 h-8 text-indigo-600" />
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-700 mb-1">
                      {isUploading ? '正在上传...' : '点击或拖拽文件到此处'}
                    </h3>
                    <p className="text-sm text-slate-400 max-w-xs">
                      支持 JPG, PNG, PSD, MP4 格式。单个文件最大支持 500MB。
                    </p>
                  </div>

                  {/* Metadata Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-2">
                       <label className="block text-sm font-medium text-slate-700 mb-1">作品标题</label>
                       <input type="text" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" placeholder="给作品起个名字..." />
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">分类</label>
                       <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                         <option>插画</option>
                         <option>UI 设计</option>
                         <option>3D 模型</option>
                       </select>
                    </div>
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">可见性</label>
                       <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                         <option>公开 (社区可见)</option>
                         <option>私密 (仅自己可见)</option>
                         <option>仅粉丝可见</option>
                       </select>
                    </div>
                    <div className="col-span-2">
                       <div className="flex justify-between items-center mb-1">
                          <label className="block text-sm font-medium text-slate-700">标签 (AI 推荐)</label>
                          <button className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                             <Sparkles className="w-3 h-3" /> 自动分析
                          </button>
                       </div>
                       <div className="flex flex-wrap gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg min-h-[44px]">
                          <span className="bg-white border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md">#赛博朋克</span>
                          <span className="bg-white border border-slate-200 text-slate-600 text-xs px-2 py-1 rounded-md">#霓虹</span>
                          <span className="text-slate-400 text-xs py-1">+ 添加标签</span>
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
                         基于 Stable Diffusion 模型，输入提示词快速生成草图或参考图。生成的作品将带有 "AI Generated" 标识。
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
                     <div className="aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                       预览位 1
                     </div>
                     <div className="aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm">
                       预览位 2
                     </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          {!uploadComplete && (
            <>
              <button onClick={onClose} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded-lg transition-colors">
                取消
              </button>
              <button 
                onClick={handleUploadSim}
                disabled={isUploading}
                className={`px-6 py-2 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2 ${
                  activeTab === 'ai' 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {activeTab === 'ai' ? '生成并发布' : '确认发布'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;
