
import { Artwork, Asset, Project, Task, Transaction, Invoice, Creator, Event, RoleDefinition, User, UserProfile } from './types';

// === RBAC CONFIGURATION ===
// 模拟数据库中的 Roles 和 Permissions 表配置
export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    code: 'root_admin',
    name: '系统根管理员',
    description: '系统最高权限，负责全局配置与安全',
    defaultPermissions: [
      'USER_VIEW', 'USER_EDIT', 'USER_ROLE_ASSIGN', 'USER_AUTH_REVIEW',
      'CONTENT_REVIEW', 'CONTENT_DELETE', 'CONTENT_RECOMMEND',
      'TRANSACTION_VIEW', 
      'SYSTEM_CONFIG', 'ROLE_MANAGE', 'LOG_VIEW', 'DATA_BACKUP'
    ]
  },
  {
    code: 'content_ops',
    name: '内容审核/运营',
    description: '负责内容生态治理与推荐',
    defaultPermissions: [
      'USER_VIEW', 'USER_AUTH_REVIEW',
      'CONTENT_REVIEW', 'CONTENT_DELETE', 'CONTENT_RECOMMEND',
      'LOG_VIEW'
    ]
  },
  {
    code: 'creator',
    name: '认证创作者',
    description: '平台核心生产力，拥有接单与作品管理权限',
    defaultPermissions: [
      'CONTENT_UPLOAD', 
      'TRANSACTION_VIEW', 'WITHDRAW_APPLY',
      'PROJECT_VIEW'
    ]
  },
  {
    code: 'enterprise',
    name: '企业主账号',
    description: '拥有采购、DAM管理与财务权限',
    defaultPermissions: [
      'TRANSACTION_CREATE', 'TRANSACTION_VIEW', 'INVOICE_APPLY',
      'PROJECT_CREATE', 'PROJECT_VIEW', 'TASK_ASSIGN'
    ]
  },
  {
    code: 'platform_admin',
    name: '平台管理员',
    description: '负责平台日常业务运营',
    defaultPermissions: ['USER_VIEW', 'USER_ROLE_ASSIGN', 'TRANSACTION_VIEW', 'LOG_VIEW']
  }
];

// Mock Users for Admin View
export const MOCK_USERS_ADMIN_VIEW: Partial<User>[] = [
  { id: 'u1', name: 'Admin_Root', role: 'root_admin', roleName: '系统根管理员', avatar: 'https://ui-avatars.com/api/?name=Admin+Root&background=ef4444&color=fff' },
  { id: 'u2', name: 'Ops_Sarah', role: 'content_ops', roleName: '内容审核员', avatar: 'https://ui-avatars.com/api/?name=Sarah+Ops&background=f97316&color=fff' },
  { id: 'u3', name: 'NeonDreamer', role: 'creator', roleName: '认证创作者', avatar: 'https://ui-avatars.com/api/?name=Neon+Dreamer&background=8b5cf6&color=fff' },
  { id: 'u4', name: 'TechNova_PM', role: 'enterprise', roleName: '企业主账号', avatar: 'https://ui-avatars.com/api/?name=Tech+Nova&background=3b82f6&color=fff' },
  { id: 'u5', name: 'InkFlow', role: 'creator', roleName: '创作者', avatar: 'https://ui-avatars.com/api/?name=Ink+Flow&background=10b981&color=fff' },
  { id: 'u6', name: 'GameStudio_HR', role: 'enterprise', roleName: '企业主账号', avatar: 'https://ui-avatars.com/api/?name=Game+Studio&background=6366f1&color=fff' },
];

// === EXISTING MOCK DATA ===

