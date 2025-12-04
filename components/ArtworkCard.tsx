
import React, { useState } from 'react';
import { Heart, Eye, BadgeCheck, Sparkles, Flame, User } from 'lucide-react';
import { Artwork } from '../types';

interface ArtworkCardProps {
  artwork?: Artwork;
  isLoading?: boolean;
  isLiked?: boolean;
  onLike?: (id: string, e: React.MouseEvent) => void;
  onHire?: (artist: string, e: React.MouseEvent) => void;
  onNavigateToProfile?: (artist: string, e: React.MouseEvent) => void;
  onClick?: (artwork: Artwork) => void;
  style?: React.CSSProperties;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto'; // New prop for flexibility
  showAvatar?: boolean;
  className?: string;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ 
  artwork, 
  isLoading = false, 
  isLiked = false, 
  onLike, 
  onNavigateToProfile,
  onClick,
  style,
  aspectRatio = 'auto',
  showAvatar = true,
  className = ''
}) => {
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Load+Error';
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLiked) {
      setIsAnimatingLike(true);
      setTimeout(() => setIsAnimatingLike(false), 500);
    }
    onLike?.(artwork?.id || '', e);
  };

  const handleCardClick = () => {
    if (onClick && artwork) {
      onClick(artwork);
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigateToProfile?.(artwork?.artist || '', e);
  };

  // Aspect Ratio Classes
  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-[3/4]',
    auto: '' // Let content decide height (good for masonry)
  }[aspectRatio];

  // === SKELETON LOADING STATE ===
  if (isLoading || !artwork) {
    return (
      <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-full flex flex-col ${className}`} style={style}>
        <div className={`relative bg-slate-200 overflow-hidden ${aspectRatio === 'auto' ? 'aspect-[4/3]' : aspectClass}`}>
          <div className="absolute inset-0 animate-shimmer"></div>
        </div>
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
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === RENDERED STATE ===
  return (
    <div 
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 break-inside-avoid mb-6 flex flex-col border border-slate-100 ${className}`}
      style={style}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-slate-100 cursor-pointer ${aspectClass}`}>
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform block"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
           <div className="flex justify-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none group-hover:pointer-events-auto">
             <button 
               onClick={handleLikeClick}
               className={`p-2 rounded-full backdrop-blur-md border transition-all active:scale-90 ${
                 isLiked ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
               }`}
             >
               <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''} ${isAnimatingLike ? 'animate-heart-pop' : ''}`} />
             </button>
           </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
           {artwork.likes > 3000 && (
              <span className="bg-amber-500/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" /> 热门
              </span>
           )}
        </div>
        {artwork.isAiGenerated && (
          <div className="absolute top-3 right-3 pointer-events-none">
             <span className="bg-purple-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
               <Sparkles className="w-3 h-3" /> AI
             </span>
          </div>
        )}
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
            <h3 
              className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors"
              title={artwork.title}
            >
              {artwork.title}
            </h3>
        </div>

        {/* Tags */}
        {artwork.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
              {artwork.tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-center truncate max-w-[80px]">
                    {tag}
                </span>
              ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          {showAvatar && (
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
              onClick={handleProfileClick}
            >
              <img 
                src={artwork.artistAvatar} 
                alt={artwork.artist} 
                className="w-6 h-6 rounded-full border border-slate-100 object-cover flex-shrink-0" 
                onError={handleImageError}
              />
              <span className="text-xs font-medium text-slate-600 truncate max-w-[100px]">
                {artwork.artist}
              </span>
              {artwork.isVerified && <BadgeCheck className="w-3 h-3 text-blue-500 flex-shrink-0" />}
            </div>
          )}
          
          <div className="flex items-center gap-3 text-xs text-slate-400">
             <span className="flex items-center gap-1">
               <Eye className="w-3 h-3" /> 
               {artwork.views > 1000 ? (artwork.views/1000).toFixed(1) + 'k' : artwork.views}
             </span>
             <span className={`flex items-center gap-1 ${isLiked ? 'text-rose-500' : ''}`}>
               <Heart className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} /> 
               {isLiked ? artwork.likes + 1 : artwork.likes}
             </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
