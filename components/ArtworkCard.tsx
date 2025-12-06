
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
  onClick?: (artwork: Artwork) => void;
  style?: React.CSSProperties;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
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
    auto: '' 
  }[aspectRatio];

  // === SKELETON LOADING STATE ===
  if (isLoading || !artwork) {
    return (
      <div className={`flex flex-col gap-3 ${className}`} style={style}>
        <div className={`relative bg-slate-200 rounded-xl overflow-hidden ${aspectRatio === 'auto' ? 'aspect-[4/3]' : aspectClass}`}>
          <div className="absolute inset-0 animate-shimmer"></div>
        </div>
        <div className="space-y-2 px-1">
          <div className="h-4 bg-slate-200 rounded w-3/4 overflow-hidden relative">
             <div className="absolute inset-0 animate-shimmer"></div>
          </div>
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-200 overflow-hidden relative"><div className="absolute inset-0 animate-shimmer"></div></div>
                <div className="h-3 bg-slate-200 rounded w-16 overflow-hidden relative"><div className="absolute inset-0 animate-shimmer"></div></div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // === RENDERED STATE ===
  return (
    <div 
      className={`group relative flex flex-col ${className}`}
      style={style}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className={`relative rounded-xl overflow-hidden bg-slate-100 cursor-pointer ${aspectClass} shadow-sm group-hover:shadow-md transition-all duration-300 ring-1 ring-slate-900/5 group-hover:ring-indigo-500/30`}>
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className={`w-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out will-change-transform block ${aspectRatio === 'auto' ? 'h-auto' : 'h-full'}`}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Overlay - Gradient on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
        {/* Top Right Like Button */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
           <button 
             onClick={handleLikeClick}
             className={`p-2 rounded-full shadow-lg transition-all active:scale-90 ${
               isLiked 
                 ? 'bg-rose-500 text-white hover:bg-rose-600' 
                 : 'bg-white text-slate-700 hover:bg-slate-100'
             }`}
           >
             <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''} ${isAnimatingLike ? 'animate-heart-pop' : ''}`} />
           </button>
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
           {artwork.likes > 3000 && (
              <span className="bg-amber-500/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                <Flame className="w-3 h-3 fill-current" />
              </span>
           )}
           {artwork.isAiGenerated && (
              <span className="bg-purple-600/90 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI
              </span>
           )}
        </div>
      </div>

      {/* Meta Info */}
      <div className="pt-3 px-1">
        {/* Title */}
        <h3 
          className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1.5"
          title={artwork.title}
        >
          {artwork.title}
        </h3>

        {/* Footer: Artist & Stats */}
        <div className="flex items-center justify-between">
          {showAvatar && (
            <div 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity min-w-0"
              onClick={handleProfileClick}
            >
              <img 
                src={artwork.artistAvatar} 
                alt={artwork.artist} 
                className="w-5 h-5 rounded-full border border-slate-100 object-cover flex-shrink-0" 
                onError={handleImageError}
              />
              <span className="text-xs font-medium text-slate-500 truncate max-w-[100px]">
                {artwork.artist}
              </span>
              {artwork.isVerified && <BadgeCheck className="w-3 h-3 text-blue-500 flex-shrink-0" />}
            </div>
          )}
          
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
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
