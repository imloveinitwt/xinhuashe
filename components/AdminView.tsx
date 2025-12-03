
import React, { useState } from 'react';
import { 
  Users, Shield, Settings, Search, Edit2, Trash2, CheckCircle, XCircle, 
  MoreVertical, Lock, Key, AlertTriangle 
} from 'lucide-react';
import { MOCK_USERS_ADMIN_VIEW, ROLE_DEFINITIONS } from '../constants';
import { User, RoleDefinition, PermissionCode, UserRole } from '../types';

const AdminView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'roles'>('users');
  const [users, setUsers] = useState(MOCK_USERS_ADMIN_VIEW);
  
  // For demo, we just toggle permissions in state if we were to build a full editor
  const [roles, setRoles] = useState<RoleDefinition[]>(ROLE_DEFINITIONS);

  const StatusBadge = ({ active }: { active: boolean }) => (
    <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
      active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
    }`}>
      {active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {active ? '正常' : '禁用'}
    </span>
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">系统管理后台</h2>
          <p className="text-slate-500 text-sm mt-1">
            RBAC 权限控制中心 | 当前操作员: 系统根管理员
          </p>
        </div>
        <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <button 
            onClick={() => setActiveSubTab('users')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === 'users' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" /> 用户管理
          </button>
          <button 
            onClick={() => setActiveSubTab('roles')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
              activeSubTab === 'roles' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" /> 角色与权限
          </button>
        </div>
      </div>

      {activeSubTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-800">用户列表</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="搜索用户名/ID..." 
                className="pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">用户</th>
                <th className="px-6 py-3">角色</th>
                <th className="px-6 py-3">状态</th>
                <th className="px-6 py-3">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
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
                  <td className="px-6 py-4">
                    <StatusBadge active={true} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button className="text-indigo-600 hover:text-indigo-800 font-medium text-xs">编辑</button>
                      <button className="text-slate-500 hover:text-red-600 font-medium text-xs">禁用</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubTab === 'roles' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {roles.map((role) => (
               <div key={role.code} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-slate-50 rounded-lg">
                      <Shield className={`w-6 h-6 ${
                        role.code === 'root_admin' ? 'text-red-500' : 
                        role.code === 'enterprise' ? 'text-indigo-500' : 
                        'text-slate-500'
                      }`} />
                   </div>
                   <button className="text-slate-400 hover:text-indigo-600">
                     <Settings className="w-4 h-4" />
                   </button>
                 </div>
                 <h3 className="font-bold text-lg text-slate-800">{role.name}</h3>
                 <p className="text-sm text-slate-500 mt-1 h-10">{role.description}</p>
                 
                 <div className="mt-4 pt-4 border-t border-slate-50">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">权限预览</h4>
                   <div className="flex flex-wrap gap-1">
                     {role.defaultPermissions.slice(0, 5).map(perm => (
                       <span key={perm} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                         {perm.split('_')[0]}
                       </span>
                     ))}
                     {role.defaultPermissions.length > 5 && (
                       <span className="text-[10px] bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded">
                         +{role.defaultPermissions.length - 5}
                       </span>
                     )}
                   </div>
                 </div>
               </div>
             ))}
             
             {/* Add Role Card */}
             <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-500 cursor-pointer transition-colors min-h-[240px]">
               <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                 <Settings className="w-6 h-6" />
               </div>
               <span className="font-medium">配置新角色</span>
             </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-amber-800">系统安全提示</h4>
              <p className="text-xs text-amber-700 mt-1">
                修改“系统根管理员”的权限可能会导致系统无法访问。所有权限变更操作均会被记录在审计日志中。
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminView;
