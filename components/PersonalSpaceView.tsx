
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  MapPin, Link as LinkIcon, Calendar, BadgeCheck, Settings, 
  UserPlus, Mail, Eye, Heart, Share2, PenTool, Image as ImageIcon,
  Grid, List, Check, X, Palette, Layout, Users, Crown, Zap, Loader2,
  Briefcase, Sparkles, MessageCircle, Camera
} from 'lucide-react';
import { User, UserProfile, UserProfilePreferences, ThemeColor, ViewMode } from '../types';
import { MOCK_ARTWORKS, MOCK_CREATORS, MOCK_USERS_ADMIN_VIEW } from '../constants';
import ArtworkDetailModal from './ArtworkDetailModal';
import ArtworkCard from './ArtworkCard';
import Avatar from './Avatar';
import AvatarUploadModal from './AvatarUploadModal';
import { useAuth } from '../contexts/AuthContext';

interface PersonalSpaceViewProps {
  profile: UserProfile;
  currentUser: User | null;
  onNavigate?: (mode: ViewMode) => void;
}

const PersonalSpaceView: React.FC<PersonalSpaceViewProps> = ({ profile, currentUser, onNavigate }) => {
  const { updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'works' | 'likes' | 'about' | 'followers'>('works');
  
  // Customization State
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [preferences, setPreferences] = useState<UserProfilePreferences>(
    profile.preferences || { themeColor: 'indigo', layoutMode: 'grid' }
  );

  // Portfolio Filter State
  const [workFilter, setWorkFilter] = useState('全部');

  // Modal State
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);

  // Sync preferences if profile changes (e.g. navigation)
  useEffect(() => {
    if (profile.preferences) {
      setPreferences(profile.preferences);
    }
  }, [profile]);

  useEffect(() => {
    if (isCustomizeOpen || isAvatarModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCustomizeOpen, isAvatarModalOpen]);
  
  // Logic to determine if the viewer is the owner of this profile
  const isOwner = currentUser?.id && (profile.userId === currentUser.id || profile.displayName === currentUser.name);

  // Filter artworks for this profile
  const userArtworks = useMemo(() => MOCK_ARTWORKS.filter(art => art.artist === profile.displayName), [profile.displayName]);
  
  // Compute available tags for filtering
  const portfolioTags = useMemo(() => {
    const tags = new Set<string>(['全部']);
    userArtworks.forEach(art => {
      art.tags?.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).slice(0, 8); // Top 8 tags
  }, [userArtworks]);

  // Apply filter
  const filteredWorks = userArtworks.filter(art => 
    workFilter === '全部' || art.tags?.includes(workFilter)
  );

  const likedArtworks = MOCK_ARTWORKS.slice(0, 4); 

  // Mock Followers Data (Mix of creators and admin users for demo)
  const mockFollowers = [...MOCK_CREATORS, ...MOCK_USERS_ADMIN_VIEW].slice(0, 8).map(u => ({
    id: u.id,
    name: 'name' in u ? u.name : 'Unknown',
    avatar: u.avatar,
    isVerified: 'isVerified' in u ? u.isVerified : false,
    role: 'roleName' in u ? u.roleName : 'Creator'
  }));

  const handleEditClick = () => {
    setIsEditLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setIsEditLoading(false);
      setIsCustomizeOpen(true);
    }, 800);
  };

  const handleAvatarSave = async (base64Image: string) => {
    // 1. Update global user state (so sidebar/header updates)
    updateUser({ avatar: base64Image });
    // 2. In a real app, we would also update 'profile.avatar', but since 'profile' prop 
    // comes from MOCK_DATA generator based on ID, we rely on the fact that if isOwner is true,
    // currentUser.avatar IS the profile avatar in this context for immediate feedback.
    setIsAvatarModalOpen(false);
  };

  // Helpers for Dynamic Styling
  const getThemeColorClass = (type: 'text' | 'bg' | 'border' | 'ring') => {
    const color = preferences.themeColor;
    const map: Record<ThemeColor, string> = {
      indigo: `${type}-indigo-600`,
      pink: `${type}-pink-500`,
      blue: `${type}-blue-500`,
      purple: `${type}-purple-600`,
      emerald: `${type}-emerald-500`,
    };
    return map[color] || map.indigo;
  };

  const getHoverBgClass = () => {
    const color = preferences.themeColor;
    const map: Record<ThemeColor, string> = {
      indigo: 'hover:bg-indigo-700',
      pink: 'hover:bg-pink-600',
      blue: 'hover:bg-blue-600',
      purple: 'hover:bg-purple-700',
      emerald: 'hover:bg-emerald-600',
    };
    return map[color] || map.indigo;
  };

  const handleCoverError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/1200x400/1e293b/64748b?text=Cover+Image';
  };

  const handleArtworkError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Load+Error';
  };

  const hasMembership = profile.membershipLevel && profile.membershipLevel !== 'none';

  // Use current user avatar if owner, otherwise profile avatar
  const displayAvatar = isOwner && currentUser ? currentUser.avatar : profile.avatar;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      
      {/* Artwork Modal */}
      <ArtworkDetailModal 
        artworkId={selectedArtworkId}
        onClose={() => setSelectedArtworkId(null)}
        currentUser={currentUser}
      />

      {/* Avatar Upload Modal */}
      <AvatarUploadModal 
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSave={handleAvatarSave}
      />

      {/* Customization Modal */}
      {isCustomizeOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-500" />
                空间个性化设置
              </h3>
              <button onClick={() => setIsCustomizeOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              
              {/* Theme Color Selector */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block flex items-center gap-2">
                  <Palette className="w-4 h-4" /> 主题色调
                </label>
                <div className="flex gap-4">
                  {(['indigo', 'pink', 'blue', 'purple', 'emerald'] as ThemeColor[]).map(color => (
                    <button
                      key={color}
                      onClick={() => setPreferences(p => ({ ...p, themeColor: color }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                        preferences.themeColor === color ? 'border-slate-600 scale-110' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: color === 'indigo' ? '#4f46e5' : color === 'pink' ? '#ec4899' : color === 'blue' ? '#3b82f6' : color === 'purple' ? '#9333ea' : '#10b981' }}
                    >
                      {preferences.themeColor === color && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Selector */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block flex items-center gap-2">
                  <Layout className="w-4 h-4" /> 作品展示布局
                </label>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setPreferences(p => ({ ...p, layoutMode: 'grid' }))}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      preferences.layoutMode === 'grid' 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <Grid className="w-6 h-6" />
                    <span className="text-xs font-medium">网格视图</span>
                  </button>
                  <button 
                    onClick={() => setPreferences(p => ({ ...p, layoutMode: 'list' }))}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      preferences.layoutMode === 'list' 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    <List className="w-6 h-6" />
                    <span className="text-xs font-medium">列表视图</span>
                  </button>
                </div>
              </div>

            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => setIsCustomizeOpen(false)}
                className={`px-6 py-2 rounded-lg text-white font-medium text-sm transition-colors ${getThemeColorClass('bg')} ${getHoverBgClass()}`}
              >
                保存设置
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 1. Cover Image */}
      <div className="h-64 md:h-80 w-full relative group overflow-hidden">
        <img 
          src={profile.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover bg-slate-900 transition-transform duration-700 group-hover:scale-105"
          onError={handleCoverError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent"></div>
        
        {isOwner && (
          <button className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-colors flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
            <ImageIcon className="w-4 h-4" />
            更换封面
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 2. Sidebar / Info Card */}
          <div className="lg:w-80 flex-shrink-0">
             <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 flex flex-col items-center lg:items-start text-center lg:text-left relative overflow-hidden">
                {/* Avatar */}
                <div className="relative group/avatar">
                  <div className={`rounded-full border-4 border-white shadow-lg mb-4 bg-white relative z-10`}>
                    <Avatar 
                      src={displayAvatar} 
                      name={profile.displayName} 
                      size="3xl"
                      className="border-4 border-white"
                    />
                  </div>
                  
                  {isOwner && (
                    <button 
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="absolute bottom-4 right-0 z-20 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-md border-2 border-white opacity-0 group-hover/avatar:opacity-100 transition-all hover:bg-indigo-600 cursor-pointer"
                      title="更换头像"
                    >
                       <Camera className="w-4 h-4" />
                    </button>
                  )}

                  {hasMembership && !isOwner && (
                    <div className="absolute bottom-4 right-0 z-20 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-slate-50">
                       <Crown className={`w-4 h-4 ${profile.membershipLevel === 'max' ? 'text-amber-500 fill-amber-500' : 'text-indigo-500 fill-indigo-500'}`} />
                    </div>
                  )}
                </div>
                
                {/* Name & Verify */}
                <div className="mb-2 w-full">
                  <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center lg:justify-start gap-2">
                    {profile.displayName}
                    {profile.isVerified && <BadgeCheck className={`w-5 h-5 ${getThemeColorClass('text')} fill-current text-white`} />}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">@{profile.id.split('_')[1] || 'user'}</p>
                </div>

                {/* Badges Row (Credit + Membership) */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                  {profile.creditScore && (
                    <div 
                      onClick={() => onNavigate?.('credit_score')}
                      className="bg-slate-50 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      <span className="text-xs font-bold text-slate-700">信用 {profile.creditScore}</span>
                    </div>
                  )}
                  {hasMembership && (
                    <div className={`px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm ${
                      profile.membershipLevel === 'max' 
                        ? 'bg-amber-50 border-amber-200 text-amber-700' 
                        : 'bg-indigo-50 border-indigo-200 text-indigo-700'
                    }`}>
                      <Crown className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold">{profile.membershipLevel === 'max' ? 'MAX会员' : 'PRO会员'}</span>
                    </div>
                  )}
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between w-full border-y border-slate-100 py-4 mb-6">
                   <div className="text-center flex-1 border-r border-slate-100 last:border-0">
                     <div className="font-bold text-slate-900 text-lg">{profile.stats.followers}</div>
                     <div className="text-xs text-slate-500 font-medium">粉丝</div>
                   </div>
                   <div className="text-center flex-1 border-r border-slate-100 last:border-0">
                     <div className="font-bold text-slate-900 text-lg">{profile.stats.following}</div>
                     <div className="text-xs text-slate-500 font-medium">关注</div>
                   </div>
                   <div className="text-center flex-1">
                     <div className="font-bold text-slate-900 text-lg">{profile.stats.likes > 1000 ? (profile.stats.likes/1000).toFixed(1)+'k' : profile.stats.likes}</div>
                     <div className="text-xs text-slate-500 font-medium">获赞</div>
                   </div>
                </div>

                {/* Bio */}
                <div className="w-full mb-6 text-left">
                   <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">关于我</h4>
                   <p className="text-slate-600 text-sm leading-relaxed line-clamp-4">
                     {profile.bio || "这位创作者很懒，还没有填写简介。"}
                   </p>
                </div>

                {/* Meta Info */}
                <div className="w-full space-y-3 text-sm text-slate-600 mb-6 text-left">
                   <div className="flex items-center gap-3">
                     <MapPin className="w-4 h-4 text-slate-400" />
                     {profile.location}
                   </div>
                   {profile.website && (
                    <div className="flex items-center gap-3 group">
                      <LinkIcon className="w-4 h-4 text-slate-400" />
                      <a href={`https://${profile.website}`} target="_blank" rel="noreferrer" className={`${getThemeColorClass('text')} hover:underline truncate group-hover:opacity-80`}>{profile.website}</a>
                    </div>
                   )}
                   <div className="flex items-center gap-3">
                     <Calendar className="w-4 h-4 text-slate-400" />
                     {profile.joinedDate} 加入
                   </div>
                </div>

                {/* Skills Tags */}
                <div className="w-full mb-8 text-left">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">技能标签</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <span key={skill} className="bg-slate-50 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-md hover:border-indigo-300 transition-colors cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full flex gap-3 mt-auto">
                  {isOwner ? (
                    <>
                      <button 
                        onClick={handleEditClick}
                        disabled={isEditLoading}
                        className={`flex-1 border font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm ${
                          isEditLoading 
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-wait' 
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                        }`}
                      >
                        {isEditLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
                        {isEditLoading ? '加载中...' : '编辑资料'}
                      </button>
                      <button 
                        onClick={() => setIsCustomizeOpen(true)}
                        className="flex-none p-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
                        title="自定义空间"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className={`flex-1 ${getThemeColorClass('bg')} text-white font-bold py-2.5 rounded-xl ${getHoverBgClass()} transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 hover:-translate-y-0.5`}>
                        <UserPlus className="w-4 h-4" />
                        关注
                      </button>
                      <button className="flex-1 bg-white border border-slate-300 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition-all shadow-sm flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" /> 私信
                      </button>
                      <button className="flex-none p-2.5 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-sm">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
             </div>
          </div>

          {/* 3. Main Content Tabs */}
          <div className="flex-1 min-w-0 pt-0 lg:pt-20">
             {/* Sticky Tabs Header */}
             <div className="sticky top-16 z-30 bg-slate-50/95 backdrop-blur-md pt-2 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-2 md:px-6">
                  <div className="flex gap-6 overflow-x-auto no-scrollbar">
                    {[
                      { id: 'works', label: '作品集', count: userArtworks.length },
                      { id: 'likes', label: '收藏夹', count: profile.stats.likes },
                      { id: 'followers', label: '粉丝', count: profile.stats.followers },
                      { id: 'about', label: '关于' }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative py-4 text-sm font-bold transition-colors whitespace-nowrap flex items-center gap-2 ${
                          activeTab === tab.id 
                            ? getThemeColorClass('text') 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {tab.label}
                        {tab.count !== undefined && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            activeTab === tab.id 
                              ? `bg-${preferences.themeColor}-50 text-${preferences.themeColor}-600` 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                        {activeTab === tab.id && (
                          <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${getThemeColorClass('bg')} rounded-t-full`}></div>
                        )}
                      </button>
                    ))}
                  </div>
               </div>
             </div>

             {/* Tab Content */}
             <div className="animate-fade-in min-h-[500px]">
               
               {activeTab === 'works' && (
                 <>
                   {/* Portfolio Filter Bar */}
                   <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mask-linear-fade">
                         {portfolioTags.map(tag => (
                            <button
                              key={tag}
                              onClick={() => setWorkFilter(tag)}
                              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
                                workFilter === tag 
                                  ? `${getThemeColorClass('bg')} text-white border-transparent shadow-md`
                                  : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200 hover:text-slate-700'
                              }`}
                            >
                              {tag}
                            </button>
                         ))}
                      </div>
                   </div>

                   {/* Artwork Grid */}
                   <div className={`grid gap-6 ${
                     preferences.layoutMode === 'grid' 
                       ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                       : 'grid-cols-1' // List view is single column
                   }`}>
                      {filteredWorks.length > 0 ? filteredWorks.map(art => (
                        preferences.layoutMode === 'grid' ? (
                          <ArtworkCard 
                            key={art.id} 
                            artwork={art}
                            onClick={() => setSelectedArtworkId(art.id)}
                            showAvatar={false}
                            className="h-full"
                          />
                        ) : (
                          // Custom List View Item
                          <div 
                            key={art.id} 
                            className="group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer flex flex-row h-48"
                            onClick={() => setSelectedArtworkId(art.id)}
                          >
                             <div className="w-64 flex-shrink-0 relative overflow-hidden">
                               <img 
                                src={art.imageUrl} 
                                alt={art.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                onError={handleArtworkError}
                               />
                               {/* AI Badge for Images */}
                               {art.isAiGenerated && (
                                  <div className="absolute top-2 left-2 bg-purple-600/80 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                     <Sparkles className="w-3 h-3 fill-current" /> AI
                                  </div>
                               )}
                             </div>
                             <div className="p-5 flex flex-col justify-center flex-1">
                                <h3 className="font-bold text-slate-900 text-lg truncate mb-2 group-hover:text-indigo-600 transition-colors">{art.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4">{art.description || "暂无描述"}</p>
                                
                                <div className="flex gap-2 mb-auto">
                                   {art.tags.slice(0, 3).map(tag => (
                                     <span key={tag} className="bg-slate-50 text-slate-600 text-xs px-2 py-1 rounded-md border border-slate-100">{tag}</span>
                                   ))}
                                </div>

                                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pt-4 border-t border-slate-50 mt-auto">
                                   <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {art.views}</span>
                                   <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {art.likes}</span>
                                   <span className="flex items-center gap-1 ml-auto"><Calendar className="w-3.5 h-3.5" /> {art.publishDate}</span>
                                </div>
                             </div>
                          </div>
                        )
                      )) : (
                        <div className="col-span-full py-20 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                          <p>暂无相关作品</p>
                        </div>
                      )}
                      
                      {/* Upload Placeholder for Owner */}
                      {isOwner && workFilter === '全部' && (
                        <div className={`border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50/50 hover:border-indigo-300 transition-all cursor-pointer group ${
                          preferences.layoutMode === 'list' ? 'h-48' : 'min-h-[280px]'
                        }`}
                        >
                           <div className={`p-4 rounded-full bg-slate-50 group-hover:${getThemeColorClass('bg')} group-hover:text-white transition-colors mb-3`}>
                              <PenTool className="w-6 h-6" />
                           </div>
                           <span className="font-bold text-sm">上传新作品</span>
                        </div>
                      )}
                   </div>
                 </>
               )}

               {activeTab === 'likes' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedArtworks.map(art => (
                       <ArtworkCard 
                         key={`like-${art.id}`}
                         artwork={art}
                         onClick={() => setSelectedArtworkId(art.id)}
                         showAvatar={true}
                         className="opacity-90 hover:opacity-100 transition-opacity"
                       />
                    ))}
                 </div>
               )}

               {activeTab === 'followers' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {mockFollowers.map((follower, idx) => (
                     <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between hover:shadow-md transition-shadow hover:border-indigo-200 group">
                       <div className="flex items-center gap-3">
                         <Avatar
                           src={follower.avatar} 
                           name={follower.name} 
                           size="md"
                           className="bg-slate-200"
                         />
                         <div>
                           <div className="flex items-center gap-1">
                             <h4 className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{follower.name}</h4>
                             {follower.isVerified && <BadgeCheck className="w-3 h-3 text-blue-500 fill-current text-white" />}
                           </div>
                           <p className="text-xs text-slate-500">{follower.role}</p>
                         </div>
                       </div>
                       <button className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                         preferences.themeColor === 'indigo' ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white' : 
                         preferences.themeColor === 'pink' ? 'border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white' :
                         'border-slate-300 text-slate-600 hover:bg-slate-800 hover:text-white hover:border-slate-800'
                       }`}>
                         关注
                       </button>
                     </div>
                   ))}
                   
                   {/* Load More Placeholder */}
                   <div className="col-span-full text-center py-8">
                     <button className="text-sm text-slate-400 hover:text-slate-600 font-bold px-6 py-2 rounded-full hover:bg-slate-100 transition-colors">
                       加载更多...
                     </button>
                   </div>
                 </div>
               )}

               {activeTab === 'about' && (
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="mb-12">
                        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 pb-2 border-b border-slate-100">
                           <div className={`w-1 h-5 rounded-full ${getThemeColorClass('bg')}`}></div>
                           个人简介
                        </h3>
                        <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
                          {profile.bio}
                          {"\n\n"}
                          作为一名数字艺术家，我致力于探索色彩与光影的极限。我有5年的行业经验，曾服务于多家知名游戏公司。
                          欢迎各类商业合作与交流。
                        </p>
                    </div>
                    
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-2 pb-2 border-b border-slate-100">
                           <div className={`w-1 h-5 rounded-full ${getThemeColorClass('bg')}`}></div>
                           职业经历
                        </h3>
                        <div className="space-y-0 relative border-l-2 border-slate-100 ml-3 pl-8 pb-4">
                           <div className="relative mb-10 group">
                              <div className={`absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-white border-4 transition-colors ${
                                preferences.themeColor === 'pink' ? 'border-pink-500 group-hover:border-pink-600' : 'border-indigo-500 group-hover:border-indigo-600'
                              }`}></div>
                              <div className="flex gap-5 items-start">
                                  <div className={`w-14 h-14 rounded-xl ${getThemeColorClass('bg')} bg-opacity-10 flex items-center justify-center ${getThemeColorClass('text')} font-bold text-xl flex-shrink-0`}>N</div>
                                  <div>
                                     <h4 className="font-bold text-slate-800 text-lg">高级概念设计师</h4>
                                     <p className="text-sm text-slate-500 font-medium mb-3">NetEase Games • 2021 - 至今</p>
                                     <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                                       <div className="absolute top-4 -left-1.5 w-3 h-3 bg-slate-50 border-l border-t border-slate-100 transform -rotate-45"></div>
                                       负责核心项目场景概念设计与风格制定。参与了《代号：无限》的主视觉开发，主导了场景美术风格的落地。
                                     </div>
                                  </div>
                              </div>
                           </div>
                           
                           <div className="relative group">
                              <div className="absolute -left-[39px] top-0 w-5 h-5 rounded-full bg-white border-4 border-slate-300 group-hover:border-slate-400 transition-colors"></div>
                              <div className="flex gap-5 items-start">
                                  <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xl flex-shrink-0">F</div>
                                  <div>
                                     <h4 className="font-bold text-slate-800 text-lg">自由插画师</h4>
                                     <p className="text-sm text-slate-500 font-medium mb-3">Freelance • 2018 - 2021</p>
                                     <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 relative">
                                       <div className="absolute top-4 -left-1.5 w-3 h-3 bg-slate-50 border-l border-t border-slate-100 transform -rotate-45"></div>
                                       承接各类商业插画与游戏外包。服务客户包括腾讯、米哈游等，累计完成 50+ 张高质量商稿。
                                     </div>
                                  </div>
                              </div>
                           </div>
                        </div>
                    </div>
                 </div>
               )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PersonalSpaceView;
