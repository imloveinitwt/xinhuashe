
import React, { useState, useMemo } from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  alt?: string;
  onClick?: () => void;
}

const SIZE_MAP = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl',
  '3xl': 'w-32 h-32 text-4xl',
};

// Generate a deterministic color based on a string
const stringToColor = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const c1 = (hash & 0x00ffffff).toString(16).toUpperCase();
  const c2 = ((hash >> 4) & 0x00ffffff).toString(16).toUpperCase();
  
  return {
    from: '#' + '00000'.substring(0, 6 - c1.length) + c1,
    to: '#' + '00000'.substring(0, 6 - c2.length) + c2
  };
};

const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  name = 'User', 
  size = 'md', 
  className = '', 
  alt,
  onClick 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate distinct background for fallback
  const bgColors = useMemo(() => stringToColor(name), [name]);
  
  const initials = useMemo(() => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }, [name]);

  const sizeClass = SIZE_MAP[size];

  return (
    <div 
      className={`relative rounded-full overflow-hidden flex-shrink-0 select-none ${sizeClass} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role="img"
      aria-label={alt || name}
    >
      {src && !imageError ? (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse" />
          )}
          <img 
            src={src} 
            alt={alt || name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy" 
          />
        </>
      ) : (
        // Fallback / Default Avatar
        <div 
          className="w-full h-full flex items-center justify-center text-white font-bold shadow-inner"
          style={{
            background: `linear-gradient(135deg, ${bgColors.from}, ${bgColors.to})`
          }}
        >
          {initials || <User className="w-[50%] h-[50%]" />}
        </div>
      )}
    </div>
  );
};

export default Avatar;
