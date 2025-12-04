
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Sparkles, TrendingUp, ArrowRight, Zap, 
  Briefcase, Clock, 
  Crown, ChevronRight, SlidersHorizontal, CheckCircle2, Monitor,
  Heart, Eye, User as UserIcon
} from 'lucide-react';
import { MOCK_PROJECTS, MOCK_ARTWORKS } from '../constants';
import { Artwork } from '../types';
import { ArtworkService } from '../services/ArtworkService';
import { useAuth } from '../contexts/AuthContext';
import ArtworkCard from './ArtworkCard';
import ArtworkDetailModal from './ArtworkDetailModal';

interface DiscoveryViewProps {
  // Legacy props kept optional for compatibility, but internal hooks preferred
  onNavigateToProfile?: (profileId: string) => void;
  onTriggerLogin?: () => void;
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
                  {badge === "Editor's Choice" && <Crown className="w-3 h-3 text-yellow-400 fill-current" />}
                  {badge === "Trending" && <TrendingUp className="w-3 h-3 text-rose-400" />}
                  {badge === "New Rising" && <Sparkles className="w-3 h-3 text-blue-400" />}
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

const DiscoveryView: React.FC<DiscoveryViewProps> = ({ onTriggerLogin }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State
  const [activeCategory, setActiveCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  const [likedArtworks, setLikedArtworks] = useState<Set<string>>(new Set());
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  // Constants
  const CATEGORIES = ['全部', 'UI/UX', '插画', '3D模型', '概念设计', '二次元', '场景', '科幻', '像素画', '国风', '素材'];
  
  // Hero Slides Data
  const HERO_SLIDES = [
    {
      image: MOCK_ARTWORKS[0].imageUrl, // Cyberpunk
      title: "连接无限创意",
      subtitle: "汇聚全球 10w+ 顶尖创作者",
      color: "from-blue-600 to-purple-600"
    },
    {
      image: MOCK_ARTWORKS[5].imageUrl, // Ink
      title: "驱动商业价值",
      subtitle: "为企业打造智能化的创意供应链",
      color: "from-emerald-600 to-teal-600"
    },
    {
      image: MOCK_ARTWORKS[12].imageUrl, // 3D
      title: "管理数字资产",
      subtitle: "AI 赋能的 DAM 系统，让资产复用更简单",
      color: "from-orange-600 to-rose-600"
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
  }, []);

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
    // Demo logic mapping
    const profileId = artistName === 'NeonDreamer' ? 'p_neon' : artistName === 'InkFlow' ? 'p_ink' : 'p_artmaster';
    navigate(`/profile/${profileId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-16">
      
      <ArtworkDetailModal 
        artworkId={selectedArtworkId}
        onClose={() => setSelectedArtworkId(null)}
        onNavigateToProfile={(artist) => handleArtistClick({ stopPropagation: () => {} } as any, artist)}
        onTriggerLogin={onTriggerLogin}
        currentUser={user}
      />

      {/* 1. Immersive Hero Section (New Design) */}
      <div className="relative bg-slate-900 overflow-hidden h-[600px] lg:h-[680px]">
        {/* Background Slides */}
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
              className="w-full h-full object-cover opacity-60 scale-105 animate-float" // Slight movement
              style={{ animationDuration: '20s' }}
            />
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-900/20 md:to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
          </div>
        ))}

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-12 h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl space-y-8 pt-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold backdrop-blur-md animate-fade-in-up">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                薪画社 2.0 全新上线
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight">
                  <span className="block animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    {HERO_SLIDES[heroIndex].title}
                  </span>
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${HERO_SLIDES[heroIndex].color} block text-4xl md:text-6xl mt-2 animate-fade-in-up transition-colors duration-1000`} style={{ animationDelay: '200ms' }}>
                    {heroIndex === 0 && "落地商业价值"}
                    {heroIndex === 1 && "释放设计潜能"}
                    {heroIndex === 2 && "加速创意流转"}
                  </span>
                </h1>
                <p className="text-lg text-slate-300 max-w-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                  {HERO_SLIDES[heroIndex].subtitle}。
                  无论是寻找灵感的独立创作者，还是寻求高效方案的企业主，这里都是最佳起点。
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <button 
                  onClick={() => navigate('/enterprise')}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 group"
                >
                  <Briefcase className="w-5 h-5" />
                  我是企业主
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={() => navigate('/artworks')}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl font-bold transition-all backdrop-blur-md flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  我是创作者
                </button>
              </div>

              {/* Search Bar (Integrated) */}
              <div className="pt-4 max-w-md animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                 <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
                    <div className="relative flex items-center bg-slate-800/80 backdrop-blur-md rounded-xl border border-white/10 focus-within:border-indigo-500/50 transition-colors">
                       <Search className="w-5 h-5 text-slate-400 ml-4" />
                       <input 
                         type="text" 
                         className="w-full bg-transparent border-none outline-none px-4 py-3 text-white placeholder:text-slate-500"
                         placeholder="搜索灵感、画师或企划..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                       />
                    </div>
                 </div>
              </div>
            </div>

            {/* Right: Floating Card (Desktop Only) */}
            <div className="hidden lg:flex justify-end items-center h-full relative">
               <div className="relative w-[400px] h-[500px] perspective-1000">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl opacity-20 blur-3xl animate-pulse"></div>
                  
                  {/* Floating Glass Card */}
                  <div className="relative w-full h-full bg-slate-800/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col shadow-2xl animate-float">
                     {/* Card Header */}
                     <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                           <span className="text-white text-xs font-bold uppercase tracking-wider">Trending Now</span>
                        </div>
                        <span className="text-white/50 text-xs">Top Rated</span>
                     </div>

                     {/* Featured Image */}
                     <div className="flex-1 rounded-2xl overflow-hidden relative group mb-4 cursor-pointer" onClick={() => setSelectedArtworkId(MOCK_ARTWORKS[heroIndex].id)}>
                        <img 
                          src={MOCK_ARTWORKS[heroIndex].imageUrl} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          alt="Featured" 
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                        <div className="absolute bottom-4 left-4 right-4">
                           <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
                              <h3 className="text-white font-bold text-sm truncate">{MOCK_ARTWORKS[heroIndex].title}</h3>
                              <p className="text-white/70 text-xs mt-1 flex items-center gap-1">
                                 <UserIcon className="w-3 h-3" /> {MOCK_ARTWORKS[heroIndex].artist}
                              </p>
                           </div>
                        </div>
                     </div>

                     {/* Mini Stats */}
                     <div className="grid grid-cols-3 gap-2">
                        <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                           <div className="text-indigo-400 font-bold text-lg">{MOCK_ARTWORKS[heroIndex].likes}</div>
                           <div className="text-white/40 text-[10px]">Likes</div>
                        </div>
                        <div className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                           <div className="text-pink-400 font-bold text-lg">{(MOCK_ARTWORKS[heroIndex].views / 1000).toFixed(1)}k</div>
                           <div className="text-white/40 text-[10px]">Views</div>
                        </div>
                        <div className="bg-indigo-600 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
                           <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                     </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -right-6 w-20 h-20 bg-yellow-400 rounded-full blur-2xl opacity-20"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
               </div>
            </div>

          </div>
        </div>

        {/* Integrated Stats Bar (Glassmorphism) */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-slate-900/60 backdrop-blur-md z-20">
           <div className="max-w-[1600px] mx-auto px-6 md:px-12 py-6">
              <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 md:gap-12">
                 <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors"><Monitor className="w-5 h-5" /></div>
                    <div>
                       <div className="font-bold text-white text-lg leading-none">120k+</div>
                       <div className="text-xs text-slate-400 font-medium mt-1">优质原创作品</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform">
                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors"><Crown className="w-5 h-5" /></div>
                    <div>
                       <div className="font-bold text-white text-lg leading-none">8,500+</div>
                       <div className="text-xs text-slate-400 font-medium mt-1">认证创作者</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform">
                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors"><Briefcase className="w-5 h-5" /></div>
                    <div>
                       <div className="font-bold text-white text-lg leading-none">¥50M+</div>
                       <div className="text-xs text-slate-400 font-medium mt-1">累计交易总额</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform">
                    <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors"><CheckCircle2 className="w-5 h-5" /></div>
                    <div>
                       <div className="font-bold text-white text-lg leading-none">100%</div>
                       <div className="text-xs text-slate-400 font-medium mt-1">资金托管保障</div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        
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
                   artwork={MOCK_ARTWORKS[21]} // Example: Cyberpunk girl
                   size="large"
                   badge="Editor's Choice"
                   badgeColor="bg-gradient-to-r from-yellow-500 to-amber-600 border-yellow-400/30"
                   onClick={setSelectedArtworkId}
                   onLike={toggleLike}
                   isLiked={likedArtworks.has(MOCK_ARTWORKS[21].id)}
                 />
              </div>

              {/* Secondary Features (Right column, 2 items stacked) */}
              <div className="flex flex-col gap-6 md:h-full">
                 <div className="flex-1">
                    <FeaturedItem 
                      artwork={MOCK_ARTWORKS[5]} // Example: Ink wash
                      badge="Trending"
                      badgeColor="bg-rose-500/80 border-rose-400/30"
                      onClick={setSelectedArtworkId}
                      onLike={toggleLike}
                      isLiked={likedArtworks.has(MOCK_ARTWORKS[5].id)}
                    />
                 </div>
                 <div className="flex-1">
                    <FeaturedItem 
                      artwork={MOCK_ARTWORKS[12]} // Example: 3D assets
                      badge="New Rising"
                      badgeColor="bg-blue-500/80 border-blue-400/30"
                      onClick={setSelectedArtworkId}
                      onLike={toggleLike}
                      isLiked={likedArtworks.has(MOCK_ARTWORKS[12].id)}
                    />
                 </div>
              </div>

           </div>
        </section>

        {/* SECTION: Projects Horizontal Scroll */}
        <section>
           <SectionHeader 
             title="急需人才的企划" 
             subtitle="优质甲方 · 预算托管 · 极速结算" 
             icon={Briefcase}
             actionText="进入企划大厅"
             onAction={() => navigate('/projects')}
           />
           <div className="relative group/scroll">
              <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
                 {MOCK_PROJECTS.slice(0, 6).map((project) => (
                    <div 
                      key={project.id} 
                      className="min-w-[280px] md:min-w-[320px] bg-white rounded-2xl border border-slate-200 p-5 snap-start hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer flex flex-col"
                    >
                       <div className="flex justify-between items-start mb-3">
                          <span className={`text-[10px] px-2 py-1 rounded font-bold ${project.status === '招募中' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
                             {project.status}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                             <Clock className="w-3 h-3" /> {project.deadline}
                          </span>
                       </div>
                       <h3 className="font-bold text-slate-800 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors text-base">{project.title}</h3>
                       <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                          <Briefcase className="w-3 h-3" /> {project.client}
                       </p>
                       
                       <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                          <div className="font-bold text-indigo-600 flex items-center gap-0.5">
                             <span className="text-xs">¥</span>{project.budget.toLocaleString()}
                          </div>
                          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">
                             {project.phase}
                          </span>
                       </div>
                    </div>
                 ))}
                 
                 {/* View All Card */}
                 <div 
                   onClick={() => navigate('/projects')}
                   className="min-w-[150px] bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors snap-start"
                 >
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 text-indigo-600 group-hover:scale-110 transition-transform">
                       <ChevronRight className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-slate-600 group-hover:text-indigo-600">查看全部</span>
                 </div>
              </div>
              {/* Fade masks */}
              <div className="absolute top-0 right-0 bottom-4 w-24 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none md:block hidden"></div>
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

           {/* Waterfall Grid */}
           <div className="mt-6 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {isLoading ? (
                 Array.from({ length: 8 }).map((_, i) => (
                    <ArtworkCard key={i} isLoading={true} className="break-inside-avoid" />
                 ))
              ) : (
                 artworks.map((artwork, idx) => (
                    <div key={artwork.id} className="break-inside-avoid animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
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
