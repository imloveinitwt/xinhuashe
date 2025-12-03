import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, Eye, Sparkles, Search, BadgeCheck, Briefcase, 
  Trophy, Flame, SlidersHorizontal, ArrowUpRight, TrendingUp, Zap, Newspaper, ArrowRight,
  DollarSign, Calendar, UserPlus, Clock, ChevronRight, Palette, ChevronLeft
} from 'lucide-react';
import { MOCK_CREATORS, MOCK_ARTICLES, MOCK_PROJECTS } from '../constants';
import { User, Artwork } from '../types';
import { ArtworkService } from '../services/ArtworkService';
import ArtworkCard from './ArtworkCard';

interface DiscoveryViewProps {
  onNavigateToProfile?: (profileId: string) => void;
  onTriggerLogin?: () => void;
  user?: User | null;
}

type SortOption = 'recommended' | 'likes' | 'views';
type AiFilterOption = 'all' | 'ai_only' | 'human_only';

const TRENDING_TOPICS = [
  { id: 1, title: '赛博朋克 2077', count: '1.2w 关注', image: 'https://image.pollinations.ai/prompt/cyberpunk%20city%20night%20neon%20lights%20futuristic?width=400&height=200&nologo=true', query: '赛博朋克' },
  { id: 2, title: '国风水墨', count: '8.5k 关注', image: 'https://image.pollinations.ai/prompt/chinese%20ink%20painting%20mountains?width=400&height=200&nologo=true', query: '水墨' },
  { id: 3, title: '极简 3D', count: '2.4w 关注', image: 'https://image.pollinations.ai/prompt/minimalist%203d%20shapes%20pastel?width=400&height=200&nologo=true', query: '3D' },
  { id: 4, title: '吉卜力画风', count: '5.6k 关注', image: 'https://image.pollinations.ai/prompt/ghibli%20anime%20style%20grass%20field?width=400&height=200&nologo=true', query: '二次元' },
];

// Mock covers for the featured creators section
const FEATURED_COVERS = [
  'https://image.pollinations.ai/prompt/cyberpunk%20city%20panorama%20neon%20art?width=600&height=300&nologo=true',
  'https://image.pollinations.ai/prompt/fantasy%20epic%20landscape%20digital%20art?width=600&height=300&nologo=true',
  'https://image.pollinations.ai/prompt/modern%20abstract%203d%20geometric%20shapes?width=600&height=300&nologo=true'
];

// Hero Slider Data
const HERO_SLIDES = [
  {
    id: 1,
    image: 'https://image.pollinations.ai/prompt/cyberpunk%20city%20neon%20lights%20futuristic%20night%20panorama?width=1600&height=900&nologo=true',
    title: '赛博朋克：霓虹与钢铁的交响',
    color: 'from-blue-600 to-purple-600'
  },
  {
    id: 2,
    image: 'https://image.pollinations.ai/prompt/fantasy%20floating%20islands%20epic%20clouds%20sunset%20magic?width=1600&height=900&nologo=true',
    title: '奇幻世界：云端之上的史诗',
    color: 'from-amber-500 to-pink-600'
  },
  {
    id: 3,
    image: 'https://image.pollinations.ai/prompt/abstract%203d%20fluid%20shapes%20glass%20colorful%20minimalist?width=1600&height=900&nologo=true',
    title: '数字艺术：极简与流体的美学',
    color: 'from-emerald-500 to-cyan-600'
  }
];

