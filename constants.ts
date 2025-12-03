

import { Artwork, Asset, Project, Task, Transaction, Invoice, Creator, Event, RoleDefinition, User, UserProfile, Article, SavingsGoal, DepartmentBudget, EnterpriseProfile, ProjectCase } from './types';
import { Laptop, Plane, Home, Briefcase, Car } from 'lucide-react';

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
  },
  // New Added Artworks
  {
    id: '14',
    title: '浮空岛：天空之城',
    artist: 'VoxelBuilder',
    artistAvatar: 'https://ui-avatars.com/api/?name=Voxel+Builder&background=10b981&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/voxel%20art%20floating%20island%20sky%20castle%20clouds?width=600&height=600&nologo=true',
    likes: 1350,
    views: 2900,
    tags: ['体素艺术', 'MagicaVoxel', '场景'],
    isVerified: false
  },
  {
    id: '15',
    title: '印象派：雨中街景',
    artist: 'OilPainter',
    artistAvatar: 'https://ui-avatars.com/api/?name=Oil+Painter&background=f59e0b&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/impressionist%20oil%20painting%20rainy%20city%20street%20night%20reflections?width=600&height=400&nologo=true',
    likes: 2800,
    views: 6100,
    tags: ['油画', '传统艺术', '印象派'],
    isVerified: true
  },
  {
    id: '16',
    title: '异星战场概念图',
    artist: 'MattePainter',
    artistAvatar: 'https://ui-avatars.com/api/?name=Matte+Painter&background=6366f1&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/sci-fi%20alien%20battlefield%20matte%20painting%20epic%20scale?width=600&height=300&nologo=true',
    likes: 4100,
    views: 11000,
    tags: ['MattePainting', '电影概念', '科幻'],
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
  {
    id: 'p_artmaster',
    userId: 'u_101', 
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
  },
  {
    id: 'p8',
    title: '可持续能源品牌宣传战役',
    client: 'GreenEnergy',
    status: '进行中',
    budget: 75000,
    deadline: '2024-03-15',
    progress: 60,
    phase: '物料延展',
    description: '包含品牌视频、社交媒体海报及线下活动物料的全案设计。',
    coverImage: 'https://image.pollinations.ai/prompt/sustainable%20energy%20brand%20campaign%20poster%20wind%20solar%20clean?width=800&height=400&nologo=true'
  }
];

export const MOCK_TASKS: Task[] = [
  // ... (keeping existing tasks)
  { id: 't1_1', projectId: 'p1', title: '初步构图草案 (3版)', assignee: 'Alex', assigneeAvatar: 'https://ui-avatars.com/api/?name=Alex&background=random', status: 'done', priority: 'high', dueDate: '10月15日', comments: 4, attachments: 3 },
  // ... (abbreviated for brevity, assuming existing data is kept)
];