export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: '赛博朋克都市夜景',
    artist: 'NeonDreamer',
    artistAvatar: 'https://ui-avatars.com/api/?name=Neon+Dreamer&background=8b5cf6&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/cyberpunk%20city%20night%20neon%20lights%20futuristic?width=600&height=800&nologo=true',
    likes: 1240,
    views: 5400,
    tags: ['科幻', '场景', '概念设计'],
    isVerified: true
  },
  {
    id: '2',
    title: '森林守护者',
    artist: 'NatureStroke',
    artistAvatar: 'https://ui-avatars.com/api/?name=Nature+Stroke&background=10b981&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/mystical%20forest%20guardian%20spirit%20fantasy%20art?width=600&height=400&nologo=true',
    likes: 890,
    views: 3200,
    tags: ['奇幻', '角色', '插画'],
    isVerified: true
  },
  {
    id: '3',
    title: 'SaaS 仪表盘 UI 套件',
    artist: 'PixelMaster',
    artistAvatar: 'https://ui-avatars.com/api/?name=Pixel+Master&background=3b82f6&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/modern%20clean%20saas%20dashboard%20ui%20design%20light%20mode?width=600&height=600&nologo=true',
    likes: 2100,
    views: 12000,
    tags: ['UI/UX', '网页设计'],
    isAiGenerated: false,
    isVerified: true
  },
  {
    id: '4',
    title: '重型机甲 001',
    artist: 'RoboArt',
    artistAvatar: 'https://ui-avatars.com/api/?name=Robo+Art&background=64748b&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/heavy%20combat%20mecha%20robot%20sci-fi%20industrial%20design?width=600&height=900&nologo=true',
    likes: 560,
    views: 1500,
    tags: ['机甲', '科幻'],
    isAiGenerated: true,
    isVerified: false
  },
  {
    id: '5',
    title: '抽象流体艺术',
    artist: 'ColorFlow',
    artistAvatar: 'https://ui-avatars.com/api/?name=Color+Flow&background=f43f5e&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/abstract%20fluid%20acrylic%20art%20colorful%20swirls?width=600&height=500&nologo=true',
    likes: 3400,
    views: 8900,
    tags: ['抽象', '材质'],
    isVerified: false
  },
  {
    id: '6',
    title: '水墨山水：归途',
    artist: 'InkFlow',
    artistAvatar: 'https://ui-avatars.com/api/?name=Ink+Flow&background=10b981&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/chinese%20ink%20wash%20painting%20mountains%20fog%20landscape?width=600&height=850&nologo=true',
    likes: 4500,
    views: 10200,
    tags: ['国风', '插画', '传统艺术'],
    isVerified: true
  },
  {
    id: '7',
    title: '低多边形城市 (Low Poly)',
    artist: 'LowPolyGod',
    artistAvatar: 'https://ui-avatars.com/api/?name=Low+Poly&background=8b5cf6&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/low%20poly%20city%20isometric%20view%20colorful%203d%20render?width=600&height=450&nologo=true',
    likes: 1800,
    views: 4500,
    tags: ['3D模型', 'Blender', '场景'],
    isVerified: true
  },
  {
    id: '8',
    title: 'RPG 游戏像素图标集',
    artist: 'PixelRetro',
    artistAvatar: 'https://ui-avatars.com/api/?name=Pixel+Retro&background=f59e0b&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/pixel%20art%20rpg%20game%20items%20icons%20sword%20potion%20shield?width=600&height=600&nologo=true',
    likes: 3200,
    views: 6700,
    tags: ['游戏原画', '像素画', 'UI/UX'],
    isVerified: false
  },
  {
    id: '9',
    title: '未来概念跑车 2077',
    artist: 'NeonDreamer',
    artistAvatar: 'https://ui-avatars.com/api/?name=Neon+Dreamer&background=8b5cf6&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/futuristic%20sports%20car%20concept%20cyberpunk%20style%20neon?width=600&height=350&nologo=true',
    likes: 2900,
    views: 8100,
    tags: ['科幻', '载具', '概念设计'],
    isVerified: true,
    isAiGenerated: true
  },
  {
    id: '10',
    title: '魔法学院入学测试动画',
    artist: 'MotionMaster',
    artistAvatar: 'https://ui-avatars.com/api/?name=Motion+Master&background=ec4899&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/anime%20style%20magic%20academy%20students%20casting%20spells?width=600&height=400&nologo=true',
    likes: 5100,
    views: 15000,
    tags: ['动画', '二次元', '故事板'],
    isVerified: true
  },
  // New Added Artworks
  {
    id: '11',
    title: '智能家居控制台 UI',
    artist: 'ArtMaster',
    artistAvatar: 'https://ui-avatars.com/api/?name=Art+Master&background=ec4899&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/smart%20home%20dashboard%20ui%20interface%20clean%20modern?width=600&height=450&nologo=true',
    likes: 1540,
    views: 3200,
    tags: ['UI设计', 'Figma', 'IoT'],
    isVerified: true
  },
  {
    id: '12',
    title: '复古未来主义海报系列',
    artist: 'NeonDreamer',
    artistAvatar: 'https://ui-avatars.com/api/?name=Neon+Dreamer&background=8b5cf6&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/retro%20futurism%20poster%20design%2080s%20style%20synthwave?width=600&height=800&nologo=true',
    likes: 2200,
    views: 8900,
    tags: ['平面设计', '海报', '复古'],
    isVerified: true
  },
  {
    id: '13',
    title: '3D 植被资产库',
    artist: 'LowPolyGod',
    artistAvatar: 'https://ui-avatars.com/api/?name=Low+Poly&background=8b5cf6&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/low%20poly%20trees%20and%20plants%203d%20assets%20game%20dev?width=600&height=600&nologo=true',
    likes: 980,
    views: 2100,
    tags: ['3D模型', 'Blender', '游戏资产'],
    isVerified: true
  }
];

