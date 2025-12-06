
import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, ArrowLeft, Heart, Eye, Zap, 
  Sparkles, TrendingUp, Filter, X, ImageOff, ChevronDown, 
  Compass, Grid, List, LayoutGrid, User as UserIcon, Clock, Calendar,
  MoreHorizontal, Share2, Download, Flame, Hash
} from 'lucide-react';
import { MOCK_ARTWORKS } from '../constants';
import { Artwork, User } from '../types';
import ArtworkDetailModal from './ArtworkDetailModal';
import { ArtworkService } from '../services/ArtworkService';

interface ArtworksPageProps {
  onBack: () => void;
  onNavigateToProfile?: (profileId: string) => void;
  onTriggerLogin?: () => void;
  user?: User | null;
}

// --- 样式组件 ---

interface ModernItemProps {
  artwork: Artwork;
  onClick: (art: Artwork) => void;
  onLike: (id: string, e: React.MouseEvent) => void;
  isLiked: boolean;
  onNavigateToProfile: (artist: string, e: React.MouseEvent) => void;
}

// 1. 列表视图：杂志排版风格 (Editorial List)
const ModernListItem: React.FC<ModernItemProps> = ({ 
  artwork, 
  onClick, 
  onLike, 
  isLiked, 
  onNavigateToProfile 
}) => (
  <div 
    onClick={() => onClick(artwork)}
    className="group relative bg-white rounded-[2rem] p-6 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-1 cursor-pointer border border-slate-100 flex flex-col md:flex-row gap-8 overflow-hidden"
  >
    {/* 装饰背景元素 */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-slate-50 to-transparent rounded-bl-full opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>

    {/* 图片区域 */}
    <div className="w-full md:w-[360px] lg:w-[420px] aspect-[4/3] md:aspect-auto flex-shrink-0 rounded-2xl overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
       <img 
         src={artwork.imageUrl} 
         alt={artwork.title} 
         className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
         loading="lazy"
       />
       
       {/* 浮动标签 */}
       <div className="absolute top-3 left-3 flex gap-2">
         {artwork.isAiGenerated && (
            <div className="bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-white/10 shadow-lg">
               <Sparkles className="w-3 h-3 text-purple-300" /> AI
            </div>
         )}
         {artwork.likes > 2000 && (
            <div className="bg-rose-500/90 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold flex items-center gap-1 border border-white/10 shadow-lg">
               <Flame className="w-3 h-3 fill-current" /> HOT
            </div>
         )}
       </div>
    </div>

    {/* 内容区域 */}
    <div className="flex-1 flex flex-col justify-center relative z-10 py-2">
       
       {/* 顶部元数据 */}
       <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
            <Clock className="w-3 h-3" /> {artwork.publishDate}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span>{artwork.tags[0] || 'Digital Art'}</span>
       </div>

       {/* 标题 */}
       <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight mb-4 font-sans">
          {artwork.title}
       </h3>

       {/* 描述 */}
       <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6 max-w-2xl">
          {artwork.description || "探索这一独特的视觉创作，感受光影与构图的精妙结合。艺术家运用了独特的色彩语言，构建了一个令人沉浸的视觉世界，每一处细节都值得细细品味。"}
       </p>

       {/* 标签 */}
       <div className="flex flex-wrap gap-2 mb-8">
          {artwork.tags.slice(0, 4).map(tag => (
             <span key={tag} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-200 group-hover:border-indigo-100 transition-colors">
                #{tag}
             </span>
          ))}
       </div>

       {/* 底部作者栏 */}
       <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 group/artist" onClick={(e) => onNavigateToProfile(artwork.artist, e)}>
             <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-purple-500">
                <img src={artwork.artistAvatar} alt={artwork.artist} className="w-full h-full rounded-full object-cover border-2 border-white" />
             </div>
             <div>
                <div className="text-sm font-bold text-slate-900 group-hover/artist:text-indigo-600 transition-colors">{artwork.artist}</div>
                <div className="text-[10px] text-slate-400">Pro Creator</div>
             </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex items-center gap-6 text-sm font-bold text-slate-500">
                <div className="flex items-center gap-1.5" title="浏览量">
                   <Eye className="w-4 h-4 text-slate-300" /> 
                   {artwork.views > 1000 ? (artwork.views/1000).toFixed(1)+'k' : artwork.views}
                </div>
                <button 
                   onClick={(e) => onLike(artwork.id, e)}
                   className={`flex items-center gap-1.5 transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
                >
                   <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} /> 
                   {artwork.likes}
                </button>
             </div>
             
             <div className="w-px h-4 bg-slate-200"></div>
             
             <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                <Share2 className="w-4 h-4" />
             </button>
          </div>
       </div>
    </div>
  </div>
);

// 2. 网格视图：画廊瀑布流 (Gallery Masonry)
const ModernGridItem: React.FC<ModernItemProps> = ({ 
  artwork, 
  onClick, 
  onLike, 
  isLiked, 
  onNavigateToProfile 
}) => (
  <div 
    onClick={() => onClick(artwork)}
    className="group break-inside-avoid mb-6 cursor-pointer relative"
  >
    {/* 图片容器 */}
    <div className="relative rounded-2xl overflow-hidden bg-slate-100 mb-3 shadow-sm group-hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1">
       <img 
         src={artwork.imageUrl} 
         alt={artwork.title} 
         className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
         loading="lazy"
       />
       
       {/* 渐变遮罩 (底部信息) */}
       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="text-white font-bold text-lg line-clamp-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
             {artwork.title}
          </h3>
          <p className="text-white/80 text-xs mt-1 line-clamp-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
             {artwork.description || "点击查看详情"}
          </p>
       </div>

       {/* 悬浮操作栏 (右上角) */}
       <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
          <button className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-indigo-600 transition-colors shadow-lg">
             <Download className="w-4 h-4" />
          </button>
          <button 
             onClick={(e) => onLike(artwork.id, e)}
             className={`p-2 rounded-full backdrop-blur-md transition-colors shadow-lg ${
                isLiked 
                  ? 'bg-rose-500 text-white' 
                  : 'bg-white/20 text-white hover:bg-white hover:text-rose-500'
             }`}
          >
             <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
       </div>
       
       {/* AI 标记 (左上角) */}
       {artwork.isAiGenerated && (
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white/90 text-[10px] px-2 py-1 rounded-full font-bold border border-white/10 flex items-center gap-1">
             <Sparkles className="w-3 h-3 text-purple-300" /> AI
          </div>
       )}
    </div>

    {/* 底部极简信息 (Grid View External Info) */}
    <div className="flex items-center justify-between px-1">
       <div 
         onClick={(e) => onNavigateToProfile(artwork.artist, e)}
         className="flex items-center gap-2 group/artist cursor-pointer"
       >
          <img src={artwork.artistAvatar} className="w-6 h-6 rounded-full bg-slate-200 border border-white shadow-sm group-hover/artist:scale-110 transition-transform" alt="" />
          <span className="text-xs font-bold text-slate-700 group-hover/artist:text-indigo-600 transition-colors truncate max-w-[100px]">
             {artwork.artist}
          </span>
       </div>
       
       <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1 hover:text-slate-600 transition-colors">
             <Eye className="w-3 h-3" /> {artwork.views > 1000 ? (artwork.views/1000).toFixed(1)+'k' : artwork.views}
          </span>
          <span className={`flex items-center gap-1 transition-colors ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}>
             <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} /> {artwork.likes}
          </span>
       </div>
    </div>
  </div>
);


