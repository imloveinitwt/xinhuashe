
import React, { useState } from 'react';
import { 
  Folder, FileImage, FileVideo, FileText, MoreVertical, 
  Search, Grid, List, Download, Share2, Sparkles, Plus, Image as ImageIcon,
  Check, Loader2, X
} from 'lucide-react';
import { MOCK_ASSETS } from '../constants';
import { Asset } from '../types';

const AssetIcon = ({ type }: { type: Asset['type'] }) => {
  switch (type) {
    case 'folder': return <Folder className="w-10 h-10 text-blue-400 fill-current" />;
    case 'image': return <FileImage className="w-10 h-10 text-purple-500" />;
    case 'video': return <FileVideo className="w-10 h-10 text-pink-500" />;
    case 'psd': return <ImageIcon className="w-10 h-10 text-blue-700" />; // Fallback representation
    default: return <FileText className="w-10 h-10 text-slate-400" />;
  }
};

const DAMView: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleSelection = (id: string) => {
    if (isAnalyzing) return;
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleAIAnalysis = () => {
    if (selectedIds.size === 0) return;

    setIsAnalyzing(true);
    
    // Simulate AI Processing Delay
    setTimeout(() => {
      setAssets(prevAssets => prevAssets.map(asset => {
        if (selectedIds.has(asset.id) && asset.type !== 'folder') {
          // Generate mock AI tags based on type
          const newTags = [...asset.tags];
          const aiTags = ['AI_Label', 'Smart_Tag'];
          
          if (asset.type === 'image') aiTags.push('Visual_Content', 'High_Res', 'Color_Pop');
          if (asset.type === 'video') aiTags.push('Scene_Detect', 'Motion', '4K');
          if (asset.type === 'psd') aiTags.push('Layered', 'Editable', 'Design');

          // Add only unique tags
          aiTags.forEach(tag => {
            if (!newTags.includes(tag)) newTags.push(tag);
          });
          
          return { ...asset, tags: newTags };
        }
        return asset;
      }));

      setToastMessage(`成功为 ${selectedIds.size} 个资产生成 AI 元数据`);
      setIsAnalyzing(false);
      setSelectedIds(new Set());

      // Hide toast after 3 seconds
      setTimeout(() => setToastMessage(null), 3000);
    }, 2500);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* DAM Header / Toolbar */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">资产列表</h2>
          <div className="h-6 w-px bg-slate-300"></div>
          
          {/* Breadcrumb Mockup */}
          <div className="flex items-center text-sm text-slate-600">
             <span className="hover:text-indigo-600 cursor-pointer">空间</span>
             <span className="mx-2">/</span>
             <span className="font-semibold text-slate-900">项目 Alpha</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="搜索资产..." 
              className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
            />
          </div>
          <div className="flex bg-white border border-slate-300 rounded-lg p-1">
            <button className="p-1.5 bg-slate-100 rounded text-slate-700"><Grid className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-50 rounded text-slate-500"><List className="w-4 h-4" /></button>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            上传
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto p-6 custom-scrollbar bg-white">
        
        {/* AI Action Banner */}
        <div className={`transition-all duration-300 border p-4 rounded-xl mb-6 flex items-center justify-between ${
          selectedIds.size > 0 
            ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
            : 'bg-gradient-to-r from-slate-50 to-white border-slate-100'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full shadow-sm transition-colors ${selectedIds.size > 0 ? 'bg-indigo-100' : 'bg-white'}`}>
               <Sparkles className={`w-5 h-5 ${selectedIds.size > 0 ? 'text-indigo-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 text-sm">
                {selectedIds.size > 0 ? `已选择 ${selectedIds.size} 个资产` : 'Gemini AI 智能打标'}
              </h4>
              <p className="text-xs text-slate-500">
                {selectedIds.size > 0 ? '准备运行 AI 分析以生成智能标签...' : '自动分类图片并生成元数据，提升检索效率。'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.size > 0 && (
              <button 
                onClick={clearSelection}
                className="text-sm text-slate-500 hover:text-slate-700 font-medium px-3 py-1.5"
              >
                取消
              </button>
            )}
            <button 
              onClick={handleAIAnalysis}
              disabled={selectedIds.size === 0 || isAnalyzing}
              className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all ${
                selectedIds.size > 0 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {selectedIds.size > 0 ? '生成标签' : '请选择资产'}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section: Folders */}
        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">文件夹</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {assets.filter(a => a.type === 'folder').map(asset => (
              <div key={asset.id} className="group p-4 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-indigo-100 cursor-pointer transition-all">
                <div className="flex justify-between items-start mb-2">
                  <Folder className="w-10 h-10 text-blue-400 fill-current" />
                  <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white rounded-full"><MoreVertical className="w-4 h-4 text-slate-400" /></button>
                </div>
                <p className="font-medium text-slate-700 text-sm truncate">{asset.name}</p>
                <p className="text-xs text-slate-400 mt-1">{asset.modified}</p>
              </div>
            ))}
             <div className="border border-dashed border-slate-300 rounded-xl flex items-center justify-center p-4 hover:bg-slate-50 cursor-pointer text-slate-400 hover:text-indigo-500">
               <Plus className="w-6 h-6" />
             </div>
          </div>
        </div>

        {/* Section: Files */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">文件</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {assets.filter(a => a.type !== 'folder').map(asset => {
              const isSelected = selectedIds.has(asset.id);
              const isItemAnalyzing = isAnalyzing && isSelected;

              return (
                <div 
                  key={asset.id} 
                  onClick={() => toggleSelection(asset.id)}
                  className={`group relative border rounded-xl p-4 transition-all cursor-pointer bg-white ${
                    isSelected 
                      ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' 
                      : 'border-slate-200 hover:shadow-md hover:border-indigo-200'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className={`absolute top-3 right-3 z-10 transition-all ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-600' 
                        : 'bg-white border-slate-300 hover:border-indigo-400'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>

                  {/* Analyzing Overlay */}
                  {isItemAnalyzing && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-20 flex flex-col items-center justify-center rounded-xl">
                      <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
                      <span className="text-xs font-semibold text-indigo-700">AI 分析中...</span>
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-slate-50 p-3 rounded-lg">
                      <AssetIcon type={asset.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`} title={asset.name}>
                        {asset.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">{asset.size}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-xs text-slate-500">{asset.version}</span>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-2 min-h-[1.5rem]">
                        {asset.tags.map(tag => {
                          const isAiTag = ['AI_Label', 'Smart_Tag', 'Visual_Content', 'Scene_Detect', 'High_Res', 'Color_Pop', 'Motion', '4K', 'Layered', 'Editable', 'Design'].includes(tag);
                          return (
                            <span 
                              key={tag} 
                              className={`px-1.5 py-0.5 text-[10px] rounded-sm transition-colors flex items-center gap-0.5 ${
                                isAiTag
                                  ? 'bg-indigo-100 text-indigo-700 font-medium' // Highlight AI tags
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {isAiTag && <Sparkles className="w-2 h-2" />}
                              #{tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Hover Actions (Only show if not selecting/analyzing to avoid clutter) */}
                  {!isSelected && !isAnalyzing && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg backdrop-blur-sm z-10">
                       <button 
                         className="p-1.5 hover:bg-slate-100 rounded text-slate-600" 
                         title="下载"
                         onClick={(e) => e.stopPropagation()}
                       >
                         <Download className="w-4 h-4" />
                       </button>
                       <button 
                         className="p-1.5 hover:bg-slate-100 rounded text-slate-600" 
                         title="分享"
                         onClick={(e) => e.stopPropagation()}
                       >
                         <Share2 className="w-4 h-4" />
                       </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DAMView;