export const MOCK_CREATORS: Creator[] = [
  { id: 'c1', name: 'WLOP', avatar: 'https://ui-avatars.com/api/?name=WLOP&background=1e293b&color=fff', tags: ['插画', '古风'], followers: 850000, isVerified: true },
  { id: 'c2', name: 'RuanJia', avatar: 'https://ui-avatars.com/api/?name=Ruan+Jia&background=1e293b&color=fff', tags: ['概念', '厚涂'], followers: 620000, isVerified: true },
  { id: 'c3', name: 'TechDesign', avatar: 'https://ui-avatars.com/api/?name=Tech+Design&background=1e293b&color=fff', tags: ['UI', 'B端'], followers: 150000, isVerified: false },
  { id: 'c4', name: 'LowPolyGod', avatar: 'https://ui-avatars.com/api/?name=Low+Poly&background=8b5cf6&color=fff', tags: ['3D', 'Blender'], followers: 98000, isVerified: true },
  { id: 'c5', name: 'InkFlow', avatar: 'https://ui-avatars.com/api/?name=Ink+Flow&background=10b981&color=fff', tags: ['水墨', '国风'], followers: 45000, isVerified: true },
  { id: 'c6', name: 'MotionMaster', avatar: 'https://ui-avatars.com/api/?name=Motion+Master&background=ec4899&color=fff', tags: ['动画', 'VFX'], followers: 210000, isVerified: true },
  { id: 'c7', name: 'PixelRetro', avatar: 'https://ui-avatars.com/api/?name=Pixel+Retro&background=f59e0b&color=fff', tags: ['像素', '独立游戏'], followers: 32000, isVerified: false },
];

// === PROFILE DATA ===
export const MOCK_PROFILES: UserProfile[] = [
  // Current User (Demo)
  {
    id: 'p_artmaster',
    userId: 'u_101', // Matches the mock ID in App.tsx if role is creator
    displayName: 'ArtMaster',
    avatar: 'https://ui-avatars.com/api/?name=Art+Master&background=ec4899&color=fff',
    coverImage: 'https://image.pollinations.ai/prompt/art%20studio%20workspace%20cozy%20creative?width=1200&height=400&nologo=true',
    bio: '专注概念设计与插画绘制，接商稿中。',
    location: '上海, 中国',
    website: 'artmaster.design',
    skills: ['Photoshop', 'Blender', '概念设计', '角色原画'],
    stats: { followers: 1250, following: 45, likes: 3200, views: 15000 },
    joinedDate: '2022年3月',
    isVerified: true,
    preferences: { themeColor: 'pink', layoutMode: 'grid' }
  },
  // Other Artists
  {
    id: 'p_neon',
    userId: 'u3',
    displayName: 'NeonDreamer',
    avatar: 'https://ui-avatars.com/api/?name=Neon+Dreamer&background=8b5cf6&color=fff',
    coverImage: 'https://image.pollinations.ai/prompt/cyberpunk%20city%20skyline%20neon%20lights%20panorama?width=1200&height=400&nologo=true',
    bio: '赛博朋克美学爱好者。构建未来的视觉语言。',
    location: '深圳, 中国',
    skills: ['Cyberpunk', 'Environment Art', 'Unreal Engine 5'],
    stats: { followers: 85000, following: 120, likes: 240000, views: 1200000 },
    joinedDate: '2021年5月',
    isVerified: true,
    preferences: { themeColor: 'purple', layoutMode: 'grid' }
  },
  {
    id: 'p_ink',
    userId: 'u5',
    displayName: 'InkFlow',
    avatar: 'https://ui-avatars.com/api/?name=Ink+Flow&background=10b981&color=fff',
    coverImage: 'https://image.pollinations.ai/prompt/chinese%20traditional%20ink%20painting%20landscape%20mountains?width=1200&height=400&nologo=true',
    bio: '传统水墨与现代数字艺术的结合探索者。',
    location: '杭州, 中国',
    skills: ['水墨', '插画', 'Procreate'],
    stats: { followers: 45000, following: 20, likes: 98000, views: 340000 },
    joinedDate: '2022年1月',
    isVerified: true,
    preferences: { themeColor: 'emerald', layoutMode: 'list' }
  }
];

