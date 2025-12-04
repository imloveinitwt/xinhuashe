
import { Artwork, Asset, Project, Task, Transaction, Invoice, Creator, Event, RoleDefinition, User, UserProfile, Article, SavingsGoal, DepartmentBudget, EnterpriseProfile, ProjectCase, Notification, SystemLog, VerificationRequest } from './types';
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
export const MOCK_USERS_ADMIN_VIEW: User[] = [
  { id: 'u1', name: 'Admin_Root', role: 'root_admin', roleName: '系统根管理员', avatar: 'https://ui-avatars.com/api/?name=Admin+Root&background=ef4444&color=fff', permissions: [], isAuthenticated: true, status: 'active', email: 'root@xhs.com' },
  { id: 'u2', name: 'Ops_Sarah', role: 'content_ops', roleName: '内容审核员', avatar: 'https://ui-avatars.com/api/?name=Sarah+Ops&background=f97316&color=fff', permissions: [], isAuthenticated: true, status: 'active', email: 'sarah@xhs.com' },
  { id: 'u3', name: 'NeonDreamer', role: 'creator', roleName: '认证创作者', avatar: 'https://ui-avatars.com/api/?name=Neon+Dreamer&background=8b5cf6&color=fff', permissions: [], isAuthenticated: true, status: 'active', email: 'neon@gmail.com' },
  { id: 'u4', name: 'TechNova_PM', role: 'enterprise', roleName: '企业主账号', avatar: 'https://ui-avatars.com/api/?name=Tech+Nova&background=3b82f6&color=fff', permissions: [], isAuthenticated: true, status: 'active', email: 'pm@technova.com' },
  { id: 'u5', name: 'InkFlow', role: 'creator', roleName: '创作者', avatar: 'https://ui-avatars.com/api/?name=Ink+Flow&background=10b981&color=fff', permissions: [], isAuthenticated: true, status: 'active', email: 'ink@studio.com' },
  { id: 'u6', name: 'GameStudio_HR', role: 'enterprise', roleName: '企业主账号', avatar: 'https://ui-avatars.com/api/?name=Game+Studio&background=6366f1&color=fff', permissions: [], isAuthenticated: true, status: 'banned', email: 'hr@gamestudio.com' },
  { id: 'u7', name: 'PixelArtist_99', role: 'creator', roleName: '创作者', avatar: 'https://ui-avatars.com/api/?name=Pixel+Artist&background=random&color=fff', permissions: [], isAuthenticated: true, status: 'active', email: 'pixel99@art.com' },
  { id: 'u8', name: 'Marketing_Lead', role: 'enterprise', roleName: '企业主账号', avatar: 'https://ui-avatars.com/api/?name=Marketing&background=random&color=fff', permissions: [], isAuthenticated: true, status: 'active', email: 'market@brand.com' },
  { id: 'u9', name: 'Design_Lead_A', role: 'creator', roleName: '设计总监', avatar: 'https://ui-avatars.com/api/?name=Design+Lead&background=ec4899&color=fff', permissions: [], isAuthenticated: true, status: 'inactive', email: 'design@lead.com' },
  { id: 'u10', name: 'Finance_User', role: 'enterprise', roleName: '财务专员', avatar: 'https://ui-avatars.com/api/?name=Finance+User&background=14b8a6&color=fff', permissions: [], isAuthenticated: true, status: 'active', email: 'finance@corp.com' },
];