export const MOCK_ASSETS: Asset[] = [
  // ... (keeping existing assets)
  { id: 'f1', name: '2023 营销物料', type: 'folder', modified: '2天前', version: '-', tags: [] },
  // ... 
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
  { id: 'tr_1', type: 'income', amount: 12000, date: '2023-10-26 14:30', description: '项目 P1 阶段一验收款', status: 'completed', relatedProject: 'p1', category: '项目收入' },
  { id: 'tr_2', type: 'withdrawal', amount: -5000, date: '2023-10-25 09:15', description: '提现至支付宝 (尾号 9876)', status: 'completed', category: '提现' },
  { id: 'tr_3', type: 'payment', amount: -200, date: '2023-10-24 18:00', description: '平台技术服务费 (10月)', status: 'completed', category: '平台费用' },
  { id: 'tr_4', type: 'escrow_release', amount: 45000, date: '2023-10-20 11:20', description: '项目 P2 资金托管释放', status: 'completed', relatedProject: 'p2', category: '项目收入' },
  { id: 'tr_5', type: 'withdrawal', amount: -20000, date: '2023-10-18 16:45', description: '提现至招商银行 (尾号 8888)', status: 'completed', category: '提现' },
  { id: 'tr_6', type: 'escrow_frozen', amount: 5000, date: '2023-10-15 10:00', description: '项目 P3 预付款托管冻结', status: 'completed', relatedProject: 'p3', category: '项目支出' },
  { id: 'tr_7', type: 'income', amount: 8000, date: '2023-10-12 13:20', description: '稿件 C34 版权转让费', status: 'completed', category: '版权收益' },
  { id: 'tr_8', type: 'escrow_frozen', amount: 12000, date: '2023-10-28 09:00', description: '项目 P6 第一阶段托管', status: 'completed', relatedProject: 'p6', category: '项目支出' },
  { id: 'tr_9', type: 'payment', amount: -600, date: '2023-10-29 11:30', description: '购买 Pro 会员 (年付)', status: 'completed', category: '软件订阅' },
  { id: 'tr_10', type: 'income', amount: 1500, date: '2023-10-30 15:45', description: '素材库分成收入', status: 'completed', category: '被动收入' }
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-1001', amount: 45000, createdDate: '2023-10-20', title: '技术服务费 - TechNova 科技', status: 'paid', companyName: 'TechNova 科技' },
  { id: 'INV-2023-1002', amount: 12000, createdDate: '2023-10-26', title: '美术设计费 - 网易游戏', status: 'paid', companyName: '网易游戏' },
  { id: 'INV-2023-1003', amount: 5000, createdDate: '2023-10-28', title: '创意咨询费 - 独立工作室', status: 'processing', companyName: '独立工作室' },
  { id: 'INV-2023-1004', amount: 35000, createdDate: '2023-10-29', title: '插画制作费 - EduPress', status: 'unpaid', companyName: 'EduPress' }
];

export const MOCK_ARTICLES: Article[] = [
  // ... existing articles
  {
    id: 'a1',
    title: '2024年数字艺术趋势报告：AI如何重塑创意工作流',
    coverImage: 'https://image.pollinations.ai/prompt/digital%20art%20trends%20report%20ai%20workflow?width=200&height=200&nologo=true',
    date: '2小时前'
  },
  // ...
];

// === NEW MOCK DATA FOR FINANCE VIEW ===

export const MOCK_SAVINGS_GOALS: SavingsGoal[] = [
  { id: 'g1', name: '新款 MacBook Pro', targetAmount: 20000, currentAmount: 12500, deadline: '2023-12-31', color: 'bg-indigo-500', icon: Laptop },
  { id: 'g2', name: '日本游学基金', targetAmount: 50000, currentAmount: 18000, deadline: '2024-06-01', color: 'bg-pink-500', icon: Plane },
  { id: 'g3', name: '工作时装修', targetAmount: 10000, currentAmount: 8500, deadline: '2023-11-15', color: 'bg-emerald-500', icon: Home },
];

export const MOCK_DEPT_BUDGETS: DepartmentBudget[] = [
  { id: 'db1', department: '市场营销部', totalBudget: 500000, usedBudget: 320000, head: 'Alice Wang', status: 'healthy' },
  { id: 'db2', department: '产品研发部', totalBudget: 1200000, usedBudget: 1150000, head: 'David Chen', status: 'warning' },
  { id: 'db3', department: '创意设计部', totalBudget: 300000, usedBudget: 120000, head: 'Neon Dreamer', status: 'healthy' },
  { id: 'db4', department: '行政人事部', totalBudget: 100000, usedBudget: 98000, head: 'Sarah Li', status: 'critical' },
];

export const CHART_DATA_CASH_FLOW = [
  { month: '1月', income: 150000, expense: 120000, profit: 30000 },
  { month: '2月', income: 180000, expense: 130000, profit: 50000 },
  { month: '3月', income: 160000, expense: 140000, profit: 20000 },
  { month: '4月', income: 210000, expense: 150000, profit: 60000 },
  { month: '5月', income: 240000, expense: 180000, profit: 60000 },
  { month: '6月', income: 280000, expense: 160000, profit: 120000 },
];

