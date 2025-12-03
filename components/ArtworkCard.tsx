import React, { useState } from 'react';
import { Heart, Eye, BadgeCheck, Sparkles, Flame } from 'lucide-react';
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
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Load+Error';
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    if (!isLiked) {
      setIsAnimatingLike(true);
      setTimeout(() => setIsAnimatingLike(false), 500);
    }
    onLike?.(artwork?.id || '', e);
  };

  // === SKELETON LOADING STATE ===
  if (isLoading || !artwork) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-full flex flex-col" style={style}>
        {/* Image Skeleton with Shimmer */}
        <div className="relative aspect-[4/3] bg-slate-200 overflow-hidden">
          <div className="absolute inset-0 animate-shimmer"></div>
        </div>
        {/* Content Skeleton */}
        <div className="p-4 space-y-3 flex-1">
          <div className="h-5 bg-slate-200 rounded w-3/4 overflow-hidden relative">
             <div className="absolute inset-0 animate-shimmer"></div>
          </div>
          <div className="flex gap-2 mb-1">
             <div className="h-5 bg-slate-100 rounded w-12 overflow-hidden relative"><div className="absolute inset-0 animate-shimmer"></div></div>
             <div className="h-5 bg-slate-100 rounded w-16 overflow-hidden relative"><div className="absolute inset-0 animate-shimmer"></div></div>
          </div>
          <div className="flex items-center justify-between pt-2 mt-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden relative">
                 <div className="absolute inset-0 animate-shimmer"></div>
              </div>
              <div className="space-y-1">
                <div className="h-3 bg-slate-200 rounded w-20 overflow-hidden relative"><div className="absolute inset-0 animate-shimmer"></div></div>
                <div className="h-2 bg-slate-200 rounded w-12 overflow-hidden relative"><div className="absolute inset-0 animate-shimmer"></div></div>
              </div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-16 overflow-hidden relative"><div className="absolute inset-0 animate-shimmer"></div></div>
          </div>
        </div>
      </div>
    );
  }

  // === RENDERED STATE ===
  return (
    <div 
      className="group relative bg-white rounded-2xl overflow-hidden shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] card-hover transition-all duration-300 break-inside-avoid h-full flex flex-col"
      style={style}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-slate-100 aspect-[4/3] cursor-pointer" onClick={(e) => onNavigateToProfile?.(artwork.artist, e)}>
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
           
           {/* Bottom Info in Overlay - Simplified to just Like button since tags moved to body */}
           <div className="flex justify-end items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none group-hover:pointer-events-auto">
             <button 
               onClick={handleLikeClick}
               className={`p-2.5 rounded-full backdrop-blur-md border transition-all btn-press ${
                 isLiked ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
               }`}
             >
               <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''} ${isAnimatingLike ? 'animate-heart-pop' : ''}`} />
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
             <span className="glass text-slate-800 text-[10px] px-2 py-1 rounded-md font-bold shadow-sm flex items-center gap-1 border border-white/40">
               <Sparkles className="w-3 h-3 text-purple-600" /> AI
             </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col justify-between flex-1 relative z-10 bg-white">
        <div>
            <h3 
              className="font-bold text-slate-800 text-base mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors cursor-pointer"
              onClick={(e) => onNavigateToProfile?.(artwork.artist, e)}
              title={artwork.title}
            >
              {artwork.title}
            </h3>

            {/* Tags with Custom Tooltip */}
            <div className="flex flex-wrap gap-2 mb-4">
                {artwork.tags.slice(0, 3).map(tag => (
                  <div key={tag} className="group/tag relative">
                    <span className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md truncate max-w-[60px] block cursor-default hover:border-indigo-200 hover:text-indigo-600 transition-colors">
                        #{tag}
                    </span>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tag:block bg-slate-800 text-white text-[10px] font-medium px-2 py-1 rounded shadow-xl z-20 whitespace-nowrap animate-fade-in pointer-events-none">
                        {tag}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                ))}
            </div>
        </div>

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
             <span className="flex items-center gap-1 hover:text-slate-600 transition-colors">
               <Eye className="w-3.5 h-3.5" /> 
               {artwork.views > 1000 ? (artwork.views/1000).toFixed(1) + 'k' : artwork.views}
             </span>
             <span 
               className={`flex items-center gap-1 transition-colors cursor-pointer ${isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
               onClick={handleLikeClick}
             >
               <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''} ${isAnimatingLike ? 'animate-heart-pop' : ''}`} /> 
               {isLiked ? artwork.likes + 1 : artwork.likes}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;