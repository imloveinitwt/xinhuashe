
import React, { useState } from 'react';
import { ArrowLeft, Trophy, Flame, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { MOCK_CREATORS, MOCK_ARTWORKS } from '../constants';
import { User } from '../types';

interface RankingsPageProps {
  onBack: () => void;
  onNavigateToProfile?: (profileId: string) => void;
  onTriggerLogin?: () => void;
  user?: User | null;
}

const RankingsPage: React.FC<RankingsPageProps> = ({ onBack, onNavigateToProfile }) => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [type, setType] = useState<'creators' | 'works'>('creators');

  // Mock Ranking Data Generation
  const rankedCreators = [...MOCK_CREATORS]
    .map(c => ({
      ...c,
      score: Math.floor(c.followers / 100) + Math.floor(Math.random() * 500),
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable'
    }))
    .sort((a, b) => b.score - a.score);

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <div className="w-8 h-8 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center font-bold text-lg shadow-lg shadow-yellow-200">1</div>;
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold text-lg shadow-lg shadow-slate-200">2</div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-amber-600 text-amber-100 flex items-center justify-center font-bold text-lg shadow-lg shadow-amber-200">3</div>;
    return <span className="text-lg font-bold text-slate-400 w-8 text-center">{rank + 1}</span>;
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ChevronUp className="w-4 h-4 text-red-500" />;
    if (trend === 'down') return <ChevronDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-slate-300" />;
  };

  const handleRowClick = (creatorName: string) => {
    if (onNavigateToProfile) {
        const profileId = creatorName === 'NeonDreamer' ? 'p_neon' : creatorName === 'InkFlow' ? 'p_ink' : 'p_artmaster';
        onNavigateToProfile(profileId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> 返回社区
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                <Trophy className="w-8 h-8 text-yellow-500" />
                热门榜单
              </h1>
              <p className="text-slate-500 mt-2">
                每日更新，发现社区最受欢迎的创作者与作品
              </p>
            </div>
            
            <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                <button 
                  onClick={() => setTimeRange('day')}
                  className={`px-4 py-2 text-sm font-medium rounded transition-all ${timeRange === 'day' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  日榜
                </button>
                <button 
                  onClick={() => setTimeRange('week')}
                  className={`px-4 py-2 text-sm font-medium rounded transition-all ${timeRange === 'week' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  周榜
                </button>
                <button 
                  onClick={() => setTimeRange('month')}
                  className={`px-4 py-2 text-sm font-medium rounded transition-all ${timeRange === 'month' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  月榜
                </button>
            </div>
          </div>
        </div>

        {/* Podium (Top 3) */}
        <div className="grid grid-cols-3 gap-4 mb-8 items-end max-w-3xl mx-auto">
           {/* 2nd Place */}
           <div className="order-1 flex flex-col items-center">
              <div 
                onClick={() => handleRowClick(rankedCreators[1].name)}
                className="bg-white rounded-t-2xl rounded-b-lg p-6 w-full max-w-[240px] shadow-sm border border-slate-200 flex flex-col items-center relative hover:-translate-y-1 transition-transform cursor-pointer"
              >
                 <div className="absolute -top-4 w-8 h-8 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center font-bold shadow-lg">2</div>
                 <img src={rankedCreators[1].avatar} className="w-16 h-16 rounded-full border-4 border-slate-100 mb-3" alt="" />
                 <h3 className="font-bold text-slate-800 text-center truncate w-full">{rankedCreators[1].name}</h3>
                 <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-red-500" /> {rankedCreators[1].score}
                 </div>
              </div>
              <div className="h-4 w-full max-w-[200px] bg-slate-200 rounded-b-lg mx-auto opacity-50"></div>
           </div>

           {/* 1st Place */}
           <div className="order-2 flex flex-col items-center mb-6">
              <div className="w-12 h-12 mb-2">
                 <img src="https://cdn-icons-png.flaticon.com/512/6439/6439499.png" className="w-full h-full object-contain drop-shadow-md animate-float" alt="Crown" />
              </div>
              <div 
                onClick={() => handleRowClick(rankedCreators[0].name)}
                className="bg-gradient-to-b from-yellow-50 to-white rounded-t-2xl rounded-b-lg p-8 w-full max-w-[260px] shadow-lg border border-yellow-200 flex flex-col items-center relative hover:-translate-y-2 transition-transform cursor-pointer"
              >
                 <div className="absolute -top-5 w-10 h-10 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center font-bold text-xl shadow-lg border-2 border-white">1</div>
                 <img src={rankedCreators[0].avatar} className="w-24 h-24 rounded-full border-4 border-yellow-200 mb-4 shadow-sm" alt="" />
                 <h3 className="font-bold text-slate-900 text-lg text-center truncate w-full">{rankedCreators[0].name}</h3>
                 <p className="text-xs text-slate-500 mb-2">{rankedCreators[0].tags[0]}</p>
                 <div className="text-sm font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full flex items-center gap-1">
                    <Flame className="w-4 h-4 fill-current" /> {rankedCreators[0].score}
                 </div>
              </div>
           </div>

           {/* 3rd Place */}
           <div className="order-3 flex flex-col items-center">
              <div 
                onClick={() => handleRowClick(rankedCreators[2].name)}
                className="bg-white rounded-t-2xl rounded-b-lg p-6 w-full max-w-[240px] shadow-sm border border-slate-200 flex flex-col items-center relative hover:-translate-y-1 transition-transform cursor-pointer"
              >
                 <div className="absolute -top-4 w-8 h-8 rounded-full bg-amber-600 text-amber-100 flex items-center justify-center font-bold shadow-lg">3</div>
                 <img src={rankedCreators[2].avatar} className="w-16 h-16 rounded-full border-4 border-slate-100 mb-3" alt="" />
                 <h3 className="font-bold text-slate-800 text-center truncate w-full">{rankedCreators[2].name}</h3>
                 <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-red-500" /> {rankedCreators[2].score}
                 </div>
              </div>
              <div className="h-4 w-full max-w-[200px] bg-slate-200 rounded-b-lg mx-auto opacity-50"></div>
           </div>
        </div>

        {/* Ranking List (4-10) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-medium">
                 <tr>
                    <th className="px-6 py-4 w-20 text-center">排名</th>
                    <th className="px-6 py-4">画师</th>
                    <th className="px-6 py-4 text-center">趋势</th>
                    <th className="px-6 py-4">热度指数</th>
                    <th className="px-6 py-4 text-right">操作</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {rankedCreators.slice(3).map((creator, index) => (
                    <tr 
                      key={creator.id} 
                      className="hover:bg-slate-50 cursor-pointer group transition-colors"
                      onClick={() => handleRowClick(creator.name)}
                    >
                       <td className="px-6 py-4 text-center font-bold text-slate-500">
                          {index + 4}
                       </td>
                       <td className="px-6 py-4 flex items-center gap-3">
                          <img src={creator.avatar} className="w-10 h-10 rounded-full bg-slate-100" alt="" />
                          <div>
                             <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{creator.name}</div>
                             <div className="text-xs text-slate-400">{creator.tags.slice(0,2).join(' ')}</div>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-center">
                          {getTrendIcon(creator.trend || 'stable')}
                       </td>
                       <td className="px-6 py-4 font-mono text-slate-600">
                          {creator.score.toLocaleString()}
                       </td>
                       <td className="px-6 py-4 text-right">
                          <button className="text-xs border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-600 hover:text-white transition-colors font-medium">
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
