import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CHART_DATA, MOCK_PROJECTS } from '../constants';
import { DollarSign, Clock, Briefcase, TrendingUp } from 'lucide-react';

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

const DashboardView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">仪表盘总览</h2>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option>最近7天</option>
            <option>最近30天</option>
            <option>本年度</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="总收入" value="¥42,593" trend="环比增长 12.5%" icon={DollarSign} color="bg-indigo-500" />
        <StatCard title="进行中项目" value="12" trend="3个项目本周截止" icon={Briefcase} color="bg-blue-500" />
        <StatCard title="待审核" value="5" trend="需要采取行动" icon={Clock} color="bg-amber-500" />
        <StatCard title="资产增长" value="1.2 TB" trend="+120 GB 新增资产" icon={TrendingUp} color="bg-emerald-500" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">收入与活跃度</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">近期动态</h3>
          <div className="space-y-6">
            {MOCK_PROJECTS.map((project) => (
              <div key={project.id} className="flex flex-col gap-2 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">{project.title}</h4>
                    <p className="text-xs text-slate-500">{project.client} • {project.phase}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    project.status === '进行中' ? 'bg-blue-100 text-blue-700' :
                    project.status === '已完成' ? 'bg-green-100 text-green-700' :
                    project.status === '审核中' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                  <div 
                    className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
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