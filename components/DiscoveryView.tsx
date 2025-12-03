import React, { useState } from 'react';
import { Heart, Eye, Filter, Sparkles, Search, BadgeCheck, X, Briefcase } from 'lucide-react';
import { MOCK_ARTWORKS } from '../constants';

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
    <div className="min-h-screen bg-slate-50 pt-20 pb-10 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="mb-10 text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
          发现顶尖创意人才
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          汇聚插画、设计与3D资产的顶级社区，连接 50,000+ 创作者。
        </p>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto mt-8 relative">
          <input 
            type="text" 
            placeholder="搜索 '赛博朋克', 'UI设计', '角色原画'..." 
            className="w-full pl-12 pr-4 py-4 rounded-full shadow-lg border-none focus:ring-2 focus:ring-indigo-500 bg-white text-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
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
          {/* Show active filter if it's not in the default categories */}
          {!categories.includes(activeFilter) && (
             <button 
             onClick={() => setActiveFilter('全部')}
             className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors bg-indigo-100 text-indigo-700 flex items-center gap-2"
           >
             #{activeFilter}
             <X className="w-3 h-3" />
           </button>
          )}
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Filter className="w-4 h-4" />
          筛选
        </button>
      </div>

      {/* Masonry Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {visibleArtworks.map((art) => (
          <div key={art.renderKey} className="break-inside-avoid group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300">
            {/* Image */}
            <div className="relative">
              <img 
                src={art.imageUrl} 
                alt={art.title} 
                className="w-full h-auto object-cover"
              />
              {/* Overlay on Hover - Prominent Hire Button */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[1px]">
                 <button className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95">
                    <Briefcase className="w-5 h-5" />
                    雇佣画师
                 </button>
              </div>
              
              {/* AI Tag */}
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

              {/* Tags */}
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

      {visibleArtworks.length === 0 && (
        <div className="text-center py-20">
          <div className="inline-block p-4 rounded-full bg-slate-100 mb-4">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">没有找到相关作品</h3>
          <p className="text-slate-500 mt-2">试试选择其他标签或查看全部作品</p>
          <button 
            onClick={() => setActiveFilter('全部')}
            className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            查看全部
          </button>
        </div>
      )}
    </div>
  );
};

export default DiscoveryView;