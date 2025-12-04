
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Heart, Eye, Share2, Download, MessageSquare, 
  BadgeCheck, Calendar, Maximize2, Palette, Layers, Monitor, AlertCircle
} from 'lucide-react';
import { Artwork } from '../types';
import { ArtworkService } from '../services/ArtworkService';

interface ArtworkDetailModalProps {
  artworkId: string | null;
  onClose: () => void;
  onNavigateToProfile?: (artist: string) => void;
  onTriggerLogin?: () => void;
  currentUser?: any;
}

const ArtworkDetailModal: React.FC<ArtworkDetailModalProps> = ({ 
  artworkId, 
  onClose, 
  onNavigateToProfile,
  onTriggerLogin,
  currentUser
}) => {
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (artworkId) {
      loadArtwork(artworkId);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [artworkId]);

  const loadArtwork = async (id: string) => {
    setLoading(true);
    setError(false);
    try {
      const data = await ArtworkService.getArtworkById(id);
      if (data) {
        setArtwork(data);
        // Reset like state or fetch from user data
        setIsLiked(false); 
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    if (!currentUser && onTriggerLogin) {
      onTriggerLogin();
      return;
    }
    setIsLiked(!isLiked);
  };

  const handleHire = () => {
    if (!currentUser && onTriggerLogin) {
      onTriggerLogin();
      return;
    }
    // Handle hire logic
    alert(`已向 ${artwork?.artist} 发送合作意向`);
  };

  const handleProfileClick = () => {
    if (artwork && onNavigateToProfile) {
      onClose();
      onNavigateToProfile(artwork.artist); // Simple mapping, real app would use ID
    }
  };

  if (!artworkId) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-sm animate-fade-in p-0 md:p-6" onClick={onClose}>
      
      <div 
        className="bg-white w-full h-full md:h-auto md:max-h-[90vh] md:max-w-6xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button (Mobile & Desktop) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 md:bg-white md:hover:bg-slate-100 text-white md:text-slate-500 rounded-full transition-colors backdrop-blur-md md:backdrop-blur-none"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="w-full h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-400">
               <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
               <span className="text-sm">加载作品详情...</span>
            </div>
          </div>
        ) : error || !artwork ? (
          <div className="w-full h-[60vh] flex items-center justify-center">
             <div className="text-center">
               <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-2" />
               <p className="text-slate-500">无法加载作品信息</p>
               <button onClick={() => loadArtwork(artworkId)} className="mt-4 text-indigo-600 font-medium hover:underline">点击重试</button>
             </div>
          </div>
        ) : (
          <>
            {/* Left: Image Viewer */}
            <div className="flex-1 bg-slate-950 relative flex items-center justify-center min-h-[40vh] md:min-h-0 overflow-hidden group bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
               <img 
                 src={artwork.imageUrl} 
                 alt={artwork.title} 
                 className="w-full h-full object-contain max-h-[85vh]"
               />
               <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg backdrop-blur-sm">
                    <Maximize2 className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Right: Info Panel */}
            <div className="w-full md:w-[420px] bg-white flex flex-col h-auto md:h-full border-l border-slate-100">
              
              {/* Header: Artist Info */}
              <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                 <div className="cursor-pointer" onClick={handleProfileClick}>
                    <img src={artwork.artistAvatar} alt={artwork.artist} className="w-12 h-12 rounded-full border border-slate-200" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <h3 
                      className="font-bold text-slate-900 text-lg truncate hover:text-indigo-600 cursor-pointer transition-colors"
                      onClick={handleProfileClick}
                    >
                      {artwork.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                       <span className="font-medium hover:underline cursor-pointer" onClick={handleProfileClick}>{artwork.artist}</span>
                       {artwork.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                    </div>
                 </div>
                 <button 
                   onClick={handleLike}
                   className={`p-2 rounded-full border transition-all active:scale-95 ${isLiked ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}
                 >
                   <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                 </button>
              </div>

              {/* Content: Scrollable */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                 
                 {/* Description */}
                 <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">作品简介</h4>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {artwork.description}
                    </p>
                 </div>

                 {/* Tags */}
                 <div>
                    <div className="flex flex-wrap gap-2">
                       {artwork.tags.map(tag => (
                         <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer">
                           #{tag}
                         </span>
                       ))}
                    </div>
                 </div>

                 {/* Meta Stats */}
                 <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-slate-50">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                       <Eye className="w-4 h-4 text-slate-400" />
                       <span>{artwork.views.toLocaleString()} 阅读</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                       <Heart className="w-4 h-4 text-slate-400" />
                       <span>{artwork.likes.toLocaleString()} 喜欢</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                       <Calendar className="w-4 h-4 text-slate-400" />
                       <span>{artwork.publishDate}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                       <Monitor className="w-4 h-4 text-slate-400" />
                       <span>{artwork.resolution}</span>
                    </div>
                 </div>

                 {/* Tools */}
                 {artwork.tools && (
                   <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">创作工具</h4>
                      <div className="flex gap-3">
                         {artwork.tools.map(tool => (
                           <div key={tool} className="flex flex-col items-center gap-1 group cursor-pointer">
                              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                 {tool === 'Blender' ? <Layers className="w-5 h-5" /> : 
                                  tool === 'Photoshop' ? <Palette className="w-5 h-5" /> : 
                                  <Monitor className="w-5 h-5" />}
                              </div>
                              <span className="text-[10px] text-slate-500">{tool}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                 )}
                 
                 {/* Comments Preview (Static) */}
                 <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> 评论 (3)
                    </h4>
                    <div className="space-y-4">
                       <div className="flex gap-3">
                          <img src="https://ui-avatars.com/api/?name=User+A" className="w-8 h-8 rounded-full bg-slate-200" alt="" />
                          <div>
                             <div className="text-xs font-bold text-slate-700">Alice Chen</div>
                             <p className="text-xs text-slate-500 mt-0.5">光影处理得太棒了！非常有氛围感。</p>
                          </div>
                       </div>
                    </div>
                    <button className="mt-3 text-xs text-indigo-600 font-medium hover:underline">查看全部评论</button>
                 </div>

              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-100 flex gap-3 bg-white z-10">
                 <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm shadow-indigo-200 active:scale-95" onClick={handleHire}>
                    约稿 / 合作
                 </button>
                 <button className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium rounded-lg transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                 </button>
                 <button className="px-4 py-2.5 border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium rounded-lg transition-colors flex items-center gap-2">
                    <Download className="w-4 h-4" />
                 </button>
              </div>

            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ArtworkDetailModal;