export const getProfileById = (id: string) => {
  return MOCK_PROFILES.find(p => p.id === id) || MOCK_PROFILES[0];
};

export const MOCK_EVENTS: Event[] = [
  { id: 'e1', title: '2023 全球机甲设计大赛', coverUrl: 'https://image.pollinations.ai/prompt/mecha%20robot%20design%20contest%20banner%20sci-fi?width=400&height=200&nologo=true', deadline: '剩余 12 天', prize: '¥100,000', status: 'active' },
  { id: 'e2', title: '王者荣耀皮肤设计征集', coverUrl: 'https://image.pollinations.ai/prompt/moba%20game%20character%20skin%20design%20fantasy?width=400&height=200&nologo=true', deadline: '剩余 25 天', prize: '签约机会', status: 'active' },
  { id: 'e3', title: 'Indie Game Jam 2023', coverUrl: 'https://image.pollinations.ai/prompt/indie%20game%20jam%20pixel%20art%20banner?width=400&height=200&nologo=true', deadline: '11月1日开启', prize: '孵化基金', status: 'upcoming' },
  { id: 'e4', title: '角色设计挑战：反派', coverUrl: 'https://image.pollinations.ai/prompt/villain%20character%20design%20dark%20fantasy%20art?width=400&height=200&nologo=true', deadline: '剩余 5 天', prize: '¥20,000', status: 'active' },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: '夏日游戏活动主视觉 KV',
    client: '网易游戏',
    status: '进行中',
    budget: 12000,
    deadline: '2023-11-15',
    progress: 65,
    phase: '上色',
    description: '针对夏季促销活动的二次元风格主视觉海报，包含3个角色和海滩背景。',
    coverImage: 'https://image.pollinations.ai/prompt/summer%20beach%20anime%20game%20poster%20key%20visual?width=800&height=400&nologo=true'
  },
  {
    id: 'p2',
    title: '企业品牌 VI 升级包',
    client: 'TechNova 科技',
    status: '审核中',
    budget: 45000,
    deadline: '2023-10-30',
    progress: 90,
    phase: '完稿',
    description: '包含 Logo 规范、名片、PPT 模板及官网 UI 的全套 VI 升级。',
    coverImage: 'https://image.pollinations.ai/prompt/corporate%20brand%20identity%20vi%20design%20minimalist%20tech?width=800&height=400&nologo=true'
  },
  {
    id: 'p3',
    title: '移动端 APP 角色资产',
    client: '独立工作室',
    status: '草稿',
    budget: 5000,
    deadline: '2023-12-01',
    progress: 10,
    phase: '需求',
    description: '一款放置类手游的 Q 版角色立绘，共 10 个角色。',
    coverImage: 'https://image.pollinations.ai/prompt/cute%20chibi%20game%20character%20sprites%20mobile%20game?width=800&height=400&nologo=true'
  },
  {
    id: 'p4',
    title: '次世代机甲3D模型制作',
    client: 'FutureGames',
    status: '进行中',
    budget: 28000,
    deadline: '2023-11-20',
    progress: 45,
    phase: '高模',
    description: '高精度机甲战士3D模型，包含贴图与骨骼绑定，用于虚幻引擎5。',
    coverImage: 'https://image.pollinations.ai/prompt/high%20quality%203d%20mecha%20robot%20unreal%20engine%205%20render?width=800&height=400&nologo=true'
  },
  {
    id: 'p5',
    title: '虚拟现实 (VR) 展厅设计',
    client: 'MetaHome',
    status: '草稿',
    budget: 60000,
    deadline: '2023-12-31',
    progress: 5,
    phase: '概念',
    description: '为高端家居品牌打造的沉浸式 VR 购物展厅，需适配 Quest 3。',
    coverImage: 'https://image.pollinations.ai/prompt/virtual%20reality%20showroom%20modern%20furniture%20interior%20design?width=800&height=400&nologo=true'
  },
  {
    id: 'p6',
    title: '少儿百科全书插画',
    client: 'EduPress',
    status: '进行中',
    budget: 35000,
    deadline: '2024-01-15',
    progress: 30,
    phase: '草图',
    description: '一套 20 张关于海洋生物的科普插画，风格需活泼生动。',
    coverImage: 'https://image.pollinations.ai/prompt/children%20book%20illustration%20ocean%20animals%20colorful?width=800&height=400&nologo=true'
  },
  // New Added Project
  {
    id: 'p7',
    title: '金融科技 App 界面重构',
    client: 'FinTech Corp',
    status: '进行中',
    budget: 55000,
    deadline: '2024-02-28',
    progress: 25,
    phase: 'UI设计',
    description: '为移动端银行应用提供全新的用户体验设计，包含暗色模式适配。',
    coverImage: 'https://image.pollinations.ai/prompt/fintech%20mobile%20app%20ui%20design%20dark%20mode%20modern?width=800&height=400&nologo=true'
  }
];

