

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_DATA_ARTIST, CHART_DATA_CLIENT, MOCK_PROJECTS, MOCK_ENTERPRISE_PROFILE } from '../constants';
import { DollarSign, Clock, Briefcase, TrendingUp, Eye, Users, Layers, Award, Building, Globe, Flag, GitFork, Calendar } from 'lucide-react';
import { UserRole } from '../types';

const StatCard: React.FC<{ title: string; value: string; trend?: string; icon: any; color: string }> = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      {trend && <span className="text-green-500 text-xs font-semibold mt-2 inline-block">{trend}</span>}
    </div>
    <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

interface DashboardProps {
  userRole: UserRole;
}

const DashboardView: React.FC<DashboardProps> = ({ userRole }) => {
  const isClient = userRole === 'enterprise';
  const [viewMode, setViewMode] = useState<'overview' | 'profile'>('overview');

  const chartData = isClient ? CHART_DATA_CLIENT : CHART_DATA_ARTIST;
  const dataKey = isClient ? 'expenditure' : 'revenue';
  const color = isClient ? '#6366f1' : '#db2777'; // Indigo vs Pink

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=Project';
  };

  const renderEnterpriseProfile = () => {
    const profile = MOCK_ENTERPRISE_PROFILE;
    return (
      <div className="animate-fade-in space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden relative">
           <div className="h-32 bg-gradient-to-r from-slate-800 to-indigo-900"></div>
           <div className="px-8 pb-8 relative">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                 <div className="-mt-12 p-1 bg-white rounded-xl shadow-md">
                    <img src={profile.logo} alt="Logo" className="w-24 h-24 rounded-lg bg-slate-50 object-cover" />
                 </div>
                 <div className="pt-4 flex-1">
                    <div className="flex justify-between items-start">
                       <div>
                         <h2 className="text-2xl font-bold text-slate-900">{profile.name}</h2>
                         <div className="flex gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {profile.industry}</span>
                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {profile.size}</span>
                            <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {profile.website}</span>
                         </div>
                       </div>
                       <button className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">
                         编辑资料
                       </button>
                    </div>
                    <p className="mt-4 text-slate-600 leading-relaxed max-w-3xl">
                      {profile.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                       {profile.coreBusiness.map(tag => (
                         <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100">
                           {tag}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           {/* Left: History Timeline */}
           <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Flag className="w-5 h-5 text-indigo-600" /> 发展历程
              </h3>
              <div className="relative border-l-2 border-indigo-100 ml-3 space-y-8 pl-6 py-2">
                 {profile.history.map((milestone, idx) => (
                   <div key={idx} className="relative group">
                      <span className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-500 group-hover:scale-110 transition-transform"></span>
                      <span className="text-sm font-bold text-indigo-600 block mb-1">{milestone.year}</span>
                      <h4 className="font-bold text-slate-800 text-sm mb-1">{milestone.title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{milestone.description}</p>
                   </div>
                 ))}
              </div>
           </div>

           {/* Right: Organizational Structure */}
           <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <GitFork className="w-5 h-5 text-indigo-600" /> 组织架构
              </h3>
              <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 overflow-x-auto">
                 <div className="flex flex-col items-center min-w-[500px]">
                    {/* Root */}
                    <div className="border border-slate-300 bg-white rounded-lg p-3 w-48 text-center shadow-sm mb-8 relative after:content-[''] after:absolute after:bottom-[-20px] after:left-1/2 after:w-px after:h-5 after:bg-slate-300">
                       <div className="font-bold text-slate-800 text-sm">{profile.structure.name}</div>
                       <div className="text-xs text-slate-500">{profile.structure.role}</div>
                    </div>
                    
                    {/* Level 2 Container */}
                    <div className="flex gap-8 relative before:content-[''] before:absolute before:top-[-12px] before:left-1/2 before:-translate-x-1/2 before:w-[calc(100%-12rem)] before:h-px before:bg-slate-300">
                       {profile.structure.children?.map((child, idx) => (
                          <div key={child.id} className="flex flex-col items-center relative before:content-[''] before:absolute before:top-[-12px] before:left-1/2 before:w-px before:h-3 before:bg-slate-300">
                             <div className="border border-slate-300 bg-white rounded-lg p-3 w-40 text-center shadow-sm mb-4">
                                <div className="font-bold text-slate-800 text-xs">{child.name}</div>
                                <div className="text-[10px] text-slate-500">{child.role}</div>
                             </div>
                             
                             {/* Level 3 */}
                             {child.children && (
                               <div className="flex flex-col gap-2 mt-2 pl-4 border-l border-slate-200">
                                  {child.children.map(sub => (
                                    <div key={sub.id} className="text-[10px] text-slate-600 bg-white px-2 py-1 rounded border border-slate-200">
                                      {sub.name}
                                    </div>
                                  ))}
                               </div>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isClient ? (viewMode === 'overview' ? '企业运营总览' : '企业中心') : '创作者仪表盘'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {isClient ? 'Tezign 企业级服务已激活' : 'Mihuashi 个人接单模式已激活'}
          </p>
        </div>
        
        {isClient ? (
          <div className="flex bg-white border border-slate-200 rounded-lg p-1">
             <button 
               onClick={() => setViewMode('overview')}
               className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${viewMode === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               运营概览
             </button>
             <button 
               onClick={() => setViewMode('profile')}
               className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${viewMode === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
             >
               企业中心
             </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>最近7天</option>
              <option>最近30天</option>
              <option>本年度</option>
            </select>
          </div>
        )}
      </div>

      {isClient && viewMode === 'profile' ? (
        renderEnterpriseProfile()
      ) : (
        <>
          {/* Stats Grid - Adapted for Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {isClient ? (
              <>
                <StatCard title="总支出" value="¥142,593" trend="+12.5% 环比" icon={DollarSign} color="bg-indigo-500" />
                <StatCard title="活跃项目" value="8" trend="3个即将交付" icon={Briefcase} color="bg-blue-500" />
                <StatCard title="待验收" value="5" trend="需尽快处理" icon={Clock} color="bg-amber-500" />
                <StatCard title="资产总数" value="1,240" trend="+120 本周新增" icon={Layers} color="bg-emerald-500" />
              </>
            ) : (
              <>
                <StatCard title="本月收入" value="¥12,450" trend="+8.2% 环比" icon={DollarSign} color="bg-pink-500" />
                <StatCard title="主页访问" value="5.4k" trend="+240 今日新增" icon={Eye} color="bg-purple-500" />
                <StatCard title="粉丝增长" value="890" trend="+12 本周新增" icon={Users} color="bg-orange-500" />
                <StatCard title="作品收藏" value="2.1k" trend="热度上升中" icon={Award} color="bg-rose-500" />
              </>
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                {isClient ? '资金支出与活跃度趋势' : '收入与流量趋势'}
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={color} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#colorChart)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Project Status */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">
                {isClient ? '项目交付进度' : '近期接单动态'}
              </h3>
              <div className="space-y-6">
                {MOCK_PROJECTS.map((project) => (
                  <div key={project.id} className="flex flex-col gap-2 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="flex gap-3">
                      {/* Thumbnail Image */}
                      <img 
                        src={project.coverImage || `https://placehold.co/100x100?text=${project.id}`} 
                        alt={project.title}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                        onError={handleImageError}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-semibold text-slate-800 text-sm truncate pr-2">{project.title}</h4>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${
                            project.status === '进行中' ? 'bg-blue-100 text-blue-700' :
                            project.status === '已完成' ? 'bg-green-100 text-green-700' :
                            project.status === '审核中' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mb-2">{project.client} • {project.phase}</p>
                        <div className="w-full bg-slate-100 rounded-full h-1.5">
                          <div 
                            className={`${isClient ? 'bg-indigo-500' : 'bg-pink-500'} h-1.5 rounded-full transition-all duration-500`} 
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardView;
