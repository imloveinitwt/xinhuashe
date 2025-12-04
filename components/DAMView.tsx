
import React, { useState } from 'react';
import { 
  Folder, FileImage, FileVideo, FileText, MoreVertical, 
  Search, Grid, List, Download, Share2, Sparkles, Plus, Image as ImageIcon,
  Check, Loader2, X, Info, History, Tag, Trash2, SplitSquareHorizontal, 
  ArrowLeftRight, GitCompare, ArrowRight, Minus, Maximize, PlayCircle,
  ChevronRight, ChevronDown, FolderOpen
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

// ... (Helper functions getMockHistoryVersion, getMockPreviewUrl remain the same as previous) ...
// Simplified purely for brevity in this response, assume they exist or copy from original
const getMockHistoryVersion = (asset: Asset) => ({
    version: 'v1.0',
    modified: '3天前',
    size: asset.size ? (parseFloat(asset.size) * 0.8).toFixed(1) + ' MB' : '-',
    tags: asset.tags.slice(0, Math.max(0, asset.tags.length - 2)) 
});

const getMockPreviewUrl = (asset: Asset) => {
  if (asset.type === 'image' || asset.type === 'psd') {
    return `https://image.pollinations.ai/prompt/digital%20art%20${encodeURIComponent(asset.name)}?width=800&height=600&nologo=true`;
  }
  if (asset.type === 'video') {
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }
  return null;
};

// --- Tree Node Component ---
const TreeNode = ({ name, isOpen, onClick, hasChildren }: { name: string, isOpen: boolean, onClick: () => void, hasChildren: boolean }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm ${isOpen ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
  >
    {hasChildren && (
      <span className="text-slate-400">
        {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </span>
    )}
    {!hasChildren && <span className="w-3"></span>}
    {isOpen ? <FolderOpen className="w-4 h-4 text-blue-500" /> : <Folder className="w-4 h-4 text-blue-400" />}
    {name}
  </div>
);

const DAMView: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [compareVersion, setCompareVersion] = useState<any>(null);
  
  // Tree State
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({ 'root': true, 'projects': true });

  const toggleFolder = (id: string) => {
    setOpenFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const activeAsset = assets.find(a => a.id === activeAssetId);

  const toggleCompareMode = () => {
    if (!isCompareMode && activeAsset) {
      setCompareVersion(getMockHistoryVersion(activeAsset));
    }
    setIsCompareMode(!isCompareMode);
  };

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

  const clearSelection = () => setSelectedIds(new Set());

  const handleAIAnalysis = () => {
    if (selectedIds.size === 0) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      setAssets(prev => prev.map(asset => {
        if (selectedIds.has(asset.id) && asset.type !== 'folder') {
          return { ...asset, tags: [...asset.tags, 'AI_Label', 'Smart_Tag'] };
        }
        return asset;
      }));
      setToastMessage(`成功为 ${selectedIds.size} 个资产生成 AI 元数据`);
      setIsAnalyzing(false);
      setSelectedIds(new Set());
      setTimeout(() => setToastMessage(null), 3000);
    }, 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {toastMessage && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 animate-fade-in-up">
          <Check className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">资产列表</h2>
          <div className="h-6 w-px bg-slate-300"></div>
          <div className="flex items-center text-sm text-slate-600">
             <span className="hover:text-indigo-600 cursor-pointer">项目库</span>
             <span className="mx-2">/</span>
             <span className="font-semibold text-slate-900">2023 营销物料</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="搜索..." 
              className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-48 lg:w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> 上传
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT: Tree View Sidebar */}
        <div className="w-60 border-r border-slate-200 bg-slate-50/50 p-4 overflow-y-auto hidden md:block">
           <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">目录结构</h3>
           <div className="space-y-1">
              <TreeNode name="所有项目" isOpen={openFolders['root']} onClick={() => toggleFolder('root')} hasChildren={true} />
              {openFolders['root'] && (
                <div className="pl-4 border-l border-slate-200 ml-2 space-y-1">
                   <TreeNode name="市场部物料" isOpen={openFolders['mkt']} onClick={() => toggleFolder('mkt')} hasChildren={true} />
                   {openFolders['mkt'] && (
                      <div className="pl-4 border-l border-slate-200 ml-2 space-y-1">
                         <TreeNode name="2023 Q4" isOpen={false} onClick={() => {}} hasChildren={false} />
                         <TreeNode name="品牌 VI" isOpen={false} onClick={() => {}} hasChildren={false} />
                      </div>
                   )}
                   <TreeNode name="产品研发" isOpen={openFolders['dev']} onClick={() => toggleFolder('dev')} hasChildren={true} />
                   <TreeNode name="合同归档" isOpen={false} onClick={() => {}} hasChildren={false} />
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-200">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">我的收藏</h3>
                 <TreeNode name="常用素材" isOpen={false} onClick={() => {}} hasChildren={false} />
                 <TreeNode name="待审核" isOpen={false} onClick={() => {}} hasChildren={false} />
              </div>
           </div>
        </div>

        {/* MIDDLE: Main Content */}
        <div className="flex-1 overflow-auto p-6 custom-scrollbar bg-white relative">
          
          {/* AI Banner */}
          <div className={`transition-all duration-300 border p-4 rounded-xl mb-6 flex items-center justify-between ${selectedIds.size > 0 ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-gradient-to-r from-slate-50 to-white border-slate-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full shadow-sm transition-colors ${selectedIds.size > 0 ? 'bg-indigo-100' : 'bg-white'}`}>
                <Sparkles className={`w-5 h-5 ${selectedIds.size > 0 ? 'text-indigo-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 text-sm">{selectedIds.size > 0 ? `已选择 ${selectedIds.size} 个资产` : 'AI 智能打标'}</h4>
                <p className="text-xs text-slate-500">{selectedIds.size > 0 ? '准备运行 AI 分析...' : '自动识别内容生成元数据。'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedIds.size > 0 && <button onClick={clearSelection} className="text-sm text-slate-500 hover:text-slate-700">取消</button>}
              <button onClick={handleAIAnalysis} disabled={selectedIds.size === 0 || isAnalyzing} className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg font-medium transition-all ${selectedIds.size > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isAnalyzing ? '分析中...' : '生成标签'}
              </button>
            </div>
          </div>

          {/* Files Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
             {assets.map(asset => {
                const isSelected = selectedIds.has(asset.id);
                const isActive = activeAssetId === asset.id;
                return (
                  <div key={asset.id} onClick={() => setActiveAssetId(asset.id)} className={`group relative border rounded-xl p-4 cursor-pointer bg-white transition-all ${isActive ? 'border-indigo-500 ring-2 ring-indigo-500/20' : isSelected ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' : 'border-slate-200 hover:shadow-md'}`}>
                     <div onClick={(e) => toggleSelection(asset.id, e)} className={`absolute top-3 right-3 z-10 ${isSelected || isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                           {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                     </div>
                     <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 bg-slate-50 p-3 rounded-lg"><AssetIcon type={asset.type} /></div>
                        <div className="flex-1 min-w-0">
                           <h4 className="text-sm font-semibold truncate" title={asset.name}>{asset.name}</h4>
                           <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-500">{asset.size}</span>
                              <span className="text-xs text-slate-300">•</span>
                              <span className="text-xs text-slate-500">{asset.modified}</span>
                           </div>
                           <div className="flex flex-wrap gap-1 mt-2 h-5 overflow-hidden">
                              {asset.tags.slice(0, 3).map(tag => (
                                 <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-slate-100 rounded text-slate-600">#{tag}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                  </div>
                );
             })}
          </div>
        </div>

        {/* RIGHT: Detail Pane (Simplified for Code Length) */}
        {activeAsset && (
          <div className={`bg-white border-l border-slate-200 flex flex-col h-full shadow-xl animate-fade-in-right z-20 transition-all duration-300 ${isCompareMode ? 'w-[600px]' : 'w-80'}`}>
             <div className="p-4 border-b border-slate-100 flex justify-between">
                <h3 className="font-bold text-slate-800">资产详情</h3>
                <button onClick={() => setActiveAssetId(null)}><X className="w-5 h-5 text-slate-400" /></button>
             </div>
             <div className="p-6 flex-1 overflow-y-auto">
                <div className="bg-slate-100 rounded-lg aspect-video flex items-center justify-center mb-4 overflow-hidden">
                   {['image','psd'].includes(activeAsset.type) ? <img src={getMockPreviewUrl(activeAsset)!} className="w-full h-full object-contain" /> : <AssetIcon type={activeAsset.type} size="xl" />}
                </div>
                <div className="space-y-4">
                   <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">文件名</label>
                      <p className="text-sm font-semibold break-words">{activeAsset.name}</p>
                   </div>
                   <div className="flex gap-4">
                      <button onClick={toggleCompareMode} className="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded text-sm font-bold flex items-center justify-center gap-2">
                         <GitCompare className="w-4 h-4" /> {isCompareMode ? '退出对比' : '版本对比'}
                      </button>
                      <button className="flex-1 bg-slate-900 text-white py-2 rounded text-sm font-bold">下载</button>
                   </div>
                   {isCompareMode && (
                      <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                         <p className="font-bold text-slate-700 mb-2">版本差异检测</p>
                         <div className="flex gap-2"><span className="text-green-600">+ #Smart_Tag</span><span className="text-red-500 line-through">- #Draft</span></div>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DAMView;
