
import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Heart, Eye, Share2, Download, MessageSquare, 
  BadgeCheck, Calendar, Maximize2, Palette, Layers, Monitor, AlertCircle,
  Send, ThumbsUp, CornerDownRight, MoreHorizontal, Briefcase, ChevronRight
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

// --- Mock Data for Dynamic Comments ---
const MOCK_COMMENT_USERS_RAW = [
  'Alex Chen', 'Sarah Wu', 'Mike Ross', 'DesignPro', 'ArtLover99', 'PixelGod', 
  'CreativeSoul', 'NeonVibe', 'CyberPunk_X', 'WatercolorFan', '3D_Master', 
  'SketchBook', 'ColorPalette', 'VisualArtist', 'GameDev_User',
  '追风少年', '墨染流年', '绘梦师', '快乐小狗', '橘子汽水', '云边小卖部', '星河滚烫', '一只特立独行的猪'
];

const MOCK_COMMENT_USERS = MOCK_COMMENT_USERS_RAW.map(name => ({
  name,
  avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(name)}&backgroundColor=e5e7eb,b6e3f4,c0aede,d1d4f9,ffd5dc`
}));

const MOCK_COMMENTS_TEXT = [
  "光影处理得太棒了！非常有氛围感。",
  "构图精妙，色彩搭配也很舒服，学习了！",
  "大神受我一拜，这个细节简直无敌。",
  "请问是用什么笔刷画的？质感很独特。",
  "太强了，这种风格我一直想尝试但画不好。",
  "第一眼就被吸引了，果断收藏！",
  "背景的虚化处理让主体非常突出，很有电影感。",
  "这也太好看了吧，期待大大的新作品！",
  "颜色用的很大胆，但是意外的和谐。",
  "细节狂魔啊，放大看简直惊呆了。",
  "这张图的故事感很强，让人浮想联翩。",
  "虽然是赛博朋克风，但有一丝温暖的感觉，很喜欢。",
  "这个角色的眼神很有戏，抓住了灵魂。",
  "从技术角度看，透视和解剖都非常完美。",
  "能出个教程吗？很想学这个上色方法。",
  "看着这张图，感觉心情都变好了。",
  "非常有创意的设计，打破了常规认知。",
  "这一笔下去，我可能要练十年。",
  "不仅画技高超，审美也一直在线。",
  "什么时候开放约稿？想约一张类似的。",
  "绝绝子！太美了！",
  "卧槽，牛逼！（破音）"
];

interface Comment {
  id: string;
  user: { name: string; avatar: string };
  content: string;
  time: string;
  likes: number;
  isLiked: boolean;
}

const generateComments = (count: number): Comment[] => {
  return Array.from({ length: count }).map((_, i) => {
    const user = MOCK_COMMENT_USERS[Math.floor(Math.random() * MOCK_COMMENT_USERS.length)];
    const text = MOCK_COMMENTS_TEXT[Math.floor(Math.random() * MOCK_COMMENTS_TEXT.length)];
    return {
      id: `c_${Date.now()}_${i}`,
      user,
      content: text,
      time: `${Math.floor(Math.random() * 23) + 1}小时前`,
      likes: Math.floor(Math.random() * 100),
      isLiked: false
    };
  });
};

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
  
  // Comment State
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (artworkId) {
      loadArtwork(artworkId);
      // Generate random comments for this session
      setComments(generateComments(Math.floor(Math.random() * 6) + 10)); // 10-15 comments
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
    alert(`已向 ${artwork?.artist} 发送合作意向`);
  };

  const handleProfileClick = () => {
    if (artwork && onNavigateToProfile) {
      onClose();
      onNavigateToProfile(artwork.artist);
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!currentUser && onTriggerLogin) {
      onTriggerLogin();
      return;
    }

    const comment: Comment = {
      id: `new_${Date.now()}`,
      user: {
        name: currentUser?.name || '我',
        avatar: currentUser?.avatar || `https://api.dicebear.com/7.x/notionists/svg?seed=Me`
      },
      content: newComment,
      time: '刚刚',
      likes: 0,
      isLiked: false
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const toggleCommentLike = (commentId: string) => {
    if (!currentUser && onTriggerLogin) {
      onTriggerLogin();
      return;
    }
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          likes: c.isLiked ? c.likes - 1 : c.likes + 1,
          isLiked: !c.isLiked
        };
      }
      return c;
    }));
  };

  if (!artworkId) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 animate-fade-in">
      {/* Darkened Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>
      
      <div 
        className="relative bg-white w-full h-full md:h-[90vh] md:max-w-7xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white">
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">加载作品详情...</p>
          </div>
        ) : error || !artwork ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white">
             <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
             <p className="text-slate-500 mb-4">无法加载作品信息</p>
             <button onClick={() => loadArtwork(artworkId)} className="text-indigo-600 font-bold hover:underline">点击重试</button>
          </div>
        ) : (
          <>
            {/* Left: Immersive Image Viewer */}
            <div className="flex-1 bg-slate-950 relative flex items-center justify-center min-h-[40vh] md:min-h-0 overflow-hidden group">
               {/* Background Texture */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
               
               {/* Main Image */}
               <img 
                 src={artwork.imageUrl} 
                 alt={artwork.title} 
                 className="w-full h-full object-contain max-h-[85vh] relative z-10 transition-transform duration-300"
               />
               
               {/* Hover Controls */}
               <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-lg" title="查看原图">
                    <Maximize2 className="w-5 h-5" />
                  </button>
                  <button className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-lg" title="下载">
                    <Download className="w-5 h-5" />
                  </button>
               </div>
            </div>

            {/* Right: Info Sidebar */}
            <div className="w-full md:w-[420px] lg:w-[480px] bg-white flex flex-col h-full border-l border-slate-100 relative">
              
              {/* Scrollable Area */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                 
                 {/* Artist Header */}
                 <div className="p-6 pb-2">
                    <div className="flex items-center justify-between gap-4 mb-5">
                       <div className="flex items-center gap-3 group cursor-pointer" onClick={handleProfileClick}>
                          <div className="relative">
                             <img src={artwork.artistAvatar} alt={artwork.artist} className="w-12 h-12 rounded-full border border-slate-100 object-cover shadow-sm" />
                             {artwork.isVerified && <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm"><BadgeCheck className="w-4 h-4 text-blue-500 fill-current" /></div>}
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base">{artwork.artist}</h3>
                             <p className="text-xs text-slate-500 mt-0.5">2小时前发布</p>
                          </div>
                       </div>
                       <button className="px-4 py-1.5 text-xs font-bold border border-slate-200 rounded-full text-slate-600 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                          + 关注
                       </button>
                    </div>
                    
                    <h1 className="text-2xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight">{artwork.title}</h1>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                       {artwork.tags.map(tag => (
                         <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200">
                           #{tag}
                         </span>
                       ))}
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-slate-100 bg-slate-50/30 rounded-lg">
                        <div className="text-center border-r border-slate-100">
                            <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1">
                                <Eye className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-700">{artwork.views.toLocaleString()}</span>
                        </div>
                        <div className="text-center border-r border-slate-100">
                            <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1">
                                <Heart className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-700">{artwork.likes.toLocaleString()}</span>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-slate-700 text-xs mt-1.5 block">{artwork.publishDate}</span>
                        </div>
                    </div>

                    {/* Description Box */}
                    <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 leading-relaxed mb-8 border border-slate-100">
                        {artwork.description}
                    </div>

                    {/* Technical Info */}
                    {artwork.tools && (
                      <div className="mb-8">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                             <Monitor className="w-3 h-3" /> 创作环境
                          </h4>
                          <div className="flex gap-2">
                            {artwork.tools.map(tool => (
                              <div key={tool} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-medium text-slate-600">
                                  {tool === 'Blender' ? <Layers className="w-3.5 h-3.5 text-orange-500" /> : 
                                    tool === 'Photoshop' ? <Palette className="w-3.5 h-3.5 text-blue-500" /> : 
                                    <Monitor className="w-3.5 h-3.5 text-slate-400" />}
                                  {tool}
                              </div>
                            ))}
                          </div>
                      </div>
                    )}

                    {/* Comments Header */}
                    <div className="flex items-center justify-between mb-4 mt-2">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2 text-base">
                          <MessageSquare className="w-4 h-4 text-indigo-500" /> 
                          评论 <span className="text-slate-400 font-normal text-sm">({comments.length})</span>
                        </h4>
                        <div className="text-xs text-slate-400 font-medium">按热度排序</div>
                    </div>
                    
                    {/* Comments List */}
                    <div className="space-y-5 pb-6 pr-2">
                       {comments.map((comment) => (
                          <div key={comment.id} className="flex gap-3 group animate-fade-in-up">
                             <img src={comment.user.avatar} className="w-9 h-9 rounded-full bg-slate-100 flex-shrink-0 border border-white shadow-sm" alt={comment.user.name} />
                             <div className="flex-1">
                                <div className="bg-slate-50 p-3.5 rounded-2xl rounded-tl-none border border-slate-100">
                                   <div className="flex items-baseline justify-between mb-1">
                                      <span className="text-xs font-bold text-slate-800">{comment.user.name}</span>
                                      <span className="text-[10px] text-slate-400">{comment.time}</span>
                                   </div>
                                   <p className="text-sm text-slate-600 leading-relaxed">{comment.content}</p>
                                </div>
                                
                                <div className="flex items-center gap-4 mt-1.5 pl-2">
                                   <button 
                                     onClick={() => toggleCommentLike(comment.id)}
                                     className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${comment.isLiked ? 'text-rose-500' : 'text-slate-400 hover:text-slate-600'}`}
                                   >
                                      <ThumbsUp className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-current' : ''}`} /> 
                                      {comment.likes > 0 ? comment.likes : '点赞'}
                                   </button>
                                   <button className="text-[11px] font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1">
                                      <CornerDownRight className="w-3.5 h-3.5" /> 回复
                                   </button>
                                   <button className="ml-auto opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 transition-opacity">
                                      <MoreHorizontal className="w-4 h-4" />
                                   </button>
                                </div>
                             </div>
                          </div>
                       ))}
                       <div ref={commentsEndRef}></div>
                    </div>
                 </div>
              </div>

              {/* Sticky Footer: Actions & Input */}
              <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.05)] z-20">
                 
                 {/* Input Area */}
                 <div className="relative mb-3 group">
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all shadow-inner"
                      placeholder="写下你的评论..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePostComment(e)}
                      disabled={!currentUser}
                    />
                    <button 
                      onClick={handlePostComment}
                      disabled={!newComment.trim()}
                      className={`absolute right-1.5 top-1.5 p-1.5 rounded-full transition-all ${newComment.trim() ? 'bg-indigo-600 text-white shadow-md hover:scale-105' : 'text-slate-300 bg-transparent'}`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex gap-3">
                    <button 
                       onClick={handleLike}
                       className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                          isLiked 
                          ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                       }`}
                    >
                       <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                       {isLiked ? '已喜欢' : '喜欢'}
                    </button>
                    
                    <button 
                       onClick={handleHire}
                       className="flex-[2] bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-slate-200 hover:shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95"
                    >
                       <Briefcase className="w-5 h-5" />
                       约稿 / 合作
                    </button>
                    
                    <button className="p-3 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-colors active:scale-95">
                       <Share2 className="w-5 h-5" />
                    </button>
                 </div>
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