export const MOCK_TASKS: Task[] = [
  // P1
  {
    id: 't1', projectId: 'p1', title: '角色A线稿细化', assignee: 'Alex', assigneeAvatar: 'https://ui-avatars.com/api/?name=Alex&background=random',
    status: 'done', priority: 'high', dueDate: '10月20日', comments: 3, attachments: 2
  },
  {
    id: 't2', projectId: 'p1', title: '背景色彩氛围设定', assignee: 'Sam', assigneeAvatar: 'https://ui-avatars.com/api/?name=Sam&background=random',
    status: 'in-progress', priority: 'medium', dueDate: '10月25日', comments: 5, attachments: 1
  },
  {
    id: 't3', projectId: 'p1', title: '角色B/C 草图绘制', assignee: 'Alex', assigneeAvatar: 'https://ui-avatars.com/api/?name=Alex&background=random',
    status: 'in-progress', priority: 'high', dueDate: '10月26日', comments: 0, attachments: 0
  },
  {
    id: 't4', projectId: 'p1', title: '最终光影合成', assignee: 'Lead', assigneeAvatar: 'https://ui-avatars.com/api/?name=Lead&background=random',
    status: 'todo', priority: 'high', dueDate: '11月01日', comments: 0, attachments: 0
  },
  {
    id: 't1_1', projectId: 'p1', title: '海浪特效绘制', assignee: 'Sam', assigneeAvatar: 'https://ui-avatars.com/api/?name=Sam&background=random',
    status: 'todo', priority: 'low', dueDate: '10月28日', comments: 1, attachments: 0
  },
  // P2
  {
    id: 't5', projectId: 'p2', title: 'Logo 矢量文件输出', assignee: 'DesignTeam', assigneeAvatar: 'https://ui-avatars.com/api/?name=Design+Team&background=random',
    status: 'done', priority: 'high', dueDate: '10月15日', comments: 1, attachments: 4
  },
  {
    id: 't6', projectId: 'p2', title: '官网 UI 视觉规范', assignee: 'DesignTeam', assigneeAvatar: 'https://ui-avatars.com/api/?name=Design+Team&background=random',
    status: 'review', priority: 'medium', dueDate: '10月28日', comments: 8, attachments: 2
  },
  {
    id: 't2_1', projectId: 'p2', title: 'PPT 母版样式微调', assignee: 'DesignTeam', assigneeAvatar: 'https://ui-avatars.com/api/?name=Design+Team&background=random',
    status: 'done', priority: 'low', dueDate: '10月22日', comments: 2, attachments: 1
  },
  // P3
  {
    id: 't7', projectId: 'p3', title: '需求文档确认', assignee: 'PM', assigneeAvatar: 'https://ui-avatars.com/api/?name=PM&background=random',
    status: 'done', priority: 'high', dueDate: '10月10日', comments: 12, attachments: 1
  },
  {
    id: 't8', projectId: 'p3', title: '风格探索 (Moodboard)', assignee: 'Artist1', assigneeAvatar: 'https://ui-avatars.com/api/?name=Artist+1&background=random',
    status: 'in-progress', priority: 'medium', dueDate: '11月05日', comments: 2, attachments: 5
  },
  // P4
  {
    id: 't4_1', projectId: 'p4', title: '头部高模雕刻', assignee: '3D_Max', assigneeAvatar: 'https://ui-avatars.com/api/?name=3D+Max&background=random',
    status: 'done', priority: 'high', dueDate: '11月01日', comments: 4, attachments: 3
  },
  {
    id: 't4_2', projectId: 'p4', title: '身体机甲结构搭建', assignee: '3D_Max', assigneeAvatar: 'https://ui-avatars.com/api/?name=3D+Max&background=random',
    status: 'in-progress', priority: 'high', dueDate: '11月10日', comments: 1, attachments: 0
  },
  {
    id: 't4_3', projectId: 'p4', title: '低模拓扑 (Retopology)', assignee: 'Junior_Mod', assigneeAvatar: 'https://ui-avatars.com/api/?name=Junior&background=random',
    status: 'todo', priority: 'medium', dueDate: '11月15日', comments: 0, attachments: 0
  },
  {
    id: 't4_4', projectId: 'p4', title: 'UV 拆分与整理', assignee: 'Junior_Mod', assigneeAvatar: 'https://ui-avatars.com/api/?name=Junior&background=random',
    status: 'todo', priority: 'low', dueDate: '11月18日', comments: 0, attachments: 0
  },
  // P5 (New)
  {
    id: 't5_1', projectId: 'p5', title: '展厅平面布局图', assignee: 'Architect', assigneeAvatar: 'https://ui-avatars.com/api/?name=Architect&background=random',
    status: 'review', priority: 'high', dueDate: '11月05日', comments: 6, attachments: 1
  },
  {
    id: 't5_2', projectId: 'p5', title: 'VR 交互逻辑定义', assignee: 'Dev_Lead', assigneeAvatar: 'https://ui-avatars.com/api/?name=Dev+Lead&background=random',
    status: 'todo', priority: 'medium', dueDate: '11月12日', comments: 0, attachments: 0
  },
  // P6 (New)
  {
    id: 't6_1', projectId: 'p6', title: '海洋生物资料收集', assignee: 'Illustrator', assigneeAvatar: 'https://ui-avatars.com/api/?name=Illustrator&background=random',
    status: 'done', priority: 'low', dueDate: '10月25日', comments: 1, attachments: 8
  },
  {
    id: 't6_2', projectId: 'p6', title: '第一批草图 (5张)', assignee: 'Illustrator', assigneeAvatar: 'https://ui-avatars.com/api/?name=Illustrator&background=random',
    status: 'in-progress', priority: 'high', dueDate: '11月08日', comments: 2, attachments: 5
  }
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'f1', name: '2023 营销物料', type: 'folder', modified: '2天前', version: '-', tags: [] },
  { id: 'f2', name: '游戏资产 v2', type: 'folder', modified: '1周前', version: '-', tags: [] },
  { id: 'f3', name: '机甲项目_P4', type: 'folder', modified: '刚刚', version: '-', tags: [] },
  { id: 'f4', name: '少儿百科插画_P6', type: 'folder', modified: '3小时前', version: '-', tags: [] },
  { id: 'a1', name: '首页_Banner_终版.psd', type: 'psd', size: '145 MB', modified: '3小时前', version: 'v2.1', tags: ['活动', 'Banner'] },
  { id: 'a2', name: 'Logo_演绎动画.mp4', type: 'video', size: '24 MB', modified: '昨天', version: 'v1.0', tags: ['品牌'] },
  { id: 'a3', name: '角色_三视图.jpg', type: 'image', size: '2.4 MB', modified: '昨天', version: 'v1.5', tags: ['设定'] },
  { id: 'a4', name: '合同_已签署.pdf', type: 'doc', size: '1.2 MB', modified: '10月20日', version: 'v1.0', tags: ['法务'] },
  { id: 'a5', name: '鯨鱼_分层源文件.psd', type: 'psd', size: '320 MB', modified: '5小时前', version: 'v1.0', tags: ['插画', '海洋'] },
  { id: 'a6', name: '展厅_概念图_01.jpg', type: 'image', size: '5.6 MB', modified: '1天前', version: 'v0.5', tags: ['VR', '概念'] },
  { id: 'a7', name: '交互规范文档.pdf', type: 'doc', size: '3.4 MB', modified: '2天前', version: 'v1.2', tags: ['文档'] }
];