export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  { id: 'log_1', action: '登录系统', operator: 'Admin_Root', target: 'System', timestamp: '2023-10-27 09:00:01', ip: '192.168.1.1', status: 'success' },
  { id: 'log_2', action: '封禁用户', operator: 'Admin_Root', target: 'GameStudio_HR (u6)', timestamp: '2023-10-27 09:15:30', ip: '192.168.1.1', status: 'success' },
  { id: 'log_3', action: '修改配置', operator: 'Admin_Root', target: 'Content Audit Level', timestamp: '2023-10-27 10:22:10', ip: '192.168.1.1', status: 'success' },
  { id: 'log_4', action: '删除作品', operator: 'Ops_Sarah', target: 'Artwork #204', timestamp: '2023-10-27 11:05:00', ip: '10.0.0.5', status: 'success' },
  { id: 'log_5', action: '登录失败', operator: 'Unknown', target: 'System', timestamp: '2023-10-27 13:45:12', ip: '203.114.55.1', status: 'failure' },
  { id: 'log_6', action: '重置密码', operator: 'Admin_Root', target: 'TechNova_PM (u4)', timestamp: '2023-10-27 14:10:00', ip: '192.168.1.1', status: 'success' },
  { id: 'log_7', action: '批量审核', operator: 'Ops_Sarah', target: 'Artworks (15 items)', timestamp: '2023-10-27 15:30:00', ip: '10.0.0.5', status: 'success' },
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
    isVerified: true,
    status: 'approved'
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
    isVerified: true,
    status: 'approved'
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
    isVerified: true,
    status: 'approved'
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
    isVerified: false,
    status: 'pending'
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
    isVerified: false,
    status: 'approved'
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
    isVerified: true,
    status: 'approved'
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
    isVerified: true,
    status: 'approved'
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
    isVerified: false,
    status: 'approved'
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
    isAiGenerated: true,
    status: 'approved'
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
    isVerified: true,
    status: 'approved'
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
    isVerified: true,
    status: 'approved'
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
    isVerified: true,
    status: 'approved'
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
    isVerified: true,
    status: 'approved'
  },
  {
    id: '14',
    title: '浮空岛：天空之城',
    artist: 'VoxelBuilder',
    artistAvatar: 'https://ui-avatars.com/api/?name=Voxel+Builder&background=10b981&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/voxel%20art%20floating%20island%20sky%20castle%20clouds?width=600&height=600&nologo=true',
    likes: 1350,
    views: 2900,
    tags: ['体素艺术', 'MagicaVoxel', '场景'],
    isVerified: false,
    status: 'approved'
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
    isVerified: true,
    status: 'approved'
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
    isVerified: true,
    status: 'approved'
  },
  {
    id: '17',
    title: '极简咖啡馆',
    artist: 'PixelRetro',
    artistAvatar: 'https://ui-avatars.com/api/?name=Pixel+Retro&background=f59e0b&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/isometric%20pixel%20art%20cozy%20coffee%20shop%20interior?width=600&height=600&nologo=true',
    likes: 1900,
    views: 4500,
    tags: ['像素画', '场景', '可爱'],
    isVerified: false,
    status: 'approved'
  },
  {
    id: '18',
    title: '蒸汽朋克飞艇',
    artist: 'SteamEngine',
    artistAvatar: 'https://ui-avatars.com/api/?name=Steam+Engine&background=78350f&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/steampunk%20airship%20flying%20in%20clouds%20brass%20gears?width=600&height=400&nologo=true',
    likes: 3100,
    views: 7800,
    tags: ['蒸汽朋克', '插画', '概念设计'],
    isVerified: true,
    status: 'approved'
  },
  {
    id: '19',
    title: '极光下的雪屋',
    artist: 'NatureStroke',
    artistAvatar: 'https://ui-avatars.com/api/?name=Nature+Stroke&background=10b981&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/northern%20lights%20aurora%20over%20snowy%20cabin%20winter?width=600&height=400&nologo=true',
    likes: 4200,
    views: 9500,
    tags: ['风景', '插画', '治愈系'],
    isVerified: true,
    status: 'approved'
  },
  {
    id: '20',
    title: '电商活动促销 C4D',
    artist: '3DAdMaster',
    artistAvatar: 'https://ui-avatars.com/api/?name=3D+Ad+Master&background=ef4444&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/c4d%203d%20render%20ecommerce%20sale%20podium%20colorful?width=600&height=600&nologo=true',
    likes: 1100,
    views: 2800,
    tags: ['C4D', '电商设计', '3D'],
    isVerified: false,
    status: 'approved'
  },
  {
    id: '21',
    title: '二次元机能风少女',
    artist: 'AnimePro',
    artistAvatar: 'https://ui-avatars.com/api/?name=Anime+Pro&background=ec4899&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/anime%20girl%20techwear%20cyberpunk%20street%20style?width=600&height=800&nologo=true',
    likes: 5600,
    views: 18000,
    tags: ['二次元', '角色', '插画'],
    isVerified: true,
    status: 'approved'
  },
  // --- New Additions ---
  {
    id: '22',
    title: '赛博武士：赤红之刃',
    artist: 'NeonDreamer',
    artistAvatar: 'https://ui-avatars.com/api/?name=Neon+Dreamer&background=8b5cf6&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/cyberpunk%20samurai%20red%20laser%20katana%20rain%20night?width=600&height=800&nologo=true',
    likes: 3420,
    views: 12000,
    tags: ['科幻', '角色', '赛博朋克'],
    isVerified: true,
    status: 'approved'
  },
  {
    id: '23',
    title: '深海探险队',
    artist: 'OceanBlue',
    artistAvatar: 'https://ui-avatars.com/api/?name=Ocean+Blue&background=0ea5e9&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/deep%20sea%20exploration%20submarine%20bioluminescence?width=600&height=400&nologo=true',
    likes: 1890,
    views: 5600,
    tags: ['科幻', '场景', '深海'],
    isVerified: false,
    status: 'approved'
  },
  {
    id: '24',
    title: '古风建筑：空中楼阁',
    artist: 'InkFlow',
    artistAvatar: 'https://ui-avatars.com/api/?name=Ink+Flow&background=10b981&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/chinese%20ancient%20floating%20palace%20clouds%20fantasy?width=600&height=800&nologo=true',
    likes: 5670,
    views: 18900,
    tags: ['国风', '建筑', '场景'],
    isVerified: true,
    status: 'approved'
  },
  {
    id: '25',
    title: '超现实主义梦境',
    artist: 'DreamWeaver',
    artistAvatar: 'https://ui-avatars.com/api/?name=Dream+Weaver&background=a855f7&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/surrealism%20dream%20landscape%20clocks%20melting%20salvador%20dali%20style?width=600&height=600&nologo=true',
    likes: 2300,
    views: 7800,
    tags: ['超现实', '艺术', '插画'],
    isVerified: false,
    status: 'pending'
  },
  {
    id: '26',
    title: '美食插画：日式拉面',
    artist: 'FoodieArt',
    artistAvatar: 'https://ui-avatars.com/api/?name=Foodie+Art&background=f97316&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/delicious%20japanese%20ramen%20illustration%20anime%20style%20steam?width=600&height=600&nologo=true',
    likes: 4100,
    views: 10500,
    tags: ['插画', '美食', '治愈'],
    isVerified: true,
    status: 'approved'
  },
  {
    id: '27',
    title: '低多边形动物园',
    artist: 'LowPolyGod',
    artistAvatar: 'https://ui-avatars.com/api/?name=Low+Poly&background=8b5cf6&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/low%20poly%20zoo%20animals%20elephant%20giraffe%20lion%203d?width=600&height=400&nologo=true',
    likes: 1560,
    views: 4200,
    tags: ['3D', 'LowPoly', '动物'],
    isVerified: true,
    status: 'approved'
  },
  {
    id: '28',
    title: 'APP 启动页设计：旅行',
    artist: 'UIDesignPro',
    artistAvatar: 'https://ui-avatars.com/api/?name=UI+Pro&background=3b82f6&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/travel%20app%20splash%20screen%20ui%20design%20mobile%20modern?width=600&height=900&nologo=true',
    likes: 2890,
    views: 9100,
    tags: ['UI', '移动端', '界面'],
    isVerified: true,
    status: 'approved'
  },
  {
    id: '29',
    title: '暗黑幻想：龙之巢穴',
    artist: 'DarkFantasy',
    artistAvatar: 'https://ui-avatars.com/api/?name=Dark+Fantasy&background=1f2937&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/dark%20fantasy%20dragon%20lair%20treasure%20epic%20lighting?width=600&height=400&nologo=true',
    likes: 6700,
    views: 21000,
    tags: ['奇幻', '概念', '龙'],
    isVerified: true,
    status: 'approved'
  },
  {
    id: '30',
    title: '时尚杂志封面概念',
    artist: 'VogueArt',
    artistAvatar: 'https://ui-avatars.com/api/?name=Vogue+Art&background=ec4899&color=fff',
    imageUrl: 'https://image.pollinations.ai/prompt/fashion%20magazine%20cover%20design%20high%20fashion%20model?width=600&height=800&nologo=true',
    likes: 1200,
    views: 3400,
    tags: ['时尚', '排版', '平面设计'],
    isVerified: false,
    status: 'approved'
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
  { id: 'c8', name: 'NeonDreamer', avatar: 'https://ui-avatars.com/api/?name=Neon+Dreamer&background=8b5cf6&color=fff', tags: ['赛博朋克', '场景'], followers: 120000, isVerified: true },
  { id: 'c9', name: 'VoxelBuilder', avatar: 'https://ui-avatars.com/api/?name=Voxel+Builder&background=10b981&color=fff', tags: ['体素', '3D'], followers: 15000, isVerified: false },
  { id: 'c10', name: 'OceanBlue', avatar: 'https://ui-avatars.com/api/?name=Ocean+Blue&background=0ea5e9&color=fff', tags: ['场景', '概念'], followers: 8900, isVerified: false },
  { id: 'c11', name: 'DarkFantasy', avatar: 'https://ui-avatars.com/api/?name=Dark+Fantasy&background=1f2937&color=fff', tags: ['奇幻', '插画'], followers: 23000, isVerified: true },
  { id: 'c12', name: 'FoodieArt', avatar: 'https://ui-avatars.com/api/?name=Foodie+Art&background=f97316&color=fff', tags: ['美食', '生活'], followers: 12000, isVerified: true },
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
  // ... (keeping other projects)
  {
    id: 'p15',
    title: 'Web3 社区 NFT 系列生成',
    client: 'CryptoWorld',
    status: '验收中',
    budget: 90000,
    deadline: '2023-10-28',
    progress: 98,
    phase: '验收',
    description: '设计基础元素并通过代码生成 5000 个独一无二的 PFP 头像。',
    coverImage: 'https://image.pollinations.ai/prompt/nft%20collection%20avatar%20variations%20crypto%20punk%20style?width=800&height=400&nologo=true'
  }
];

