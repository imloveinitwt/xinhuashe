
import React, { useState } from 'react';
import { Heart, Eye, Filter, Sparkles, Search, BadgeCheck, X, Briefcase, Trophy, Flame, ChevronDown, SlidersHorizontal, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import { MOCK_ARTWORKS, MOCK_CREATORS, MOCK_EVENTS } from '../constants';

interface DiscoveryViewProps {
  onNavigateToProfile?: (profileId: string) => void;
}

type SortOption = 'recommended' | 'likes' | 'views';
type AiFilterOption = 'all' | 'ai_only' | 'human_only';

const DiscoveryView: React.FC<DiscoveryViewProps> = ({ onNavigateToProfile }) => {
  // State for Filters
  const [activeFilter, setActiveFilter] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  
  // Advanced Filter States
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [aiFilter, setAiFilter] = useState<AiFilterOption>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [likedArtworks, setLikedArtworks] = useState<Set<string>>(new Set());

  // Combine original and reversed mock data to simulate a larger grid, ensuring unique keys
  const allArtworks = [
    ...MOCK_ARTWORKS.map(art => ({ ...art, renderKey: art.id })),
    ...[...MOCK_ARTWORKS].reverse().map(art => ({ ...art, renderKey: `dup-${art.id}` }))
  ];

  // Logic to process artworks based on all active filters
  const visibleArtworks = allArtworks
    .filter(art => {
      // 1. Category Filter
      if (activeFilter !== '全部' && !art.tags.includes(activeFilter)) return false;

      // 2. Search Query (Title or Artist)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = art.title.toLowerCase().includes(query);
        const matchesArtist = art.artist.toLowerCase().includes(query);
        if (!matchesTitle && !matchesArtist) return false;
      }

      // 3. AI Filter
      if (aiFilter === 'ai_only' && !art.isAiGenerated) return false;
      if (aiFilter === 'human_only' && art.isAiGenerated) return false;

      // 4. Verified Filter
      if (verifiedOnly && !art.isVerified) return false;

      return true;
    })
    .sort((a, b) => {
      // 5. Sorting
      if (sortOption === 'likes') return b.likes - a.likes;
      if (sortOption === 'views') return b.views - a.views;
      return 0; // Default order (Recommended)
    });

  const categories = ['全部', '插画', '游戏原画', 'UI/UX', '3D模型', '动画'];

  const toggleLike = (id: string) => {
    setLikedArtworks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleArtistClick = (artistName: string) => {
    if (onNavigateToProfile) {
      // Demo logic: map specific names to specific mock profile IDs
      if (artistName === 'NeonDreamer') onNavigateToProfile('p_neon');
      else if (artistName === 'InkFlow') onNavigateToProfile('p_ink');
      else onNavigateToProfile('p_artmaster'); // Fallback
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Load+Error';
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=cbd5e1&color=fff';
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-10 px-4 md:px-8 max-w-[1440px] mx-auto">
      
      {/* Top Section: Events Banner (Integration of Gracg/Huashi6 Features) */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900">热门赛事与活动</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_EVENTS.map(event => (
            <div key={event.id} className="relative rounded-xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all h-40">
              <img 
                src={event.coverUrl} 
                alt={event.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                onError={handleImageError}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                <div className="flex justify-between items-end">
                  <div>
                    <span className="inline-block bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full mb-2">进行中</span>
                    <h3 className="text-white font-bold text-lg">{event.title}</h3>
                    <p className="text-slate-300 text-xs mt-1">截止: {event.deadline}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-bold text-lg">{event.prize}</p>
                    <p className="text-slate-400 text-xs">总奖池</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Main Artwork Stream (Integration of Huajia/Huashilm) */}
        <div className="flex-1">
          
          {/* Filters & Search & Advanced Controls */}
          <div className="sticky top-16 z-20 bg-slate-50/95 backdrop-blur-sm pt-4 pb-2 mb-4 border-b border-slate-200 transition-all">
             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Category Tags */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                      activeFilter === cat 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Search & Advanced Toggle */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索作品、画师..." 
                      className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                 </div>
                 <button 
                    onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                    className={`p-2 border rounded-full transition-colors flex items-center justify-center gap-2 px-3 shadow-sm ${
                      isAdvancedFilterOpen || verifiedOnly || aiFilter !== 'all' || sortOption !== 'recommended'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                 >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium">筛选</span>
                    {isAdvancedFilterOpen ? <ArrowUpNarrowWide className="w-3 h-3" /> : <ArrowDownWideNarrow className="w-3 h-3" />}
                 </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAdvancedFilterOpen ? 'max-h-64 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Sort Option */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">排序方式</h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="radio" name="sort" checked={sortOption === 'recommended'} onChange={() => setSortOption('recommended')} className="text-indigo-600 focus:ring-indigo-500" />
                      综合推荐
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="radio" name="sort" checked={sortOption === 'likes'} onChange={() => setSortOption('likes')} className="text-indigo-600 focus:ring-indigo-500" />
                      最多喜爱 (Likes)
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="radio" name="sort" checked={sortOption === 'views'} onChange={() => setSortOption('views')} className="text-indigo-600 focus:ring-indigo-500" />
                      最多浏览 (Views)
                    </label>
                  </div>
                </div>

                {/* Content Type (AI) */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">内容类型</h4>
                  <div className="flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="radio" name="aifilter" checked={aiFilter === 'all'} onChange={() => setAiFilter('all')} className="text-indigo-600 focus:ring-indigo-500" />
                      全部内容
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="radio" name="aifilter" checked={aiFilter === 'human_only'} onChange={() => setAiFilter('human_only')} className="text-indigo-600 focus:ring-indigo-500" />
                      仅人工创作
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="radio" name="aifilter" checked={aiFilter === 'ai_only'} onChange={() => setAiFilter('ai_only')} className="text-indigo-600 focus:ring-indigo-500" />
                      仅 AI 生成
                    </label>
                  </div>
                </div>

                {/* Creator Type */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">创作者</h4>
                  <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer mt-1">
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors ${verifiedOnly ? 'bg-indigo-600' : 'bg-slate-200'}`} onClick={(e) => { e.preventDefault(); setVerifiedOnly(!verifiedOnly); }}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${verifiedOnly ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="flex items-center gap-1">仅看认证画师 <BadgeCheck className="w-3 h-3 text-blue-500" /></span>
                  </label>
                </div>

              </div>
              
              {/* Reset Filters */}
              <div className="mt-3 flex justify-end">
                <button 
                  onClick={() => {
                    setSortOption('recommended');
                    setAiFilter('all');
                    setVerifiedOnly(false);
                    setSearchQuery('');
                    setActiveFilter('全部');
                  }}
                  className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> 重置所有筛选
                </button>
              </div>
            </div>
          </div>

          {/* Result Count */}
          <div className="mb-4 text-xs text-slate-500 font-medium">
            共找到 {visibleArtworks.length} 个结果
            {searchQuery && <span> · 搜索关键词: "{searchQuery}"</span>}
          </div>

          {/* Masonry Layout */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {visibleArtworks.length > 0 ? visibleArtworks.map((art) => {
              const isLiked = likedArtworks.has(art.id);
              return (
                <div key={art.renderKey} className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                  {/* Image */}
                  <div className="relative">
                    <img 
                      src={art.imageUrl} 
                      alt={art.title} 
                      className="w-full h-auto object-cover min-h-[200px] bg-slate-100"
                      onError={handleImageError}
                      loading="lazy"
                    />
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
                       <button className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95">
                          <Briefcase className="w-5 h-5" />
                          雇佣画师
                       </button>
                    </div>
                    
                    {art.isAiGenerated && (
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI 生成
                      </div>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 text-lg truncate" title={art.title}>{art.title}</h3>
                    <div className="flex items-center justify-between mt-3 mb-3">
                      <div 
                        className="flex items-center gap-2 max-w-[65%] cursor-pointer hover:bg-slate-100 p-1 -ml-1 rounded transition-colors"
                        onClick={() => handleArtistClick(art.artist)}
                      >
                        <img 
                          src={art.artistAvatar} 
                          alt={art.artist} 
                          className="w-6 h-6 rounded-full flex-shrink-0 bg-slate-200" 
                          onError={handleAvatarError}
                        />
                        <span className="text-sm text-slate-600 font-medium truncate" title={art.artist}>{art.artist}</span>
                        {art.isVerified && (
                          <span title="认证创作者" className="flex items-center">
                            <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-slate-400 text-xs flex-shrink-0">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {(art.views / 1000).toFixed(1)}k
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(art.id);
                          }}
                          className={`flex items-center gap-1 cursor-pointer transition-colors ${
                            isLiked ? 'text-pink-500' : 'text-slate-400 hover:text-pink-500'
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} />
                          {art.likes + (isLiked ? 1 : 0)}
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {art.tags.map(tag => (
                        <button
                          key={tag}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveFilter(tag);
                          }}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${
                            activeFilter === tag
                              ? 'bg-indigo-100 text-indigo-700 font-medium'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                          }`}
                        >
                          #{tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div className="col-span-full py-20 text-center">
                 <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                   <Search className="w-8 h-8 text-slate-400" />
                 </div>
                 <h3 className="text-lg font-medium text-slate-700">没有找到相关作品</h3>
                 <p className="text-slate-500 text-sm mt-2">尝试切换关键词或调整筛选条件</p>
                 <button 
                   onClick={() => {
                     setSearchQuery('');
                     setAiFilter('all');
                     setVerifiedOnly(false);
                     setActiveFilter('全部');
                   }}
                   className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                 >
                   清除筛选
                 </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Sidebar - Top Creators (Integration of Huashi6 Rankings) */}
        <div className="w-full lg:w-80 flex-shrink-0 space-y-8">
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                 <Flame className="w-5 h-5 text-red-500" />
                 <h3 className="font-bold text-lg text-slate-800">推荐创作者</h3>
              </div>
              <div className="space-y-6">
                 {MOCK_CREATORS.map((creator, index) => (
                   <div 
                     key={creator.id} 
                     className="flex items-center gap-3 group cursor-pointer"
                     onClick={() => handleArtistClick(creator.name === 'WLOP' ? 'p_neon' : 'p_artmaster')}
                   >
                      <div className="relative">
                        <img 
                          src={creator.avatar} 
                          className="w-12 h-12 rounded-full border border-slate-100 group-hover:border-indigo-300 transition-colors bg-slate-200" 
                          onError={handleAvatarError}
                        />
                        <div className="absolute -top-1 -left-1 w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center gap-1">
                           <h4 className="font-semibold text-slate-800 text-sm truncate">{creator.name}</h4>
                           {creator.isVerified && <BadgeCheck className="w-3 h-3 text-blue-500" />}
                         </div>
                         <p className="text-xs text-slate-500 truncate">{creator.tags.join(' / ')}</p>
                      </div>
                      <button className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors">
                        关注
                      </button>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-6 py-2 text-sm text-slate-500 hover:text-slate-800 font-medium border-t border-slate-100">
                查看完整榜单
              </button>
           </div>
           
           {/* Ad / Promo */}
           <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white text-center">
              <h3 className="font-bold text-lg mb-2">开通 Pro 会员</h3>
              <p className="text-indigo-100 text-sm mb-4">解锁 4K 原图下载与专属课程</p>
              <button className="bg-white text-indigo-700 px-6 py-2 rounded-full text-sm font-bold shadow-lg hover:scale-105 transition-transform">
                 立即升级
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryView;