export const CHART_DATA_ARTIST = [
  { name: '周一', revenue: 200, active: 450 },
  { name: '周二', revenue: 500, active: 620 },
  { name: '周三', revenue: 1200, active: 800 },
  { name: '周四', revenue: 800, active: 750 },
  { name: '周五', revenue: 2400, active: 900 },
  { name: '周六', revenue: 1500, active: 1200 },
  { name: '周日', revenue: 3000, active: 1500 },
];

export const CHART_DATA_CLIENT = [
  { name: '周一', expenditure: 4000, active: 24 },
  { name: '周二', expenditure: 3000, active: 13 },
  { name: '周三', expenditure: 2000, active: 38 },
  { name: '周四', expenditure: 2780, active: 39 },
  { name: '周五', expenditure: 5890, active: 48 },
  { name: '周六', expenditure: 2390, active: 38 },
  { name: '周日', expenditure: 3490, active: 43 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tr_1', type: 'income', amount: 12000, date: '2023-10-26 14:30', description: '项目 P1 阶段一验收款', status: 'completed', relatedProject: 'p1' },
  { id: 'tr_2', type: 'withdrawal', amount: -5000, date: '2023-10-25 09:15', description: '提现至支付宝 (尾号 9876)', status: 'completed' },
  { id: 'tr_3', type: 'payment', amount: -200, date: '2023-10-24 18:00', description: '平台技术服务费 (10月)', status: 'completed' },
  { id: 'tr_4', type: 'escrow_release', amount: 45000, date: '2023-10-20 11:20', description: '项目 P2 资金托管释放', status: 'completed', relatedProject: 'p2' },
  { id: 'tr_5', type: 'withdrawal', amount: -20000, date: '2023-10-18 16:45', description: '提现至招商银行 (尾号 8888)', status: 'completed' },
  { id: 'tr_6', type: 'escrow_frozen', amount: 5000, date: '2023-10-15 10:00', description: '项目 P3 预付款托管冻结', status: 'completed', relatedProject: 'p3' },
  { id: 'tr_7', type: 'income', amount: 8000, date: '2023-10-12 13:20', description: '稿件 C34 版权转让费', status: 'completed' },
  { id: 'tr_8', type: 'escrow_frozen', amount: 12000, date: '2023-10-28 09:00', description: '项目 P6 第一阶段托管', status: 'completed', relatedProject: 'p6' },
  { id: 'tr_9', type: 'payment', amount: -600, date: '2023-10-29 11:30', description: '购买 Pro 会员 (年付)', status: 'completed' },
  { id: 'tr_10', type: 'income', amount: 1500, date: '2023-10-30 15:45', description: '素材库分成收入', status: 'completed' }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-1001', amount: 45000, createdDate: '2023-10-20', title: '技术服务费 - TechNova 科技', status: 'paid', companyName: 'TechNova 科技' },
  { id: 'INV-2023-1002', amount: 12000, createdDate: '2023-10-26', title: '美术设计费 - 网易游戏', status: 'paid', companyName: '网易游戏' },
  { id: 'INV-2023-1003', amount: 5000, createdDate: '2023-10-28', title: '创意咨询费 - 独立工作室', status: 'processing', companyName: '独立工作室' },
  { id: 'INV-2023-1004', amount: 35000, createdDate: '2023-10-29', title: '插画制作费 - EduPress', status: 'unpaid', companyName: 'EduPress' }
];
