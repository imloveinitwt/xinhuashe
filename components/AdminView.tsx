import React, { useState, useEffect } from 'react';
import { 
  Users, Shield, Settings, Search, Edit2, Trash2, CheckCircle, XCircle, 
  MoreVertical, Lock, Key, AlertTriangle, Activity, BarChart2, FileText, 
  Eye, Layout, Code, Server, Database, RefreshCw, Filter, List, Power,
  ChevronRight, Terminal, UserCheck, Briefcase, CreditCard, Building, Image as ImageIcon,
  FileCheck, IdCard, MessageSquare, Bell, Sparkles, Loader2, Save, Wand2, Download,
  Ban, Check, LogIn
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { ROLE_DEFINITIONS } from '../constants';
import { User, RoleDefinition, SystemLog, SystemConfig, Artwork, VerificationRequest, UserRole } from '../types';
import { AIService } from '../services/AIService';
import { DB } from '../services/db';
import { useToast } from '../contexts/ToastContext'; // Import Toast

export type AdminTab = 'monitor' | 'users' | 'content' | 'settings' | 'dev' | 'auth_audit';

interface AdminViewProps {
  initialTab?: AdminTab;
}

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
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
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

// --- SUB-COMPONENT: USER MANAGEMENT ---
const UserManagement = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>(() => DB.users.getAll());
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleStatusToggle = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    DB.users.update(userId, { status: newStatus as any });
    setUsers(DB.users.getAll()); // Refresh
    showToast(`用户状态已更新为: ${newStatus === 'active' ? '正常' : '封禁'}`, newStatus === 'active' ? 'success' : 'warning');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'root_admin': return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-bold border border-red-200">超级管理员</span>;
      case 'platform_admin': return <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded text-xs font-bold border border-orange-200">平台管理员</span>;
      case 'enterprise': return <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold border border-blue-200">企业主</span>;
      case 'creator': return <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-xs font-bold border border-pink-200">创作者</span>;
      default: return <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">普通用户</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索用户名、邮箱..." 
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select 
            className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
          >
            <option value="all">所有角色</option>
            <option value="creator">创作者</option>
            <option value="enterprise">企业主</option>
            <option value="root_admin">管理员</option>
          </select>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-700 flex items-center gap-2">
            <LogIn className="w-4 h-4" /> 添加用户
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase">
            <tr>
              <th className="px-6 py-4">用户</th>
              <th className="px-6 py-4">角色</th>
              <th className="px-6 py-4">信用分</th>
              <th className="px-6 py-4">状态</th>
              <th className="px-6 py-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-9 h-9 rounded-full bg-slate-200" alt="" />
                    <div>
                      <div className="font-bold text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-400">{user.email || 'No Email'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4">
                  <div className={`font-mono font-bold ${
                    user.creditScore >= 800 ? 'text-green-600' : 
                    user.creditScore >= 600 ? 'text-blue-600' : 'text-amber-600'
                  }`}>
                    {user.creditScore}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {user.status === 'active' ? (
                    <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                      <CheckCircle className="w-3.5 h-3.5" /> 正常
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-red-600 text-xs font-bold">
                      <Ban className="w-3.5 h-3.5" /> 封禁
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleStatusToggle(user.id, user.status || 'active')}
                      className={`p-1.5 rounded-lg transition-colors ${
                        user.status === 'active' 
                          ? 'text-red-500 hover:bg-red-50' 
                          : 'text-green-500 hover:bg-green-50'
                      }`}
                      title={user.status === 'active' ? '封禁账号' : '解封账号'}
                    >
                      {user.status === 'active' ? <Ban className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            未找到匹配的用户
          </div>
        )}
      </div>
    </div>
  );
};

