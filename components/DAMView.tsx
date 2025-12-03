
import React, { useState } from 'react';
import { 
  Folder, FileImage, FileVideo, FileText, MoreVertical, 
  Search, Grid, List, Download, Share2, Sparkles, Plus, Image as ImageIcon,
  Check, Loader2, X, Info, History, Tag, Trash2, SplitSquareHorizontal, ArrowLeftRight
} from 'lucide-react';
import { MOCK_ASSETS } from '../constants';
import { Asset } from '../types';

const AssetIcon = ({ type, size = 'md' }: { type: Asset['type'], size?: 'sm'|'md'|'lg'|'xl' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-32 h-32'
  };
  const s = sizeClasses[size];

  switch (type) {
    case 'folder': return <Folder className={`${s} text-blue-400 fill-current`} />;
    case 'image': return <FileImage className={`${s} text-purple-500`} />;
    case 'video': return <FileVideo className={`${s} text-pink-500`} />;
    case 'psd': return <ImageIcon className={`${s} text-blue-700`} />;
    default: return <FileText className={`${s} text-slate-400`} />;
  }
};

const DAMView: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);
  
  // New State for Version Comparison
  const [isCompareMode, setIsCompareMode] = useState(false);

  const activeAsset = assets.find(a => a.id === activeAssetId);

  const toggleSelection = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6 custom-scrollbar bg-white relative">
          
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
                const isActive = activeAssetId === asset.id;

                return (
                  <div 
                    key={asset.id} 
                    onClick={() => setActiveAssetId(asset.id)}
                    className={`group relative border rounded-xl p-4 transition-all cursor-pointer bg-white ${
                      isActive 
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                        : isSelected 
                          ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' 
                          : 'border-slate-200 hover:shadow-md hover:border-indigo-200'
                    }`}
                  >
                    {/* Selection Checkbox */}
                    <div 
                      onClick={(e) => toggleSelection(asset.id, e)}
                      className={`absolute top-3 right-3 z-10 transition-all ${
                        isSelected || isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
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
                        <h4 className={`text-sm font-semibold truncate transition-colors ${isSelected || isActive ? 'text-indigo-700' : 'text-slate-800'}`} title={asset.name}>
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

                    {/* Hover Actions */}
                    {!isSelected && !isAnalyzing && (
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg backdrop-blur-sm z-10">
                        <button 
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-600" 
                          title="查看详情"
                          onClick={(e) => { e.stopPropagation(); setActiveAssetId(asset.id); }}
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-600" 
                          title="下载"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Asset Detail Pane (Right Sidebar) */}
        {activeAsset && (
          <div className="w-96 bg-white border-l border-slate-200 flex flex-col h-full shadow-xl animate-fade-in-right z-20">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">资产详情</h3>
              <div className="flex gap-1">
                 <button 
                  onClick={() => setIsCompareMode(!isCompareMode)}
                  className={`p-1.5 rounded transition-colors ${isCompareMode ? 'bg-indigo-100 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                  title="版本对比模式"
                >
                  <SplitSquareHorizontal className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setActiveAssetId(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Preview with Compare Mode */}
              <div className="relative">
                 {isCompareMode ? (
                   <div className="grid grid-cols-2 gap-2 border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 flex flex-col items-center justify-center p-4 border-r border-slate-200">
                        <AssetIcon type={activeAsset.type} size="md" />
                        <span className="text-xs font-bold text-slate-500 mt-2">v1.0 (Old)</span>
                      </div>
                      <div className="bg-indigo-50 flex flex-col items-center justify-center p-4">
                        <AssetIcon type={activeAsset.type} size="md" />
                         <span className="text-xs font-bold text-indigo-600 mt-2">{activeAsset.version} (New)</span>
                      </div>
                      <div className="col-span-2 bg-slate-50 p-2 text-center text-xs text-slate-500 border-t border-slate-200">
                        <ArrowLeftRight className="w-3 h-3 inline mr-1" />
                        差异比对模式开启
                      </div>
                   </div>
                 ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                      <AssetIcon type={activeAsset.type} size="xl" />
                      <p className="mt-4 text-sm font-medium text-slate-600">{activeAsset.type.toUpperCase()}</p>
                    </div>
                 )}
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                 <div>
                   <label className="text-xs font-bold text-slate-400 uppercase">文件名</label>
                   <p className="text-sm font-semibold text-slate-800 break-words">{activeAsset.name}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">大小</label>
                      <p className="text-sm text-slate-800">{activeAsset.size || '-'}</p>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">修改时间</label>
                      <p className="text-sm text-slate-800">{activeAsset.modified}</p>
                    </div>
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-400 uppercase">当前版本</label>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">{activeAsset.version}</span>
                       <span className="text-xs text-green-600 flex items-center gap-1"><Check className="w-3 h-3" /> 最新</span>
                    </div>
                 </div>
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                   <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                     <Tag className="w-3 h-3" /> 标签
                   </label>
                   <button className="text-xs text-indigo-600 hover:underline">编辑</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeAsset.tags.length > 0 ? activeAsset.tags.map(tag => (
                    <span key={tag} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs">#{tag}</span>
                  )) : (
                    <span className="text-xs text-slate-400 italic">无标签</span>
                  )}
                  <button className="text-xs text-slate-400 border border-dashed border-slate-300 px-2 py-1 rounded hover:border-indigo-400 hover:text-indigo-600">
                    + 添加
                  </button>
                </div>
              </div>

              {/* Version History (Mock) */}
              <div className="pt-4 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-3">
                  <History className="w-3 h-3" /> 版本记录
                </label>
                <div className="space-y-3 relative before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-px before:bg-slate-200">
                   <div className="relative pl-5">
                      <div className="absolute left-0 top-1.5 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white"></div>
                      <p className="text-xs font-bold text-slate-800">{activeAsset.version} (Current)</p>
                      <p className="text-[10px] text-slate-500">Modified by ArtMaster • {activeAsset.modified}</p>
                   </div>
                   {activeAsset.version !== 'v1.0' && (
                     <div className="relative pl-5 opacity-60 hover:opacity-100 transition-opacity">
                        <div className="absolute left-0 top-1.5 w-3 h-3 bg-slate-300 rounded-full border-2 border-white"></div>
                        <p className="text-xs font-bold text-slate-800">v1.0</p>
                        <p className="text-[10px] text-slate-500">Original Upload • 3 days ago</p>
                     </div>
                   )}
                </div>
              </div>

            </div>

            {/* Actions Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
               <button className="flex-1 bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                 <Download className="w-4 h-4" /> 下载
               </button>
               <button className="p-2 border border-slate-200 rounded-lg hover:bg-white text-slate-600 transition-colors">
                 <Share2 className="w-5 h-5" />
               </button>
               <button className="p-2 border border-slate-200 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors">
                 <Trash2 className="w-5 h-5" />
               </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DAMView;
