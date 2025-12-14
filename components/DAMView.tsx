
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Folder, FileImage, FileVideo, FileText, MoreVertical, 
  Search, Grid, List, Download, Share2, Sparkles, Plus, Image as ImageIcon,
  Check, Loader2, X, Info, History, Tag, Trash2, SplitSquareHorizontal, 
  ArrowLeftRight, GitCompare, ArrowRight, Minus, Maximize, Edit2, Copy, Move,
  ChevronDown, ChevronRight, AlertTriangle, Home, CornerDownRight, Save, MessageSquare,
  ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react';
import { MOCK_ASSETS } from '../constants';
import { Asset, Annotation, AssetVersion } from '../types';
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
  if (asset.url) return asset.url; // Prefer stored URL
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

// === ASSET DETAIL MODAL ===
interface AssetDetailModalProps {
  asset: Asset;
  onClose: () => void;
  onUpdate: (updatedAsset: Asset) => void;
}

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose, onUpdate }) => {
  const { showToast } = useToast();
  // Local state for annotation mode within the modal
  const [isAnnotationMode, setIsAnnotationMode] = useState(false);
  const [newAnnotationPos, setNewAnnotationPos] = useState<{x: number, y: number} | null>(null);
  const [newAnnotationText, setNewAnnotationText] = useState('');
  
  const previewUrl = getMockPreviewUrl(asset);
  
  // Effect to handle body scroll locking
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnnotationMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setNewAnnotationPos({ x, y });
  };

  const saveAnnotation = () => {
    if (!newAnnotationPos || !newAnnotationText.trim()) return;
    
    const newAnno: Annotation = {
      id: `anno_${Date.now()}`,
      x: newAnnotationPos.x,
      y: newAnnotationPos.y,
      content: newAnnotationText,
      author: 'Me',
      createdAt: new Date().toLocaleString()
    };

    const updatedAnnotations = [...(asset.annotations || []), newAnno];
    onUpdate({ ...asset, annotations: updatedAnnotations });
    
    setNewAnnotationText('');
    setNewAnnotationPos(null);
    showToast('批注已添加', 'success');
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className="relative w-full h-full md:h-[90vh] md:w-[95vw] md:max-w-7xl bg-white md:rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scale-in">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT: Preview Area (Dark Theme) */}
        <div className="flex-1 bg-slate-950 relative flex flex-col min-h-[40vh] md:min-h-0">
           {/* Image Container */}
           <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative group">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
              
              {['image', 'psd'].includes(asset.type) ? (
                 <div className="relative inline-block max-w-full max-h-full">
                    <div 
                      className={`relative cursor-${isAnnotationMode ? 'crosshair' : 'default'}`}
                      onClick={handleImageClick}
                    >
                       <img 
                         src={previewUrl!} 
                         className="max-w-full max-h-[calc(90vh-100px)] object-contain shadow-2xl" 
                         alt={asset.name} 
                       />
                       
                       {/* Existing Annotations */}
                       {asset.annotations?.map((anno, i) => (
                          <div 
                            key={anno.id}
                            className="absolute w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform cursor-pointer group/marker z-10"
                            style={{ left: `${anno.x}%`, top: `${anno.y}%` }}
                          >
                             {i + 1}
                             {/* Tooltip */}
                             <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-white text-slate-800 text-xs p-2 rounded shadow-xl opacity-0 group-hover/marker:opacity-100 pointer-events-none transition-opacity z-20">
                                <div className="font-bold mb-1">{anno.author}</div>
                                {anno.content}
                             </div>
                          </div>
                       ))}

                       {/* Pending Marker */}
                       {newAnnotationPos && (
                          <div 
                            className="absolute w-6 h-6 bg-indigo-500 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 animate-bounce z-20"
                            style={{ left: `${newAnnotationPos.x}%`, top: `${newAnnotationPos.y}%` }}
                          >
                             <Plus className="w-4 h-4" />
                          </div>
                       )}
                    </div>
                 </div>
              ) : (
                 <div className="scale-150 p-10 bg-slate-800/50 rounded-3xl">
                   <AssetIcon type={asset.type} size="xl" />
                 </div>
              )}
           </div>

           {/* Toolbar (Bottom Center) */}
           <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur-md rounded-full border border-white/10 shadow-xl z-30">
              <button className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="缩小">
                 <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-xs text-slate-400 font-mono px-2">100%</span>
              <button className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-colors" title="放大">
                 <ZoomIn className="w-5 h-5" />
              </button>
              <div className="w-px h-4 bg-white/20 mx-1"></div>
              <button 
                onClick={() => { setIsAnnotationMode(!isAnnotationMode); setNewAnnotationPos(null); }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                   isAnnotationMode 
                     ? 'bg-indigo-600 text-white' 
                     : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                 <MessageSquare className="w-4 h-4" /> 
                 {isAnnotationMode ? '退出标注' : '添加批注'}
              </button>
           </div>
        </div>

        {/* RIGHT: Details Pane */}
        <div className="w-full md:w-[400px] lg:w-[450px] bg-white border-l border-slate-200 flex flex-col h-full relative z-20 shadow-xl">
           
           {/* Header Info */}
           <div className="p-6 border-b border-slate-100">
              <div className="flex items-start gap-3 mb-4">
                 <div className="mt-1"><AssetIcon type={asset.type} size="md" /></div>
                 <div>
                    <h2 className="text-xl font-bold text-slate-900 break-words leading-tight mb-1">{asset.name}</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                       <span className="bg-slate-100 px-2 py-0.5 rounded font-mono">{asset.version}</span>
                       <span>•</span>
                       <span>{asset.size}</span>
                       <span>•</span>
                       <span>{asset.modified}</span>
                    </div>
                 </div>
              </div>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                 {asset.tags.length > 0 ? asset.tags.map(t => (
                    <span key={t} className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1">
                       <Tag className="w-3 h-3" /> {t}
                    </span>
                 )) : <span className="text-slate-400 text-xs italic">暂无标签</span>}
              </div>
           </div>

           {/* Scrollable Content */}
           <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
              
              {/* Annotation Input Area (Contextual) */}
              {isAnnotationMode && newAnnotationPos && (
                 <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl animate-fade-in mb-4 shadow-sm">
                    <label className="block text-xs font-bold text-indigo-800 mb-1.5 flex items-center gap-1">
                       <MessageSquare className="w-3.5 h-3.5" /> 添加新批注
                    </label>
                    <textarea 
                       className="w-full text-sm p-3 rounded-lg border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px] bg-white"
                       placeholder="描述需要修改的地方..."
                       value={newAnnotationText}
                       onChange={(e) => setNewAnnotationText(e.target.value)}
                       autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                       <button 
                         onClick={() => setNewAnnotationPos(null)}
                         className="px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded transition-colors"
                       >
                         取消
                       </button>
                       <button 
                         onClick={saveAnnotation}
                         className="px-4 py-1.5 text-xs bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 shadow-sm"
                       >
                         保存
                       </button>
                    </div>
                 </div>
              )}

              <DetailSection title="在线批注" defaultOpen={true}>
                 {asset.annotations && asset.annotations.length > 0 ? (
                    <div className="space-y-3 mt-2">
                       {asset.annotations.map((anno, i) => (
                          <div key={anno.id} className="flex gap-3 text-sm group hover:bg-slate-50 p-2 rounded-lg transition-colors cursor-pointer">
                             <div className="w-6 h-6 flex-shrink-0 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5 border border-red-200">
                                {i + 1}
                             </div>
                             <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                   <span className="font-bold text-slate-700 text-xs">{anno.author}</span>
                                   <span className="text-[10px] text-slate-400">{anno.createdAt}</span>
                                </div>
                                <p className="text-slate-600 leading-relaxed">{anno.content}</p>
                                <div className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button className="text-[10px] text-indigo-600 hover:underline">回复</button>
                                   <button className="text-[10px] text-green-600 hover:underline">标记解决</button>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                       暂无批注，点击图片即可添加
                    </div>
                 )}
              </DetailSection>

              <DetailSection title="版本历史" defaultOpen={true}>
                 <div className="space-y-4 mt-2 relative border-l-2 border-slate-100 ml-2 pl-6 pb-2">
                    {/* Current Version */}
                    <div className="relative">
                       <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white ring-2 ring-indigo-100"></div>
                       <div className="flex justify-between items-start p-2 rounded-lg bg-indigo-50/50 border border-indigo-50">
                          <div>
                             <div className="text-xs font-bold text-indigo-900 flex items-center gap-2">
                                {asset.version} <span className="px-1.5 py-0.5 bg-indigo-200 text-indigo-700 rounded text-[10px]">当前</span>
                             </div>
                             <div className="text-[10px] text-indigo-400 mt-0.5">刚刚 • By Admin</div>
                          </div>
                          <button className="text-[10px] text-indigo-600 font-medium hover:underline flex items-center gap-1">
                             <Download className="w-3 h-3" /> 下载
                          </button>
                       </div>
                    </div>
                    
                    {/* Historical Versions */}
                    {asset.versions?.map(v => (
                       <div key={v.id} className="relative group">
                          <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-slate-300 border-2 border-white group-hover:bg-slate-400 transition-colors"></div>
                          <div className="flex justify-between items-start p-2 rounded-lg hover:bg-slate-50 transition-colors">
                             <div>
                                <div className="text-xs font-bold text-slate-600">{v.version}</div>
                                <div className="text-[10px] text-slate-400 mt-0.5">{v.createdAt} • By {v.author}</div>
                                {v.changeLog && <div className="text-[10px] text-slate-500 mt-1 bg-slate-100 p-1 rounded px-2 inline-block border border-slate-200">{v.changeLog}</div>}
                             </div>
                             <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-[10px] text-slate-500 hover:text-indigo-600" title="回滚"><RotateCcw className="w-3 h-3"/></button>
                                <button className="text-[10px] text-slate-500 hover:text-indigo-600" title="下载"><Download className="w-3 h-3"/></button>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </DetailSection>

              <DetailSection title="基本属性" defaultOpen={false}>
                 <div className="space-y-2 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                       <span className="text-slate-400 text-xs">分辨率</span>
                       <span className="text-slate-700 text-xs font-mono">1920 x 1080</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-400 text-xs">色彩模式</span>
                       <span className="text-slate-700 text-xs">RGB</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-400 text-xs">所有者</span>
                       <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[8px]">A</div>
                          <span className="text-slate-700 text-xs">Admin</span>
                       </div>
                    </div>
                 </div>
              </DetailSection>
           </div>

           {/* Footer Actions */}
           <div className="p-4 border-t border-slate-200 bg-white flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <button className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center justify-center gap-2">
                 <Download className="w-4 h-4" /> 下载文件
              </button>
              <button className="p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-colors" title="分享">
                 <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-red-600 transition-colors" title="删除">
                 <Trash2 className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const DAMView: React.FC = () => {
  const { showToast } = useToast();
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);
  
  // Folder Navigation State
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{id: string | null, name: string}[]>([{id: null, name: 'Root'}]);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{x: number, y: number, assetId: string} | null>(null);
  
  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);

  const activeAsset = assets.find(a => a.id === activeAssetId);

  // Derive visible assets based on current folder
  const visibleAssets = assets.filter(a => {
    // If currentFolderId is null, show items with parentId null or undefined
    if (currentFolderId === null) return !a.parentId;
    return a.parentId === currentFolderId;
  });

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

  const handleFolderClick = (folder: Asset) => {
    setCurrentFolderId(folder.id);
    setFolderPath([...folderPath, { id: folder.id, name: folder.name }]);
    setSelectedIds(new Set()); // Clear selection on navigate
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = folderPath.slice(0, index + 1);
    setFolderPath(newPath);
    setCurrentFolderId(newPath[newPath.length - 1].id);
    setSelectedIds(new Set());
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
        if (asset?.type === 'folder') {
          handleFolderClick(asset);
        } else {
          setActiveAssetId(contextMenu.assetId);
        }
        break;
      case 'rename':
        showToast('重命名功能尚未实装', 'info');
        break;
      case 'delete':
        setAssets(prev => prev.filter(a => a.id !== contextMenu.assetId));
        showToast('资产已删除', 'success');
        break;
      case 'download':
        if (asset?.type === 'folder') showToast('不支持下载文件夹', 'warning');
        else showToast(`开始下载 ${asset?.name}`, 'success');
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
      showToast(`正在上传 ${files.length} 个文件到当前文件夹...`, 'info');
      // Simulate upload
      setTimeout(() => {
        const newAssets = files.map((file: any, i) => ({
          id: `new_${Date.now()}_${i}`,
          parentId: currentFolderId, // Upload to current folder
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

  // Callback to update asset from modal
  const handleAssetUpdate = (updatedAsset: Asset) => {
    setAssets(prev => prev.map(a => a.id === updatedAsset.id ? updatedAsset : a));
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
      
      {/* Modal Integration */}
      {activeAsset && (
        <AssetDetailModal 
          asset={activeAsset} 
          onClose={() => setActiveAssetId(null)} 
          onUpdate={handleAssetUpdate}
        />
      )}

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

      {/* Toolbar & Breadcrumbs */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
             {folderPath.map((folder, index) => (
                <React.Fragment key={index}>
                   <div 
                     onClick={() => handleBreadcrumbClick(index)}
                     className={`flex items-center gap-1 cursor-pointer hover:text-indigo-600 transition-colors ${index === folderPath.length - 1 ? 'font-bold text-slate-900' : ''}`}
                   >
                      {index === 0 && <Home className="w-3.5 h-3.5" />}
                      {folder.name}
                   </div>
                   {index < folderPath.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </React.Fragment>
             ))}
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
            {visibleAssets.map(asset => {
              const isSelected = selectedIds.has(asset.id);
              const isActive = activeAssetId === asset.id;

              return (
                <div 
                  key={asset.id} 
                  onClick={() => {
                    if (asset.type === 'folder') handleFolderClick(asset);
                    else setActiveAssetId(asset.id);
                  }}
                  onContextMenu={(e) => handleContextMenu(e, asset.id)}
                  className={`group relative border rounded-xl p-4 transition-all cursor-pointer bg-white flex flex-col ${
                    isActive 
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20' 
                      : isSelected 
                        ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50/10' 
                        : 'border-slate-200 hover:shadow-md hover:border-indigo-200'
                  }`}
                >
                  {/* Selection Checkbox - Only for files for now */}
                  {asset.type !== 'folder' && (
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
                  )}

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

                  <div className="flex-1 flex flex-col items-center justify-center py-4 relative">
                    <AssetIcon type={asset.type} size="lg" />
                    {asset.type !== 'folder' && asset.annotations && asset.annotations.length > 0 && (
                       <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                          {asset.annotations.length}
                       </div>
                    )}
                  </div>
                  
                  <div className="mt-2 text-center">
                    <h4 className="text-sm font-semibold truncate w-full px-2">{asset.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{asset.size || (asset.type === 'folder' ? 'Folder' : '')} • {asset.modified}</p>
                  </div>
                </div>
              );
            })}
            
            {/* Drop Zone Placeholder */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 hover:bg-slate-50 cursor-pointer text-slate-400 hover:text-indigo-500 transition-colors min-h-[160px]">
              <Plus className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">拖拽文件上传</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DAMView;
