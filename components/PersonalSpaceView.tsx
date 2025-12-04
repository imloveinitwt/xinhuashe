
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  MapPin, Link as LinkIcon, Calendar, BadgeCheck, Settings, 
  UserPlus, Mail, Eye, Heart, Share2, PenTool, Image as ImageIcon,
  Grid, List, Check, X, Palette, Layout, Users
} from 'lucide-react';
import { User, UserProfile, UserProfilePreferences, ThemeColor } from '../types';
import { MOCK_ARTWORKS, MOCK_CREATORS, MOCK_USERS_ADMIN_VIEW } from '../constants';
import ArtworkDetailModal from './ArtworkDetailModal';

interface PersonalSpaceViewProps {
  profile: UserProfile;
  currentUser: User | null;
}

const PersonalSpaceView: React.FC<PersonalSpaceViewProps> = ({ profile, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'works' | 'likes' | 'about' | 'followers'>('works');
  
  // Customization State
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserProfilePreferences>(
    profile.preferences || { themeColor: 'indigo', layoutMode: 'grid' }
  );

  // Modal State
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);

  // Sync preferences if profile changes (e.g. navigation)
  useEffect(() => {
    if (profile.preferences) {
      setPreferences(profile.preferences);
    }
  }, [profile]);

  useEffect(() => {
    if (isCustomizeOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCustomizeOpen]);
  
  // Logic to determine if the viewer is the owner of this profile
  const isOwner = currentUser?.id && (profile.userId === currentUser.id || profile.displayName === currentUser.name);

  // Filter artworks for this profile
  const userArtworks = MOCK_ARTWORKS.filter(art => art.artist === profile.displayName);
  const likedArtworks = MOCK_ARTWORKS.slice(0, 4); 

  // Mock Followers Data (Mix of creators and admin users for demo)
  const mockFollowers = [...MOCK_CREATORS, ...MOCK_USERS_ADMIN_VIEW].slice(0, 8).map(u => ({
    id: u.id,
    name: 'name' in u ? u.name : 'Unknown',
    avatar: u.avatar,
    isVerified: 'isVerified' in u ? u.isVerified : false,
    role: 'roleName' in u ? u.roleName : 'Creator'
  }));

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

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://ui-avatars.com/api/?name=User&background=cbd5e1&color=fff';
  };

  const handleArtworkError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://placehold.co/600x400/f1f5f9/94a3b8?text=Image+Load+Error';
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      
      {/* Artwork Modal */}
      <ArtworkDetailModal 
        artworkId={selectedArtworkId}
        onClose={() => setSelectedArtworkId(null)}
        currentUser={currentUser}
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
      <div className="h-64 md:h-80 w-full relative group">
        <img 
          src={profile.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover bg-slate-900"
          onError={handleCoverError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        {isOwner && (
          <button className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-colors flex items-center gap-2 opacity-0 group-hover:opacity-100">
            <ImageIcon className="w-4 h-4" />
            更换封面
          </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 2. Sidebar / Info Card */}
          <div className="lg:w-80 flex-shrink-0">
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center lg:items-start text-center lg:text-left relative">
                {/* Avatar */}
                <div className={`w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden mb-4 bg-white`}>
                  <img 
                    src={profile.avatar} 
                    alt={profile.displayName} 
                    className="w-full h-full object-cover bg-slate-200" 
                    onError={handleAvatarError}
                  />
                </div>
                
                {/* Name & Verify */}
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center lg:justify-start gap-2">
                    {profile.displayName}
                    {profile.isVerified && <BadgeCheck className={`w-5 h-5 ${getThemeColorClass('text')}`} />}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1">@{profile.id.split('_')[1]}</p>
                </div>

                {/* Bio */}
                <p className="text-slate-600 text-sm leading-relaxed mb-6 w-full">
                  {profile.bio}
                </p>

                {/* Stats Row */}
                <div className="flex items-center justify-center lg:justify-between w-full border-b border-slate-100 pb-6 mb-6 gap-6 lg:gap-0">
                   <div className="text-center lg:text-left">
                     <div className="font-bold text-slate-900">{profile.stats.followers}</div>
                     <div className="text-xs text-slate-500">粉丝</div>
                   </div>
                   <div className="text-center lg:text-left">
                     <div className="font-bold text-slate-900">{profile.stats.following}</div>
                     <div className="text-xs text-slate-500">关注</div>
                   </div>
                   <div className="text-center lg:text-left">
                     <div className="font-bold text-slate-900">{profile.stats.likes}</div>
                     <div className="text-xs text-slate-500">获赞</div>
                   </div>
                </div>

                {/* Meta Info */}
                <div className="w-full space-y-3 text-sm text-slate-600 mb-6">
                   <div className="flex items-center gap-3">
                     <MapPin className="w-4 h-4 text-slate-400" />
                     {profile.location}
                   </div>
                   {profile.website && (
                    <div className="flex items-center gap-3">
                      <LinkIcon className="w-4 h-4 text-slate-400" />
                      <a href={`https://${profile.website}`} className={`${getThemeColorClass('text')} hover:underline truncate`}>{profile.website}</a>
                    </div>
                   )}
                   <div className="flex items-center gap-3">
                     <Calendar className="w-4 h-4 text-slate-400" />
                     {profile.joinedDate} 加入
                   </div>
                </div>

                {/* Skills Tags */}
                <div className="w-full flex flex-wrap gap-2 mb-8">
                  {profile.skills.map(skill => (
                    <span key={skill} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="w-full flex gap-3">
                  {isOwner ? (
                    <>
                      <button className="flex-1 bg-white border border-slate-300 text-slate-700 font-medium py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                        <PenTool className="w-4 h-4" />
                        编辑
                      </button>
                      <button 
                        onClick={() => setIsCustomizeOpen(true)}
                        className="flex-none p-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600"
                        title="自定义空间"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button className={`flex-1 ${getThemeColorClass('bg')} text-white font-medium py-2 rounded-lg ${getHoverBgClass()} transition-colors flex items-center justify-center gap-2`}>
                        <UserPlus className="w-4 h-4" />
                        关注
                      </button>
                      <button className="flex-none p-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
                        <Mail className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button className="flex-none p-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-600">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
             </div>
          </div>

          {/* 3. Main Content Tabs */}
          <div className="flex-1 min-w-0 pt-0 lg:pt-20">
             {/* Tabs Header */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 px-6 mb-6">
                <div className="flex gap-8 overflow-x-auto no-scrollbar">
                  {[
                    { id: 'works', label: '作品集', count: userArtworks.length },
                    { id: 'likes', label: '收藏夹', count: profile.stats.likes },
                    { id: 'followers', label: '粉丝', count: profile.stats.followers },
                    { id: 'about', label: '关于' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`relative py-4 text-sm font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                          ? getThemeColorClass('text') 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                      {tab.count !== undefined && <span className="ml-1 text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">{tab.count}</span>}
                      {activeTab === tab.id && (
                        <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${getThemeColorClass('bg')} rounded-t-full`}></div>
                      )}
                    </button>
                  ))}
                </div>
             </div>

             {/* Tab Content */}
             <div className="animate-fade-in">
               
               {activeTab === 'works' && (
                 <div className={`grid gap-6 ${
                   preferences.layoutMode === 'grid' 
                     ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                     : 'grid-cols-1' // List view is single column
                 }`}>
                    {userArtworks.length > 0 ? userArtworks.map(art => (
                      <div 
                        key={art.id} 
                        className={`group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer ${
                          preferences.layoutMode === 'list' ? 'flex flex-row h-48' : ''
                        }`}
                        onClick={() => setSelectedArtworkId(art.id)}
                      >
                         <div className={`relative overflow-hidden ${
                           preferences.layoutMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-[4/3]'
                         }`}>
                           <img 
                            src={art.imageUrl} 
                            alt={art.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            onError={handleArtworkError}
                           />
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                         </div>
                         <div className="p-4 flex flex-col justify-center flex-1">
                            <h3 className="font-semibold text-slate-800 text-lg truncate">{art.title}</h3>
                            <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
                               <div className="flex items-center gap-4">
                                 <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {art.views}</span>
                                 <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {art.likes}</span>
                               </div>
                               {preferences.layoutMode === 'list' && (
                                 <div className="flex gap-2">
                                   {art.tags.slice(0, 3).map(tag => (
                                     <span key={tag} className="bg-slate-100 px-2 py-1 rounded-md">{tag}</span>
                                   ))}
                                 </div>
                               )}
                            </div>
                         </div>
                      </div>
                    )) : (
                      <div className="col-span-full py-12 text-center text-slate-400">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>暂无发布作品</p>
                      </div>
                    )}
                    
                    {/* Upload Placeholder for Owner */}
                    {isOwner && (
                      <div className={`border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-all cursor-pointer ${
                        preferences.layoutMode === 'list' ? 'h-48' : 'min-h-[240px]'
                      }`}
                        style={{ borderColor: preferences.themeColor === 'indigo' ? undefined : 'var(--slate-200)' }} // Just a demo of inline style override
                      >
                         <PenTool className="w-8 h-8 mb-2" />
                         <span className="font-medium">上传新作品</span>
                      </div>
                    )}
                 </div>
               )}

               {activeTab === 'likes' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {likedArtworks.map(art => (
                       <div 
                         key={`like-${art.id}`} 
                         onClick={() => setSelectedArtworkId(art.id)}
                         className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
                       >
                          <img 
                            src={art.imageUrl} 
                            className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all" 
                            onError={handleArtworkError}
                          />
                          <div className="p-3">
                             <p className="font-medium text-slate-700 truncate">{art.title}</p>
                             <p className="text-xs text-slate-500 mt-1">by {art.artist}</p>
                          </div>
                       </div>
                    ))}
                 </div>
               )}

               {activeTab === 'followers' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {mockFollowers.map((follower, idx) => (
                     <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                         <img 
                           src={follower.avatar} 
                           alt={follower.name} 
                           className="w-12 h-12 rounded-full border border-slate-100 bg-slate-200"
                           onError={handleAvatarError}
                         />
                         <div>
                           <div className="flex items-center gap-1">
                             <h4 className="font-bold text-slate-800 text-sm">{follower.name}</h4>
                             {follower.isVerified && <BadgeCheck className="w-3 h-3 text-blue-500" />}
                           </div>
                           <p className="text-xs text-slate-500">{follower.role}</p>
                         </div>
                       </div>
                       <button className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                         preferences.themeColor === 'indigo' ? 'border-indigo-600 text-indigo-600 hover:bg-indigo-50' : 
                         preferences.themeColor === 'pink' ? 'border-pink-500 text-pink-500 hover:bg-pink-50' :
                         'border-slate-300 text-slate-600 hover:bg-slate-50'
                       }`}>
                         关注
                       </button>
                     </div>
                   ))}
                   
                   {/* Load More Placeholder */}
                   <div className="col-span-full text-center py-4">
                     <button className="text-sm text-slate-400 hover:text-slate-600 font-medium">
                       加载更多...
                     </button>
                   </div>
                 </div>
               )}

               {activeTab === 'about' && (
                 <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">关于我</h3>
                    <p className="text-slate-600 leading-relaxed mb-8">
                      {profile.bio}
                      <br /><br />
                      作为一名数字艺术家，我致力于探索色彩与光影的极限。我有5年的行业经验，曾服务于多家知名游戏公司。
                      欢迎各类商业合作与交流。
                    </p>
                    
                    <h3 className="text-lg font-bold text-slate-800 mb-4">工作经历</h3>
                    <div className="space-y-6">
                       <div className={`flex gap-4`}>
                          <div className={`w-12 h-12 rounded-lg ${getThemeColorClass('bg')} bg-opacity-10 flex items-center justify-center ${getThemeColorClass('text')} font-bold text-xl`}>N</div>
                          <div>
                             <h4 className="font-bold text-slate-800">高级概念设计师</h4>
                             <p className="text-sm text-slate-600">NetEase Games • 2021 - 至今</p>
                             <p className="text-xs text-slate-500 mt-1">负责核心项目场景概念设计与风格制定。</p>
                          </div>
                       </div>
                       <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xl">F</div>
                          <div>
                             <h4 className="font-bold text-slate-800">自由插画师</h4>
                             <p className="text-sm text-slate-600">Freelance • 2018 - 2021</p>
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
