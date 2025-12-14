
import React, { useState, useEffect } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { CHART_DATA_ARTIST, CHART_DATA_CLIENT, MOCK_PROJECTS, MOCK_ENTERPRISE_PROFILE } from '../constants';
import { DollarSign, Clock, Briefcase, TrendingUp, Eye, Users, Layers, Award, Building, Globe, Flag, GitFork, Calendar, PieChart as PieChartIcon, ShieldCheck, Zap, Crown } from 'lucide-react';
import { UserRole, User, ViewMode } from '../types';

const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-32 flex flex-col justify-between animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-20"></div>
        <div className="h-8 bg-slate-200 rounded w-32"></div>
      </div>
      <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
    </div>
    <div className="h-3 bg-slate-100 rounded w-24"></div>
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-80 animate-pulse">
    <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
    <div className="h-60 bg-slate-100 rounded-lg w-full"></div>
  </div>
);

const StatCard: React.FC<{ title: string; value: string; trend?: string; icon: any; color: string; onClick?: () => void }> = ({ title, value, trend, icon: Icon, color, onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start justify-between hover:shadow-md transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
  >
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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white p-3 rounded-lg shadow-xl text-xs border border-slate-700">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-indigo-300">
          {payload[0].name}: <span className="font-mono">{payload[0].value}</span>
        </p>
        <p className="text-slate-400 mt-1">环比增长: +5.2%</p>
      </div>
    );
  }
  return null;
};

interface DashboardProps {
  user: User;
  onNavigate?: (mode: ViewMode) => void;
}

const DashboardView: React.FC<DashboardProps> = ({ user, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState<any[]>([]);

  const isClient = user.role === 'enterprise';
  const baseData = isClient ? CHART_DATA_CLIENT : CHART_DATA_ARTIST;

  useEffect(() => {
    // Simulate data fetching with loading
    setIsLoading(true);
    setTimeout(() => {
      // Mock data variation based on time range
      const multiplier = timeRange === '30d' ? 4 : timeRange === '1y' ? 12 : 1;
      const data = baseData.map(d => ({
        ...d,
        revenue: d.revenue ? d.revenue * multiplier : undefined,
        expenditure: d.expenditure ? d.expenditure * multiplier : undefined,
        name: timeRange === '1y' ? `M${d.name.replace('周',' ')}` : d.name
      }));
      setChartData(data);
      setIsLoading(false);
    }, 800);
  }, [timeRange, isClient]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  const dataKey = isClient ? 'expenditure' : 'revenue';
  const color = isClient ? '#6366f1' : '#db2777';

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
           <div className="h-8 bg-slate-200 rounded w-48 animate-pulse"></div>
           <div className="h-8 bg-slate-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2"><SkeletonChart /></div>
           <div><SkeletonChart /></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {isClient ? '企业运营总览' : '创作者仪表盘'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {isClient ? 'Tezign 企业级服务已激活' : 'Mihuashi 个人接单模式已激活'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <select 
            value={timeRange}
            onChange={handleTimeChange}
            className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="1y">本年度</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isClient ? (
          <>
            <StatCard title="总支出" value="¥142,593" trend="+12.5% 环比" icon={DollarSign} color="bg-indigo-500" />
            <StatCard title="活跃项目" value="8" trend="3个即将交付" icon={Briefcase} color="bg-blue-500" />
            <StatCard 
              title="企业信用" 
              value="AAA" 
              trend="极佳" 
              icon={ShieldCheck} 
              color="bg-green-500" 
              onClick={() => onNavigate?.('credit_score')}
            />
            <StatCard title="当前套餐" value="专业版" trend="企业特权" icon={Crown} color="bg-amber-500" />
          </>
        ) : (
          <>
            <StatCard title="本月收入" value="¥12,450" trend="+8.2% 环比" icon={DollarSign} color="bg-pink-500" />
            <StatCard title="主页访问" value="5.4k" trend="+240 今日新增" icon={Eye} color="bg-purple-500" />
            <StatCard 
              title="个人信用" 
              value="700" 
              trend="良好" 
              icon={Zap} 
              color="bg-yellow-500"
              onClick={() => onNavigate?.('credit_score')}
            />
            <StatCard title="会员等级" value="Pro" trend="权益生效中" icon={Crown} color="bg-indigo-500" />
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            {isClient ? '资金支出与活跃度趋势' : '收入与流量趋势'}
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill="url(#colorChart)" animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status (Simple list) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            {isClient ? '项目交付进度' : '近期接单动态'}
          </h3>
          <div className="space-y-6">
            {MOCK_PROJECTS.slice(0, 4).map((project) => (
              <div key={project.id} className="flex flex-col gap-2 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex gap-3">
                  <img 
                    src={project.coverImage || `https://placehold.co/100x100/e2e8f0/64748b?text=${project.id}`} 
                    alt={project.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-slate-100"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-slate-800 text-sm truncate pr-2">{project.title}</h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 whitespace-nowrap">
                        {project.status}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                      <div 
                        className={`${isClient ? 'bg-indigo-500' : 'bg-pink-500'} h-1.5 rounded-full transition-all duration-1000`} 
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
    </div>
  );
};

export default DashboardView;
