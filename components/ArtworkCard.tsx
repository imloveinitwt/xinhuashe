
import React, { useState, useEffect } from 'react';
import { Heart, Eye, BadgeCheck, Sparkles, Flame } from 'lucide-react';
import { Artwork } from '../types';
import { getImage } from '../mockData'; // Import local helper

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
  isAuthenticated?: boolean;
  onTriggerLogin?: () => void;
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
  className = '',
  isAuthenticated = false,
  onTriggerLogin
}) => {
  const [isAnimatingLike, setIsAnimatingLike] = useState(false);
  
  // Local state for optimistic updates
  const [currentLikes, setCurrentLikes] = useState(artwork?.likes || 0);
  const [currentLiked, setCurrentLiked] = useState(isLiked);

  // Sync local state when props change
  useEffect(() => {
    if (artwork) setCurrentLikes(artwork.likes);
  }, [artwork?.likes]);

  useEffect(() => {
    setCurrentLiked(isLiked);
  }, [isLiked]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback to locally generated SVG based on title
    e.currentTarget.src = getImage(artwork?.title || 'Artwork Fallback', 600, 400);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Check authentication
    if (onTriggerLogin && !isAuthenticated) {
      onTriggerLogin();
      return;
    }

    // Optimistic Update
    if (!currentLiked) {
      setIsAnimatingLike(true);
      setTimeout(() => setIsAnimatingLike(false), 500);
    }
    
    const newLikedState = !currentLiked;
    setCurrentLiked(newLikedState);
    setCurrentLikes(prev => newLikedState ? prev + 1 : prev - 1);

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

  // === HIGH FIDELITY SKELETON ===
  if (isLoading || !artwork) {
    return (
      <div className={`flex flex-col gap-3 ${className}`} style={style}>
        {/* Image Placeholder */}
        <div className={`relative bg-slate-200 rounded-2xl overflow-hidden ${aspectRatio === 'auto' ? 'aspect-[4/3]' : aspectClass} border border-slate-100`}>
          <div className="absolute inset-0 animate-shimmer"></div>
          {/* Mock Badge */}
          <div className="absolute top-3 left-3 w-10 h-5 bg-white/50 rounded-full"></div>
        </div>
        
        {/* Content Placeholder */}
        <div className="px-1 space-y-2.5">
          {/* Title Line */}
          <div className="h-5 bg-slate-200 rounded-md w-3/4 relative overflow-hidden">
             <div className="absolute inset-0 animate-shimmer"></div>
          </div>
          
          {/* Meta Line */}
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-slate-200 relative overflow-hidden">
                   <div className="absolute inset-0 animate-shimmer"></div>
                </div>
                <div className="h-3 bg-slate-200 rounded w-20 relative overflow-hidden">
                   <div className="absolute inset-0 animate-shimmer"></div>
                </div>
             </div>
             <div className="h-3 bg-slate-200 rounded w-12 relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer"></div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // === RENDERED STATE ===
  return (
    <div 
      className={`group relative flex flex-col gap-3 ${className}`}
      style={style}
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className={`relative rounded-2xl overflow-hidden bg-slate-100 cursor-pointer ${aspectClass} shadow-sm group-hover:shadow-xl transition-all duration-500 ring-1 ring-black/5`}>
        <img 
          src={artwork.imageUrl} 
          alt={artwork.title} 
          className={`w-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out will-change-transform block ${aspectRatio === 'auto' ? 'h-auto' : 'h-full'}`}
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Gradient Overlay (Visible on Hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        
        {/* Top Right Like Button (Glassmorphism) */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-4px] group-hover:translate-y-0">
           <button 
             onClick={handleLikeClick}
             className={`p-2.5 rounded-full shadow-lg transition-all active:scale-90 border border-white/20 backdrop-blur-md ${
               currentLiked 
                 ? 'bg-rose-50 text-white hover:bg-rose-600' 
                 : 'bg-black/30 text-white hover:bg-white hover:text-rose-500'
             }`}
           >
             <Heart className={`w-4 h-4 ${currentLiked ? 'fill-current' : ''} ${isAnimatingLike ? 'animate-heart-pop' : ''}`} />
           </button>
        </div>
        
        {/* Badges (Top Left) */}
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
           {currentLikes > 3000 && (
              <span className="bg-amber-500/90 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm flex items-center gap-1 border border-white/10">
                <Flame className="w-3 h-3 fill-current" /> 热门
              </span>
           )}
        </div>

        {/* Bottom Right Stats (Glassmorphism Pill) - Visible on hover */}
        <div className="absolute bottom-3 right-3 flex items-center gap-3 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-white/90 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
             <span className="flex items-center gap-1.5">
               <Eye className="w-3.5 h-3.5" /> 
               {artwork.views > 1000 ? (artwork.views/1000).toFixed(1) + 'k' : artwork.views}
             </span>
             <div className="w-px h-3 bg-white/20"></div>
             <span className={`flex items-center gap-1.5 ${currentLiked ? 'text-rose-400' : ''}`}>
               <Heart className={`w-3.5 h-3.5 ${currentLiked ? 'fill-current' : ''}`} /> 
               {currentLikes}
             </span>
        </div>
      </div>

      {/* Meta Info (Clean Layout) */}
      <div className="px-1">
        {/* Title */}
        <h3 
          className="font-bold text-slate-900 text-base leading-snug line-clamp-1 group-hover:text-indigo-600 transition-colors mb-1.5"
          title={artwork.title}
        >
          {artwork.title}
        </h3>

        {/* Artist Info */}
        {showAvatar && (
          <div 
            className="flex items-center gap-2 cursor-pointer group/artist min-w-0"
            onClick={handleProfileClick}
          >
            <div className="relative">
               <img 
                 src={artwork.artistAvatar} 
                 alt={artwork.artist} 
                 className="w-6 h-6 rounded-full border border-slate-200 object-cover flex-shrink-0 group-hover/artist:border-indigo-400 transition-colors" 
                 onError={handleImageError}
               />
               {artwork.isVerified && (
                 <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[1px]">
                    <BadgeCheck className="w-3 h-3 text-blue-500 fill-current" />
                 </div>
               )}
            </div>
            <span className="text-sm font-medium text-slate-500 group-hover/artist:text-slate-800 truncate transition-colors">
              {artwork.artist}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtworkCard;
