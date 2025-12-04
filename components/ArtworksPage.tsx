
import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowLeft, Heart, Eye, Zap, Sparkles } from 'lucide-react';
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

const ArtworksPage: React.FC<ArtworksPageProps> = ({ onBack, onNavigateToProfile, onTriggerLogin, user }) => {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'recommended' | 'likes' | 'views'>('recommended');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [likedArtworks, setLikedArtworks] = useState<Set<string>>(new Set());

  const categories = ['全部', 'UI/UX', '插画', '3D模型', '概念设计', '二次元', '场景', '科幻', '像素画', '国风', '素材', '厚涂'];

  // Fetch Data
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
       // Demo mapping
       const profileId = artistName === 'NeonDreamer' ? 'p_neon' : artistName === 'InkFlow' ? 'p_ink' : 'p_artmaster';
       onNavigateToProfile(profileId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-20 px-4 md:px-8 font-sans">
      
      <ArtworkDetailModal 
        artworkId={selectedArtworkId}
        onClose={() => setSelectedArtworkId(null)}
        onNavigateToProfile={(artist) => handleArtistClick({ stopPropagation: () => {} } as any, artist)}
        onTriggerLogin={onTriggerLogin}
        currentUser={user}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> 返回社区
            </button>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-pink-500" />
              作品广场
            </h1>
            <p className="text-slate-500 mt-1">探索 {MOCK_ARTWORKS.length}+ 优质原创设计作品</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="搜索作品、标签或画师..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 w-full sm:w-64 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                />
             </div>
             
             <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 p-1">
                {[
                  { id: 'recommended', label: '推荐', icon: Zap },
                  { id: 'likes', label: '热门', icon: Heart },
                  { id: 'views', label: '浏览', icon: Eye }
                ].map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => setSortOption(opt.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
                      sortOption === opt.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                     <opt.icon className="w-3.5 h-3.5" />
                     <span className="hidden sm:inline">{opt.label}</span>
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-x-auto pb-2 no-scrollbar">
           <div className="flex gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    activeFilter === cat 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>

        {/* Gallery Grid */}
        <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
           {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <ArtworkCard key={i} isLoading={true} />
              ))
           ) : artworks.length > 0 ? (
              artworks.map((artwork, idx) => (
                <div key={artwork.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                    <ArtworkCard 
                      artwork={artwork}
                      isLiked={likedArtworks.has(artwork.id)}
                      onLike={toggleLike}
                      onNavigateToProfile={(artist, e) => handleArtistClick(e, artist)}
                      onClick={(art) => setSelectedArtworkId(art.id)}
                    />
                </div>
              ))
           ) : (
             <div className="col-span-full py-20 text-center">
                <p className="text-slate-400 text-lg">没有找到相关作品</p>
                <button onClick={() => { setActiveFilter('全部'); setSearchQuery(''); }} className="mt-4 text-indigo-600 font-medium hover:underline">
                  清除筛选条件
                </button>
             </div>
           )}
        </div>

        {/* Load More Trigger (Mock) */}
        {!isLoading && artworks.length > 0 && (
          <div className="mt-12 text-center">
             <button className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-medium rounded-full hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm">
               加载更多精彩作品
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ArtworksPage;
