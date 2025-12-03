
import React, { useState, useEffect } from 'react';
import { 
  Heart, Eye, Sparkles, Search, BadgeCheck, Briefcase, 
  Trophy, Flame, SlidersHorizontal, ArrowUpRight, TrendingUp, Zap, Newspaper, ArrowRight,
  DollarSign, Calendar, UserPlus, Clock
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
  { id: 1, title: '赛博朋克 2077', count: '1.2w 关注', image: 'https://image.pollinations.ai/prompt/cyberpunk%20city%20neon%20night?width=400&height=200&nologo=true', query: '赛博朋克' },
  { id: 2, title: '国风水墨', count: '8.5k 关注', image: 'https://image.pollinations.ai/prompt/chinese%20ink%20painting%20mountains?width=400&height=200&nologo=true', query: '水墨' },
  { id: 3, title: '极简 3D', count: '2.4w 关注', image: 'https://image.pollinations.ai/prompt/minimalist%203d%20shapes%20pastel?width=400&height=200&nologo=true', query: '3D' },
  { id: 4, title: '吉卜力画风', count: '5.6k 关注', image: 'https://image.pollinations.ai/prompt/ghibli%20anime%20style%20grass%20field?width=400&height=200&nologo=true', query: '二次元' },
];

const DiscoveryView: React.FC<DiscoveryViewProps> = ({ onNavigateToProfile, onTriggerLogin, user }) => {
  const [activeFilter, setActiveFilter] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [aiFilter, setAiFilter] = useState<AiFilterOption>('all');
  const [likedArtworks, setLikedArtworks] = useState<Set<string>>(new Set());
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Async Data State
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['全部', 'UI/UX', '插画', '3D模型', '概念设计', '二次元', '场景', '科幻', '像素画'];
  const trendingTags = ['赛博朋克', '国风', 'Blender', '机甲', '极简主义'];

  // Handle scroll for sticky effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        console.log('Navigate to generic profile');
      }
    } else {
        // Fallback or guest behavior
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

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* 1. Hero Section */}
      <div className="relative pt-32 pb-16 px-6 overflow-hidden bg-white border-b border-slate-100">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.4] pointer-events-none"></div>
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-60 animate-float"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-pink-50 rounded-full blur-3xl opacity-60 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold mb-6">
            <Sparkles className="w-3 h-3" />
            连接无限创意 · 驱动商业价值
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
            全链路创意生态，<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">
              让灵感快速落地
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            整合米画师交易模式与特赞企业级DAM服务。
            <br className="hidden md:block"/>
            无论是寻找顶级画师，还是管理企业创意资产，这里都是您的最佳起点。
          </p>
          
          {/* Main Search Bar */}
          <div className="relative max-w-2xl mx-auto group z-20 mb-8">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative bg-white rounded-2xl shadow-xl flex items-center p-2 border border-slate-100">
              <div className="pl-4 text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                placeholder="搜索 '赛博朋克' 或 'UI设计'..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 outline-none text-lg text-slate-700 placeholder-slate-400 bg-transparent"
              />
              <button className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                搜索
              </button>
            </div>
          </div>

          {/* Guest CTA Buttons */}
          {!user && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
               <button 
                 onClick={onTriggerLogin}
                 className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-1 flex items-center gap-2"
               >
                 <Briefcase className="w-4 h-4" /> 我是企业主，发布需求
               </button>
               <button 
                 onClick={onTriggerLogin}
                 className="px-8 py-3 bg-white text-slate-700 border border-slate-200 hover:border-pink-300 hover:text-pink-600 rounded-full font-bold shadow-sm transition-all transform hover:-translate-y-1 flex items-center gap-2"
               >
                 <Sparkles className="w-4 h-4" /> 我是创作者，入驻接单
               </button>
            </div>
          )}

          {/* Trending Tags */}
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> 热门搜索:</span>
            {trendingTags.map(tag => (
              <button 
                key={tag} 
                onClick={() => { setSearchQuery(tag); }}
                className="hover:text-indigo-600 hover:underline decoration-indigo-600/30 underline-offset-4 transition-all"
              >
                #{tag}
              </button>
            ))}
          </div>
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

      {/* 2. Sticky Filter Bar */}
      <div className={`sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar mask-gradient-right flex-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                  activeFilter === cat 
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20' 
                    : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative flex-shrink-0">
             <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  isFilterOpen 
                    ? 'bg-indigo-50 text-indigo-600 border-indigo-200' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">筛选 & 排序</span>
                <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-xs ml-1">
                  {isLoading ? '...' : artworks.length}
                </span>
             </button>

             {isFilterOpen && (
                <div className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 animate-scale-in origin-top-right">
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">排序方式</h4>
                      <div className="space-y-2">
                        {[
                          { id: 'recommended', label: '综合推荐', icon: Zap },
                          { id: 'likes', label: '最多喜爱', icon: Heart },
                          { id: 'views', label: '最多浏览', icon: Eye }
                        ].map(opt => (
                          <button 
                            key={opt.id}
                            onClick={() => setSortOption(opt.id as any)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                              sortOption === opt.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'
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
                         <button onClick={() => setAiFilter('all')} className={`py-2 text-xs rounded-lg border ${aiFilter === 'all' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600'}`}>全部</button>
                         <button onClick={() => setAiFilter('human_only')} className={`py-2 text-xs rounded-lg border ${aiFilter === 'human_only' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600'}`}>纯手绘</button>
                         <button onClick={() => setAiFilter('ai_only')} className={`py-2 text-xs rounded-lg border ${aiFilter === 'ai_only' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-200 text-slate-600'}`}>AI</button>
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
             <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
               <div className="flex items-center justify-between mb-4">
                 <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-indigo-600" /> 
                      急需人才的企划
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">优质甲方 · 预算托管 · 极速结算</p>
                 </div>
                 <button className="text-sm text-indigo-600 font-medium hover:underline flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm">
                   查看全部 <ArrowRight className="w-4 h-4" />
                 </button>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {activeProjects.map(project => (
                   <div key={project.id} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                      <div className="flex gap-4">
                         <img 
                           src={project.coverImage || "https://placehold.co/100x100?text=Project"} 
                           className="w-20 h-20 rounded-lg object-cover bg-slate-100 group-hover:scale-105 transition-transform" 
                           onError={handleImageError}
                           alt={project.title}
                         />
                         <div className="flex-1 min-w-0">
                           <h3 className="font-bold text-slate-800 text-sm mb-1 truncate group-hover:text-indigo-600">{project.title}</h3>
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

             {/* MODULE: Rising Talents */}
             <section>
               <div className="flex items-center justify-between mb-4">
                 <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                   <Sparkles className="w-5 h-5 text-pink-500" /> 
                   新锐创作者
                 </h2>
                 <span className="text-xs text-slate-400">过去 24 小时关注度飙升</span>
               </div>
               <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
                  {MOCK_CREATORS.slice(0, 5).map(creator => (
                    <div key={creator.id} className="flex-shrink-0 w-44 bg-white rounded-xl border border-slate-100 p-4 text-center hover:border-pink-200 hover:shadow-md transition-all cursor-pointer group" onClick={(e) => handleArtistClick(e, creator.name)}>
                       <div className="relative inline-block mb-3">
                         <img src={creator.avatar} className="w-16 h-16 rounded-full mx-auto border-2 border-white shadow-sm" onError={handleImageError} alt={creator.name} />
                         {creator.isVerified && <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5"><BadgeCheck className="w-4 h-4 text-blue-500" /></div>}
                       </div>
                       <h3 className="font-bold text-slate-800 text-sm truncate">{creator.name}</h3>
                       <p className="text-xs text-slate-400 mb-3">{creator.tags[0]}</p>
                       <button className="w-full py-1.5 text-xs font-medium border border-slate-200 rounded-lg text-slate-600 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-colors flex items-center justify-center gap-1">
                         <UserPlus className="w-3 h-3" /> 关注
                       </button>
                    </div>
                  ))}
               </div>
             </section>

             {/* MODULE: Community News (Latest Insights) */}
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
                    <div key={article.id} className="group cursor-pointer bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <div className="h-32 overflow-hidden relative">
                        <img
                          src={article.coverImage}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                    // Render Artworks
                    artworks.map((artwork, idx) => (
                      <ArtworkCard 
                        key={artwork.id}
                        artwork={artwork}
                        isLiked={likedArtworks.has(artwork.id)}
                        onLike={toggleLike}
                        onHire={handleHireClick}
                        onNavigateToProfile={(artist, e) => handleArtistClick(e, artist)}
                        style={{ animationDelay: `${idx * 50}ms` }}
                      />
                    ))
                  )}
               </div>
             </section>

          </div>

          {/* Right Sidebar (Sticky) */}
          <div className="hidden lg:block w-80 flex-shrink-0 space-y-8">
            <div className="sticky top-32 space-y-8">
              
              {/* Featured Artist of the Week */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-500 relative">
                   <div className="absolute top-2 right-2 bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold">
                     本周推荐
                   </div>
                </div>
                <div className="px-6 pb-6 text-center -mt-10">
                   <img 
                     src={MOCK_CREATORS[0].avatar} 
                     alt="Featured" 
                     className="w-20 h-20 rounded-full border-4 border-white shadow-md mx-auto mb-3"
                     onError={handleImageError}
                   />
                   <h3 className="font-bold text-slate-800 text-lg flex items-center justify-center gap-1">
                     {MOCK_CREATORS[0].name}
                     <BadgeCheck className="w-4 h-4 text-blue-500" />
                   </h3>
                   <p className="text-xs text-slate-500 mb-4">{MOCK_CREATORS[0].tags.join(' • ')}</p>
                   <button className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                     查看作品集
                   </button>
                </div>
              </div>

              {/* Events Banner */}
              <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-5 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
                <h3 className="font-bold text-lg mb-2 relative z-10">2023 全球机甲设计大赛</h3>
                <p className="text-xs text-indigo-200 mb-4 relative z-10">总奖池 ¥100,000 | 网易游戏官方合作</p>
                <div className="flex items-center justify-between relative z-10">
                   <span className="text-xs bg-white/20 px-2 py-1 rounded">剩 12 天</span>
                   <button className="text-xs bg-white text-slate-900 px-3 py-1.5 rounded-full font-bold hover:bg-indigo-50 transition-colors flex items-center gap-1">
                     立即参赛 <ArrowUpRight className="w-3 h-3" />
                   </button>
                </div>
              </div>

              {/* Top Creators List */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" /> 
                    影响力榜单
                  </h3>
                  <button className="text-xs text-indigo-600 hover:underline">查看全部</button>
                </div>
                <div className="space-y-4">
                  {MOCK_CREATORS.slice(0, 5).map((creator, index) => (
                    <div 
                      key={creator.id} 
                      className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group"
                      onClick={(e) => handleArtistClick(e, creator.name)}
                    >
                      <div className="relative font-bold text-slate-300 w-4 text-center">
                        {index + 1}
                      </div>
                      <img src={creator.avatar} alt={creator.name} className="w-10 h-10 rounded-full border border-slate-100 object-cover" onError={handleImageError} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <h4 className="text-sm font-bold text-slate-700 truncate group-hover:text-indigo-600">{creator.name}</h4>
                          {creator.isVerified && <BadgeCheck className="w-3 h-3 text-blue-500" />}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{creator.tags.join(' ')}</p>
                      </div>
                      <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                        {(creator.followers / 1000).toFixed(1)}k
                      </div>
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
