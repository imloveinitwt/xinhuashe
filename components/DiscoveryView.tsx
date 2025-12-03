
import React, { useState } from 'react';
import { Heart, Eye, Filter, Sparkles, Search, BadgeCheck, X, Briefcase, Trophy, Flame } from 'lucide-react';
import { MOCK_ARTWORKS, MOCK_CREATORS, MOCK_EVENTS } from '../constants';

const DiscoveryView: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('全部');

  // Combine original and reversed mock data to simulate a larger grid, ensuring unique keys
  const allArtworks = [
    ...MOCK_ARTWORKS.map(art => ({ ...art, renderKey: art.id })),
    ...[...MOCK_ARTWORKS].reverse().map(art => ({ ...art, renderKey: `dup-${art.id}` }))
  ];

  // Filter logic
  const visibleArtworks = activeFilter === '全部'
    ? allArtworks
    : allArtworks.filter(art => art.tags.includes(activeFilter));

  const categories = ['全部', '插画', '游戏原画', 'UI/UX', '3D模型', '动画'];

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
              <img src={event.coverUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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
          
          {/* Filters & Search */}
          <div className="sticky top-16 z-10 bg-slate-50/95 backdrop-blur-sm py-4 mb-4 border-b border-slate-200">
             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeFilter === cat 
                        ? 'bg-slate-900 text-white' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                 <div className="relative flex-1 md:w-64">
                    <input 
                      type="text" 
                      placeholder="搜索灵感..." 
                      className="w-full pl-9 pr-4 py-2 rounded-full border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                 </div>
                 <button className="p-2 bg-white border border-slate-200 rounded-full hover:bg-slate-50">
                    <Filter className="w-4 h-4 text-slate-600" />
                 </button>
              </div>
            </div>
          </div>

          {/* Masonry Layout */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {visibleArtworks.map((art) => (
              <div key={art.renderKey} className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className="relative">
                  <img 
                    src={art.imageUrl} 
                    alt={art.title} 
                    className="w-full h-auto object-cover"
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
                  <h3 className="font-semibold text-slate-800 text-lg truncate">{art.title}</h3>
                  <div className="flex items-center justify-between mt-3 mb-3">
                    <div className="flex items-center gap-2 max-w-[65%]">
                      <img src={art.artistAvatar} alt={art.artist} className="w-6 h-6 rounded-full flex-shrink-0" />
                      <span className="text-sm text-slate-600 font-medium truncate" title={art.artist}>{art.artist}</span>
                      {art.isVerified && (
                        <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" title="认证创作者" />
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-xs flex-shrink-0">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {(art.views / 1000).toFixed(1)}k
                      </span>
                      <span className="flex items-center gap-1 hover:text-pink-500 cursor-pointer transition-colors">
                        <Heart className="w-3 h-3" />
                        {art.likes}
                      </span>
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
            ))}
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
                   <div key={creator.id} className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative">
                        <img src={creator.avatar} className="w-12 h-12 rounded-full border border-slate-100 group-hover:border-indigo-300 transition-colors" />
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
