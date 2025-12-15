
import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, TrendingUp, ArrowRight, Zap, 
  Briefcase, Clock, 
  Crown, ChevronRight, ChevronLeft, SlidersHorizontal, CheckCircle2, Monitor,
  Heart, Eye, User as UserIcon, Building, Activity, Star, DollarSign
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_ARTWORKS } from '../constants';
import { User, Artwork, ViewMode, Project } from '../types';
import { ArtworkService } from '../services/ArtworkService';
import ArtworkCard from './ArtworkCard';
import ArtworkDetailModal from './ArtworkDetailModal';
import ProjectDrawer from './ProjectDrawer';

interface DiscoveryViewProps {
  onNavigateToProfile?: (profileId: string) => void;
  onTriggerLogin?: () => void;
  onNavigate?: (mode: ViewMode) => void;
  user?: User | null;
}

// === Sub-Components ===

const SectionHeader = ({ title, subtitle, actionText, onAction, icon: Icon, extraInfo }: any) => (
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
    <div>
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          {Icon && <Icon className="w-6 h-6 text-indigo-600" />}
          {title}
        </h2>
        {extraInfo && (
          <div className="flex items-center">
            {typeof extraInfo === 'string' ? (
              <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-full border border-slate-200">
                {extraInfo}
              </span>
            ) : (
              extraInfo
            )}
          </div>
        )}
      </div>
      {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
    </div>
    {actionText && (
      <button 
        onClick={onAction}
        className="group flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
      >
        {actionText}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>
    )}
  </div>
);

const FilterTab: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border whitespace-nowrap ${
      active 
        ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
    }`}
  >
    {label}
  </button>
);

// Refined Featured Item Component
const FeaturedItem = ({ 
  artwork, 
  size = 'normal', 
  badge, 
  badgeColor,
  onClick,
  onLike,
  isLiked
}: { 
  artwork: Artwork, 
  size?: 'large' | 'normal', 
  badge?: string, 
  badgeColor?: string,
  onClick: (id: string) => void,
  onLike?: (id: string, e: React.MouseEvent) => void,
  isLiked?: boolean
}) => {
  if (!artwork) return null;

  return (
    <div 
      onClick={() => onClick(artwork.id)}
      className={`group relative rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 ${size === 'large' ? 'h-[420px] md:h-full' : 'h-[240px] md:h-full'}`}
    >
      {/* Image Background with Parallax Zoom */}
      <div className="absolute inset-0 bg-slate-200 overflow-hidden">
         <img 
            src={artwork.imageUrl} 
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
            alt={artwork.title}
            loading="lazy"
         />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content Container */}
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        
         {/* Top: Badge & Like */}
         <div className="flex justify-between items-start transform translate-y-0 transition-transform duration-300">
            {badge ? (
               <span className={`text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md border border-white/10 flex items-center gap-1.5 ${badgeColor || 'bg-black/50'}`}>
                  {badge === "编辑精选" && <Crown className="w-3 h-3 text-yellow-400 fill-current" />}
                  {badge === "时下流行" && <TrendingUp className="w-3 h-3 text-rose-400" />}
                  {badge === "新锐潜力" && <Sparkles className="w-3 h-3 text-blue-400" />}
                  {badge}
               </span>
            ) : <div></div>}

            <button 
               onClick={(e) => onLike?.(artwork.id, e)}
               className={`p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 ${
                  isLiked 
                     ? 'bg-rose-500/90 border-rose-500 text-white shadow-rose-500/30 shadow-lg' 
                     : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
               } group-hover:scale-100 scale-90 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0`}
            >
               <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
         </div>

         {/* Bottom: Info */}
         <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {/* Title & Artist */}
            <div className="mb-3">
               <h3 className={`font-bold text-white leading-tight mb-1 drop-shadow-md ${size === 'large' ? 'text-2xl md:text-3xl' : 'text-lg'}`}>
                  {artwork.title}
               </h3>
               <div className="flex items-center gap-2 text-white/90 text-sm">
                  <img src={artwork.artistAvatar} className="w-5 h-5 rounded-full border border-white/30" alt={artwork.artist} />
                  <span className="font-medium shadow-black drop-shadow-md">{artwork.artist}</span>
               </div>
            </div>
            
            {/* Description (Expand on Large or Hover) */}
            <p className={`text-slate-200 text-xs mb-4 line-clamp-2 transition-all duration-300 leading-relaxed ${size === 'large' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 h-0 group-hover:h-auto'}`}>
               {artwork.description || "探索这位创作者带来的惊艳视觉体验，细节丰富，构图精妙，展现了独特的艺术视角。"}
            </p>

            {/* Stats Bar (Glassmorphism) */}
            <div className="flex items-center gap-4 text-xs font-medium text-white/90 bg-white/10 backdrop-blur-xl rounded-xl p-2.5 border border-white/10 shadow-lg">
               <div className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-300" />
                  {(artwork.views / 1000).toFixed(1)}k
               </div>
               <div className="w-px h-3 bg-white/20"></div>
               <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-300" />
                  {artwork.likes}
               </div>
               <div className="w-px h-3 bg-white/20"></div>
               <div className="flex gap-1.5 overflow-hidden">
                  {artwork.tags.slice(0, 2).map(tag => (
                     <span key={tag} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-white/80 border border-white/5">
                        {tag}
                     </span>
                  ))}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

const DiscoveryView: React.FC<DiscoveryViewProps> = ({ onNavigateToProfile, onTriggerLogin, onNavigate, user }) => {
  // State
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [likedArtworks, setLikedArtworks] = useState<Set<string>>(new Set());
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);
  
  // New state for Card Slider
  const [cardIndex, setCardIndex] = useState(0);

  // Constants
  const CATEGORIES = ['全部', 'UI/UX', '插画', '3D模型', '概念设计', '二次元', '场景', '科幻', '像素画', '国风', '素材'];
  
  // Safe Accessor for Artworks to prevent crashes if MOCK data is limited
  const getSafeArtwork = (index: number): Artwork => {
    const art = MOCK_ARTWORKS[index] || MOCK_ARTWORKS[0];
    if (art) return art;
    
    // Ultimate fallback if MOCK_ARTWORKS is empty
    return {
      id: `fallback_${index}`,
      title: '暂无作品',
      artist: '官方',
      artistAvatar: 'https://ui-avatars.com/api/?name=System',
      imageUrl: 'https://placehold.co/800x600/e2e8f0/64748b?text=No+Image',
      likes: 0,
      views: 0,
      tags: ['示例']
    } as Artwork;
  };

  // Prepare card artworks (Top 5)
  const cardArtworks = MOCK_ARTWORKS.slice(0, 5);
  const activeCardArtwork = cardArtworks[cardIndex] || getSafeArtwork(0);

  // Hero Slides Data
  const HERO_SLIDES = [
    {
      image: getSafeArtwork(0).imageUrl, // Cyberpunk
      title: "连接无限创意",
      subtitle: "汇聚全球 10w+ 顶尖创作者",
      color: "from-blue-400 via-indigo-400 to-purple-400"
    },
    {
      image: getSafeArtwork(5).imageUrl, // Ink
      title: "驱动商业价值",
      subtitle: "为企业打造智能化的创意供应链",
      color: "from-emerald-400 via-teal-400 to-cyan-400"
    },
    {
      image: getSafeArtwork(12).imageUrl, // 3D
      title: "管理数字资产",
      subtitle: "AI 赋能的 DAM 系统，让资产复用更简单",
      color: "from-orange-400 via-rose-400 to-pink-400"
    }
  ];

  // Handlers
  const handleScroll = () => setIsScrolled(window.scrollY > 400);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hero Auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [HERO_SLIDES.length]);

  // Card Auto-play
  useEffect(() => {
    const timer = setInterval(() => {
      setCardIndex((prev) => (prev + 1) % cardArtworks.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, [cardArtworks.length]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await ArtworkService.getArtworksByFilter(activeCategory, searchQuery, 'all');
        setArtworks(data);
      } finally {
        setIsLoading(false);
      }
    };
    const timer = setTimeout(fetchData, 300); // Debounce
    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
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
      // Logic mapping with new Chinese nicknames
      const profileId = artistName === '夜色霓虹' ? 'p_neon' : artistName === '墨染流年' ? 'p_ink' : 'p_artmaster';
      onNavigateToProfile(profileId);
    }
  };

  const handleApply = () => {
    if (!user && onTriggerLogin) {
      onTriggerLogin();
    } else {
      alert("申请已发送！");
      setSelectedProject(null);
    }
  };

  const nextCard = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCardIndex((prev) => (prev + 1) % cardArtworks.length);
  };

  const prevCard = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCardIndex((prev) => (prev - 1 + cardArtworks.length) % cardArtworks.length);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-16">
      
      {selectedArtworkId && (
        <ArtworkDetailModal 
          artworkId={selectedArtworkId}
          onClose={() => setSelectedArtworkId(null)}
          onNavigateToProfile={(artist) => {
             setSelectedArtworkId(null);
             handleArtistClick({ stopPropagation: () => {} } as any, artist);
          }}
          onTriggerLogin={onTriggerLogin}
          currentUser={user}
        />
      )}

      {selectedProject && (
        <ProjectDrawer 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          onApply={handleApply} 
          user={user}
        />
      )}

      {/* 1. Responsive Immersive Hero Section */}
      <div className="relative bg-[#0F172A] overflow-hidden min-h-[640px] lg:h-[800px] flex flex-col justify-center">
        {/* Background Slides with Slow Zoom */}
        {HERO_SLIDES.map((slide, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === heroIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image} 
              alt="" 
              className={`w-full h-full object-cover opacity-40 transition-transform duration-[20s] ease-linear ${idx === heroIndex ? 'scale-110' : 'scale-100'}`}
            />
            {/* Overlay Gradients for Depth */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-[#0F172A]/30 lg:to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent"></div>
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10 pb-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Text Content (Spans 7 cols on desktop) */}
            <div className="lg:col-span-7 space-y-8 lg:space-y-10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-white text-xs md:text-sm font-bold backdrop-blur-md animate-fade-in-up shadow-lg">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </div>
                薪画社 2.0 全新上线
              </div>
              
              {/* Headings */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
                  <span className="block animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    {HERO_SLIDES[heroIndex].title}
                  </span>
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${HERO_SLIDES[heroIndex].color} block mt-2 animate-fade-in-up transition-all duration-1000`} style={{ animationDelay: '200ms' }}>
                    {heroIndex === 0 && "落地商业价值"}
                    {heroIndex === 1 && "释放设计潜能"}
                    {heroIndex === 2 && "加速创意流转"}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed animate-fade-in-up font-light" style={{ animationDelay: '300ms' }}>
                  {HERO_SLIDES[heroIndex].subtitle}。
                  <br className="hidden md:block"/>
                  无论是寻找灵感的独立创作者，还是寻求高效方案的企业主，这里都是最佳起点。
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <button 
                  onClick={() => onNavigate?.('enterprise_showcase')}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2 group w-full sm:w-auto"
                >
                  <Briefcase className="w-5 h-5" />
                  我是企业主
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => onNavigate?.('artworks')}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-bold transition-all backdrop-blur-md flex items-center justify-center gap-2 w-full sm:w-auto hover:-translate-y-1"
                >
                  <Sparkles className="w-5 h-5" />
                  我是创作者
                </button>
              </div>

              {/* Search Bar (Integrated) */}
              <div className="pt-2 max-w-lg animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                 <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative flex items-center bg-slate-800/60 backdrop-blur-xl rounded-2xl border border-white/10 focus-within:border-indigo-500/50 focus-within:bg-slate-800/80 transition-all shadow-lg">
                       <Search className="w-5 h-5 text-slate-400 ml-5" />
                       <input 
                         type="text" 
                         className="w-full bg-transparent border-none outline-none px-4 py-4 text-white placeholder:text-slate-500 text-sm md:text-base"
                         placeholder="搜索灵感、画师或企划 (例如: 赛博朋克)..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                       />
                       <div className="pr-2 hidden sm:block">
                          <span className="text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">⌘K</span>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Right: Floating Card (Desktop Only - Spans 5 cols) */}
            <div className="hidden lg:flex lg:col-span-5 justify-end items-center h-full relative perspective-1000">
               {/* Decorative Background Blobs */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px] animate-pulse"></div>
               
               {/* Main Floating Card */}
               <div className="relative w-[380px] h-[520px] transform transition-transform duration-500 hover:rotate-y-12 hover:rotate-x-12 animate-float">
                  
                  {/* Floating Elements - Behind */}
                  <div className="absolute -top-12 -right-12 p-4 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl animate-bounce" style={{ animationDuration: '3s' }}>
                     <Activity className="w-8 h-8 text-green-400" />
                  </div>

                  {/* Glass Card */}
                  <div className="relative w-full h-full bg-slate-800/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 flex flex-col shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden group">
                     {/* Glossy Reflection */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                     
                     {/* Card Header */}
                     <div className="flex justify-between items-center mb-6 relative z-10">
                        <div className="flex items-center gap-2 bg-black/40 rounded-full px-3 py-1 border border-white/5">
                           <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
                           <span className="text-white text-xs font-bold uppercase tracking-wider">Trending</span>
                        </div>
                        <div className="flex -space-x-2">
                           {[1,2,3].map(i => (
                              <div key={i} className="w-6 h-6 rounded-full bg-slate-600 border border-slate-800"></div>
                           ))}
                        </div>
                     </div>

                     {/* Featured Image Area */}
                     <div className="flex-1 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5" onClick={() => setSelectedArtworkId(activeCardArtwork.id)}>
                        {/* Image Carousel */}
                        {cardArtworks.map((art, idx) => (
                            <div 
                                key={art.id}
                                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                                    idx === cardIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                                }`}
                            >
                                <img 
                                  src={art.imageUrl} 
                                  className="w-full h-full object-cover" 
                                  alt={art.title} 
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            </div>
                        ))}

                        {/* Navigation Controls (Visible on Hover) */}
                        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                            <button 
                                onClick={prevCard} 
                                className="p-1.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white backdrop-blur-md pointer-events-auto transition-all hover:scale-110"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                                onClick={nextCard} 
                                className="p-1.5 rounded-full bg-black/40 text-white/80 hover:bg-black/60 hover:text-white backdrop-blur-md pointer-events-auto transition-all hover:scale-110"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Info Overlay */}
                        <div className="absolute bottom-5 left-5 right-5 z-10">
                            <div className="transform transition-all duration-500 translate-y-0">
                                <h3 className="text-white font-bold text-lg truncate mb-1 drop-shadow-md">{activeCardArtwork.title}</h3>
                                <p className="text-white/70 text-xs flex items-center gap-1.5">
                                    <img src={activeCardArtwork.artistAvatar} className="w-4 h-4 rounded-full border border-white/20" alt=""/>
                                    {activeCardArtwork.artist}
                                </p>
                            </div>
                        </div>

                        {/* Progress Indicators */}
                        <div className="absolute top-4 left-0 right-0 flex justify-center gap-1.5 z-20">
                            {cardArtworks.map((_, idx) => (
                                <div 
                                    key={idx} 
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                        idx === cardIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30'
                                    }`}
                                ></div>
                            ))}
                        </div>
                     </div>

                     {/* Mini Stats Row */}
                     <div className="grid grid-cols-3 gap-3 mt-5 relative z-10">
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                           <Heart className="w-4 h-4 text-rose-400 mx-auto mb-1" />
                           <div className="text-white font-bold text-xs">{activeCardArtwork.likes}</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 text-center border border-white/5 hover:bg-white/10 transition-colors cursor-default">
                           <Eye className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                           <div className="text-white font-bold text-xs">{(activeCardArtwork.views/1000).toFixed(1)}k</div>
                        </div>
                        <button className="bg-indigo-600 rounded-xl p-3 flex items-center justify-center hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                           <ArrowRight className="w-5 h-5 text-white" />
                        </button>
                     </div>
                  </div>

                  {/* Floating Elements - Front */}
                  <div className="absolute -bottom-8 -left-8 bg-white rounded-2xl p-4 shadow-2xl border border-slate-100 flex items-center gap-3 animate-float" style={{ animationDelay: '1s' }}>
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <DollarSign className="w-5 h-5" />
                     </div>
                     <div>
                        <div className="text-xs text-slate-500 font-bold uppercase">最新成交</div>
                        <div className="text-slate-900 font-bold font-mono">¥12,500</div>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        </div>

        {/* Integrated Stats Bar (Glassmorphism) */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-[#0F172A]/80 backdrop-blur-md z-20">
           <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
                 {[
                    { label: '优质原创作品', value: '120k+', icon: Monitor, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                    { label: '认证创作者', value: '8,500+', icon: Crown, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: '累计交易总额', value: '¥50M+', icon: Briefcase, color: 'text-green-400', bg: 'bg-green-500/10' },
                    { label: '资金托管保障', value: '100%', icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10' }
                 ].map((stat, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors">
                       <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                          <stat.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <div className="font-bold text-white text-xl leading-none mb-1 group-hover:text-indigo-300 transition-colors">{stat.value}</div>
                          <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
        {/* SECTION: Featured This Week (Refined) */}
        <section>
           <SectionHeader 
             title="本周精选" 
             subtitle="编辑团队每日甄选，激发你的创作灵感" 
             icon={Sparkles}
             extraInfo={
               <div className="flex items-center gap-2 text-[10px] font-mono bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 animate-pulse">
                 <Clock className="w-3 h-3" /> 下期更新: 2天 14:00:00
               </div>
             }
           />
           {/* Bento Grid Layout - Refined */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:h-[520px]">
              
              {/* Primary Feature (Left, 2/3 width) */}
              <div key={heroIndex} className="md:col-span-2 md:h-full animate-fade-in">
                 <FeaturedItem 
                   artwork={getSafeArtwork(21)} 
                   size="large"
                   badge="编辑精选"
                   badgeColor="bg-gradient-to-r from-yellow-500 to-amber-600 border-yellow-400/30"
                   onClick={setSelectedArtworkId}
                   onLike={toggleLike}
                   isLiked={likedArtworks.has(getSafeArtwork(21).id)}
                 />
              </div>

              {/* Secondary Features (Right column, 2 items stacked) */}
              <div className="flex flex-col gap-6 md:h-full">
                 <div className="flex-1">
                    <FeaturedItem 
                      artwork={getSafeArtwork(5)} // Example: Ink wash
                      badge="时下流行"
                      badgeColor="bg-rose-500/80 border-rose-400/30"
                      onClick={setSelectedArtworkId}
                      onLike={toggleLike}
                      isLiked={likedArtworks.has(getSafeArtwork(5).id)}
                    />
                 </div>
                 <div className="flex-1">
                    <FeaturedItem 
                      artwork={getSafeArtwork(12)} // Example: 3D assets
                      badge="新锐潜力"
                      badgeColor="bg-blue-500/80 border-blue-400/30"
                      onClick={setSelectedArtworkId}
                      onLike={toggleLike}
                      isLiked={likedArtworks.has(getSafeArtwork(12).id)}
                    />
                 </div>
              </div>

           </div>
        </section>

        {/* SECTION: Projects Horizontal Scroll (UPDATED DESIGN & INTERACTION) */}
        <section>
           <SectionHeader 
             title="急需人才的企划" 
             subtitle="优质甲方 · 预算托管 · 极速结算" 
             icon={Briefcase}
             actionText="进入企划大厅"
             onAction={() => onNavigate?.('projects_hub')}
           />
           <div className="relative group/scroll">
              <div className="flex gap-6 overflow-x-auto pb-6 pt-1 no-scrollbar snap-x snap-mandatory px-1">
                 {MOCK_PROJECTS.slice(0, 6).map((project, idx) => (
                    <div 
                      key={project.id} 
                      onClick={() => setSelectedProject(project)}
                      className="min-w-[300px] md:min-w-[340px] h-[320px] bg-white rounded-2xl relative overflow-hidden group cursor-pointer snap-start shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ring-1 ring-slate-100"
                    >
                       {/* Card Cover Image */}
                       <div className="absolute inset-0 bg-slate-200">
                          <img 
                            src={project.coverImage || `https://placehold.co/600x400/e2e8f0/64748b?text=${project.title}`} 
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                       </div>

                       {/* Status Badge (Top Right) */}
                       <div className="absolute top-4 right-4">
                          <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold backdrop-blur-md border border-white/10 flex items-center gap-1 ${
                             project.status === '招募中' 
                               ? 'bg-rose-500/90 text-white shadow-lg shadow-rose-500/20' 
                               : 'bg-black/40 text-white'
                          }`}>
                             {project.status === '招募中' && <Zap className="w-3 h-3 fill-current" />}
                             {project.status}
                          </span>
                       </div>

                       {/* Content Content (Bottom) */}
                       <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="text-[10px] bg-white/20 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                <Building className="w-3 h-3" /> {project.client}
                             </span>
                             {project.category && (
                                <span className="text-[10px] bg-indigo-500/80 backdrop-blur-sm px-2 py-0.5 rounded font-bold">
                                   {project.category}
                                </span>
                             )}
                          </div>
                          
                          <h3 className="font-bold text-lg mb-1 leading-tight group-hover:text-indigo-300 transition-colors line-clamp-2">
                             {project.title}
                          </h3>
                          
                          <p className="text-xs text-slate-300 line-clamp-1 mb-4 opacity-80">
                             {project.description || "暂无详细描述，点击查看详情..."}
                          </p>

                          <div className="flex items-end justify-between border-t border-white/10 pt-3">
                             <div>
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">项目预算</p>
                                <div className="text-xl font-bold font-mono text-emerald-400">¥{project.budget.toLocaleString()}</div>
                             </div>
                             <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">截止日期</p>
                                <div className="text-sm font-bold flex items-center gap-1">
                                   <Clock className="w-3.5 h-3.5 text-slate-300" /> {project.deadline}
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
                 
                 {/* View All Card */}
                 <div 
                   onClick={() => onNavigate?.('projects_hub')}
                   className="min-w-[150px] bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all snap-start group"
                 >
                    <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center shadow-sm mb-3 text-slate-400 group-hover:scale-110 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                       <ChevronRight className="w-7 h-7" />
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-indigo-700">查看全部企划</span>
                 </div>
              </div>
              {/* Fade masks */}
              <div className="absolute top-0 right-0 bottom-6 w-24 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none md:block hidden"></div>
           </div>
        </section>

        {/* SECTION: Main Artwork Feed */}
        <section>
           <div className={`sticky top-16 z-30 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-4'}`}>
              <div className={`bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 p-2 flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${isScrolled ? 'shadow-md' : ''}`}>
                 
                 {/* Categories */}
                 <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto px-2">
                    {CATEGORIES.map(cat => (
                       <FilterTab 
                         key={cat} 
                         label={cat} 
                         active={activeCategory === cat} 
                         onClick={() => setActiveCategory(cat)} 
                       />
                    ))}
                 </div>

                 {/* Tools */}
                 <div className="flex items-center gap-2 px-2 flex-shrink-0">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="筛选设置">
                       <SlidersHorizontal className="w-5 h-5" />
                    </button>
                    <div className="h-4 w-px bg-slate-300 mx-1"></div>
                    <select className="bg-transparent text-sm font-medium text-slate-600 outline-none cursor-pointer hover:text-slate-900">
                       <option>综合推荐</option>
                       <option>最新发布</option>
                       <option>最多点赞</option>
                    </select>
                 </div>
              </div>
           </div>

           {/* Waterfall Grid - Masonry Layout */}
           <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
              {isLoading ? (
                 Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="break-inside-avoid mb-6">
                        <ArtworkCard isLoading={true} aspectRatio="auto" />
                    </div>
                 ))
              ) : (
                 artworks.map((artwork, idx) => (
                    <div key={artwork.id} className="break-inside-avoid mb-6 animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                       <ArtworkCard 
                          artwork={artwork}
                          isLiked={likedArtworks.has(artwork.id)}
                          onLike={toggleLike}
                          onNavigateToProfile={(artist, e) => handleArtistClick(e, artist)}
                          onClick={(art) => setSelectedArtworkId(art.id)}
                          aspectRatio="auto" // Enable dynamic height for masonry
                       />
                    </div>
                 ))
              )}
           </div>

           {/* Load More */}
           <div className="mt-12 text-center">
              <button className="bg-white border border-slate-200 text-slate-600 px-8 py-3 rounded-full font-bold hover:bg-slate-50 hover:shadow-sm transition-all hover:-translate-y-0.5">
                 加载更多精彩
              </button>
           </div>
        </section>

      </div>
    </div>
  );
};

export default DiscoveryView;
