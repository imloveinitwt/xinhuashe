
import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, FileImage, FileVideo, FileText, MoreVertical, 
  Search, Grid, List, Download, Share2, Sparkles, Plus, Image as ImageIcon,
  Check, Loader2, X, Info, History, Tag, Trash2, SplitSquareHorizontal, 
  ArrowLeftRight, GitCompare, ArrowRight, Minus, Maximize, Edit2, Copy, Move,
  ChevronDown, ChevronRight, AlertTriangle
} from 'lucide-react';
import { MOCK_ASSETS } from '../constants';
import { Asset } from '../types';
import { useToast } from '../contexts/ToastContext';
import { AIService } from '../services/AIService';

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

const getMockPreviewUrl = (asset: Asset) => {
  // Use a reliable placeholder or actual mock URL logic
  if (asset.type === 'image' || asset.type === 'psd') {
    // We add a unique param to ensure image is fetched fresh if needed
    return `https://image.pollinations.ai/prompt/digital%20art%20${encodeURIComponent(asset.name)}?width=800&height=600&nologo=true`;
  }
  if (asset.type === 'video') {
    return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  }
  return null;
};

// Helper to convert image URL to Base64 (needed for Gemini API if we don't have the file object directly)
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data:image/png;base64, prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error("Error converting URL to base64", e);
    throw new Error("无法读取图片数据");
  }
};

