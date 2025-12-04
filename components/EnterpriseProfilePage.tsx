
import React from 'react';
import { ArrowLeft, MapPin, Globe, Users, Building, Flag, CheckCircle2, Briefcase } from 'lucide-react';
import { MOCK_ENTERPRISE_PROFILE, MOCK_PROJECTS } from '../constants';
import { User } from '../types';

interface EnterpriseProfilePageProps {
  onBack: () => void;
  onTriggerLogin?: () => void;
  user?: User | null;
}

const EnterpriseProfilePage: React.FC<EnterpriseProfilePageProps> = ({ onBack, onTriggerLogin, user }) => {
  const profile = MOCK_ENTERPRISE_PROFILE;
  // Mock active projects for this enterprise
  const activeProjects = MOCK_PROJECTS.filter(p => p.status === '招募中').slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header / Nav */}
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> 返回
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
           <div className="h-32 bg-gradient-to-r from-slate-800 to-indigo-900"></div>
           <div className="px-8 pb-8">
              <div className="flex flex-col md:flex-row gap-6 items-start -mt-12">
                 <div className="p-1 bg-white rounded-xl shadow-md">
                    <img src={profile.logo} alt="Logo" className="w-24 h-24 rounded-lg bg-slate-50 object-cover" />
                 </div>
                 <div className="pt-14 md:pt-4 flex-1">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                       <div>
                         <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                           {profile.name}
                           <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                         </h1>
                         <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {profile.industry}</span>
                            <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {profile.size}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> 北京·朝阳</span>
                            <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {profile.website}</span>
                         </div>
                       </div>
                       <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                         关注企业
                       </button>
                    </div>
                 </div>
              </div>
              
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="lg:col-span-2 space-y-6">
                    <section>
                       <h3 className="font-bold text-slate-900 text-lg mb-3">企业简介</h3>
                       <p className="text-slate-600 leading-relaxed text-sm">
                         {profile.description}
                       </p>
                    </section>
                    
                    <section>
                       <h3 className="font-bold text-slate-900 text-lg mb-3">核心业务</h3>
                       <div className="flex flex-wrap gap-2">
                          {profile.coreBusiness.map(tag => (
                            <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm border border-slate-200">
                              {tag}
                            </span>
                          ))}
                       </div>
                    </section>
                 </div>

                 <div className="lg:col-span-1">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                       <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                         <Flag className="w-4 h-4 text-indigo-600" /> 发展历程
                       </h3>
                       <div className="space-y-4 relative border-l-2 border-slate-200 ml-1.5 pl-4">
                          {profile.history.map((h, i) => (
                            <div key={i} className="relative">
                               <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-300 border-2 border-white"></div>
                               <span className="text-xs font-bold text-indigo-600 block mb-0.5">{h.year}</span>
                               <h4 className="text-sm font-bold text-slate-800">{h.title}</h4>
                               <p className="text-xs text-slate-500 mt-1">{h.description}</p>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Active Projects */}
        <div>
           <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
             <Briefcase className="w-6 h-6 text-indigo-600" />
             热招企划
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeProjects.map(project => (
                <div key={project.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow cursor-pointer">
                   <div className="flex justify-between items-start mb-3">
                      <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded font-bold">
                        {project.phase}
                      </span>
                      <span className="text-slate-400 text-xs">{project.deadline} 截止</span>
                   </div>
                   <h3 className="font-bold text-slate-800 mb-2 line-clamp-1">{project.title}</h3>
                   <div className="text-xl font-bold text-indigo-600 mb-4">¥{project.budget.toLocaleString()}</div>
                   <div className="border-t border-slate-100 pt-4 flex justify-between items-center">
                      <span className="text-xs text-slate-500">需要: UI设计 / 插画</span>
                      <button className="text-sm font-bold text-indigo-600 hover:underline">查看详情</button>
                   </div>
                </div>
              ))}
              {activeProjects.length === 0 && (
                <div className="col-span-full py-10 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                   暂无公开招募的企划
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
};

export default EnterpriseProfilePage;
