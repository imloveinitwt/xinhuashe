
import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Settings, Search, Edit2, Trash2, CheckCircle, XCircle, 
  MoreVertical, Lock, Key, AlertTriangle, Activity, BarChart2, FileText, 
  Eye, Layout, Code, Server, Database, RefreshCw, Filter, List, Power,
  ChevronRight, Terminal
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { MOCK_USERS_ADMIN_VIEW, ROLE_DEFINITIONS, MOCK_SYSTEM_LOGS, MOCK_ARTWORKS } from '../constants';
import { User, RoleDefinition, SystemLog, SystemConfig, Artwork } from '../types';

type AdminTab = 'monitor' | 'users' | 'content' | 'settings' | 'dev';

// --- SUB-COMPONENT: SYSTEM MONITOR ---
const SystemMonitor = () => {
  // Mock Real-time Data
  const [data, setData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ cpu: 45, memory: 62, qps: 1240, activeUsers: 854 });

  useEffect(() => {
    // Generate initial data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      time: `${10 + Math.floor(i/2)}:${(i%2)*30}`,
      cpu: 30 + Math.random() * 40,
      memory: 50 + Math.random() * 30,
      qps: 800 + Math.random() * 800
    }));
    setData(initialData);

    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1)];
        const lastTime = prev[prev.length-1].time; // simplified
        const now = new Date();
        newData.push({
          time: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
          cpu: 30 + Math.random() * 40,
          memory: 50 + Math.random() * 30,
          qps: 800 + Math.random() * 800
        });
        return newData;
      });
      setMetrics({
        cpu: Math.floor(30 + Math.random() * 40),
        memory: Math.floor(50 + Math.random() * 30),
        qps: Math.floor(800 + Math.random() * 800),
        activeUsers: 850 + Math.floor(Math.random() * 50)
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider">
            <Server className="w-4 h-4" /> CPU Usage
          </div>
          <div className="text-2xl font-bold text-slate-800">{metrics.cpu}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${metrics.cpu > 80 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${metrics.cpu}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider">
            <Database className="w-4 h-4" /> Memory
          </div>
          <div className="text-2xl font-bold text-slate-800">{metrics.memory}%</div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${metrics.memory > 80 ? 'bg-amber-500' : 'bg-blue-500'}`} style={{ width: `${metrics.memory}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" /> QPS (Req/s)
          </div>
          <div className="text-2xl font-bold text-green-600">{metrics.qps}</div>
          <div className="text-xs text-slate-400 mt-1">Peak: 2,400</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4" /> Real-time Users
          </div>
          <div className="text-2xl font-bold text-purple-600">{metrics.activeUsers}</div>
          <div className="text-xs text-slate-400 mt-1">Total Registered: 12,450</div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-6">系统负载趋势</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Area type="monotone" dataKey="cpu" name="CPU %" stroke="#6366f1" fillOpacity={1} fill="url(#colorCpu)" />
              <Area type="monotone" dataKey="memory" name="Memory %" stroke="#3b82f6" fillOpacity={1} fill="url(#colorMem)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: CONTENT CMS ---
const ContentCMS = () => {
  const [artworks, setArtworks] = useState<Artwork[]>(MOCK_ARTWORKS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredArtworks = artworks.filter(a => {
    // Default status to approved if undefined for mock data
    const status = a.status || 'approved';
    return filter === 'all' || status === filter;
  });

  const handleAction = (action: 'approve' | 'reject' | 'delete') => {
    if (selectedIds.size === 0) return;
    const newArtworks = artworks.map(a => {
      if (selectedIds.has(a.id)) {
        if (action === 'delete') return null;
        return { ...a, status: action === 'approve' ? 'approved' : 'rejected' };
      }
      return a;
    }).filter(Boolean) as Artwork[];
    
    setArtworks(newArtworks);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f === 'pending' ? '待审核' : f === 'approved' ? '已发布' : f === 'rejected' ? '已驳回' : '全部'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => handleAction('approve')}
            disabled={selectedIds.size === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" /> 通过
          </button>
          <button 
            onClick={() => handleAction('reject')}
            disabled={selectedIds.size === 0}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <XCircle className="w-4 h-4" /> 驳回
          </button>
          <button 
            onClick={() => handleAction('delete')}
            disabled={selectedIds.size === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> 删除
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-4 w-10">
                <input type="checkbox" onChange={(e) => {
                  if (e.target.checked) setSelectedIds(new Set(filteredArtworks.map(a => a.id)));
                  else setSelectedIds(new Set());
                }} checked={selectedIds.size === filteredArtworks.length && filteredArtworks.length > 0} />
              </th>
              <th className="px-6 py-4">作品预览</th>
              <th className="px-6 py-4">标题 / ID</th>
              <th className="px-6 py-4">创作者</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4">数据</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredArtworks.map(art => (
              <tr key={art.id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <input type="checkbox" checked={selectedIds.has(art.id)} onChange={() => toggleSelect(art.id)} />
                </td>
                <td className="px-6 py-4">
                  <div className="w-16 h-12 bg-slate-100 rounded overflow-hidden">
                    <img src={art.imageUrl} className="w-full h-full object-cover" alt="" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{art.title}</div>
                  <div className="text-xs text-slate-400">ID: {art.id}</div>
                </td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <img src={art.artistAvatar} className="w-6 h-6 rounded-full" alt="" />
                  <span>{art.artist}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    (art.status || 'approved') === 'approved' ? 'bg-green-100 text-green-700' :
                    (art.status || 'approved') === 'pending' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {art.status || 'approved'}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  <div>Likes: {art.likes}</div>
                  <div>Views: {art.views}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredArtworks.length === 0 && (
          <div className="p-12 text-center text-slate-400">暂无相关数据</div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: SETTINGS & LOGS ---
const SystemSettings = () => {
  const [config, setConfig] = useState<SystemConfig>({
    maintenanceMode: false,
    allowRegistration: true,
    contentAuditLevel: 'medium',
    maxUploadSize: 50
  });

  const logs = MOCK_SYSTEM_LOGS;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      {/* Config Panel */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-500" /> 全局配置
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">系统维护模式</div>
                <div className="text-xs text-slate-500">开启后仅管理员可访问</div>
              </div>
              <button 
                onClick={() => setConfig({...config, maintenanceMode: !config.maintenanceMode})}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${config.maintenanceMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.maintenanceMode ? 'translate-x-6' : ''}`}></div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-slate-800">开放新用户注册</div>
                <div className="text-xs text-slate-500">关闭后停止所有注册入口</div>
              </div>
              <button 
                onClick={() => setConfig({...config, allowRegistration: !config.allowRegistration})}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${config.allowRegistration ? 'bg-green-500' : 'bg-slate-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${config.allowRegistration ? 'translate-x-6' : ''}`}></div>
              </button>
            </div>

            <div>
              <div className="font-medium text-slate-800 mb-2">内容审核等级</div>
              <select 
                value={config.contentAuditLevel}
                onChange={(e) => setConfig({...config, contentAuditLevel: e.target.value as any})}
                className="w-full border border-slate-200 rounded-lg p-2 text-sm"
              >
                <option value="low">低 (仅AI过滤)</option>
                <option value="medium">中 (AI + 抽检)</option>
                <option value="high">高 (AI + 人工复审)</option>
                <option value="strict">严格 (先审后发)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
           <h4 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> 敏感操作区</h4>
           <div className="space-y-2">
             <button className="w-full py-2 bg-white border border-amber-200 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-100">
               清除系统缓存
             </button>
             <button className="w-full py-2 bg-white border border-amber-200 text-amber-700 text-sm font-medium rounded-lg hover:bg-amber-100">
               重启服务节点
             </button>
           </div>
        </div>
      </div>

      {/* Logs Panel */}
      <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <List className="w-5 h-5 text-slate-500" /> 操作审计日志
          </h3>
          <button className="text-xs text-indigo-600 hover:underline">导出 CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">时间</th>
                <th className="px-4 py-3">操作人</th>
                <th className="px-4 py-3">行为</th>
                <th className="px-4 py-3">对象</th>
                <th className="px-4 py-3">IP</th>
                <th className="px-4 py-3">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-slate-500 text-xs">{log.timestamp}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{log.operator}</td>
                  <td className="px-4 py-3">{log.action}</td>
                  <td className="px-4 py-3 text-slate-600">{log.target}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{log.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {log.status === 'success' ? '成功' : '失败'}
                    </span>
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

// --- SUB-COMPONENT: DEV DOCS ---
const DevDocs = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-fade-in h-[calc(100vh-200px)]">
      {/* Sidebar */}
      <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-4 h-full overflow-y-auto">
        <h3 className="font-bold text-slate-900 mb-4 px-2">Developer Hub</h3>
        <div className="space-y-1">
          <div className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium cursor-pointer">API Reference</div>
          <div className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm cursor-pointer">Authentication</div>
          <div className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm cursor-pointer">Project Endpoints</div>
          <div className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm cursor-pointer">Asset Management</div>
          <div className="my-4 border-t border-slate-100"></div>
          <div className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm cursor-pointer">Component Library</div>
          <div className="px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm cursor-pointer">Design Tokens</div>
        </div>
      </div>

      {/* Content */}
      <div className="lg:col-span-3 bg-white border border-slate-200 rounded-xl p-8 h-full overflow-y-auto custom-scrollbar">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">API Documentation v1.0</h1>
          <p className="text-slate-600 mb-8">
            Welcome to the Xinhuashe Platform API. All endpoints are prefixed with <code className="bg-slate-100 px-1 rounded text-sm text-pink-600">/api/v1</code>.
            Authentication is handled via Bearer Tokens.
          </p>

          <div className="space-y-8">
            <section>
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">GET</span>
                /projects
              </h3>
              <p className="text-sm text-slate-600 mb-3">Retrieve a list of projects with optional filtering.</p>
              <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs overflow-x-auto">
{`// Request
GET /api/v1/projects?status=active&limit=10

// Response 200 OK
{
  "data": [
    {
      "id": "p_123",
      "title": "Summer Campaign",
      "status": "in-progress",
      "budget": 50000
    }
  ],
  "meta": {
    "total": 45,
    "page": 1
  }
}`}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">POST</span>
                /auth/login
              </h3>
              <p className="text-sm text-slate-600 mb-3">Authenticate user and retrieve session token.</p>
              <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs overflow-x-auto">
{`// Request
POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "hashed_password"
}

// Response 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsIn...",
  "user": {
    "id": "u_1",
    "role": "creator"
  }
}`}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MAIN ADMIN VIEW ---
const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('monitor');

  // Navigation Items
  const navItems: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'monitor', label: '系统监控', icon: Activity },
    { id: 'content', label: '内容管理', icon: Layout },
    { id: 'users', label: '用户与权限', icon: Users },
    { id: 'settings', label: '系统设置', icon: Settings },
    { id: 'dev', label: '开发者中心', icon: Code },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'monitor': return <SystemMonitor />;
      case 'content': return <ContentCMS />;
      case 'settings': return <SystemSettings />;
      case 'dev': return <DevDocs />;
      case 'users': 
      default:
        // Use existing User Logic but enhanced
        return <UserManagementModule />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Nav */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-2 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">系统指挥中心</h2>
            <p className="text-xs text-slate-500">Admin Command Center v2.0</p>
          </div>
        </div>
        
        <div className="flex overflow-x-auto no-scrollbar gap-1 p-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="min-h-[600px]">
        {renderContent()}
      </div>

    </div>
  );
};

// Re-implemented User Management to be self-contained in this file for simplicity 
// (or could import the previous logic, but here we enhance it)
const UserManagementModule = () => {
  const [users, setUsers] = useState(MOCK_USERS_ADMIN_VIEW);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.roleName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'banned' : 'active' };
      }
      return u;
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800">用户列表</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="搜索用户名..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64"
          />
        </div>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-3">用户</th>
            <th className="px-6 py-3">角色</th>
            <th className="px-6 py-3">邮箱</th>
            <th className="px-6 py-3">状态</th>
            <th className="px-6 py-3">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4 flex items-center gap-3">
                <img src={user.avatar} className="w-8 h-8 rounded-full border border-slate-200" alt="" />
                <div>
                  <div className="font-medium text-slate-900">{user.name}</div>
                  <div className="text-xs text-slate-400">ID: {user.id}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  user.role === 'root_admin' ? 'bg-red-100 text-red-700' :
                  user.role === 'enterprise' ? 'bg-blue-100 text-blue-700' :
                  user.role === 'creator' ? 'bg-pink-100 text-pink-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {user.role === 'root_admin' && <Lock className="w-3 h-3" />}
                  {user.roleName}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-500">{user.email || 'N/A'}</td>
              <td className="px-6 py-4">
                <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium w-fit ${
                  user.status === 'active' ? 'bg-green-100 text-green-700' : 
                  user.status === 'banned' ? 'bg-red-100 text-red-700' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {user.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  {user.status === 'active' ? '正常' : user.status === 'banned' ? '已封禁' : '未激活'}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-3">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs flex items-center gap-1">
                    <Key className="w-3 h-3" /> 重置密码
                  </button>
                  {user.role !== 'root_admin' && (
                    <button 
                      onClick={() => toggleStatus(user.id)}
                      className={`${user.status === 'active' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} font-medium text-xs flex items-center gap-1`}
                    >
                      {user.status === 'active' ? <Power className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {user.status === 'active' ? '封禁' : '解封'}
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminView;
