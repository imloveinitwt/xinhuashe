
import React from 'react';
import { Heart, Eye, Briefcase, BadgeCheck, Sparkles, Flame } from 'lucide-react';
import { Artwork } from '../types';

interface ArtworkCardProps {
  artwork?: Artwork;
  isLoading?: boolean;
  isLiked?: boolean;
  onLike?: (id: string, e: React.MouseEvent) => void;
  onHire?: (artist: string, e: React.MouseEvent) => void;
  onNavigateToProfile?: (artist: string, e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ 
  artwork, 
  isLoading = false, 
  isLiked = false, 
  onLike, 
  onHire, 
  onNavigateToProfile,
  style
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Load+Error';
  };

  // === SKELETON LOADING STATE ===
  if (isLoading || !artwork) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-full flex flex-col" style={style}>
        {/* Image Skeleton */}
        <div className="relative aspect-[4/3] bg-slate-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-[shimmer_2s_infinite]"></div>
        </div>
        {/* Content Skeleton */}
        <div className="p-4 space-y-3 flex-1">
          <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse"></div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-3 bg-slate-200 rounded w-20 animate-pulse"></div>
                <div className="h-2 bg-slate-200 rounded w-12 animate-pulse"></div>
              </div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // === RENDERED STATE ===
  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.2)] transition-all duration-300 break-inside-avoid transform hover:-translate-y-1 h-full flex flex-col"
      style={style}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-slate-100 aspect-[4/3]">
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
           {/* Hire Button */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75">
              <button 
                onClick={(e) => onHire?.(artwork.artist, e)}
                className="w-full bg-white text-slate-900 hover:bg-indigo-50 font-bold py-3 rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4 text-indigo-600" />
                雇佣画师
              </button>
           </div>

           {/* Bottom Info in Overlay */}
           <div className="flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
             <div className="text-white flex-1 pr-4">
               <div className="flex flex-wrap gap-2 mb-2">
                 {artwork.tags.slice(0, 2).map(tag => (
                   <span key={tag} className="text-[10px] font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded text-white">
                     #{tag}
                   </span>
                 ))}
               </div>
             </div>
             <button 
               onClick={(e) => onLike?.(artwork.id, e)}
               className={`p-2.5 rounded-full backdrop-blur-md border transition-all ${isLiked ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'}`}
             >
               <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
             </button>
           </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
           {artwork.likes > 2000 && (
              <span className="bg-amber-400 text-white text-[10px] px-2 py-1 rounded-md font-bold shadow-sm flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" /> 热门
              </span>
           )}
        </div>
        {artwork.isAiGenerated && (
          <div className="absolute top-3 right-3">
             <span className="bg-purple-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-md font-bold shadow-sm flex items-center gap-1">
               <Sparkles className="w-3 h-3" /> AI
             </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <h3 className="font-bold text-slate-800 text-base mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {artwork.title}
        </h3>
        <div className="flex items-center justify-between mt-auto">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-75 transition-opacity"
            onClick={(e) => onNavigateToProfile?.(artwork.artist, e)}
          >
            <img 
              src={artwork.artistAvatar} 
              alt={artwork.artist} 
              className="w-8 h-8 rounded-full border border-slate-100 object-cover" 
              onError={handleImageError}
            />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                {artwork.artist}
                {artwork.isVerified && <BadgeCheck className="w-3 h-3 text-blue-500" />}
              </span>
              <span className="text-[10px] text-slate-400">2小时前</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
             <span className="flex items-center gap-1 hover:text-slate-600">
               <Eye className="w-3.5 h-3.5" /> 
               {artwork.views > 1000 ? (artwork.views/1000).toFixed(1) + 'k' : artwork.views}
             </span>
             <span className={`flex items-center gap-1 ${isLiked ? 'text-rose-500' : 'hover:text-slate-600'}`}>
               <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} /> 
               {isLiked ? artwork.likes + 1 : artwork.likes}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