// --- SUB-COMPONENT: CONTENT CMS ---
const ContentCMS = () => {
  // Use DB for source of truth to ensure frontend syncs
  const [artworks, setArtworks] = useState<Artwork[]>(() => DB.artworks.getAll());
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);
  
  // Interaction State
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false); // For bulk
  const [isRegeneratingSingle, setIsRegeneratingSingle] = useState(false); // For single modal
  const { showToast } = useToast();

  const filteredArtworks = artworks.filter(a => {
    const status = a.status || 'approved';
    return filter === 'all' || status === filter;
  });

  // Helper to sanitize prompts for fallback generators
  const getSafePrompt = (text: string) => {
    return (text || "Digital Art").slice(0, 100).replace(/\n/g, ' ');
  };

  const handleAction = (action: 'approve' | 'reject' | 'delete') => {
    if (selectedIds.size === 0) return;

    if (action === 'reject' && !showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (action === 'reject' && !rejectReason.trim()) {
      alert('请填写驳回原因');
      return;
    }

    // Perform updates
    const targets: string[] = Array.from(selectedIds);

    if (action === 'delete') {
       targets.forEach(id => DB.artworks.delete(id));
    } else {
       targets.forEach(id => {
         DB.artworks.update(id, { status: action === 'approve' ? 'approved' : 'rejected' });
       });
    }
    
    // Update UI by re-fetching
    setArtworks(DB.artworks.getAll());
    setSelectedIds(new Set());
    setRejectReason('');
    setShowRejectInput(false);
    
    showToast(`成功${action === 'approve' ? '通过' : action === 'reject' ? '驳回' : '删除'}了 ${targets.length} 个作品。`, 'success');
  };

  const handleAiRegenerate = async () => {
    if (selectedIds.size === 0) {
       showToast('请先勾选需要 AI 重绘的作品', 'warning');
       return;
    }

    setIsRegenerating(true);
    let successCount = 0;

    const targets: string[] = Array.from(selectedIds);

    for (const id of targets) {
      const art = DB.artworks.findById(id);
      if (art) {
        try {
          const safePrompt = getSafePrompt(art.description || art.title);
          // Bulk uses fallback for quota reasons or consistency
          const persistableUrl = AIService.getPersistableUrl(
            safePrompt,
            { aspectRatio: '3:4', style: (art.tags && art.tags[0]) || 'Digital Art' }
          );

          await new Promise(r => setTimeout(r, 600));

          DB.artworks.update(id, { 
            imageUrl: persistableUrl,
          });
          successCount++;
        } catch (e) {
          console.error(`Failed to regenerate artwork ${id}`, e);
        }
      }
    }

    setArtworks(DB.artworks.getAll());
    setIsRegenerating(false);
    setSelectedIds(new Set());
    showToast(`批量 AI 重绘完成，已优化存储，成功更新 ${successCount} 张配图。`, 'success');
  };

  const handleSingleAiRegenerate = async () => {
    if (!editingArtwork) return;
    
    setIsRegeneratingSingle(true);
    try {
      const safeDesc = getSafePrompt(editingArtwork.description || editingArtwork.title);
      // Explicitly include tags in prompt
      const styleTags = editingArtwork.tags && editingArtwork.tags.length > 0 ? editingArtwork.tags.slice(0,3).join(', ') : "high quality";
      const prompt = `${safeDesc}. Style: ${styleTags}. 8k resolution, highly detailed.`;

      // Use the first tag as style for the generator if available, else 'Digital Art'
      const mainStyle = editingArtwork.tags && editingArtwork.tags.length > 0 ? editingArtwork.tags[0] : 'Digital Art';

      const imageUrl = await AIService.generateImage(prompt, {
        aspectRatio: '3:4',
        style: mainStyle
      });

      if (imageUrl) {
        setEditingArtwork(prev => prev ? ({
          ...prev,
          imageUrl,
        }) : null);
        
        showToast('配图重绘成功！点击“保存修改”以应用。', 'success');
      } else {
        throw new Error("No image URL returned");
      }
    } catch (e) {
      console.error(e);
      showToast('重绘失败，请重试', 'error');
    } finally {
      setIsRegeneratingSingle(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleEditSave = () => {
    if (!editingArtwork) return;
    
    showToast('正在同步数据至服务器...', 'info');

    setTimeout(() => {
      try {
        DB.artworks.update(editingArtwork.id, editingArtwork);
        setArtworks(DB.artworks.getAll()); 
        setEditingArtwork(null);
        showToast('作品信息已更新', 'success');
      } catch (e) {
        console.warn("Storage Quota Exceeded. Attempting optimization...", e);
        
        if (editingArtwork.imageUrl && editingArtwork.imageUrl.startsWith('data:image')) {
            const safePrompt = getSafePrompt(editingArtwork.description || editingArtwork.title);
            const persistableUrl = AIService.getPersistableUrl(
              safePrompt, 
              { aspectRatio: '3:4', style: 'Digital Art' }
            );
            
            try {
              DB.artworks.update(editingArtwork.id, {
                ...editingArtwork,
                imageUrl: persistableUrl,
              });
              setArtworks(DB.artworks.getAll());
              setEditingArtwork(null);
              showToast('已优化图片存储并保存成功', 'success');
            } catch (retryErr) {
              console.error("Critical storage error", retryErr);
              showToast('保存失败：浏览器存储空间已满', 'error');
            }
        } else {
            showToast('保存失败：浏览器存储空间已满', 'error');
        }
      }
    }, 600);
  };

  const handleDownloadImage = () => {
    if (editingArtwork && editingArtwork.imageUrl) {
      const link = document.createElement('a');
      link.href = editingArtwork.imageUrl;
      link.download = `${editingArtwork.title.replace(/\s+/g, '_')}_${editingArtwork.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('已开始下载图片', 'success');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Edit Modal */}
      {editingArtwork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-scale-in flex flex-col md:flex-row max-h-[90vh]">
              
              {/* Left Column: Image Preview & Actions */}
              <div className="w-full md:w-2/5 bg-slate-900 p-6 flex flex-col items-center justify-center relative group">
                 <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-slate-800 shadow-lg mb-4 ring-1 ring-white/10">
                    <img 
                      key={editingArtwork.imageUrl} // FORCE RENDER when URL changes
                      src={editingArtwork.imageUrl} 
                      className="w-full h-full object-cover" 
                      alt="Preview" 
                      referrerPolicy="no-referrer"
                    />
                 </div>
                 
                 <div className="w-full grid grid-cols-2 gap-2">
                   <button 
                     onClick={handleSingleAiRegenerate}
                     disabled={isRegeneratingSingle}
                     className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                   >
                     {isRegeneratingSingle ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                     {isRegeneratingSingle ? '重绘中...' : '根据描述重绘'}
                   </button>
                   <button 
                     onClick={handleDownloadImage}
                     className="py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 text-xs border border-white/10"
                   >
                     <Download className="w-4 h-4" />
                     保存本地
                   </button>
                 </div>
                 <p className="text-slate-400 text-[10px] mt-3 text-center px-2">
                   左：基于右侧“作品描述”生成新图 | 右：下载当前图片
                 </p>
              </div>

              {/* Right Column: Form Fields */}
              <div className="flex-1 flex flex-col h-full bg-white">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                   <h3 className="font-bold text-slate-800 flex items-center gap-2">
                     <Edit2 className="w-4 h-4 text-indigo-500" /> 编辑作品信息
                   </h3>
                   <button onClick={() => setEditingArtwork(null)} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                     <XCircle className="w-5 h-5 text-slate-400" />
                   </button>
                </div>
                
                <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar flex-1">
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">作品标题</label>
                      <input 
                        value={editingArtwork.title} 
                        onChange={e => setEditingArtwork({...editingArtwork, title: e.target.value})}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                   </div>
                   
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">作品描述 (用于AI重绘)</label>
                      <textarea 
                        value={editingArtwork.description || ''} 
                        onChange={e => setEditingArtwork({...editingArtwork, description: e.target.value})}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm h-32 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none leading-relaxed"
                        placeholder="请输入详细的画面描述，AI 将基于此描述重新生成配图..."
                      />
                   </div>
                   
                   <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">标签 (逗号分隔)</label>
                      <input 
                        value={editingArtwork.tags.join(', ')} 
                        onChange={e => setEditingArtwork({...editingArtwork, tags: e.target.value.split(/[,，]/).map(t => t.trim()).filter(Boolean)})}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">审核状态</label>
                          <select 
                             value={editingArtwork.status || 'approved'} 
                             onChange={e => setEditingArtwork({...editingArtwork, status: e.target.value as any})}
                             className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                          >
                             <option value="pending">待审核</option>
                             <option value="approved">已发布</option>
                             <option value="rejected">已驳回</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">作者</label>
                          <input 
                            value={editingArtwork.artist} 
                            onChange={e => setEditingArtwork({...editingArtwork, artist: e.target.value})}
                            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50"
                            disabled
                          />
                      </div>
                   </div>
                </div>

                <div className="p-4 border-t bg-slate-50 flex justify-end gap-3">
                   <button 
                     onClick={() => setEditingArtwork(null)} 
                     className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                   >
                     取消
                   </button>
                   <button 
                     onClick={handleEditSave} 
                     className="px-6 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-sm"
                   >
                     <Save className="w-4 h-4" /> 保存修改
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm gap-4">
        {/* ... (rest of the file remains same, keeping list view controls) ... */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f as any); setSelectedIds(new Set()); setShowRejectInput(false); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                filter === f ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {f === 'pending' ? '待审核' : f === 'approved' ? '已发布' : f === 'rejected' ? '已驳回' : '全部'}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          {showRejectInput ? (
            <div className="flex-1 flex gap-2 animate-scale-in">
              <input 
                type="text" 
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="请输入驳回原因..."
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              />
              <button 
                onClick={() => handleAction('reject')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 whitespace-nowrap"
              >
                确认驳回
              </button>
              <button 
                onClick={() => { setShowRejectInput(false); setRejectReason(''); }}
                className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50"
              >
                取消
              </button>
            </div>
          ) : (
            <div className="flex gap-2 w-full md:w-auto justify-end">
              <button 
                onClick={handleAiRegenerate}
                disabled={isRegenerating}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm whitespace-nowrap"
                title="使用 Nano Banana 模型根据描述重新生成图片"
              >
                {isRegenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isRegenerating ? '批量重绘中...' : '批量 AI 重绘'}
              </button>
              <div className="w-px h-8 bg-slate-200 mx-1 hidden md:block"></div>
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
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
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
                <th className="px-6 py-4">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredArtworks.map(art => (
                <tr key={art.id} className={`hover:bg-slate-50 transition-colors ${selectedIds.has(art.id) ? 'bg-indigo-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <input type="checkbox" checked={selectedIds.has(art.id)} onChange={() => toggleSelect(art.id)} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="w-20 h-14 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 relative group">
                      <img 
                        src={art.imageUrl} 
                        className="w-full h-full object-cover" 
                        alt="" 
                        loading="lazy" 
                        key={art.imageUrl} // Force re-render if URL changes
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800 line-clamp-1">{art.title}</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">ID: {art.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img src={art.artistAvatar} className="w-6 h-6 rounded-full border border-slate-100" alt="" />
                      <span className="truncate max-w-[100px]">{art.artist}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                      (art.status || 'approved') === 'approved' ? 'bg-green-100 text-green-700' :
                      (art.status || 'approved') === 'pending' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {art.status === 'pending' ? '待审核' : art.status === 'rejected' ? '已驳回' : '已发布'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Likes: {art.likes}</div>
                    <div className="flex items-center gap-1 mt-1"><Eye className="w-3 h-3" /> Views: {art.views}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setEditingArtwork(art)}
                      className="p-1.5 hover:bg-slate-200 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-1"
                      title="编辑 / 重绘"
                    >
                      <Edit2 className="w-4 h-4" />
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

const AdminView: React.FC<AdminViewProps> = ({ initialTab = 'users' }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const renderContent = () => {
    switch (activeTab) {
      case 'monitor': return <SystemMonitor />;
      case 'users': return <UserManagement />;
      case 'content': return <ContentCMS />;
      case 'settings': return (
        <div className="flex flex-col items-center justify-center h-96 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
           <Settings className="w-12 h-12 mb-4 text-slate-300" />
           <h3 className="text-lg font-bold text-slate-600">系统设置</h3>
           <p className="text-sm">全局参数配置模块正在开发中...</p>
        </div>
      );
      case 'dev': return (
        <div className="flex flex-col items-center justify-center h-96 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
           <Terminal className="w-12 h-12 mb-4 text-slate-300" />
           <h3 className="text-lg font-bold text-slate-600">开发者中心</h3>
           <p className="text-sm">API 管理与日志调试模块正在开发中...</p>
        </div>
      );
      case 'auth_audit': return (
        <div className="flex flex-col items-center justify-center h-96 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
           <UserCheck className="w-12 h-12 mb-4 text-slate-300" />
           <h3 className="text-lg font-bold text-slate-600">认证审核</h3>
           <p className="text-sm">实名认证审核模块正在开发中...</p>
        </div>
      );
      default: return <UserManagement />;
    }
  };

  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'monitor': return { title: '系统监控', desc: '实时服务器状态与性能指标' };
      case 'users': return { title: '用户管理', desc: '全平台用户账号、角色与权限控制' };
      case 'content': return { title: '内容管理 (CMS)', desc: '作品审核、推荐与违规处理' };
      case 'settings': return { title: '系统设置', desc: '平台基础配置与参数' };
      case 'dev': return { title: '开发者中心', desc: 'API 密钥与系统日志' };
      case 'auth_audit': return { title: '认证审核', desc: '用户实名与企业资质审核' };
      default: return { title: '管理后台', desc: '系统管理中心' };
    }
  }

  const { title, desc } = getHeaderInfo();

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        <p className="text-slate-500 text-sm mt-1">{desc}</p>
      </div>
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminView;