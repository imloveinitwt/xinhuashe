
import React from 'react';
import { 
  Clock, Building, CheckCircle2, Zap, Target, 
  ArrowRight, Heart, MapPin, Calendar, Flame
} from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project?: Project;
  onClick?: (project: Project) => void;
  className?: string;
  style?: React.CSSProperties;
  isLoading?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick, className = '', style, isLoading = false }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/800x400/f1f5f9/94a3b8?text=Project+Cover';
  };

  // === HIGH FIDELITY SKELETON ===
  if (isLoading || !project) {
    return (
      <div className={`bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col h-full ${className}`} style={style}>
        {/* Cover Skeleton */}
        <div className="h-44 bg-slate-200 relative">
           <div className="absolute inset-0 animate-shimmer"></div>
           <div className="absolute top-3 left-3 w-20 h-5 bg-white/50 rounded-full"></div>
           <div className="absolute top-3 right-3 w-14 h-5 bg-white/50 rounded-full"></div>
        </div>
        
        {/* Content Skeleton */}
        <div className="p-5 flex-1 flex flex-col space-y-4">
           {/* Tags */}
           <div className="flex gap-2">
              <div className="w-12 h-4 bg-slate-200 rounded relative overflow-hidden"><div className="absolute inset-0 animate-shimmer"></div></div>
              <div className="w-16 h-4 bg-slate-200 rounded relative overflow-hidden"><div className="absolute inset-0 animate-shimmer"></div></div>
           </div>
           
           {/* Title */}
           <div className="space-y-2">
              <div className="w-full h-5 bg-slate-200 rounded relative overflow-hidden"><div className="absolute inset-0 animate-shimmer"></div></div>
              <div className="w-2/3 h-5 bg-slate-200 rounded relative overflow-hidden"><div className="absolute inset-0 animate-shimmer"></div></div>
           </div>

           {/* Client Info */}
           <div className="flex items-center gap-2 pt-1">
              <div className="w-6 h-6 rounded bg-slate-200 relative overflow-hidden"><div className="absolute inset-0 animate-shimmer"></div></div>
              <div className="w-24 h-4 bg-slate-200 rounded relative overflow-hidden"><div className="absolute inset-0 animate-shimmer"></div></div>
           </div>

           {/* Footer */}
           <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
              <div className="space-y-1">
                 <div className="w-10 h-3 bg-slate-100 rounded"></div>
                 <div className="w-20 h-6 bg-slate-200 rounded relative overflow-hidden"><div className="absolute inset-0 animate-shimmer"></div></div>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-200 relative overflow-hidden"><div className="absolute inset-0 animate-shimmer"></div></div>
           </div>
        </div>
      </div>
    );
  }

  // === RENDERED STATE ===
  const getStatusColor = (status: string) => {
    switch (status) {
      case '招募中': return 'bg-indigo-600 text-white shadow-indigo-200';
      case '进行中': return 'bg-emerald-500 text-white shadow-emerald-200';
      case '已完结': return 'bg-slate-500 text-white';
      default: return 'bg-blue-500 text-white';
    }
  };

  const isRecruiting = project.status === '招募中';

  return (
    <div 
      onClick={() => onClick && onClick(project)}
      className={`group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full ring-1 ring-slate-100 hover:ring-indigo-100/50 ${className}`}
      style={style}
    >
      {/* Cover Image */}
      <div className="h-44 bg-slate-100 relative overflow-hidden">
        <img 
          src={project.coverImage || `https://placehold.co/800x400/f1f5f9/94a3b8?text=${project.title}`} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
          alt={project.title}
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Status Badge - Glassmorphism */}
        <div className={`absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg backdrop-blur-md border border-white/20 flex items-center gap-1 ${getStatusColor(project.status)}`}>
           {isRecruiting && <Zap className="w-3 h-3 fill-current" />}
           {project.status}
        </div>

        {/* Deadline Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10">
           <Clock className="w-3 h-3 text-slate-200" /> 
           <span>{project.deadline} 截止</span>
        </div>

        {/* Urgent Hiring Label */}
        {isRecruiting && (
           <div className="absolute bottom-3 left-3 bg-rose-500/90 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 shadow-lg border border-white/10 animate-pulse">
              <Flame className="w-3 h-3 fill-current" />
              急需人才
           </div>
        )}
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col">
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
           {project.category && (
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                 {project.category}
              </span>
           )}
           {project.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                 {tag}
              </span>
           ))}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-slate-900 leading-snug mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
           {project.title}
        </h3>

        {/* Client Info */}
        <div className="flex items-center gap-2 mb-4">
           <div className="p-1 rounded-md bg-slate-100 text-slate-400">
              <Building className="w-3.5 h-3.5" />
           </div>
           <span className="text-xs font-medium text-slate-600 truncate max-w-[150px]">
              {project.client}
           </span>
           <span className="text-emerald-500" title="认证企业">
              <CheckCircle2 className="w-3.5 h-3.5 fill-current/10" />
           </span>
        </div>

        {/* Progress (if active) */}
        {['进行中', '验收中'].includes(project.status) && (
           <div className="mb-4">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1 font-medium">
                 <span>交付进度</span>
                 <span className="text-indigo-600 font-bold">{project.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                 <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
              </div>
           </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
           <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">项目预算</p>
              <div className="text-lg font-extrabold text-slate-900 font-mono flex items-baseline gap-0.5">
                 <span className="text-sm">¥</span>
                 {project.budget.toLocaleString()}
              </div>
           </div>
           
           <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-colors group/btn">
              <ArrowRight className="w-4 h-4 group-hover/btn:-rotate-45 transition-transform" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
