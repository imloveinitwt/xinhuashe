
import React, { useState } from 'react';
import { 
  Users, UserPlus, MoreHorizontal, Shield, Clock, 
  Mail, Search, Filter, CheckCircle2 
} from 'lucide-react';
import { UserRole } from '../types';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'editor' | 'viewer';
  status: 'active' | 'invited' | 'inactive';
  lastActive: string;
}

const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Alex Chen', email: 'alex@technova.com', avatar: 'https://ui-avatars.com/api/?name=Alex+Chen&background=random', role: 'admin', status: 'active', lastActive: '5分钟前' },
  { id: '2', name: 'Sarah Wu', email: 'sarah@technova.com', avatar: 'https://ui-avatars.com/api/?name=Sarah+Wu&background=random', role: 'editor', status: 'active', lastActive: '1小时前' },
  { id: '3', name: 'Mike Ross', email: 'mike@technova.com', avatar: 'https://ui-avatars.com/api/?name=Mike+Ross&background=random', role: 'editor', status: 'active', lastActive: '2天前' },
  { id: '4', name: 'Emily Zhang', email: 'emily@technova.com', avatar: 'https://ui-avatars.com/api/?name=Emily+Z&background=random', role: 'viewer', status: 'invited', lastActive: '-' },
];

const TeamView: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM_MEMBERS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> 团队协作
          </h2>
          <p className="text-slate-500 text-sm mt-1">管理团队成员、权限及邀请新成员</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-all">
          <UserPlus className="w-4 h-4" /> 邀请成员
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="搜索成员..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 flex items-center gap-2 text-sm">
            <Filter className="w-4 h-4" /> 筛选
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">成员</th>
                <th className="px-6 py-4">角色权限</th>
                <th className="px-6 py-4">状态</th>
                <th className="px-6 py-4">最近活跃</th>
                <th className="px-6 py-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} className="w-9 h-9 rounded-full bg-slate-200" alt={member.name} />
                      <div>
                        <div className="font-bold text-slate-800">{member.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {member.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      member.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                      member.role === 'editor' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <Shield className="w-3 h-3" />
                      {member.role === 'admin' ? '管理员' : member.role === 'editor' ? '编辑者' : '访问者'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {member.status === 'active' ? (
                      <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> 已激活
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-600 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div> 邀请中
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5" /> {member.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center bg-slate-50/30">
           <span>共 {filteredMembers.length} 位成员</span>
           <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded">当前套餐支持 5 人协作</span>
        </div>
      </div>
    </div>
  );
};

export default TeamView;