export const CHART_DATA_PERSONAL_SPENDING = [
  { name: '设备软件', value: 35, color: '#6366f1' },
  { name: '生活开销', value: 40, color: '#ec4899' },
  { name: '学习进修', value: 15, color: '#10b981' },
  { name: '娱乐', value: 10, color: '#f59e0b' },
];

// === NEW MOCK DATA FOR ENTERPRISE DASHBOARD ===

export const MOCK_ENTERPRISE_PROFILE: EnterpriseProfile = {
  name: 'TechNova 科技',
  description: 'TechNova 是一家专注于人工智能与大数据分析的领先科技企业，致力于通过技术创新为全球客户提供智能化解决方案。',
  industry: '互联网 / 人工智能',
  size: '500-1000人',
  founded: '2015年',
  website: 'www.technova.tech',
  logo: 'https://ui-avatars.com/api/?name=Tech+Nova&background=3b82f6&color=fff&size=128',
  coreBusiness: ['智能风控系统', '企业级 BI 平台', '云原生架构咨询', '大数据中台'],
  history: [
    { year: '2023', title: '完成 C 轮融资', description: '获得顶级风投机构 5000 万美元投资，估值突破 5 亿。' },
    { year: '2021', title: '海外市场扩张', description: '设立新加坡研发中心，正式进军东南亚市场。' },
    { year: '2019', title: '发布 Nova BI 2.0', description: '核心产品迭代，市场占有率进入行业前三。' },
    { year: '2015', title: '公司成立', description: '创始团队来自硅谷，于北京中关村正式成立。' },
  ],
  structure: {
    id: 'root', name: 'CEO Office', role: 'CEO', children: [
      { id: 'd1', name: '产品研发中心', role: 'CTO', children: [
          { id: 'd1-1', name: 'AI 实验室', role: 'Director' },
          { id: 'd1-2', name: '平台架构部', role: 'Architect' }
      ]},
      { id: 'd2', name: '市场营销中心', role: 'CMO', children: [
          { id: 'd2-1', name: '品牌部', role: 'Brand Mgr' },
          { id: 'd2-2', name: '增长黑客', role: 'Growth Lead' }
      ]}
    ]
  }
};

export const MOCK_PROJECT_CASES: ProjectCase[] = [
  {
    id: 'case1',
    title: '某大型银行智能风控系统升级',
    year: '2022',
    category: '金融科技',
    description: '通过引入 TechNova 的 AI 决策引擎，帮助客户构建了毫秒级的实时风控体系，显著降低了信贷欺诈风险。',
    coverImage: 'https://image.pollinations.ai/prompt/fintech%20data%20center%20security%20blue?width=600&height=300&nologo=true',
    results: [
      { label: '风控识别率', value: '+45%' },
      { label: '人工审核成本', value: '-60%' },
      { label: '日处理量', value: '1000万+' }
    ],
    clientTestimonial: {
      text: "TechNova 的团队非常专业，他们的解决方案完美契合了我们的合规要求，交付效率也远超预期。",
      author: "张总, 风险管理部总经理"
    }
  },
  {
    id: 'case2',
    title: '跨境电商数据中台搭建',
    year: '2021',
    category: '电子商务',
    description: '为头部跨境电商平台整合全域数据，打通营销、物流与库存系统，实现了数据驱动的精细化运营。',
    coverImage: 'https://image.pollinations.ai/prompt/ecommerce%20logistics%20global%20map%20data?width=600&height=300&nologo=true',
    results: [
      { label: '库存周转率', value: '+30%' },
      { label: 'GMV 增长', value: '+120%' },
      { label: '数据延迟', value: '<5s' }
    ]
  },
  {
    id: 'case3',
    title: '智慧城市交通大脑',
    year: '2020',
    category: '智慧城市',
    description: '利用计算机视觉技术优化城市信号灯控制，有效缓解了早晚高峰拥堵问题。',
    coverImage: 'https://image.pollinations.ai/prompt/smart%20city%20traffic%20control%20ai?width=600&height=300&nologo=true',
    results: [
      { label: '通行效率', value: '+15%' },
      { label: '平均等待', value: '-20s' }
    ]
  }
];
