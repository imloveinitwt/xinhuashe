
import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, ArrowLeft, Heart, Eye, Zap, 
  Sparkles, TrendingUp, Filter, X, ImageOff, ChevronDown, 
  Compass, Grid, List, LayoutGrid, User as UserIcon, Clock, Calendar
} from 'lucide-react';
import { MOCK_ARTWORKS } from '../constants';
import { Artwork, User } from '../types';
import ArtworkCard from './ArtworkCard';
import ArtworkDetailModal from './ArtworkDetailModal';
import { ArtworkService } from '../services/ArtworkService';

interface ArtworksPageProps {
  onBack: () => void;
  onNavigateToProfile?: (profileId: string) => void;
  onTriggerLogin?: () => void;
  user?: User | null;
}

// List View Item Component
const ArtworkListItem = ({ 
  artwork, 
  onClick, 
  onLike, 
  isLiked, 
  onNavigateToProfile 
}: { 
  artwork: Artwork, 
  onClick: (art: Artwork) => void, 
  onLike: (id: string, e: React.MouseEvent) => void, 
  isLiked: boolean,
  onNavigateToProfile: (artist: string, e: React.MouseEvent) => void
}) => (
  <div 
    onClick={() => onClick(artwork)}
    className="group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer flex flex-col sm:flex-row gap-6 h-auto sm:h-52"
  >
    {/* Thumbnail */}
    <div className="w-full sm:w-72 h-48 sm:h-full flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 relative">
       <img 
         src={artwork.imageUrl} 
         alt={artwork.title} 
         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
         loading="lazy"
       />
       {/* Overlay Gradient */}
       <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
       
       {artwork.isAiGenerated && (
          <div className="absolute top-2 left-2 bg-purple-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm z-10">
             <Sparkles className="w-3 h-3 fill-current" /> AI
          </div>
       )}
    </div>

    {/* Content */}
    <div className="flex-1 flex flex-col min-w-0 py-1">
       <div className="flex justify-between items-start mb-2">
          <div className="min-w-0 pr-4">
             <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5 truncate" title={artwork.title}>
               {artwork.title}
             </h3>
             <div className="flex items-center gap-3 text-xs text-slate-500">
                <div 
                  className="flex items-center gap-1.5 hover:text-slate-800 transition-colors cursor-pointer"
                  onClick={(e) => onNavigateToProfile(artwork.artist, e)}
                >
                  <img src={artwork.artistAvatar} className="w-5 h-5 rounded-full border border-slate-200" alt="" />
                  <span className="font-medium">{artwork.artist}</span>
                </div>
                <span className="text-slate-300">|</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {artwork.publishDate}</span>
             </div>
          </div>
          <button 
             onClick={(e) => onLike(artwork.id, e)}
             className={`p-2 rounded-full border transition-all flex-shrink-0 ${
                isLiked 
                  ? 'bg-rose-50 border-rose-200 text-rose-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-white'
             }`}
          >
             <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
       </div>

       <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 hidden sm:block">
          {artwork.description || "暂无描述..."}
       </p>

       <div className="mt-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
             {artwork.tags.slice(0, 4).map(tag => (
                <span key={tag} className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 group-hover:border-indigo-100 transition-colors">
                   {tag}
                </span>
             ))}
          </div>
          <div className="flex items-center gap-5 text-xs text-slate-400 font-medium">
             <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-full"><Eye className="w-3.5 h-3.5" /> {artwork.views > 1000 ? (artwork.views/1000).toFixed(1)+'k' : artwork.views}</span>
             <span className={`flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-full ${isLiked ? 'text-rose-500 bg-rose-50' : ''}`}><Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} /> {artwork.likes}</span>
          </div>
       </div>
    </div>
  </div>
);

const ArtworksPage: React.FC<ArtworksPageProps> = ({ onBack, onNavigateToProfile, onTriggerLogin, user }) => {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'recommended' | 'likes' | 'views'>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // Added View Mode State
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [likedArtworks, setLikedArtworks] = useState<Set<string>>(new Set());

  const categories = ['全部', 'UI/UX', '插画', '3D模型', '概念设计', '二次元', '场景', '科幻', '像素画', '国风', '素材', '厚涂'];
  const trendingTags = ['赛博朋克', '古风', '机甲', 'UI界面', '原神', 'Blender'];

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await ArtworkService.getArtworksByFilter(activeFilter, searchQuery, 'all');
        const sortedData = [...data].sort((a, b) => {
          if (sortOption === 'likes') return b.likes - a.likes;
          if (sortOption === 'views') return b.views - a.views;
          return 0; // Default order (mock recommended)
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
       // Demo mapping
       const profileId = artistName === 'NeonDreamer' ? 'p_neon' : artistName === 'InkFlow' ? 'p_ink' : 'p_artmaster';
       onNavigateToProfile(profileId);
    }
  };

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    window.scrollTo({ top: 300, behavior: 'smooth' }); // Scroll closer to grid
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-16 font-sans">
      
      <ArtworkDetailModal 
        artworkId={selectedArtworkId}
        onClose={() => setSelectedArtworkId(null)}
        onNavigateToProfile={(artist) => handleArtistClick({ stopPropagation: () => {} } as any, artist)}
        onTriggerLogin={onTriggerLogin}
        currentUser={user}
      />

      {/* 1. Refined Hero Section */}
      <div className="bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50/50 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-50/50 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-12 relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
             <div className="max-w-2xl">
                <button 
                  onClick={onBack}
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 mb-4 transition-colors text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" /> 返回社区
                </button>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3 flex items-center gap-3">
                  <Compass className="w-8 h-8 text-indigo-600" />
                  发现灵感
                </h1>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                  探索全球顶尖创作者的 {MOCK_ARTWORKS.length}+ 优质作品，激发您的下一个创意。
                </p>
             </div>
             
             {/* Search Input in Hero */}
             <div className="w-full md:w-80">
                <div className="relative group">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                   <input 
                     type="text" 
                     placeholder="搜索作品、标签、作者..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-9 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm group-hover:border-slate-300"
                   />
                   {searchQuery && (
                     <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                       <X className="w-3 h-3" />
                     </button>
                   )}
                </div>
             </div>
           </div>
           
           {/* Popular Tags */}
           <div className="flex flex-wrap gap-2 items-center text-xs mt-6">
              <span className="text-slate-400 font-bold uppercase tracking-wider mr-2">热门:</span>
              {trendingTags.map(tag => (
                 <button 
                   key={tag}
                   onClick={() => handleSearch(tag)} 
                   className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-full hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all font-medium"
                 >
                   {tag}
                 </button>
              ))}
           </div>
        </div>
      </div>

      {/* 2. Sticky Filter Toolbar */}
      <div className="sticky top-16 z-30 bg-slate-50/90 backdrop-blur-lg border-b border-slate-200 shadow-sm transition-all">
         <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
               
               {/* Category Tabs */}
               <div className="w-full md:w-auto overflow-x-auto no-scrollbar mask-linear-fade">
                  <div className="flex items-center gap-1 min-w-max">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                          activeFilter === cat 
                            ? 'bg-slate-900 text-white shadow-md transform scale-105' 
                            : 'text-slate-500 hover:bg-white hover:text-slate-900'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
               </div>

               {/* Controls Group */}
               <div className="flex items-center gap-3 flex-shrink-0 ml-auto md:ml-0 w-full md:w-auto justify-between md:justify-end">
                  {/* View Mode Toggle */}
                  <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                     <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-all ${
                           viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="网格视图"
                     >
                        <LayoutGrid className="w-4 h-4" />
                     </button>
                     <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-all ${
                           viewMode === 'list' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                        }`}
                        title="列表视图"
                     >
                        <List className="w-4 h-4" />
                     </button>
                  </div>

                  {/* Sort Controls */}
                  <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                     {[
                        { id: 'recommended', label: '推荐', icon: Zap },
                        { id: 'likes', label: '热门', icon: Heart },
                        { id: 'views', label: '最新', icon: Eye }
                     ].map(opt => (
                        <button 
                          key={opt.id}
                          onClick={() => setSortOption(opt.id as any)}
                          className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                            sortOption === opt.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
                          }`}
                          title={opt.label}
                        >
                           <opt.icon className="w-3.5 h-3.5" />
                           <span className="hidden sm:inline">{opt.label}</span>
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* 3. Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 min-h-[500px]">
         {/* Results Count */}
         {!isLoading && (
           <div className="mb-6 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${artworks.length > 0 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                 {artworks.length} 个灵感作品
              </span>
              {activeFilter !== '全部' && (
                <button onClick={() => { setActiveFilter('全部'); setSearchQuery(''); }} className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium">
                  清除筛选 <X className="w-3 h-3" />
                </button>
              )}
           </div>
         )}

         {/* Content Area */}
         {isLoading ? (
            // Loading Skeleton
            <div className={`gap-4 ${viewMode === 'grid' ? 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4' : 'flex flex-col'}`}>
               {Array.from({ length: 8 }).map((_, i) => (
                 <div key={i} className={`break-inside-avoid mb-4 ${viewMode === 'list' ? 'h-48' : ''}`}>
                    <ArtworkCard isLoading={true} aspectRatio={viewMode === 'list' ? 'video' : 'auto'} />
                 </div>
               ))}
            </div>
         ) : artworks.length > 0 ? (
            // Results
            viewMode === 'grid' ? (
               // Grid Layout
               <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-0">
                  {artworks.map((artwork, idx) => (
                    <div key={artwork.id} className="animate-fade-in-up break-inside-avoid mb-4" style={{ animationDelay: `${idx * 50}ms` }}>
                        <ArtworkCard 
                          artwork={artwork}
                          isLiked={likedArtworks.has(artwork.id)}
                          onLike={toggleLike}
                          onNavigateToProfile={(artist, e) => handleArtistClick(e, artist)}
                          onClick={(art) => setSelectedArtworkId(art.id)}
                          aspectRatio="auto"
                        />
                    </div>
                  ))}
               </div>
            ) : (
               // List Layout
               <div className="flex flex-col gap-4">
                  {artworks.map((artwork, idx) => (
                     <div key={artwork.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                        <ArtworkListItem 
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
            // Empty State
            <div className="col-span-full py-32 text-center flex flex-col items-center justify-center">
               <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <ImageOff className="w-10 h-10 text-slate-300" />
               </div>
               <h3 className="text-lg font-bold text-slate-700 mb-2">没有找到相关作品</h3>
               <p className="text-slate-500 max-w-xs mx-auto mb-6 text-sm">
                 尝试切换其他分类，或者使用更通用的关键词搜索。
               </p>
               <button 
                 onClick={() => { setActiveFilter('全部'); setSearchQuery(''); }} 
                 className="px-6 py-2 bg-white border border-slate-200 text-indigo-600 font-bold rounded-full hover:bg-indigo-50 hover:border-indigo-200 transition-colors shadow-sm text-sm"
               >
                 清除所有筛选
               </button>
            </div>
         )}

         {/* Load More Trigger */}
         {!isLoading && artworks.length > 0 && (
           <div className="mt-16 text-center">
              <button className="group px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-full hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all shadow-sm hover:shadow-md flex items-center gap-2 mx-auto text-sm">
                加载更多精彩作品
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
           </div>
         )}

      </div>
    </div>
  );
};

export default ArtworksPage;
