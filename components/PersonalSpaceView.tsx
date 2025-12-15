
import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, Link as LinkIcon, Calendar, BadgeCheck, Settings, 
  UserPlus, Mail, Share2, Grid, Image as ImageIcon,
  MoreHorizontal, MessageCircle, Filter, Search, Zap, Heart, Eye,
  Check, Briefcase
} from 'lucide-react';
import { User, UserProfile, ViewMode, Artwork } from '../types';
import { MOCK_ARTWORKS, getImage } from '../constants'; 
import ArtworkDetailModal from './ArtworkDetailModal';
import ArtworkCard from './ArtworkCard';
import Avatar from './Avatar';
import AvatarUploadModal from './AvatarUploadModal';
import EditProfileModal from './EditProfileModal';
import CommissionModal from './CommissionModal'; 
import ShareModal from './ShareModal'; // Import
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface PersonalSpaceViewProps {
  profile: UserProfile;
  currentUser: User | null;
  onNavigate?: (mode: ViewMode) => void;
}

const PersonalSpaceView: React.FC<PersonalSpaceViewProps> = ({ profile: initialProfile, currentUser, onNavigate }) => {
  const { updateUser } = useAuth();
  const { showToast } = useToast();
  
  // -- State --
  // Use local state for profile to allow instant updates after editing
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [activeTab, setActiveTab] = useState<'works' | 'likes' | 'about'>('works');
  const [filterTag, setFilterTag] = useState('全部');
  const [selectedArtworkId, setSelectedArtworkId] = useState<string | null>(null);
  
  // Modals
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCommissionOpen, setIsCommissionOpen] = useState(false); 
  const [isShareOpen, setIsShareOpen] = useState(false); // Share state
  
  const [isFollowing, setIsFollowing] = useState(false);

  // Sync prop changes to local state if the prop changes (e.g. navigation)
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  // -- Derived Data --
  const isOwner = currentUser?.id && (profile.userId === currentUser.id || profile.displayName === currentUser.name);
  
  // Filter artworks belonging to this artist
  const userArtworks = useMemo(() => MOCK_ARTWORKS.filter(art => art.artist === profile.displayName), [profile.displayName]);
  const likedArtworks = useMemo(() => MOCK_ARTWORKS.slice(0, 6), []); // Mock liked works

  // Extract tags for filter bar
  const uniqueTags = useMemo(() => {
    const tags = new Set<string>(['全部']);
    userArtworks.forEach(art => art.tags.forEach(t => tags.add(t)));
    return Array.from(tags).slice(0, 10);
  }, [userArtworks]);

  // Filtered list
  const displayArtworks = useMemo(() => {
    let source = activeTab === 'likes' ? likedArtworks : userArtworks;
    if (filterTag === '全部') return source;
    return source.filter(art => art.tags.includes(filterTag));
  }, [activeTab, filterTag, userArtworks, likedArtworks]);

  const handleAvatarSave = async (base64Image: string) => {
    // Update Global Auth State
    updateUser({ avatar: base64Image });
    // Update Local Profile State
    setProfile(prev => ({ ...prev, avatar: base64Image }));
    setIsAvatarModalOpen(false);
    showToast('头像更新成功', 'success');
  };

  const handleProfileUpdate = async (data: Partial<UserProfile>) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update Local Profile State
    setProfile(prev => ({ ...prev, ...data }));
    
    // Update Global Auth State (Name sync)
    if (data.displayName) {
      updateUser({ name: data.displayName });
    }
    
    showToast('个人资料已更新', 'success');
  };

  const handleCoverError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = getImage('Cover Image', 1920, 400);
  };

  const formatNumber = (num: number) => {
    return num > 10000 ? (num / 10000).toFixed(1) + 'w' : num.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20 pt-16">
      
      {/* --- Modals --- */}
      <ArtworkDetailModal 
        artworkId={selectedArtworkId}
        onClose={() => setSelectedArtworkId(null)}
        currentUser={currentUser}
      />
      
      <AvatarUploadModal 
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onSave={handleAvatarSave}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        initialData={profile}
        onSave={handleProfileUpdate}
      />

      <CommissionModal 
        isOpen={isCommissionOpen}
        onClose={() => setIsCommissionOpen(false)}
        targetUser={{ name: profile.displayName, avatar: profile.avatar }}
        currentUser={currentUser}
      />

      <ShareModal 
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        data={{
          title: profile.displayName,
          cover: profile.avatar,
          author: profile.location,
          desc: profile.bio,
          type: 'profile',
          id: profile.id
        }}
      />

      {/* --- 1. Header Area --- */}
      <div className="bg-white border-b border-slate-200">
        {/* Cover Image */}
        <div className="h-48 md:h-64 w-full bg-slate-200 relative group overflow-hidden">
          <img 
            src={profile.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={handleCoverError}
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
          
          {isOwner && (
            <button className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-bold border border-white/20 transition-all flex items-center gap-2 opacity-0 group-hover:opacity-100">
              <ImageIcon className="w-3.5 h-3.5" /> 更换封面
            </button>
          )}
        </div>

        {/* Profile Info Bar */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
           <div className="relative -mt-16 mb-4 flex flex-col md:flex-row items-end md:items-center gap-6">
              
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                 <div className="p-1.5 bg-white rounded-full shadow-md">
                   <Avatar 
                     src={isOwner && currentUser ? currentUser.avatar : profile.avatar} 
                     name={profile.displayName} 
                     size="3xl"
                     className="border-2 border-slate-100"
                     onClick={isOwner ? () => setIsAvatarModalOpen(true) : undefined}
                   />
                 </div>
                 {profile.isVerified && (
                   <div className="absolute bottom-2 right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="认证画师">
                      <BadgeCheck className="w-5 h-5 fill-current" />
                   </div>
                 )}
                 {isOwner && (
                    <div 
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold text-xs pointer-events-none m-1.5"
                    >
                       更换
                    </div>
                 )}
              </div>

              {/* Name & Basic Info */}
              <div className="flex-1 pb-2 pt-2 md:pt-16">
                 <div className="flex flex-col">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                       {profile.displayName}
                       {profile.membershipLevel && profile.membershipLevel !== 'none' && (
                          <span className={`text-xs px-2 py-0.5 rounded border uppercase tracking-wider font-bold ${
                             profile.membershipLevel === 'max' 
                               ? 'bg-amber-50 text-amber-600 border-amber-200'
                               : 'bg-indigo-50 text-indigo-600 border-indigo-200'
                          }`}>
                             {profile.membershipLevel}
                          </span>
                       )}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1 max-w-xl truncate">{profile.bio || "暂无简介"}</p>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pb-4 w-full md:w-auto">
                 {isOwner ? (
                    <button 
                      onClick={() => setIsEditProfileOpen(true)}
                      className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors flex items-center justify-center gap-2"
                    >
                       <Settings className="w-4 h-4" /> 编辑资料
                    </button>
                 ) : (
                    <>
                       {/* Commission Button (New) */}
                       <button 
                         onClick={() => setIsCommissionOpen(true)}
                         className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2"
                       >
                          <Briefcase className="w-4 h-4" /> 约稿
                       </button>

                       <button 
                         onClick={() => setIsFollowing(!isFollowing)}
                         className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border ${
                            isFollowing 
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-transparent' 
                              : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400'
                         }`}
                       >
                          {isFollowing ? <Check className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                          {isFollowing ? '已关注' : '关注'}
                       </button>
                       <button 
                         onClick={() => setIsShareOpen(true)}
                         className="px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
                       >
                          <Share2 className="w-5 h-5" />
                       </button>
                    </>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* --- 2. Main Content Grid --- */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* LEFT SIDEBAR (Info & Stats) */}
            <div className="lg:col-span-1 space-y-6">
               
               {/* Stats Card */}
               <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="grid grid-cols-3 gap-2 text-center divide-x divide-slate-100">
                     <div className="px-1">
                        <div className="text-lg font-bold text-slate-900">{formatNumber(profile.stats.followers)}</div>
                        <div className="text-xs text-slate-500 mt-0.5">粉丝</div>
                     </div>
                     <div className="px-1">
                        <div className="text-lg font-bold text-slate-900">{formatNumber(profile.stats.following)}</div>
                        <div className="text-xs text-slate-500 mt-0.5">关注</div>
                     </div>
                     <div className="px-1">
                        <div className="text-lg font-bold text-slate-900">{formatNumber(profile.stats.likes)}</div>
                        <div className="text-xs text-slate-500 mt-0.5">获赞</div>
                     </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-slate-100">
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">信用评分</span>
                        <span className="font-bold text-green-600 flex items-center gap-1">
                           <Zap className="w-3.5 h-3.5 fill-current" /> {profile.creditScore}
                        </span>
                     </div>
                  </div>
               </div>

               {/* About Card */}
               <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm mb-4">个人信息</h3>
                  <div className="space-y-3 text-sm">
                     <div className="flex items-center gap-3 text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{profile.location || '未知地区'}</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>{profile.joinedDate} 加入</span>
                     </div>
                     {profile.website && (
                        <div className="flex items-center gap-3 text-slate-600 truncate">
                           <LinkIcon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                           <a href={profile.website} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline truncate">
                              {profile.website.replace(/^https?:\/\//, '')}
                           </a>
                        </div>
                     )}
                  </div>
               </div>

               {/* Skills Card */}
               <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm mb-4">擅长技能</h3>
                  <div className="flex flex-wrap gap-2">
                     {profile.skills.length > 0 ? profile.skills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-md hover:border-indigo-200 hover:text-indigo-600 transition-colors cursor-default">
                           {skill}
                        </span>
                     )) : <span className="text-xs text-slate-400">暂无标签</span>}
                  </div>
               </div>

            </div>

            {/* RIGHT MAIN CONTENT */}
            <div className="lg:col-span-3">
               
               {/* Sticky Tabs Header */}
               <div className="sticky top-16 z-20 bg-slate-50/95 backdrop-blur pt-1 pb-4">
                  <div className="bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                     <div className="flex gap-1">
                        {[
                           { id: 'works', label: '作品', count: userArtworks.length },
                           { id: 'likes', label: '收藏', count: profile.stats.likes }, // Mock count match
                           { id: 'about', label: '关于' }
                        ].map(tab => (
                           <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id as any)}
                              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                                 activeTab === tab.id 
                                    ? 'bg-slate-900 text-white shadow-md' 
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                           >
                              {tab.label}
                              {tab.count !== undefined && (
                                 <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                 }`}>
                                    {tab.count}
                                 </span>
                              )}
                           </button>
                        ))}
                     </div>
                     
                     {activeTab === 'works' && (
                        <div className="hidden sm:flex items-center gap-2 pr-2">
                           <span className="text-slate-400"><Filter className="w-4 h-4" /></span>
                           <select 
                              className="bg-transparent text-sm font-medium text-slate-600 outline-none cursor-pointer hover:text-indigo-600"
                              value={filterTag}
                              onChange={(e) => setFilterTag(e.target.value)}
                           >
                              {uniqueTags.map(t => <option key={t} value={t}>{t}</option>)}
                           </select>
                        </div>
                     )}
                  </div>

                  {/* Mobile Tag Filter (Horizontal Scroll) */}
                  {activeTab === 'works' && (
                     <div className="sm:hidden flex gap-2 overflow-x-auto no-scrollbar mt-3 pb-1">
                        {uniqueTags.map(tag => (
                           <button
                              key={tag}
                              onClick={() => setFilterTag(tag)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${
                                 filterTag === tag 
                                    ? 'bg-slate-800 text-white border-slate-800' 
                                    : 'bg-white text-slate-500 border-slate-200'
                              }`}
                           >
                              {tag}
                           </button>
                        ))}
                     </div>
                  )}
               </div>

               {/* Content Body */}
               <div className="min-h-[500px]">
                  {activeTab === 'about' ? (
                     <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm animate-fade-in">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-indigo-500 pl-3">个人简介</h3>
                        <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line mb-8">
                           {profile.bio || "这位创作者很神秘，还没有填写简介。"}
                           {profile.bio && "\n\n目前接受约稿，擅长风格包括日系厚涂、赛博朋克场景以及角色设计。欢迎私信沟通合作意向。"}
                        </p>
                        
                        <h3 className="text-lg font-bold text-slate-900 mb-4 border-l-4 border-pink-500 pl-3">职业经历</h3>
                        <div className="space-y-6 ml-2 border-l-2 border-slate-100 pl-6 py-2">
                           <div className="relative">
                              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-indigo-200"></div>
                              <h4 className="font-bold text-slate-800">自由插画师</h4>
                              <p className="text-xs text-slate-500 mt-1">2021 - 至今</p>
                              <p className="text-sm text-slate-600 mt-2">独立承接各类商业插画与游戏外包项目，服务客户包括多家知名游戏厂商。</p>
                           </div>
                           <div className="relative">
                              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-white border-4 border-slate-200"></div>
                              <h4 className="font-bold text-slate-800">美术设计师</h4>
                              <p className="text-xs text-slate-500 mt-1">2019 - 2021</p>
                              <p className="text-sm text-slate-600 mt-2">任职于某广告公司，负责品牌视觉设计与活动KV绘制。</p>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                        {displayArtworks.length > 0 ? (
                           displayArtworks.map((artwork, idx) => (
                              <div key={artwork.id} className="animate-fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                                 <ArtworkCard 
                                    artwork={artwork}
                                    showAvatar={false}
                                    onClick={() => setSelectedArtworkId(artwork.id)}
                                    className="h-full"
                                 />
                              </div>
                           ))
                        ) : (
                           <div className="col-span-full py-20 text-center flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                 <ImageIcon className="w-8 h-8 text-slate-300" />
                              </div>
                              <h3 className="text-slate-900 font-bold mb-1">暂无内容</h3>
                              <p className="text-slate-500 text-sm">该分类下还没有任何作品</p>
                           </div>
                        )}
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
