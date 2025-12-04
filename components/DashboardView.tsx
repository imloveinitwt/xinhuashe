
import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { CHART_DATA_ARTIST, CHART_DATA_CLIENT, MOCK_PROJECTS, MOCK_ENTERPRISE_PROFILE } from '../constants';
import { DollarSign, Clock, Briefcase, TrendingUp, Eye, Users, Layers, Award, Building, Globe, Flag, GitFork, Calendar, PieChart as PieChartIcon, ShieldCheck, Zap, Crown } from 'lucide-react';
import { UserRole, User, ViewMode } from '../types';

const StatCard: React.FC<{ title: string; value: string; trend?: string; icon: any; color: string }> = ({ title, value, trend, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow">
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

// Mock Data for New Charts
const COMPLETION_DATA = [
  { name: '1月', target: 12, completed: 10 },
  { name: '2月', target: 15, completed: 14 },
  { name: '3月', target: 18, completed: 18 },
  { name: '4月', target: 20, completed: 15 },
  { name: '5月', target: 25, completed: 22 },
  { name: '6月', target: 22, completed: 20 },
];

const BUDGET_DISTRIBUTION = [
  { name: '研发', value: 45, color: '#6366f1' }, // Indigo
  { name: '市场', value: 25, color: '#ec4899' }, // Pink
  { name: '运营', value: 20, color: '#10b981' }, // Emerald
  { name: '设计', value: 10, color: '#f59e0b' }, // Amber
];

interface DashboardProps {
  user: User;
  onNavigate?: (mode: ViewMode) => void;
}

const getCreditLevel = (score: number) => {
  if (score >= 800) return { label: '极好', color: 'text-green-600', bg: 'bg-green-100' };
  if (score >= 700) return { label: '优秀', color: 'text-indigo-600', bg: 'bg-indigo-100' };
  if (score >= 600) return { label: '良好', color: 'text-blue-600', bg: 'bg-blue-100' };
  return { label: '一般', color: 'text-amber-600', bg: 'bg-amber-100' };
};

const getEnterpriseRating = (score: number) => {
  if (score >= 900) return 'AAA';
  if (score >= 800) return 'AA';
  if (score >= 700) return 'A';
  if (score >= 600) return 'BBB';
  return 'B';
};

const DashboardView: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const userRole = user.role;
  const isClient = userRole === 'enterprise';
  const [viewMode, setViewMode] = useState<'overview' | 'profile'>('overview');

  const chartData = isClient ? CHART_DATA_CLIENT : CHART_DATA_ARTIST;
  const dataKey = isClient ? 'expenditure' : 'revenue';
  const color = isClient ? '#6366f1' : '#db2777'; // Indigo vs Pink

  const creditInfo = isClient 
    ? { 
        title: '企业信用评级', 
        score: user.creditScore || 850, 
        label: getEnterpriseRating(user.creditScore || 850),
        desc: '信用极佳，享极速结算',
        icon: ShieldCheck,
        color: 'bg-indigo-500'
      }
    : { 
        title: '个人信用分', 
        score: user.creditScore || 700, 
        label: getCreditLevel(user.creditScore || 700).label,
        desc: '超过 85% 的同行',
        icon: Zap,
        color: 'bg-pink-500'
      };

  const membershipInfo = {
    level: user.membershipLevel || 'none',
    title: user.membershipLevel === 'max' ? '旗舰版会员' : user.membershipLevel === 'pro' ? '专业版会员' : '免费版',
    icon: Crown,
    color: user.membershipLevel === 'max' ? 'bg-amber-500' : user.membershipLevel === 'pro' ? 'bg-indigo-500' : 'bg-slate-400'
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/100x100/e2e8f0/64748b?text=Project';
  };

  const handleCreditClick = () => {
    if (onNavigate) {
      onNavigate('credit_score');
    }
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
          {/* Stats Grid - Adapted for Role with Credit Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {isClient ? (
              <>
                <StatCard title="总支出" value="¥142,593" trend="+12.5% 环比" icon={DollarSign} color="bg-indigo-500" />
                <StatCard title="活跃项目" value="8" trend="3个即将交付" icon={Briefcase} color="bg-blue-500" />
                
                {/* Enterprise Credit Card */}
                <div 
                  onClick={handleCreditClick}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div>
                    <p className="text-slate-500 text-sm font-medium mb-1 group-hover:text-indigo-600 transition-colors">企业信用评级</p>
                    <h3 className="text-2xl font-bold text-slate-800">{creditInfo.label}</h3>
                    <span className="text-indigo-500 text-xs font-semibold mt-2 inline-block">{creditInfo.desc}</span>
                  </div>
                  <div className={`p-3 rounded-lg ${creditInfo.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    <creditInfo.icon className={`w-6 h-6 ${creditInfo.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>

                {/* Membership Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate && onNavigate('membership')}>
                  <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">当前套餐</p>
                    <h3 className="text-lg font-bold text-slate-800 truncate">{membershipInfo.title}</h3>
                    <span className="text-slate-400 text-xs font-medium mt-2 inline-block">企业级特权生效中</span>
                  </div>
                  <div className={`p-3 rounded-lg ${membershipInfo.color} bg-opacity-10`}>
                    <membershipInfo.icon className={`w-6 h-6 ${membershipInfo.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <StatCard title="本月收入" value="¥12,450" trend="+8.2% 环比" icon={DollarSign} color="bg-pink-500" />
                <StatCard title="主页访问" value="5.4k" trend="+240 今日新增" icon={Eye} color="bg-purple-500" />
                
                {/* Personal Credit Card */}
                <div 
                  onClick={handleCreditClick}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div>
                    <p className="text-slate-500 text-sm font-medium mb-1 group-hover:text-pink-600 transition-colors">个人信用分</p>
                    <h3 className="text-2xl font-bold text-slate-800 flex items-end gap-1">
                      {creditInfo.score}
                      <span className="text-sm font-medium text-slate-400 mb-1">/ 950</span>
                    </h3>
                    <span className="text-pink-500 text-xs font-semibold mt-2 inline-block">{creditInfo.label}</span>
                  </div>
                  <div className={`p-3 rounded-lg ${creditInfo.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                    <creditInfo.icon className={`w-6 h-6 ${creditInfo.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>

                {/* Membership Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => onNavigate && onNavigate('membership')}>
                  <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">会员等级</p>
                    <h3 className="text-lg font-bold text-slate-800 truncate">{membershipInfo.title}</h3>
                    <span className="text-slate-400 text-xs font-medium mt-2 inline-block">服务费减免中</span>
                  </div>
                  <div className={`p-3 rounded-lg ${membershipInfo.color} bg-opacity-10`}>
                    <membershipInfo.icon className={`w-6 h-6 ${membershipInfo.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
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
                        src={project.coverImage || `https://placehold.co/100x100/e2e8f0/64748b?text=${project.id}`} 
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

          {/* Additional Charts for Enterprise Dashboard */}
          {isClient && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              {/* Completion Rate - Bar Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <Award className="w-5 h-5 text-indigo-500" />
                       项目交付达成率 (2023上半年)
                    </h3>
                 </div>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={COMPLETION_DATA} barGap={4}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <Tooltip 
                             cursor={{fill: '#f8fafc'}}
                             contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                          />
                          <Legend iconType="circle" />
                          <Bar dataKey="target" name="目标项目数" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={20} />
                          <Bar dataKey="completed" name="实际交付" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              {/* Budget Utilization - Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                       <PieChartIcon className="w-5 h-5 text-pink-500" />
                       各部门预算消耗占比
                    </h3>
                 </div>
                 <div className="h-64 w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie
                            data={BUDGET_DISTRIBUTION}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {BUDGET_DISTRIBUTION.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                          <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-[60%] -translate-y-1/2 text-center pointer-events-none">
                       <div className="text-xs text-slate-400">总预算消耗</div>
                       <div className="text-xl font-bold text-slate-800">85%</div>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DashboardView;