export const MOCK_TASKS: Task[] = [
  { id: 't1_1', projectId: 'p1', title: '初步构图草案 (3版)', assignee: 'Alex', assigneeAvatar: 'https://ui-avatars.com/api/?name=Alex&background=random', status: 'done', priority: 'high', dueDate: '10月15日', comments: 4, attachments: 3 },
  // ... (keeping other tasks)
  { id: 't13_2', projectId: 'p13', title: '表情包延展 (6个)', assignee: 'NeonDreamer', assigneeAvatar: 'https://ui-avatars.com/api/?name=Neon+Dreamer&background=8b5cf6&color=fff', status: 'todo', priority: 'medium', dueDate: '11月20日', comments: 1, attachments: 0 },
];

export const MOCK_ASSETS: Asset[] = [
  // ... (keeping other assets)
  { id: 'd3', name: 'Style_Guide_v2.pdf', type: 'doc', size: '12 MB', modified: '3天前', version: 'v2.0', tags: ['Guide', 'Design'] },
];

export const CHART_DATA_ARTIST = [
  { name: '周一', revenue: 200, active: 450 },
  // ... (keeping charts)
  { name: '周日', revenue: 3000, active: 1500 },
];

export const CHART_DATA_CLIENT = [
  { name: '周一', expenditure: 4000, active: 24 },
  // ... (keeping charts)
  { name: '周日', expenditure: 3490, active: 43 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tr_1', type: 'income', amount: 12000, date: '2023-10-26 14:30', description: '项目 P1 阶段一验收款', status: 'completed', relatedProject: 'p1', category: '项目收入' },
  // ... (keeping transactions)
  { id: 'tr_17', type: 'escrow_release', amount: 15000, date: '2023-09-10 10:30', description: '项目 P8 尾款结算', status: 'completed', relatedProject: 'p8', category: '项目收入' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-1001', amount: 45000, createdDate: '2023-10-20', title: '技术服务费 - TechNova 科技', status: 'paid', companyName: 'TechNova 科技' },
  // ... (keeping invoices)
  { id: 'INV-2023-0902', amount: 22000, createdDate: '2023-08-25', title: '包装设计费 - CoffeeCulture', status: 'paid', companyName: 'CoffeeCulture' },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'a1',
    title: '2024年数字艺术趋势报告：AI如何重塑创意工作流',
    coverImage: 'https://image.pollinations.ai/prompt/digital%20art%20trends%20report%20ai%20workflow?width=200&height=200&nologo=true',
    date: '2小时前'
  },
  // ...
];

export const MOCK_SAVINGS_GOALS: SavingsGoal[] = [
  { id: 'g1', name: '新款 MacBook Pro', targetAmount: 20000, currentAmount: 12500, deadline: '2023-12-31', color: 'bg-indigo-500', icon: Laptop },
  // ...
];

export const MOCK_DEPT_BUDGETS: DepartmentBudget[] = [
  { id: 'db1', department: '市场营销部', totalBudget: 500000, usedBudget: 320000, head: 'Alice Wang', status: 'healthy' },
  // ...
];

export const CHART_DATA_CASH_FLOW = [
  { month: '1月', income: 150000, expense: 120000, profit: 30000 },
  // ...
];

export const CHART_DATA_PERSONAL_SPENDING = [
  { name: '设备软件', value: 35, color: '#6366f1' },
  // ...
];

export const MOCK_ENTERPRISE_PROFILE: EnterpriseProfile = {
  name: 'TechNova 科技',
  description: 'TechNova 是一家专注于人工智能与大数据分析的领先科技企业...',
  industry: '互联网 / 人工智能',
  size: '500-1000人',
  founded: '2015年',
  website: 'www.technova.tech',
  logo: 'https://ui-avatars.com/api/?name=Tech+Nova&background=3b82f6&color=fff&size=128',
  coreBusiness: ['智能风控系统', '企业级 BI 平台', '云原生架构咨询', '大数据中台'],
  history: [
    { year: '2023', title: '完成 C 轮融资', description: '获得顶级风投机构 5000 万美元投资，估值突破 5 亿。' },
    // ...
  ],
  structure: {
    id: 'root', name: 'CEO Office', role: 'CEO', children: [
      // ...
    ]
  }
};

export const MOCK_PROJECT_CASES: ProjectCase[] = [
  {
    id: 'case1',
    title: '某大型银行智能风控系统升级',
    year: '2022',
    category: '金融科技',
    description: '通过引入 TechNova 的 AI 决策引擎...',
    coverImage: 'https://image.pollinations.ai/prompt/fintech%20data%20center%20security%20blue?width=600&height=300&nologo=true',
    results: [
      { label: '风控识别率', value: '+45%' },
      // ...
    ],
    clientTestimonial: {
      text: "TechNova 的团队非常专业...",
      author: "张总, 风险管理部总经理"
    }
  },
  // ...
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'system',
    title: '欢迎加入薪画社！',
    content: '祝贺您成功注册。请完善您的个人资料，并完成实名认证以解锁全部功能。',
    time: '2分钟前',
    isRead: false,
    actionLabel: '去认证',
    linkTo: 'profile'
  },
  // ...
];

