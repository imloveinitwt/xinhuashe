
import React, { useState } from 'react';
import { 
  BarChart2, TrendingUp, Users, DollarSign, Calendar, 
  ArrowUpRight, ArrowDownRight, PieChart as PieIcon, Activity
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell 
} from 'recharts';

const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock Data
  const trendData = [
    { date: '10-01', traffic: 4000, interactions: 2400 },
    { date: '10-05', traffic: 3000, interactions: 1398 },
    { date: '10-10', traffic: 2000, interactions: 9800 },
    { date: '10-15', traffic: 2780, interactions: 3908 },
    { date: '10-20', traffic: 1890, interactions: 4800 },
    { date: '10-25', traffic: 2390, interactions: 3800 },
    { date: '10-30', traffic: 3490, interactions: 4300 },
  ];

  const projectData = [
    { name: 'UI设计', completed: 12, ongoing: 4 },
    { name: '插画', completed: 8, ongoing: 6 },
    { name: '3D建模', completed: 5, ongoing: 2 },
    { name: '品牌VI', completed: 3, ongoing: 1 },
  ];

  const assetData = [
    { name: '图片', value: 450, color: '#6366f1' },
    { name: '视频', value: 120, color: '#8b5cf6' },
    { name: '文档', value: 80, color: '#ec4899' },
    { name: '设计源文件', value: 220, color: '#06b6d4' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-600" /> 数据洞察
          </h2>
          <p className="text-slate-500 text-sm mt-1">全面分析您的业务表现与资产价值</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                timeRange === range 
                  ? 'bg-indigo-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {range === '7d' ? '近7天' : range === '30d' ? '近30天' : range === '90d' ? '本季度' : '本年度'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Activity className="w-5 h-5" /></div>
            <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full"><ArrowUpRight className="w-3 h-3 mr-1" /> +12%</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">24.5k</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">总浏览量</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users className="w-5 h-5" /></div>
            <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded-full"><ArrowUpRight className="w-3 h-3 mr-1" /> +5%</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">852</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">活跃粉丝/访客</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><DollarSign className="w-5 h-5" /></div>
            <span className="flex items-center text-red-500 text-xs font-bold bg-red-50 px-2 py-0.5 rounded-full"><ArrowDownRight className="w-3 h-3 mr-1" /> -2%</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">¥128k</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">总交易额</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><PieIcon className="w-5 h-5" /></div>
            <span className="text-xs text-slate-400 font-mono">Total</span>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">870</div>
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">沉淀资产数</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">流量与互动趋势</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInter" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                <Legend verticalAlign="top" height={36} align="right" />
                <Area type="monotone" dataKey="traffic" name="浏览量" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                <Area type="monotone" dataKey="interactions" name="互动量" stroke="#ec4899" strokeWidth={3} fillOpacity={1} fill="url(#colorInter)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">资产类型分布</h3>
          <div className="h-64 w-full relative">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <PieChart>
                <Pie
                  data={assetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                <div className="text-xs text-slate-400">Total</div>
                <div className="text-2xl font-bold text-slate-800">870</div>
            </div>
          </div>
          <div className="mt-4 text-center">
             <p className="text-xs text-slate-500">
                您的资产库主要由 <span className="text-indigo-600 font-bold">图片</span> 类文件构成
             </p>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Project Stats */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">项目交付统计</h3>
            <div className="h-72 w-full">
               <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <BarChart data={projectData} layout="vertical" barSize={20}>
                     <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" width={80} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                     <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                     <Legend />
                     <Bar dataKey="completed" name="已完成" stackId="a" fill="#10b981" radius={[0, 4, 4, 0]} />
                     <Bar dataKey="ongoing" name="进行中" stackId="a" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Efficiency or Custom Metric */}
         <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 ring-8 ring-indigo-50/50">
               <TrendingUp className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">效率提升评估</h3>
            <p className="text-slate-500 mb-6 max-w-sm">
               基于您的项目数据，使用平台工具后，平均项目交付周期缩短了 <span className="text-green-600 font-bold">35%</span>。
            </p>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
               下载详细分析报告
            </button>
         </div>
      </div>

    </div>
  );
};

export default AnalyticsView;
