
import React, { useState } from 'react';
import { 
  ArrowLeft, UserPlus, TrendingUp, Sparkles, Filter, 
  Star, ChevronRight, Award, Zap, Heart, Eye, Crown, Check, 
  MessageSquare, Image as ImageIcon, Clock
} from 'lucide-react';
import { MOCK_CREATORS, MOCK_ARTWORKS } from '../constants';
import { User, Creator } from '../types';
import ArtworkDetailModal from './ArtworkDetailModal';

interface RisingCreatorsPageProps {
  onBack: () => void;
  onNavigateToProfile?: (profileId: string) => void;
  onTriggerLogin?: () => void;
  user?: User | null;
}

const RisingCreatorsPage: React.FC<RisingCreatorsPageProps> = ({ onBack, onNavigateToProfile, onTriggerLogin, user }) => {
  const [activeTab, setActiveTab] = useState('全部');
  const [sortOption, setSortOption] = useState('growth'); // growth, followers, new
  const [followedCreators, setFollowedCreators] = useState<Set<string>>(new Set());
  const [likedArtworks, setLikedArtworks] = useState<Set<string>>(new Set());
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);

  // 1. Data Enrichment: Attach works and stats to creators
  const enrichedCreators = MOCK_CREATORS.map(creator => {
    // Find works by this artist
    const works = MOCK_ARTWORKS.filter(art => art.artist === creator.name);
    
    // Create gallery items with real IDs where possible, fallback to mocks
    const gallery = works.length > 0 ? works.slice(0, 3) : [
       { id: `mock_${creator.id}_1`, imageUrl: 'https://placehold.co/400x300/f1f5f9/cbd5e1?text=Work+1', title: 'Concept Art' },
       { id: `mock_${creator.id}_2`, imageUrl: 'https://placehold.co/400x300/f1f5f9/cbd5e1?text=Work+2', title: 'Sketch' },
       { id: `mock_${creator.id}_3`, imageUrl: 'https://placehold.co/400x300/f1f5f9/cbd5e1?text=Work+3', title: 'Design' }
    ];

    // Ensure we have at least a fallback cover image
    const coverImage = gallery[0]?.imageUrl || 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image';

    return {
      ...creator,
      bio: works[0]?.description?.slice(0, 60) + '...' || '专注创作，探索无限可能。',
      weeklyGrowth: Math.floor(Math.random() * 800) + 100, // Mock growth
      totalLikes: works.reduce((sum, w) => sum + w.likes, 0) + Math.floor(Math.random() * 5000),
      gallery, // Array of objects now
      coverImage: coverImage,
      latestActivity: '2小时前发布了新作品'
    };
  });

  // 2. Filter & Sort Logic
  const filteredCreators = enrichedCreators.filter(c => {
    if (activeTab === '全部') return true;
    return c.tags.some(t => t.includes(activeTab) || (activeTab === '3D' && (t.includes('3D') || t.includes('Blender'))));
  }).sort((a, b) => {
    if (sortOption === 'followers') return b.followers - a.followers;
    if (sortOption === 'new') return 0; // Mock order
    return b.weeklyGrowth - a.weeklyGrowth; // Default: Growth
  });

  // Spotlight Creator (Top 1)
  const spotlightCreator = enrichedCreators.find(c => c.name === 'NeonDreamer') || enrichedCreators[0];

  // Handlers
  const handleCreatorClick = (creatorName: string) => {
    if (onNavigateToProfile) {
      const profileId = creatorName === 'NeonDreamer' ? 'p_neon' : creatorName === 'InkFlow' ? 'p_ink' : 'p_artmaster';
      onNavigateToProfile(profileId);
    }
  };

  const toggleFollow = (creatorId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user && onTriggerLogin) {
      onTriggerLogin();
      return;
    }
    const newSet = new Set(followedCreators);
    if (newSet.has(creatorId)) {
      newSet.delete(creatorId);
    } else {
      newSet.add(creatorId);
    }
    setFollowedCreators(newSet);
  };

  const toggleLikeArtwork = (artworkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user && onTriggerLogin) {
      onTriggerLogin();
      return;
    }
    const newSet = new Set(likedArtworks);
    if (newSet.has(artworkId)) {
      newSet.delete(artworkId);
    } else {
      newSet.add(artworkId);
    }
    setLikedArtworks(newSet);
  };

  const openArtwork = (artworkId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (artworkId.startsWith('mock_')) return; // Don't open mocks
    setSelectedArtworkId(artworkId);
  };

  const categories = ['全部', '插画', '3D', 'UI设计', '二次元', '概念艺术'];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-20 font-sans">
      
      <ArtworkDetailModal 
        artworkId={selectedArtworkId}
        onClose={() => setSelectedArtworkId(null)}
        onNavigateToProfile={(artist) => {
           setSelectedArtworkId(null);
           handleCreatorClick(artist);
        }}
        onTriggerLogin={onTriggerLogin}
        currentUser={user}
      />

      {/* Hero Spotlight Section */}
      <div className="bg-slate-900 text-white mb-10 overflow-hidden relative">
         {/* Background Glows */}
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
            {/* Nav Back (Light Theme) */}
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回社区
            </button>

            <div className="flex flex-col lg:flex-row gap-12 items-center">
               {/* Left: Info */}
               <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                     <Crown className="w-3 h-3 fill-current" />
                     本周推荐创作者
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                     本周主打星：
                     <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 block mt-2">
                        {spotlightCreator?.name || '未知画师'}
                     </span>
                  </h1>
                  <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
                     {spotlightCreator?.bio} 凭借独特的视觉风格和高产出的优质作品，本周获得了社区的高度关注。
                  </p>
                  
                  <div className="flex gap-8 py-4 border-t border-white/10">
                     <div>
                        <div className="text-2xl font-bold text-white">+{spotlightCreator?.weeklyGrowth}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">本周涨粉</div>
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-white">{(spotlightCreator?.totalLikes / 1000).toFixed(1)}k</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">总获赞</div>
                     </div>
                     <div>
                        <div className="text-2xl font-bold text-white">前 1%</div>
                        <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">活跃度排名</div>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <button 
                       onClick={() => handleCreatorClick(spotlightCreator.name)}
                       className="px-8 py-3 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition-colors"
                     >
                       查看主页
                     </button>
                     <button 
                       onClick={(e) => toggleFollow(spotlightCreator.id, e)}
                       className={`px-8 py-3 rounded-full font-bold transition-colors flex items-center gap-2 border ${
                         followedCreators.has(spotlightCreator.id)
                           ? 'bg-transparent border-green-500 text-green-400'
                           : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700'
                       }`}
                     >
                       {followedCreators.has(spotlightCreator.id) ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                       {followedCreators.has(spotlightCreator.id) ? '已关注' : '关注'}
                     </button>
                  </div>
               </div>

               {/* Right: Visual Showcase */}
               <div className="flex-1 w-full max-w-lg relative">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group cursor-pointer" onClick={() => handleCreatorClick(spotlightCreator.name)}>
                     <img src={spotlightCreator?.coverImage} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" alt="Spotlight Work" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     <div className="absolute bottom-6 left-6 text-white">
                        <div className="text-sm font-bold opacity-90">代表作</div>
                        <div className="text-xl font-bold">赛博都市：夜幕</div>
                     </div>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-xl overflow-hidden shadow-xl border-4 border-slate-800 hidden md:block animate-float">
                     <img src={spotlightCreator?.gallery[1]?.imageUrl || spotlightCreator?.coverImage} className="w-full h-full object-cover" alt="Gallery 1" />
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 sticky top-16 z-20 bg-slate-50/95 backdrop-blur py-4 transition-all">
           {/* Filters */}
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    activeTab === cat 
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>

           {/* Sort */}
           <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-sm text-slate-500">排序:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none cursor-pointer"
              >
                <option value="growth">本周涨粉</option>
                <option value="followers">粉丝总数</option>
                <option value="new">最新入驻</option>
              </select>
           </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {filteredCreators.map((creator, index) => (
             <div 
                key={creator.id}
                onClick={() => handleCreatorClick(creator.name)}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden"
             >
                {/* 1. Header Cover */}
                <div className="h-28 bg-slate-100 relative overflow-hidden">
                   <img 
                     src={creator.coverImage} 
                     alt="Cover" 
                     className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                   />
                   <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                   
                   {/* Top Right Rank or Badge */}
                   {index < 3 && sortOption === 'growth' && activeTab === '全部' && (
                     <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                        <TrophyIcon index={index} />
                        TOP {index + 1}
                     </div>
                   )}
                </div>

                {/* 2. Info Body */}
                <div className="px-5 pt-10 pb-5 relative flex-1 flex flex-col">
                   {/* Avatar */}
                   <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white shadow-md overflow-hidden bg-white group-hover:scale-110 transition-transform duration-300">
                      <img src={creator.avatar} className="w-full h-full object-cover" alt={creator.name} />
                   </div>
                   
                   {/* Name & Tags */}
                   <div className="text-center mb-4">
                      <h3 className="font-bold text-slate-900 text-lg truncate flex items-center justify-center gap-1">
                        {creator.name}
                        {creator.isVerified && <Zap className="w-3.5 h-3.5 text-blue-500 fill-current" />}
                      </h3>
                      <div className="flex justify-center gap-1.5 mt-2 flex-wrap">
                        {creator.tags.slice(0, 2).map(tag => (
                           <span key={tag} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              {tag}
                           </span>
                        ))}
                      </div>
                   </div>

                   {/* Stats Grid */}
                   <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-50 mb-4 bg-slate-50/50 rounded-lg">
                      <div className="text-center">
                         <div className="font-bold text-slate-800 text-sm">
                            {creator.followers > 1000 ? (creator.followers/1000).toFixed(1) + 'k' : creator.followers}
                         </div>
                         <div className="text-[10px] text-slate-400 uppercase">粉丝</div>
                      </div>
                      <div className="text-center border-l border-r border-slate-200">
                         <div className="font-bold text-green-600 text-sm">+{creator.weeklyGrowth}</div>
                         <div className="text-[10px] text-slate-400 uppercase">本周</div>
                      </div>
                      <div className="text-center">
                         <div className="font-bold text-slate-800 text-sm">
                            {creator.totalLikes > 1000 ? (creator.totalLikes/1000).toFixed(1) + 'k' : creator.totalLikes}
                         </div>
                         <div className="text-[10px] text-slate-400 uppercase">获赞</div>
                      </div>
                   </div>

                   {/* Actions Row */}
                   <div className="flex gap-2 mb-5">
                      <button 
                        onClick={(e) => toggleFollow(creator.id, e)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-1.5 border ${
                          followedCreators.has(creator.id) 
                            ? 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50' 
                            : 'bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
                        }`}
                      >
                        {followedCreators.has(creator.id) ? (
                          <> <Check className="w-3.5 h-3.5" /> 已关注 </>
                        ) : (
                          <> <UserPlus className="w-3.5 h-3.5" /> 关注 </>
                        )}
                      </button>
                      <button className="px-3 py-2 rounded-lg border border-slate-200 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                         <MessageSquare className="w-4 h-4" />
                      </button>
                   </div>

                   {/* Mini Gallery (Waterfall-ish grid) */}
                   <div>
                      <div className="flex items-center justify-between mb-2">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">精选作品</span>
                         <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 新动态
                         </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                          {creator.gallery.map((art: any, i) => (
                             <div 
                               key={art.id || i} 
                               className="aspect-square rounded-lg overflow-hidden bg-slate-100 border border-slate-100 relative group/art cursor-pointer"
                               onClick={(e) => openArtwork(art.id, e)}
                             >
                                <img src={art.imageUrl} className="w-full h-full object-cover transition-transform group-hover/art:scale-110" alt="" />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/art:opacity-100 transition-opacity flex items-center justify-center gap-1">
                                   <button 
                                     onClick={(e) => toggleLikeArtwork(art.id, e)}
                                     className={`p-1.5 rounded-full backdrop-blur-sm transition-transform hover:scale-110 ${
                                       likedArtworks.has(art.id) ? 'bg-rose-500 text-white' : 'bg-white/30 text-white hover:bg-white/50'
                                     }`}
                                   >
                                      <Heart className={`w-3 h-3 ${likedArtworks.has(art.id) ? 'fill-current' : ''}`} />
                                   </button>
                                </div>
                             </div>
                          ))}
                      </div>
                   </div>

                </div>
             </div>
           ))}
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
           <button className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-medium rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
             加载更多画师
           </button>
        </div>

      </div>
    </div>
  );
};

const TrophyIcon = ({ index }: { index: number }) => {
   if (index === 0) return <span className="text-yellow-700">🥇</span>;
   if (index === 1) return <span className="text-slate-700">🥈</span>;
   if (index === 2) return <span className="text-amber-800">🥉</span>;
   return null;
}

export default RisingCreatorsPage;