export const MOCK_VERIFICATION_REQUESTS: VerificationRequest[] = [
  {
    id: 'req_1',
    userId: 'u_101',
    userName: 'ArtMaster',
    userAvatar: 'https://ui-avatars.com/api/?name=Art+Master&background=ec4899&color=fff',
    type: 'personal',
    status: 'pending',
    submitTime: '2023-10-26 10:00:00',
    realName: '张三',
    idCardNumber: '310101199001011234',
    idCardFront: 'https://placehold.co/400x250/e2e8f0/64748b?text=ID+Front',
    idCardBack: 'https://placehold.co/400x250/e2e8f0/64748b?text=ID+Back'
  },
  {
    id: 'req_2',
    userId: 'u_105',
    userName: 'TechNova',
    userAvatar: 'https://ui-avatars.com/api/?name=Tech+Nova&background=3b82f6&color=fff',
    type: 'enterprise',
    status: 'pending',
    submitTime: '2023-10-25 14:30:00',
    companyName: 'TechNova 科技有限公司',
    creditCode: '91310000MA1FL43210',
    legalRep: '李四',
    businessLicense: 'https://placehold.co/300x400/e2e8f0/64748b?text=License'
  },
  {
    id: 'req_3',
    userId: 'u_102',
    userName: 'PixelRetro',
    userAvatar: 'https://ui-avatars.com/api/?name=Pixel+Retro&background=f59e0b&color=fff',
    type: 'personal',
    status: 'approved',
    submitTime: '2023-10-20 09:15:00',
    reviewTime: '2023-10-20 11:00:00',
    reviewer: 'Ops_Sarah',
    realName: '王五',
    idCardNumber: '310101199505055678',
    idCardFront: 'https://placehold.co/400x250/e2e8f0/64748b?text=ID+Front',
    idCardBack: 'https://placehold.co/400x250/e2e8f0/64748b?text=ID+Back'
  }
];