const ArtworksPage: React.FC<ArtworksPageProps> = ({ onBack, onNavigateToProfile, onTriggerLogin, user }) => {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'recommended' | 'likes' | 'views'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); 
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [likedArtworks, setLikedArtworks] = useState<Set<string>>(new Set());
  const [isScrolled, setIsScrolled] = useState(false);

  const categories = ['全部', 'UI/UX', '插画', '3D模型', '概念设计', '二次元', '场景', '科幻', '像素画', '国风', '素材', '厚涂'];

  // Scroll Handler for sticky effects
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await ArtworkService.getArtworksByFilter(activeFilter, searchQuery, 'all');
        const sortedData = [...data].sort((a, b) => {
          if (sortOption === 'likes') return b.likes - a.likes;
          if (sortOption === 'views') return b.views - a.views;
          return 0; 
        });
        setArtworks(sortedData);
      } catch (error) {
        console.error("Failed to fetch artworks", error);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeFilter, searchQuery, sortOption]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user && onTriggerLogin) {
      onTriggerLogin();
      return;
    }
    const newLiked = new Set(likedArtworks);
    if (newLiked.has(id)) {
      newLiked.delete(id);
    } else {
      newLiked.add(id);
    }
    setLikedArtworks(newLiked);
  };

  const handleArtistClick = (e: React.MouseEvent, artistName: string) => {
    e.stopPropagation();
    if (onNavigateToProfile) {
       const profileId = artistName === 'NeonDreamer' ? 'p_neon' : artistName === 'InkFlow' ? 'p_ink' : 'p_artmaster';
       onNavigateToProfile(profileId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      <ArtworkDetailModal 
        artworkId={selectedArtworkId}
        onClose={() => setSelectedArtworkId(null)}
        onNavigateToProfile={(artist) => handleArtistClick({ stopPropagation: () => {} } as any, artist)}
        onTriggerLogin={onTriggerLogin}
        currentUser={user}
      />

      {/* 1. 沉浸式头部区域 */}
      <div className="relative bg-[#0B0F19] text-white pt-24 pb-20 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/30 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none animate-pulse" style={{animationDuration: '10s'}}></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none animate-pulse" style={{animationDuration: '15s'}}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-end gap-8">
             <div>
                <button 
                  onClick={onBack}
                  className="flex items-center gap-2 text-indigo-300 hover:text-white mb-6 transition-colors font-medium text-sm group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 返回社区
                </button>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
                  发现<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">无限灵感</span>
                </h1>
                <p className="text-indigo-200/80 text-lg max-w-2xl">
                  汇聚全球 10w+ 顶尖创作者的 {MOCK_ARTWORKS.length}+ 精选作品。探索、收藏、并与未来的合作伙伴相遇。
                </p>
             </div>
             
             {/* 悬浮搜索栏 */}
             <div className="w-full md:w-[420px]">
                <div className="relative group">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors" />
                   </div>
                   <input 
                     type="text" 
                     placeholder="搜索风格、标签或创作者..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="block w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/20 transition-all shadow-xl"
                   />
                   {searchQuery && (
                     <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-indigo-300 hover:text-white transition-colors">
                       <X className="w-5 h-5" />
                     </button>
                   )}
                </div>
                <div className="flex gap-2 mt-3 text-xs text-indigo-300/70 pl-2">
                   <span>热门搜索:</span>
                   <span className="hover:text-white cursor-pointer transition-colors">赛博朋克</span>
                   <span className="hover:text-white cursor-pointer transition-colors">水墨国风</span>
                   <span className="hover:text-white cursor-pointer transition-colors">3D 盲盒</span>
                </div>
             </div>
           </div>
        </div>
      </div>

      {/* 2. 悬浮筛选栏 - Sticky Glass Effect */}
      <div className={`sticky top-16 z-30 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
         <div className={`max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${isScrolled ? 'max-w-[1280px]' : ''}`}>
            <div className={`flex flex-col md:flex-row items-center justify-between gap-4 p-2 rounded-2xl transition-all duration-300 ${
               isScrolled 
                 ? 'bg-white/80 backdrop-blur-xl shadow-lg border border-slate-200/60' 
                 : 'bg-transparent'
            }`}>
               
               {/* 分类标签 - 胶囊样式 */}
               <div className="w-full md:w-auto overflow-x-auto no-scrollbar mask-linear-fade px-1">
                  <div className="flex items-center gap-2 min-w-max">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border ${
                          activeFilter === cat 
                            ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 transform scale-105' 
                            : isScrolled
                              ? 'bg-white/50 text-slate-600 border-transparent hover:bg-white hover:text-slate-900 hover:shadow-sm'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900 shadow-sm'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
               </div>

               {/* 右侧工具栏 */}
               <div className="flex items-center gap-3 flex-shrink-0 ml-auto md:ml-0 w-full md:w-auto justify-between md:justify-end px-1">
                  {/* 视图切换 */}
                  <div className={`flex p-1 rounded-xl border shadow-sm ${isScrolled ? 'bg-slate-100/50 border-slate-200/50' : 'bg-white border-slate-200'}`}>
                     <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                           viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="网格视图"
                     >
                        <LayoutGrid className="w-4 h-4" />
                     </button>
                     <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                           viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm font-bold' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="列表视图"
                     >
                        <List className="w-4 h-4" />
                     </button>
                  </div>

                  {/* 排序下拉 */}
                  <div className="relative group">
                     <select 
                        className={`appearance-none pl-4 pr-10 py-2.5 text-sm font-bold cursor-pointer focus:outline-none rounded-xl border shadow-sm transition-colors ${
                           isScrolled 
                              ? 'bg-slate-100/50 border-slate-200/50 text-slate-700 hover:bg-white' 
                              : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                        }`}
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as any)}
                     >
                        <option value="recommended">综合推荐</option>
                        <option value="likes">最多喜爱</option>
                        <option value="views">最新发布</option>
                     </select>
                     <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 3. 内容列表/网格 - Standard Wide Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[500px]">
         
         {isLoading ? (
            <div className={`gap-6 ${viewMode === 'grid' ? 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4' : 'flex flex-col'}`}>
               {Array.from({ length: 8 }).map((_, i) => (
                 <div key={i} className={`break-inside-avoid mb-6 bg-slate-200 rounded-2xl animate-shimmer ${viewMode === 'list' ? 'h-64' : 'h-64'}`}></div>
               ))}
            </div>
         ) : artworks.length > 0 ? (
            
            viewMode === 'grid' ? (
               // 瀑布流网格
               <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                  {artworks.map((artwork, idx) => (
                    <div key={artwork.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                       <ModernGridItem 
                          artwork={artwork}
                          isLiked={likedArtworks.has(artwork.id)}
                          onLike={toggleLike}
                          onClick={(art) => setSelectedArtworkId(art.id)}
                          onNavigateToProfile={(artist, e) => handleArtistClick(e, artist)}
                       />
                    </div>
                  ))}
               </div>
            ) : (
               // 杂志列表视图
               <div className="flex flex-col gap-8 max-w-5xl mx-auto">
                  {artworks.map((artwork, idx) => (
                     <div key={artwork.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                        <ModernListItem 
                           artwork={artwork}
                           isLiked={likedArtworks.has(artwork.id)}
                           onLike={toggleLike}
                           onClick={(art) => setSelectedArtworkId(art.id)}
                           onNavigateToProfile={(artist, e) => handleArtistClick(e, artist)}
                        />
                     </div>
                  ))}
               </div>
            )

         ) : (
            // 空状态
            <div className="col-span-full py-32 text-center flex flex-col items-center justify-center">
               <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-sm">
                  <ImageOff className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-xl font-bold text-slate-800 mb-2">没有找到相关作品</h3>
               <p className="text-slate-500 max-w-xs mx-auto mb-8">
                 尝试切换其他分类，或者使用更通用的关键词搜索。
               </p>
               <button 
                 onClick={() => { setActiveFilter('全部'); setSearchQuery(''); }} 
                 className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-0.5"
               >
                 清除筛选条件
               </button>
            </div>
         )}

         {/* 加载更多 */}
         {!isLoading && artworks.length > 0 && (
           <div className="mt-24 mb-12 text-center">
              <button className="group px-10 py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-full hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow-lg flex items-center gap-2 mx-auto">
                <Compass className="w-5 h-5 text-indigo-600 group-hover:rotate-45 transition-transform" />
                探索更多灵感
              </button>
           </div>
         )}

      </div>
    </div>
  );
};

export default ArtworksPage;
