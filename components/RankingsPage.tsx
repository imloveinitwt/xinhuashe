
import React, { useState } from 'react';
import { ArrowLeft, Trophy, Flame, ChevronUp, ChevronDown, Minus, Crown } from 'lucide-react';
import { MOCK_CREATORS } from '../constants';
import { User } from '../types';

interface RankingsPageProps {
  onBack: () => void;
  onNavigateToProfile?: (profileId: string) => void;
  onTriggerLogin?: () => void;
  user?: User | null;
}

const RankingsPage: React.FC<RankingsPageProps> = ({ onBack, onNavigateToProfile }) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  // Mock Ranking Data Generation
  const rankedCreators = [...MOCK_CREATORS]
    .map(c => ({
      ...c,
      score: Math.floor(c.followers / 100) + Math.floor(Math.random() * 500),
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
    }))
    .sort((a, b) => b.score - a.score);

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ChevronUp className="w-4 h-4 text-red-500" />;
    if (trend === 'down') return <ChevronDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-slate-300" />;
  };

  const handleRowClick = (creatorName: string) => {
    if (onNavigateToProfile) {
        // Map localized names to IDs
        const profileId = creatorName === '夜色霓虹' ? 'p_neon' : creatorName === '墨染流年' ? 'p_ink' : 'p_artmaster';
        onNavigateToProfile(profileId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* 1. Immersive Dark Hero */}
      <div className="relative bg-[#0B0F19] text-white pt-24 pb-32 overflow-hidden">
         {/* Background Effects */}
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-600/20 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none"></div>

         <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors text-sm font-medium group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 返回社区
            </button>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div>
                  <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 flex items-center gap-4">
                    <Trophy className="w-12 h-12 text-yellow-400 fill-current" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-amber-200">
                       热门榜单
                    </span>
                  </h1>
                  <p className="text-slate-400 text-lg max-w-xl leading-relaxed">
                    实时更新的创作者影响力指数。发现社区最活跃、最具潜力的设计新星。
                  </p>
               </div>

               {/* Time Range Toggle */}
               <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl border border-white/10 flex">
                  {[
                     { id: 'day', label: '日榜' },
                     { id: 'week', label: '周榜' },
                     { id: 'month', label: '月榜' }
                  ].map(item => (
                     <button
                        key={item.id}
                        onClick={() => setTimeRange(item.id as any)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                           timeRange === item.id 
                              ? 'bg-white text-slate-900 shadow-lg' 
                              : 'text-slate-400 hover:text-white'
                        }`}
                     >
                        {item.label}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-20">
        
        {/* Podium (Top 3) - Floating Card Style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
           {/* 2nd Place */}
           <div className="order-2 md:order-1 flex flex-col items-center">
              <div 
                onClick={() => handleRowClick(rankedCreators[1].name)}
                className="bg-white/95 backdrop-blur rounded-2xl p-6 w-full shadow-xl border border-white/20 flex flex-col items-center relative hover:-translate-y-2 transition-transform cursor-pointer group"
              >
                 <div className="absolute -top-5 w-10 h-10 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-xl shadow-lg border-4 border-[#0B0F19]">2</div>
                 <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-br from-slate-300 to-slate-500 mb-4">
                    <img src={rankedCreators[1].avatar} className="w-full h-full rounded-full border-2 border-white object-cover" alt="" />
                 </div>
                 <h3 className="font-bold text-slate-900 text-lg text-center truncate w-full group-hover:text-indigo-600 transition-colors">{rankedCreators[1].name}</h3>
                 <p className="text-xs text-slate-500 mb-3">{rankedCreators[1].tags[0]}</p>
                 <div className="text-sm font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {rankedCreators[1].score}
                 </div>
              </div>
           </div>

           {/* 1st Place */}
           <div className="order-1 md:order-2 flex flex-col items-center mb-0 md:mb-8">
              <Crown className="w-12 h-12 text-yellow-400 fill-current mb-2 animate-bounce drop-shadow-lg" />
              <div 
                onClick={() => handleRowClick(rankedCreators[0].name)}
                className="bg-gradient-to-b from-yellow-50 to-white rounded-2xl p-8 w-full shadow-2xl border border-yellow-200 flex flex-col items-center relative hover:-translate-y-2 transition-transform cursor-pointer group transform scale-105"
              >
                 <div className="absolute -top-6 w-12 h-12 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center font-bold text-2xl shadow-lg border-4 border-[#0B0F19]">1</div>
                 <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-br from-yellow-300 to-amber-500 mb-4">
                    <img src={rankedCreators[0].avatar} className="w-full h-full rounded-full border-4 border-white object-cover shadow-sm" alt="" />
                 </div>
                 <h3 className="font-bold text-slate-900 text-xl text-center truncate w-full group-hover:text-yellow-600 transition-colors">{rankedCreators[0].name}</h3>
                 <p className="text-xs text-slate-500 mb-3">{rankedCreators[0].tags[0]}</p>
                 <div className="text-sm font-bold text-red-600 bg-red-50 px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Flame className="w-4 h-4 fill-current" /> {rankedCreators[0].score}
                 </div>
              </div>
           </div>

           {/* 3rd Place */}
           <div className="order-3 md:order-3 flex flex-col items-center">
              <div 
                onClick={() => handleRowClick(rankedCreators[2].name)}
                className="bg-white/95 backdrop-blur rounded-2xl p-6 w-full shadow-xl border border-white/20 flex flex-col items-center relative hover:-translate-y-2 transition-transform cursor-pointer group"
              >
                 <div className="absolute -top-5 w-10 h-10 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-bold text-xl shadow-lg border-4 border-[#0B0F19]">3</div>
                 <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-br from-amber-600 to-amber-800 mb-4">
                    <img src={rankedCreators[2].avatar} className="w-full h-full rounded-full border-2 border-white object-cover" alt="" />
                 </div>
                 <h3 className="font-bold text-slate-900 text-lg text-center truncate w-full group-hover:text-indigo-600 transition-colors">{rankedCreators[2].name}</h3>
                 <p className="text-xs text-slate-500 mb-3">{rankedCreators[2].tags[0]}</p>
                 <div className="text-sm font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> {rankedCreators[2].score}
                 </div>
              </div>
           </div>
        </div>

        {/* Ranking List (4-10) */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-medium">
                 <tr>
                    <th className="px-6 py-5 w-24 text-center">排名</th>
                    <th className="px-6 py-5">创作者</th>
                    <th className="px-6 py-5 text-center">趋势</th>
                    <th className="px-6 py-5">热度指数</th>
                    <th className="px-6 py-5 text-right">操作</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {rankedCreators.slice(3).map((creator, index) => (
                    <tr 
                      key={creator.id} 
                      className="hover:bg-slate-50 cursor-pointer group transition-colors"
                      onClick={() => handleRowClick(creator.name)}
                    >
                       <td className="px-6 py-5 text-center">
                          <span className="font-bold text-slate-400 font-mono text-lg">{index + 4}</span>
                       </td>
                       <td className="px-6 py-5 flex items-center gap-4">
                          <img src={creator.avatar} className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200" alt="" />
                          <div>
                             <div className="font-bold text-slate-800 text-base group-hover:text-indigo-600 transition-colors">{creator.name}</div>
                             <div className="text-xs text-slate-400 mt-0.5">{creator.tags.slice(0,2).join(' / ')}</div>
                          </div>
                       </td>
                       <td className="px-6 py-5 text-center">
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                             {getTrendIcon(creator.trend || 'stable')}
                          </div>
                       </td>
                       <td className="px-6 py-5">
                          <div className="font-mono font-bold text-slate-700 flex items-center gap-2">
                             <Flame className="w-4 h-4 text-slate-300" />
                             {creator.score.toLocaleString()}
                          </div>
                       </td>
                       <td className="px-6 py-5 text-right">
                          <button 
                             onClick={(e) => { e.stopPropagation(); alert('已关注'); }}
                             className="text-xs border border-slate-200 text-slate-600 px-4 py-2 rounded-full hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all font-bold"
                          >
                             关注
                          </button>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

      </div>
    </div>
  );
};

export default RankingsPage;