const DiscoveryView: React.FC<DiscoveryViewProps> = ({ onNavigateToProfile, onTriggerLogin, user }) => {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [aiFilter, setAiFilter] = useState<AiFilterOption>('all');
  const [likedArtworks, setLikedArtworks] = useState<Set<string>>(new Set());
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderIntervalRef = useRef<number | null>(null);

  // Async Data State
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['全部', 'UI/UX', '插画', '3D模型', '概念设计', '二次元', '场景', '科幻', '像素画'];
  const trendingTags = ['赛博朋克', '国风', 'Blender', '机甲', '极简主义'];

  // Handle scroll for sticky effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Slider Logic
  useEffect(() => {
    const startSlider = () => {
      sliderIntervalRef.current = window.setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
      }, 5000); // 5 seconds interval
    };

    startSlider();

    return () => {
      if (sliderIntervalRef.current) clearInterval(sliderIntervalRef.current);
    };
  }, []);

  const handleManualSlideChange = (index: number) => {
    setCurrentSlide(index);
    // Reset timer on manual interaction
    if (sliderIntervalRef.current) clearInterval(sliderIntervalRef.current);
    sliderIntervalRef.current = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
  };

  // Fetch Artworks (Simulated Service Call)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await ArtworkService.getArtworksByFilter(activeFilter, searchQuery, aiFilter);
        
        // Client-side sorting (usually done on server)
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

    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [activeFilter, searchQuery, aiFilter, sortOption]);


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
      if (artistName === 'NeonDreamer') onNavigateToProfile('p_neon');
      else if (artistName === 'ArtMaster') onNavigateToProfile('p_artmaster');
      else if (artistName === 'InkFlow') onNavigateToProfile('p_ink');
      else {
        // Default fallback for demo
        onNavigateToProfile('p_artmaster');
      }
    } else {
        if (!user && onTriggerLogin) onTriggerLogin();
    }
  };

  const handleHireClick = (artist: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user && onTriggerLogin) {
      onTriggerLogin();
    } else {
      console.log(`Hire ${artist} clicked`);
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Load+Error';
  };

  // Projects Filter for "Hot Opportunities"
  const activeProjects = MOCK_PROJECTS.filter(p => p.status === '进行中' || p.status === '草稿').slice(0, 4);

  // Select 3 Featured Creators
  const featuredCreators = [MOCK_CREATORS[0], MOCK_CREATORS[1], MOCK_CREATORS[4]];

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* 1. Refactored Hero Section with Background Slider */}
      <div className="relative w-full h-[600px] md:h-[550px] overflow-hidden bg-slate-900">
        
        {/* Background Slider */}
        {HERO_SLIDES.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/90"></div>
          </div>
        ))}

        {/* Content Layer */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 pt-16">
          <div className="animate-fade-in-up max-w-4xl mx-auto">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-300 text-xs font-semibold mb-6 shadow-sm cursor-default">
              <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" />
              连接无限创意 · 驱动商业价值
            </div>
            
            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              全链路创意生态，<br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r ${HERO_SLIDES[currentSlide].color} animate-shimmer bg-[length:200%_auto]`}>
                让灵感快速落地
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-md">
              整合米画师交易模式与特赞企业级DAM服务。
              <br className="hidden md:block"/>
              无论是寻找顶级画师，还是管理企业创意资产，这里都是您的最佳起点。
            </p>
            
            {/* Search Bar (Glassmorphism) */}
            <div className="relative max-w-2xl mx-auto group z-20 mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 group-focus-within:opacity-80"></div>
              <div className="relative bg-white/10 backdrop-blur-md rounded-2xl shadow-xl flex items-center p-2 border border-white/20 group-focus-within:bg-white/90 group-focus-within:ring-2 group-focus-within:ring-indigo-300 transition-all">
                <div className="pl-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <Search className="w-6 h-6" />
                </div>
                <input 
                  type="text" 
                  placeholder="搜索 '赛博朋克' 或 'UI设计'..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-3 outline-none text-lg text-white placeholder-slate-300 bg-transparent group-focus-within:text-slate-800 group-focus-within:placeholder-slate-400"
                />
                <button className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all active:scale-95 btn-press shadow-lg">
                  搜索
                </button>
              </div>
            </div>

            {/* Guest CTA Buttons */}
            {!user && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in stagger-1">
                 <button 
                   onClick={onTriggerLogin}
                   className="px-8 py-3 bg-white hover:bg-indigo-50 text-slate-900 rounded-full font-bold shadow-lg transition-all transform hover:-translate-y-1 btn-press flex items-center gap-2"
                 >
                   <Briefcase className="w-4 h-4 text-indigo-600" /> 我是企业主，发布需求
                 </button>
                 <button 
                   onClick={onTriggerLogin}
                   className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 rounded-full font-bold shadow-sm transition-all transform hover:-translate-y-1 btn-press flex items-center gap-2"
                 >
                   <Sparkles className="w-4 h-4 text-pink-400" /> 我是创作者，入驻接单
                 </button>
              </div>
            )}

            {/* Trending Tags (Light mode for dark background) */}
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-300 stagger-2 opacity-0 animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 热门搜索:</span>
              {trendingTags.map(tag => (
                <button 
                  key={tag} 
                  onClick={() => { setSearchQuery(tag); }}
                  className="hover:text-white hover:bg-white/20 px-2 py-0.5 rounded-md transition-all border border-transparent hover:border-white/20"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center items-center gap-3">
           {HERO_SLIDES.map((_, index) => (
             <button
               key={index}
               onClick={() => handleManualSlideChange(index)}
               className={`h-1.5 rounded-full transition-all duration-300 ${
                 index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
               }`}
               aria-label={`Go to slide ${index + 1}`}
             />
           ))}
        </div>
      </div>

      {/* 1.5 Trending Topics Section */}
      <div className="bg-white border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
             <div className="bg-orange-100 p-1.5 rounded-lg">
               <Flame className="w-4 h-4 text-orange-600" />
             </div>
             <h3 className="font-bold text-slate-800 text-base">正在热议</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TRENDING_TOPICS.map(topic => (
              <div 
                key={topic.id}
                onClick={() => setSearchQuery(topic.query)}
                className="group relative h-28 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <img src={topic.image} alt={topic.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={handleImageError} />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-5">
                  <h4 className="text-white font-bold text-base mb-1 group-hover:text-indigo-300 transition-colors">{topic.title}</h4>
                  <span className="text-white/70 text-xs font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {topic.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Sticky Filter Bar (Enhanced with Glassmorphism) */}
      <div className={`sticky top-16 z-20 transition-all duration-300 ${isScrolled ? 'glass shadow-md py-2' : 'bg-white/90 backdrop-blur-sm border-b border-slate-200 py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-right flex-1 py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 btn-press ${
                  activeFilter === cat 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                    : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative flex-shrink-0">
             <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors btn-press ${
                  isFilterOpen 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">筛选 & 排序</span>
                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-xs ml-1">
                  {isLoading ? '...' : artworks.length}
                </span>
             </button>

             {isFilterOpen && (
                <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 animate-scale-in origin-top-right z-30">
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">排序方式</h4>
                      <div className="space-y-1">
                        {[
                          { id: 'recommended', label: '综合推荐', icon: Zap },
                          { id: 'likes', label: '最多喜爱', icon: Heart },
                          { id: 'views', label: '最多浏览', icon: Eye }
                        ].map(opt => (
                          <button 
                            key={opt.id}
                            onClick={() => setSortOption(opt.id as any)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                              sortOption === opt.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'hover:bg-slate-50 text-slate-600'
                            }`}
                          >
                             <div className="flex items-center gap-2">
                               <opt.icon className="w-4 h-4" />
                               {opt.label}
                             </div>
                             {sortOption === opt.id && <div className="w-2 h-2 rounded-full bg-indigo-600"></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">内容来源</h4>
                      <div className="grid grid-cols-3 gap-2">
                         <button onClick={() => setAiFilter('all')} className={`py-2 text-xs rounded-lg border transition-colors ${aiFilter === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>全部</button>
                         <button onClick={() => setAiFilter('human_only')} className={`py-2 text-xs rounded-lg border transition-colors ${aiFilter === 'human_only' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>纯手绘</button>
                         <button onClick={() => setAiFilter('ai_only')} className={`py-2 text-xs rounded-lg border transition-colors ${aiFilter === 'ai_only' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>AI</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Feed Column */}
          <div className="flex-1 min-w-0 space-y-10">
             
             {/* MODULE: Hot Opportunities (Projects) */}
             <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
               <div className="flex items-center justify-between mb-4">
                 <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-600" /> 
                      急需人才的企划
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">优质甲方 · 预算托管 · 极速结算</p>
                 </div>
                 <button className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all">
                   查看全部 <ArrowRight className="w-4 h-4" />
                 </button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {activeProjects.map(project => (
                   <div key={project.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group card-hover">
                      <div className="flex gap-4">
                         <img 
                           src={project.coverImage || "https://placehold.co/100x100?text=Project"} 
                           className="w-20 h-20 rounded-lg object-cover bg-slate-100 group-hover:scale-105 transition-transform" 
                           onError={handleImageError}
                           alt={project.title}
                         />
                         <div className="flex-1 min-w-0">
                           <h3 className="font-bold text-slate-800 text-sm mb-1 truncate group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                           <p className="text-xs text-slate-500 mb-2 truncate">{project.client} • {project.phase}</p>
                           <div className="flex items-center gap-3 text-xs font-medium">
                              <span className="text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                                <DollarSign className="w-3 h-3" /> ¥{project.budget.toLocaleString()}
                              </span>
                              <span className="text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {project.deadline}
                              </span>
                           </div>
                         </div>
                      </div>
                   </div>
                 ))}
               </div>
             </section>

             {/* MODULE: Creator Spotlight (Mobile Only - Fallback) */}
             <section className="lg:hidden space-y-6">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-pink-500" />
                      创作者推荐
                   </h2>
                </div>
                {/* Horizontal Scroll for Mobile */}
                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar">
                   {featuredCreators.map((creator, idx) => (
                      <div 
                         key={creator.id}
                         onClick={(e) => handleArtistClick(e, creator.name)} 
                         className="flex-shrink-0 w-64 bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm"
                      >
                         <div className="h-20 bg-slate-100 relative">
                            <img src={FEATURED_COVERS[idx]} className="w-full h-full object-cover" onError={handleImageError} alt="" />
                         </div>
                         <div className="px-4 pb-4 pt-8 relative mt-[-20px] text-center">
                            <img src={creator.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm mx-auto mb-2 relative z-10" onError={handleImageError} alt="" />
                            <h3 className="font-bold text-slate-800">{creator.name}</h3>
                            <button className="mt-2 w-full py-1.5 bg-slate-900 text-white text-xs rounded-lg">关注</button>
                         </div>
                      </div>
                   ))}
                </div>
             </section>

             {/* MODULE: Community News */}
             <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-purple-500" />
                    前沿资讯
                  </h2>
                  <button className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1">
                    浏览专栏 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {MOCK_ARTICLES.map((article) => (
                    <div key={article.id} className="group cursor-pointer bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all card-hover">
                      <div className="h-32 overflow-hidden relative">
                        <img
                          src={article.coverImage}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={handleImageError}
                          alt={article.title}
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                      </div>
                      <div className="p-3">
                        <h4 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {article.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
             </section>

             {/* Artwork Grid Section */}
             <section>
               <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-bold text-slate-900">推荐作品</h2>
                 {activeFilter !== '全部' && (
                   <button onClick={() => setActiveFilter('全部')} className="text-sm text-indigo-600 font-medium hover:underline">
                     清除筛选
                   </button>
                 )}
               </div>

               <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {isLoading ? (
                    // Render Skeletons
                    Array.from({ length: 6 }).map((_, i) => (
                      <ArtworkCard key={i} isLoading={true} style={{ animationDelay: `${i * 100}ms` }} />
                    ))
                  ) : (
                    // Render Artworks with Staggered Fade In
                    artworks.map((artwork, idx) => (
                      <div key={artwork.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                         <ArtworkCard 
                          artwork={artwork}
                          isLiked={likedArtworks.has(artwork.id)}
                          onLike={toggleLike}
                          onHire={handleHireClick}
                          onNavigateToProfile={(artist, e) => handleArtistClick(e, artist)}
                        />
                      </div>
                    ))
                  )}
               </div>
             </section>

          </div>

          {/* Right Sidebar (Sticky) */}
          <div className="hidden lg:block w-80 flex-shrink-0 space-y-6">
            <div className="sticky top-32 space-y-6">
              
              {/* Events Banner */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden group cursor-pointer">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500"></div>
                <h3 className="font-bold text-lg mb-2 relative z-10">2023 全球机甲设计大赛</h3>
                <p className="text-xs text-indigo-200 mb-4 relative z-10">总奖池 ¥100,000 | 网易游戏官方合作</p>
                <div className="flex items-center justify-between relative z-10">
                   <span className="text-xs bg-white/20 px-2 py-1 rounded">剩 12 天</span>
                   <button className="text-xs bg-white text-slate-900 px-3 py-1.5 rounded-full font-bold hover:bg-indigo-50 transition-colors flex items-center gap-1 btn-press">
                     立即参赛 <ArrowUpRight className="w-3 h-3" />
                   </button>
                </div>
              </div>

              {/* MODULE: Creator Spotlight (Sidebar Version) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-pink-500" />
                      本周主推
                   </h3>
                </div>
                <div className="p-4 space-y-4">
                   {featuredCreators.map((creator, idx) => (
                      <div 
                         key={creator.id}
                         onClick={(e) => handleArtistClick(e, creator.name)} 
                         className="group relative bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-md transition-all cursor-pointer"
                      >
                         <div className="h-16 bg-slate-100 relative overflow-hidden">
                            <img 
                              src={FEATURED_COVERS[idx]} 
                              alt="Cover" 
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                              onError={handleImageError}
                            />
                         </div>
                         <div className="px-3 pb-3 pt-6 relative mt-[-20px] flex flex-col items-center">
                            <img 
                               src={creator.avatar} 
                               alt={creator.name} 
                               className="w-10 h-10 rounded-full border-2 border-white shadow-sm mb-1 object-cover relative z-10"
                               onError={handleImageError}
                            />
                            <div className="text-center w-full">
                               <h3 className="font-bold text-slate-800 text-sm flex items-center justify-center gap-1">
                                  {creator.name}
                                  {creator.isVerified && <BadgeCheck className="w-3 h-3 text-blue-500" />}
                               </h3>
                               <p className="text-[10px] text-slate-500 truncate mb-2">{creator.tags.join(' • ')}</p>
                               <button className="w-full py-1.5 bg-slate-900 text-white text-xs rounded-lg hover:bg-pink-600 transition-colors">
                                 关注
                               </button>
                            </div>
                         </div>
                      </div>
                   ))}
                </div>
              </div>

              {/* MODULE: Rising Stars (Sidebar Version) */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                 <div className="flex items-center gap-2 mb-4">
                    <div className="p-1 bg-amber-100 rounded text-amber-600">
                       <Zap className="w-3 h-3 fill-current" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">新锐榜单</h3>
                 </div>
                 <div className="space-y-3">
                   {MOCK_CREATORS.slice(2).map((creator, i) => (
                      <div 
                        key={creator.id} 
                        className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                        onClick={(e) => handleArtistClick(e, creator.name)}
                      >
                        <div className="relative">
                          <img src={creator.avatar} alt={creator.name} className="w-9 h-9 rounded-full bg-slate-200 object-cover" onError={handleImageError} />
                          <div className="absolute -top-1 -left-1 w-4 h-4 bg-slate-900 text-white text-[9px] rounded-full flex items-center justify-center font-bold shadow-sm">
                            {i + 4}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                           <h4 className="font-bold text-sm text-slate-800 truncate group-hover:text-indigo-600">{creator.name}</h4>
                           <p className="text-[10px] text-slate-400 truncate">{creator.tags[0]}</p>
                        </div>
                        <button className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-600 hover:text-white transition-colors">
                           关注
                        </button>
                      </div>
                   ))}
                 </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DiscoveryView;