const ContextMenu = ({ x, y, onClose, onAction }: { x: number, y: number, onClose: () => void, onAction: (action: string) => void }) => {
  useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  const adjustedStyle = {
    top: y,
    left: x,
    transform: window.innerWidth - x < 200 ? 'translateX(-100%)' : 'none'
  };

  return (
    <div 
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-slate-200 py-1 w-48 animate-scale-in origin-top-left"
      style={adjustedStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={() => onAction('preview')} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-sm text-slate-700">
        <Maximize className="w-4 h-4" /> 预览
      </button>
      <button onClick={() => onAction('rename')} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-sm text-slate-700">
        <Edit2 className="w-4 h-4" /> 重命名
      </button>
      <button onClick={() => onAction('download')} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-sm text-slate-700">
        <Download className="w-4 h-4" /> 下载
      </button>
      <button onClick={() => onAction('share')} className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-sm text-slate-700">
        <Share2 className="w-4 h-4" /> 分享
      </button>
      <div className="h-px bg-slate-100 my-1"></div>
      <button onClick={() => onAction('delete')} className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600">
        <Trash2 className="w-4 h-4" /> 删除
      </button>
    </div>
  );
};

const DetailSection = ({ title, children, defaultOpen = false }: { title: string, children?: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 last:border-0 py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center justify-between w-full text-left mb-2 group"
      >
        <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{title}</span>
        {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" /> : <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />}
      </button>
      {isOpen && (
        <div className="animate-fade-in text-sm text-slate-600">
          {children}
        </div>
      )}
    </div>
  );
};

const DAMView: React.FC = () => {
  const { showToast } = useToast();
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, assetId: string} | null>(null);
  
  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);

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

  const handleAIAnalysis = async () => {
    if (selectedIds.size === 0) return;
    setIsAnalyzing(true);
    
    // Process only selected items that are images
    const targetAssets = assets.filter(a => selectedIds.has(a.id) && (a.type === 'image' || a.type === 'psd'));
    
    if (targetAssets.length === 0) {
      showToast('请选择图片类型资产进行分析', 'warning');
      setIsAnalyzing(false);
      return;
    }

    try {
      let processedCount = 0;
      const updatedAssets = [...assets];

      // Simulate processing sequentially or in parallel depending on load
      for (const asset of targetAssets) {
        const imageUrl = getMockPreviewUrl(asset);
        if (!imageUrl) continue;

        try {
          // Note: In a real browser environment, fetching cross-origin images for canvas/base64 might be blocked by CORS.
          // For this demo, if it fails, the service handles it gracefully or we fallback.
          let tags: string[] = [];
          
          if (AIService.isAvailable()) {
             // Try to get base64
             // For safety in this demo environment, we might catch CORS errors
             try {
                const base64 = await urlToBase64(imageUrl);
                tags = await AIService.generateImageTags(base64);
             } catch (e) {
                console.warn("CORS or Network error fetching image for AI, using fallback tags.");
                // Fallback for demo if CORS blocks fetch
                tags = ['AI分析受限', '赛博朋克', '示例图片']; 
             }
          } else {
             // Mock fallback
             await new Promise(r => setTimeout(r, 800));
             tags = ['AI模拟', '高清', '概念设计', '待审核'];
          }

          // Update asset in local list
          const idx = updatedAssets.findIndex(a => a.id === asset.id);
          if (idx !== -1) {
            updatedAssets[idx] = {
              ...updatedAssets[idx],
              tags: Array.from(new Set([...updatedAssets[idx].tags, ...tags]))
            };
          }
          processedCount++;
        } catch (err) {
          console.error(`Failed to analyze asset ${asset.id}`, err);
        }
      }

      setAssets(updatedAssets);
      showToast(`AI 分析完成，成功更新 ${processedCount} 个资产标签`, 'success');
    } catch (error) {
      showToast('AI 服务暂时不可用', 'error');
    } finally {
      setIsAnalyzing(false);
      setSelectedIds(new Set());
    }
  };

  // Context Menu Handler
  const handleContextMenu = (e: React.MouseEvent, assetId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, assetId });
  };

  const handleContextAction = (action: string) => {
    if (!contextMenu) return;
    const asset = assets.find(a => a.id === contextMenu.assetId);
    
    switch (action) {
      case 'preview':
        setActiveAssetId(contextMenu.assetId);
        break;
      case 'rename':
        showToast('重命名功能尚未实装', 'info');
        break;
      case 'delete':
        setAssets(prev => prev.filter(a => a.id !== contextMenu.assetId));
        showToast('资产已删除', 'success');
        break;
      case 'download':
        showToast(`开始下载 ${asset?.name}`, 'success');
        break;
      case 'share':
        showToast('分享链接已复制到剪贴板', 'success');
        break;
    }
    setContextMenu(null);
  };

  // Drag & Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      showToast(`正在上传 ${files.length} 个文件...`, 'info');
      // Simulate upload
      setTimeout(() => {
        const newAssets = files.map((file: any, i) => ({
          id: `new_${Date.now()}_${i}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 'doc' as any,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          modified: '刚刚',
          version: 'v1.0',
          tags: ['New']
        }));
        setAssets(prev => [...prev, ...newAssets]);
        showToast('上传完成', 'success');
      }, 1500);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)} 
          onAction={handleContextAction} 
        />
      )}

      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 bg-indigo-50/90 backdrop-blur-sm border-2 border-indigo-500 border-dashed m-4 rounded-xl flex flex-col items-center justify-center animate-fade-in pointer-events-none">
          <Plus className="w-16 h-16 text-indigo-500 mb-4 animate-bounce" />
          <h3 className="text-2xl font-bold text-indigo-700">释放鼠标以上传文件</h3>
        </div>
      )}

      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">资产列表</h2>
          <div className="h-6 w-px bg-slate-300"></div>
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
              className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            上传
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area */}
        <div 
          className="flex-1 overflow-auto p-6 custom-scrollbar bg-white relative"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          
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
                  onClick={() => setSelectedIds(new Set())}
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
                {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isAnalyzing ? '分析中...' : (selectedIds.size > 0 ? '生成标签' : '请选择资产')}
              </button>
            </div>
          </div>

          {!AIService.isAvailable() && (
             <div className="mb-4 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-xs flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>提示：未配置 API Key，将使用模拟数据演示 AI 功能。</span>
             </div>
          )}

          {/* Files Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {assets.map(asset => {
              const isSelected = selectedIds.has(asset.id);
              const isActive = activeAssetId === asset.id;

              return (
                <div 
                  key={asset.id} 
                  onClick={() => setActiveAssetId(asset.id)}
                  onContextMenu={(e) => handleContextMenu(e, asset.id)}
                  className={`group relative border rounded-xl p-4 transition-all cursor-pointer bg-white flex flex-col ${
                    isActive 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                      : isSelected 
                        ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' 
                        : 'border-slate-200 hover:shadow-md hover:border-indigo-200'
                  }`}
                >
                  {/* Selection Checkbox - Moved to Left */}
                  <div 
                    onClick={(e) => toggleSelection(asset.id, e)}
                    className={`absolute top-3 left-3 z-10 transition-all ${
                      isSelected || isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300 hover:border-indigo-400'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>

                  {/* Context Menu Button - Added to Right */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setContextMenu({ x: e.clientX, y: e.clientY, assetId: asset.id });
                    }}
                    className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white text-slate-500 opacity-0 group-hover:opacity-100 hover:text-indigo-600 hover:shadow-md transition-all border border-slate-200"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  <div className="flex-1 flex flex-col items-center justify-center py-4">
                    <AssetIcon type={asset.type} size="lg" />
                  </div>
                  
                  <div className="mt-2 text-center">
                    <h4 className="text-sm font-semibold truncate w-full px-2">{asset.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{asset.size} • {asset.modified}</p>
                  </div>
                </div>
              );
            })}
            
            {/* Drop Zone Placeholder */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 hover:bg-slate-50 cursor-pointer text-slate-400 hover:text-indigo-500 transition-colors min-h-[160px]">
              <Plus className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">点击上传</span>
            </div>
          </div>
        </div>

        {/* Sidebar Detail */}
        {activeAsset && (
          <div className="bg-white border-l border-slate-200 flex flex-col h-full shadow-xl z-20 transition-all w-80 lg:w-96 absolute right-0 top-0 bottom-0">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                 <Info className="w-4 h-4 text-indigo-500" /> 资产详情
               </h3>
               <button onClick={() => setActiveAssetId(null)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                 <X className="w-5 h-5 text-slate-400" />
               </button>
            </div>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
               {/* Preview Area */}
               <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-center items-center min-h-[200px]">
                  {['image', 'psd'].includes(activeAsset.type) ? (
                     <img src={getMockPreviewUrl(activeAsset)!} className="rounded-lg shadow-md border border-slate-200 max-h-48 object-contain bg-white" alt="" />
                  ) : (
                     <div className="scale-150">
                       <AssetIcon type={activeAsset.type} size="xl" />
                     </div>
                  )}
               </div>

               {/* Title */}
               <div className="p-6 pb-2">
                  <h2 className="text-lg font-bold text-slate-900 break-words leading-tight">{activeAsset.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                     <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-xs font-mono border border-slate-200 uppercase">{activeAsset.type}</span>
                     <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 text-xs font-mono border border-indigo-100">{activeAsset.version}</span>
                  </div>
               </div>

               {/* Collapsible Sections */}
               <div className="px-6 pb-6">
                  <DetailSection title="基本属性" defaultOpen={true}>
                     <div className="space-y-3 mt-1">
                        <div className="flex justify-between">
                           <span className="text-slate-400 text-xs">文件大小</span>
                           <span className="font-mono text-slate-700">{activeAsset.size}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-slate-400 text-xs">修改时间</span>
                           <span className="text-slate-700">{activeAsset.modified}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-slate-400 text-xs">分辨率</span>
                           <span className="text-slate-700">1920 x 1080 (Mock)</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-slate-400 text-xs">所有者</span>
                           <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded-full bg-indigo-500"></div>
                              <span className="text-slate-700">Admin</span>
                           </div>
                        </div>
                     </div>
                  </DetailSection>

                  <DetailSection title="智能标签" defaultOpen={true}>
                     <div className="flex flex-wrap gap-2 mt-2">
                        {activeAsset.tags.length > 0 ? activeAsset.tags.map(t => (
                           <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1">
                              <Tag className="w-3 h-3" /> {t}
                           </span>
                        )) : <span className="text-slate-400 text-xs italic">暂无标签，点击 AI 分析生成</span>}
                     </div>
                  </DetailSection>

                  <DetailSection title="资产描述">
                     <p className="leading-relaxed text-slate-600 mt-1">
                        {activeAsset.type === 'image' || activeAsset.type === 'psd' 
                          ? '这是一张由 AI 辅助生成的概念设计图，主要用于展示赛博朋克风格的城市夜景。包含霓虹灯光效与未来建筑元素。'
                          : '这是项目的核心文档资料，包含了详细的设计规范与品牌使用指南。请确保使用最新版本。'}
                     </p>
                  </DetailSection>
                  
                  <DetailSection title="版本历史">
                     <div className="space-y-3 mt-1 relative border-l border-slate-200 ml-1.5 pl-4">
                        <div className="relative">
                           <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-600 border-2 border-white"></div>
                           <div className="text-xs font-bold text-slate-800">v2.0 (当前)</div>
                           <div className="text-[10px] text-slate-400">2023-10-27 14:30 • By Admin</div>
                        </div>
                        <div className="relative">
                           <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                           <div className="text-xs font-bold text-slate-500">v1.0</div>
                           <div className="text-[10px] text-slate-400">2023-10-25 09:15 • By Admin</div>
                        </div>
                     </div>
                  </DetailSection>
               </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-white flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
               <button className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> 下载
               </button>
               <button className="p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors" title="分享">
                  <Share2 className="w-5 h-5" />
               </button>
               <button className="p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors" title="删除">
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
