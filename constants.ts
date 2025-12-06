
import { 
  ProjectCase, Notification, RoleDefinition, Project, Artwork, 
  Asset, Task, Transaction, Invoice, SavingsGoal, DepartmentBudget, 
  User, SystemLog, VerificationRequest, Creator, MembershipPlan,
  EnterpriseProfile, UserProfile
} from './types';
import { 
  LayoutDashboard, FolderOpen, Briefcase, Wallet, Users, PieChart, Shield, Target,
  FileText, Home, Cpu, Globe, Zap, Award, Palette
} from 'lucide-react';

export const MOCK_PROJECT_CASES: ProjectCase[] = [
  {
    id: 'case1',
    title: '《幻界：觉醒》全套角色原画设定',
    year: '2023',
    category: '游戏娱乐',
    description: '协助某头部游戏厂商，在 2 个月内完成了 50+ 个核心角色的概念设计与立绘细化，统一了美术风格，确保了项目如期上线。',
    coverImage: 'https://image.pollinations.ai/prompt/fantasy%20game%20character%20concept%20art%20collection?width=800&height=600&nologo=true&seed=case1',
    results: [
      { label: '产能提升', value: '200%' },
      { label: '美术定档', value: '提前2周' }
    ],
    clientTestimonial: {
      text: "薪画社的画师资源非常丰富，且质量极高。不仅解决了我们的产能缺口，还提供了许多极具创意的设计方案。",
      author: "陈制作, 《幻界》项目组"
    }
  },
  {
    id: 'case2',
    title: 'Bloom 护肤品牌视觉全案升级',
    year: '2023',
    category: '品牌设计',
    description: '为新锐护肤品牌 Bloom 打造全新的品牌视觉识别系统 (VI)，包括 Logo、包装、线下门店物料及社交媒体规范。',
    coverImage: 'https://image.pollinations.ai/prompt/modern%20skincare%20brand%20identity%20design%20minimalist?width=800&height=600&nologo=true&seed=case2',
    results: [
      { label: '品牌溢价', value: '+35%' },
      { label: '点击率', value: '2.5x' }
    ],
    clientTestimonial: {
      text: "设计师精准地捕捉到了我们要传达的‘自然、纯粹’理念，新包装上市后销量显著增长。",
      author: "Sarah, 品牌总监"
    }
  },
  {
    id: 'case3',
    title: '未来科技峰会 3D 动态主视觉',
    year: '2023',
    category: '3D/动画',
    description: '为 2023 未来科技峰会制作了开场 CG 及全套 3D 动态视觉物料，营造了极具沉浸感的科技氛围。',
    coverImage: 'https://image.pollinations.ai/prompt/futuristic%20tech%20conference%203d%20key%20visual%20motion?width=800&height=600&nologo=true&seed=case3',
    results: [
      { label: '视觉震撼', value: 'S级' },
      { label: '传播声量', value: '10w+' }
    ],
    clientTestimonial: {
      text: "非常高效的团队，在极短的时间内交付了电影级品质的 3D 动画，现场效果非常震撼。",
      author: "李经理, 市场部"
    }
  },
  {
    id: 'case4',
    title: '《云端童话》绘本系列插画',
    year: '2023',
    category: '插画绘本',
    description: '为知名儿童文学作家的新作创作全套 20 幅手绘风格插画，细腻温馨的画风深受读者喜爱，助力新书首月销量破 5 万册。',
    coverImage: 'https://image.pollinations.ai/prompt/children%20book%20illustration%20whimsical%20cloud%20castle?width=800&height=600&nologo=true&seed=case4',
    results: [
      { label: '销量增长', value: '150%' },
      { label: '读者评分', value: '9.8' }
    ],
    clientTestimonial: {
      text: "画师不仅技法出色，更重要的是读懂了故事的内核，每一幅画都充满了想象力。",
      author: "林编辑, 出版社"
    }
  },
  {
    id: 'case5',
    title: 'FinWise 金融 App 体验重塑',
    year: '2023',
    category: 'UI/UX',
    description: '对拥有百万用户的金融 App 进行全站体验升级。通过构建设计系统与优化交互流程，显著提升了用户留存率与转化率。',
    coverImage: 'https://image.pollinations.ai/prompt/mobile%20banking%20app%20interface%20design%20clean%20modern?width=800&height=600&nologo=true&seed=case5',
    results: [
      { label: '转化率', value: '+40%' },
      { label: '用户留存', value: '+25%' }
    ],
    clientTestimonial: {
      text: "非常专业的 UX 团队，新的设计系统极大地提高了我们的开发效率，用户反馈也非常好。",
      author: "David, 产品总监"
    }
  },
  {
    id: 'case6',
    title: '双11 "未来引力" 电商大促主视觉',
    year: '2023',
    category: '营销素材',
    description: '为头部电商平台打造双 11 全渠道营销视觉。包含 C4D 场景搭建、动态海报及 H5 页面设计，营造了极具冲击力的消费氛围。',
    coverImage: 'https://image.pollinations.ai/prompt/3d%20ecommerce%20promotion%20banner%20cyberpunk%20sale?width=800&height=600&nologo=true&seed=case6',
    results: [
      { label: '点击率', value: '3.8%' },
      { label: 'GMV贡献', value: '2亿+' }
    ],
    clientTestimonial: {
      text: "视觉效果非常震撼，完美契合了我们要传达的‘未来消费’理念，为大促带来了巨大的流量。",
      author: "赵经理, 运营部"
    }
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'system',
    title: '系统维护通知',
    content: '为了提供更好的服务，平台将于今晚 02:00 进行例行维护，预计时长 2 小时。',
    time: '2小时前',
    isRead: false
  },
  {
    id: 'n2',
    type: 'project',
    title: '项目进度更新',
    content: '您参与的“春季营销海报设计”项目，雇主已确认线稿，请继续进行上色。',
    time: '5小时前',
    isRead: false,
    linkTo: 'workspace'
  },
  {
    id: 'n3',
    type: 'social',
    title: '新粉丝关注',
    content: '用户“设计爱好者小王”关注了您。',
    time: '1天前',
    isRead: true,
    avatar: 'https://ui-avatars.com/api/?name=W&background=random'
  },
  {
    id: 'n4',
    type: 'finance',
    title: '收益到账提醒',
    content: '您提现的 ¥2,500 已打款至支付宝账户，请注意查收。',
    time: '2天前',
    isRead: true,
    linkTo: 'workspace'
  }
];

export const ROLE_DEFINITIONS: RoleDefinition[] = [
  {
    code: 'root_admin',
    name: '超级管理员',
    description: '系统最高权限，可管理所有用户、内容及系统配置。',
    defaultPermissions: ['SYSTEM_CONFIG', 'USER_VIEW', 'USER_EDIT', 'USER_ROLE_ASSIGN', 'CONTENT_REVIEW', 'CONTENT_DELETE', 'LOG_VIEW']
  },
  {
    code: 'platform_admin',
    name: '平台管理员',
    description: '负责平台日常运营、用户审核及内容监管。',
    defaultPermissions: ['USER_VIEW', 'USER_AUTH_REVIEW', 'CONTENT_REVIEW', 'CONTENT_RECOMMEND', 'TRANSACTION_VIEW']
  },
  {
    code: 'enterprise',
    name: '企业主',
    description: '发布需求、管理项目、使用 DAM 系统。',
    defaultPermissions: ['PROJECT_CREATE', 'PROJECT_VIEW', 'TASK_ASSIGN', 'TRANSACTION_CREATE', 'INVOICE_APPLY', 'CONTENT_UPLOAD']
  },
  {
    code: 'creator',
    name: '创作者',
    description: '接单、发布作品、参与活动。',
    defaultPermissions: ['CONTENT_UPLOAD', 'PROJECT_VIEW', 'WITHDRAW_APPLY', 'TRANSACTION_VIEW']
  },
  {
    code: 'general',
    name: '普通用户',
    description: '浏览内容、关注创作者、简单的互动。',
    defaultPermissions: ['CONTENT_UPLOAD'] // Limited
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'p1',
    title: '2024 新年礼盒包装插画设计',
    client: 'TechNova 科技',
    status: '招募中',
    budget: 15000,
    deadline: '2023-11-20',
    progress: 0,
    phase: '报名筛选',
    description: '寻找擅长国潮风格的插画师，设计一套新年礼盒的包装主视觉。需要包含龙年元素，色彩喜庆但不俗气。',
    category: '插画',
    tags: ['国潮', '包装设计', '节日']
  },
  {
    id: 'p2',
    title: '科幻风格游戏角色立绘（长期）',
    client: '星际互动互娱',
    status: '进行中',
    budget: 8000,
    deadline: '2023-12-01',
    progress: 45,
    phase: '线稿监修',
    description: '手游项目，需求赛博朋克风格的女性角色立绘，需要拆分图层，用于Live2D制作。',
    category: '游戏原画',
    tags: ['二次元', '赛博朋克', '角色设计']
  },
  {
    id: 'p3',
    title: '企业官网 UI 界面全新升级',
    client: 'BlueSky 咨询',
    status: '招募中',
    budget: 25000,
    deadline: '2023-11-15',
    progress: 0,
    phase: '报名筛选',
    description: '对现有官网进行改版，要求风格简洁大气，符合国际化咨询公司的定位。包含首页、关于我们、服务案例等 10+ 页面。',
    category: 'UI/UX',
    tags: ['Web设计', 'B端', '极简']
  },
  {
    id: 'p4',
    title: 'APP 启动页 3D 动画制作',
    client: 'FitnessPro',
    status: '已完结',
    budget: 12000,
    deadline: '2023-10-01',
    progress: 100,
    phase: '交付完成',
    description: '运动健康类 APP，需要一个 5秒 的 3D 启动动画，体现活力与科技感。',
    category: '3D/动画',
    tags: ['C4D', '动态设计', '运动']
  },
  {
    id: 'p5',
    title: '品牌吉祥物 IP 形象设计',
    client: '优鲜超市',
    status: '招募中',
    budget: 6000,
    deadline: '2023-11-10',
    progress: 0,
    phase: '报名筛选',
    description: '为生鲜超市设计一个亲民、可爱的吉祥物形象，需延展 3 个动作表情。',
    category: '品牌设计',
    tags: ['IP设计', '卡通', '吉祥物']
  },
  {
    id: 'p6',
    title: '电商大促 C4D 场景搭建',
    client: '美妆集合店',
    status: '招募中',
    budget: 18000,
    deadline: '2023-11-05',
    progress: 0,
    phase: '报名筛选',
    description: '双11大促主会场头图背景，需要搭建高精度的 C4D 场景，风格梦幻唯美。',
    category: '3D/动画',
    tags: ['电商设计', 'C4D', '合成']
  }
];

export const MOCK_ARTWORKS: Artwork[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `art_${i}`,
  title: [
    "Cyberpunk Cityscapes", "Ethereal Dreams", "Neon Nights", "Ancient Whispers", 
    "Future Tech UI", "Abstract Flows", "Character Study 01", "Dragon's Lair"
  ][i % 8] + ` #${i+1}`,
  artist: [
    "NeonDreamer", "InkFlow", "PixelMaster", "VoxelArchitect", 
    "ColorWizard", "LineArtPro", "ConceptKing", "DesignGuru"
  ][i % 8],
  artistAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent([
    "NeonDreamer", "InkFlow", "PixelMaster", "VoxelArchitect", 
    "ColorWizard", "LineArtPro", "ConceptKing", "DesignGuru"
  ][i % 8])}&background=random&color=fff`,
  imageUrl: `https://image.pollinations.ai/prompt/${encodeURIComponent([
    "cyberpunk city street night neon rain", 
    "fantasy landscape ethereal clouds castle", 
    "abstract 3d geometric shapes colorful", 
    "traditional chinese ink painting landscape mountains", 
    "futuristic hud interface ui design dark mode", 
    "anime character girl magic glowing effects", 
    "isometric 3d room interior cozy low poly", 
    "digital painting portrait realistic lighting"
  ][i % 8])}?width=800&height=600&nologo=true&seed=${i}`,
  likes: Math.floor(Math.random() * 5000) + 100,
  views: Math.floor(Math.random() * 50000) + 1000,
  tags: [
    ['科幻', '场景', '概念设计'],
    ['奇幻', '插画', '风景'],
    ['3D', '抽象', 'C4D'],
    ['国风', '水墨', '手绘'],
    ['UI', '科技感', '界面'],
    ['二次元', '角色', '厚涂'],
    ['3D', '低多边形', '可爱'],
    ['人像', '写实', '厚涂']
  ][i % 8],
  isAiGenerated: i % 5 === 0, // Some are AI generated
  isVerified: i % 3 === 0,
  description: "这是一幅充满想象力的作品，创作者运用了独特的色彩和构图，展现了令人惊叹的视觉效果。",
  publishDate: "2023-10-25"
}));

export const CHART_DATA_ARTIST = [
  { name: '周一', revenue: 4000, views: 2400 },
  { name: '周二', revenue: 3000, views: 1398 },
  { name: '周三', revenue: 2000, views: 9800 },
  { name: '周四', revenue: 2780, views: 3908 },
  { name: '周五', revenue: 1890, views: 4800 },
  { name: '周六', revenue: 2390, views: 3800 },
  { name: '周日', revenue: 3490, views: 4300 },
];

export const CHART_DATA_CLIENT = [
  { name: '周一', expenditure: 12000, activeProjects: 5 },
  { name: '周二', expenditure: 8000, activeProjects: 6 },
  { name: '周三', expenditure: 15000, activeProjects: 8 },
  { name: '周四', expenditure: 9000, activeProjects: 7 },
  { name: '周五', expenditure: 20000, activeProjects: 9 },
  { name: '周六', expenditure: 5000, activeProjects: 5 },
  { name: '周日', expenditure: 2000, activeProjects: 4 },
];

export const MOCK_ENTERPRISE_PROFILE: EnterpriseProfile = {
  name: 'TechNova 科技',
  description: 'TechNova 是一家专注于未来科技领域的创新型企业，致力于通过人工智能与大数据技术改变人们的生活方式。我们重视设计与用户体验，拥有超过 500 人的研发与设计团队。',
  industry: '互联网 / AI',
  size: '500-1000人',
  founded: '2015年',
  website: 'www.technova.com',
  logo: 'https://ui-avatars.com/api/?name=Tech+Nova&background=4f46e5&color=fff&size=128',
  coreBusiness: ['SaaS 平台', '移动应用开发', 'AI 解决方案', '数据可视化'],
  history: [
    { year: '2015', title: '公司成立', description: 'TechNova 在北京中关村成立，获得天使轮融资。' },
    { year: '2018', title: 'A轮融资', description: '发布核心产品 NovaCloud，获得 2000 万美元 A 轮融资。' },
    { year: '2021', title: '用户破亿', description: '旗下 APP 全球用户数突破 1 亿，并在新加坡设立海外总部。' },
    { year: '2023', title: '入驻薪画社', description: '全面升级创意供应链，与薪画社达成战略合作。' }
  ],
  structure: {
    id: 'root',
    name: 'TechNova',
    role: 'Company',
    children: [
      { id: 'd1', name: '产品研发中心', role: 'Department' },
      { id: 'd2', name: '品牌设计部', role: 'Department' },
      { id: 'd3', name: '市场营销部', role: 'Department' }
    ]
  },
  creditScore: 850
};

export const MOCK_ASSETS: Asset[] = [
  { id: '1', name: '2024_Q1_Campaign_Kv.psd', type: 'psd', size: '245 MB', modified: '2023-10-24', version: 'v2.0', tags: ['KV', 'Campaign'] },
  { id: '2', name: 'Brand_Logo_Pack.zip', type: 'folder', size: '56 MB', modified: '2023-09-15', version: 'v1.0', tags: ['Logo', 'VI'] },
  { id: '3', name: 'Product_Demo_Video.mp4', type: 'video', size: '1.2 GB', modified: '2023-10-20', version: 'v1.5', tags: ['Video', 'Demo'] },
  { id: '4', name: 'Social_Media_Templates', type: 'folder', size: '120 MB', modified: '2023-10-01', version: 'v1.0', tags: ['Social', 'Template'] },
  { id: '5', name: 'Character_Design_Sheet.jpg', type: 'image', size: '8.5 MB', modified: '2023-10-22', version: 'v3.0', tags: ['Character', 'Concept'] },
  { id: '6', name: 'Contract_Template.doc', type: 'doc', size: '2.5 MB', modified: '2023-08-30', version: 'v1.0', tags: ['Legal'] },
  { id: '7', name: 'Meeting_Notes_Oct.doc', type: 'doc', size: '1.5 MB', modified: '2023-10-25', version: 'v1.0', tags: ['Internal'] },
  { id: '8', name: 'Banner_Ad_Set.psd', type: 'psd', size: '150 MB', modified: '2023-10-18', version: 'v1.2', tags: ['Ad', 'Banner'] },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', projectId: 'p1', title: '完成线稿细化', assignee: 'NeonDreamer', assigneeAvatar: 'https://ui-avatars.com/api/?name=Neon&bg=random', status: 'in-progress', priority: 'high', dueDate: '10月28日', comments: 3, attachments: 1 },
  { id: 't2', projectId: 'p1', title: '提交配色方案 A/B', assignee: 'NeonDreamer', assigneeAvatar: 'https://ui-avatars.com/api/?name=Neon&bg=random', status: 'todo', priority: 'medium', dueDate: '10月30日', comments: 0, attachments: 0 },
  { id: 't3', projectId: 'p2', title: '角色三视图绘制', assignee: 'InkFlow', assigneeAvatar: 'https://ui-avatars.com/api/?name=Ink&bg=random', status: 'review', priority: 'high', dueDate: '10月26日', comments: 5, attachments: 2 },
  { id: 't4', projectId: 'p3', title: '首页视觉风格确认', assignee: 'PixelMaster', assigneeAvatar: 'https://ui-avatars.com/api/?name=Pixel&bg=random', status: 'done', priority: 'medium', dueDate: '10月20日', comments: 8, attachments: 4 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', type: 'income', amount: 5000, date: '2023-10-25', description: '项目《新年礼盒》预付款', status: 'completed', category: '项目收益' },
  { id: 'tx2', type: 'withdrawal', amount: -2000, date: '2023-10-20', description: '提现至支付宝', status: 'completed' },
  { id: 'tx3', type: 'escrow_frozen', amount: 15000, date: '2023-10-18', description: '托管资金 - 官网改版', status: 'pending', relatedProject: 'p3' },
  { id: 'tx4', type: 'payment', amount: -300, date: '2023-10-15', description: '购买 Pro 会员 (月付)', status: 'completed', category: '增值服务' },
  { id: 'tx5', type: 'income', amount: 800, date: '2023-10-10', description: '素材授权收益', status: 'completed', category: '版权收益' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv1', amount: 15000, createdDate: '2023-10-25', title: '技术服务费 - 官网设计', status: 'processing', companyName: 'TechNova 科技' },
  { id: 'inv2', amount: 8000, createdDate: '2023-10-10', title: '设计咨询费', status: 'paid', companyName: '星际互动' },
  { id: 'inv3', amount: 5000, createdDate: '2023-09-28', title: '插画绘制服务', status: 'paid', companyName: '优鲜超市' },
];

export const MOCK_SAVINGS_GOALS: SavingsGoal[] = [
  { id: 'g1', name: '更换 Mac Studio', targetAmount: 25000, currentAmount: 12500, deadline: '2023-12-31', color: 'bg-indigo-500', icon: Target },
  { id: 'g2', name: 'Wacom 新帝手绘屏', targetAmount: 18000, currentAmount: 18000, deadline: '2023-11-11', color: 'bg-green-500', icon: Palette },
];

export const MOCK_DEPT_BUDGETS: DepartmentBudget[] = [
  { id: 'db1', department: '品牌设计部', totalBudget: 500000, usedBudget: 320000, head: 'Alex Chen', status: 'healthy' },
  { id: 'db2', department: '市场营销部', totalBudget: 800000, usedBudget: 750000, head: 'Sarah Wu', status: 'warning' },
  { id: 'db3', department: '产品研发部', totalBudget: 1200000, usedBudget: 1100000, head: 'Mike Ross', status: 'healthy' },
];

export const CHART_DATA_CASH_FLOW = [
  { month: '1月', income: 150000, expense: 80000 },
  { month: '2月', income: 200000, expense: 90000 },
  { month: '3月', income: 180000, expense: 120000 },
  { month: '4月', income: 250000, expense: 100000 },
  { month: '5月', income: 300000, expense: 150000 },
  { month: '6月', income: 280000, expense: 130000 },
];

export const CHART_DATA_PERSONAL_SPENDING = [
  { name: '设备软件', value: 2800, color: '#6366f1' },
  { name: '生活开销', value: 3200, color: '#f43f5e' },
  { name: '学习进修', value: 1500, color: '#10b981' },
  { name: '其他', value: 740, color: '#94a3b8' },
];

export const MOCK_USERS_ADMIN_VIEW: User[] = [
  { id: 'u1', name: 'Admin Root', email: 'admin@xinhuashe.com', role: 'root_admin', roleName: '超级管理员', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Admin&background=ef4444&color=fff', permissions: [], isAuthenticated: true, creditScore: 999 },
  { id: 'u2', name: 'TechNova', email: 'contact@technova.com', role: 'enterprise', roleName: '企业主', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Tech+Nova&background=4f46e5&color=fff', permissions: [], isAuthenticated: true, creditScore: 850 },
  { id: 'u3', name: 'NeonDreamer', email: 'neon@art.com', role: 'creator', roleName: '创作者', status: 'active', avatar: 'https://ui-avatars.com/api/?name=Neon&background=ec4899&color=fff', permissions: [], isAuthenticated: true, creditScore: 720 },
  { id: 'u4', name: 'BadActor', email: 'spam@bot.com', role: 'general', roleName: '普通用户', status: 'banned', avatar: 'https://ui-avatars.com/api/?name=Bad&background=333&color=fff', permissions: [], isAuthenticated: true, creditScore: 300 },
];

export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  { id: 'l1', timestamp: '2023-10-25 14:30:22', operator: 'Admin Root', action: 'Approved Project', target: 'Project #p1', ip: '192.168.1.10', status: 'success' },
  { id: 'l2', timestamp: '2023-10-25 14:15:10', operator: 'System', action: 'Auto-Backup', target: 'Database', ip: '127.0.0.1', status: 'success' },
  { id: 'l3', timestamp: '2023-10-25 13:45:00', operator: 'TechNova', action: 'Login Failed', target: 'User #u2', ip: '202.106.0.1', status: 'failure' },
];

export const MOCK_VERIFICATION_REQUESTS: VerificationRequest[] = [
  { 
    id: 'v1', userId: 'u5', userName: 'John Doe', userAvatar: 'https://ui-avatars.com/api/?name=John', 
    type: 'personal', status: 'pending', submitTime: '2023-10-25 10:00',
    realName: '张三', idCardNumber: '110101199001011234', 
    idCardFront: 'https://placehold.co/400x250/e2e8f0/64748b?text=ID+Front', 
    idCardBack: 'https://placehold.co/400x250/e2e8f0/64748b?text=ID+Back'
  },
  {
    id: 'v2', userId: 'u6', userName: 'Creative Studio', userAvatar: 'https://ui-avatars.com/api/?name=Studio',
    type: 'enterprise', status: 'pending', submitTime: '2023-10-24 16:30',
    companyName: '北京创意无限科技有限公司', creditCode: '91110105MA000000XX', legalRep: '李四',
    businessLicense: 'https://placehold.co/300x400/e2e8f0/64748b?text=License'
  },
  {
    id: 'v3', userId: 'u3', userName: 'NeonDreamer', userAvatar: 'https://ui-avatars.com/api/?name=Neon',
    type: 'personal', status: 'approved', submitTime: '2023-10-20 09:00', reviewTime: '2023-10-20 11:00', reviewer: 'Admin Root'
  }
];

export const MOCK_CREATORS: Creator[] = [
  { id: 'c1', name: 'NeonDreamer', avatar: 'https://ui-avatars.com/api/?name=Neon&background=ec4899&color=fff', tags: ['赛博朋克', '插画', '概念设计'], followers: 12500, isVerified: true, trend: 'up', weeklyGrowth: 850, hotScore: 980, rank: 1 },
  { id: 'c2', name: 'InkFlow', avatar: 'https://ui-avatars.com/api/?name=Ink&background=3b82f6&color=fff', tags: ['水墨', '国风', '角色'], followers: 8900, isVerified: true, trend: 'stable', weeklyGrowth: 200, hotScore: 850, rank: 2 },
  { id: 'c3', name: 'VoxelArchitect', avatar: 'https://ui-avatars.com/api/?name=Voxel&background=f59e0b&color=fff', tags: ['3D', '像素', '场景'], followers: 15000, isVerified: true, trend: 'up', weeklyGrowth: 1200, hotScore: 920, rank: 3 },
  { id: 'c4', name: 'DesignGuru', avatar: 'https://ui-avatars.com/api/?name=Guru&background=10b981&color=fff', tags: ['UI/UX', 'Web', 'B端'], followers: 6000, isVerified: false, trend: 'down', weeklyGrowth: 50, hotScore: 600, rank: 4 },
];

export const MEMBERSHIP_PLANS_CREATOR: MembershipPlan[] = [
  { id: 'none', name: '基础版', price: 0, roleType: 'creator', color: 'slate', features: ['接单服务费 5%', '每月提现 1 次', '基础作品展示', '社区发帖权限'] },
  { id: 'pro', name: '专业版 Pro', price: 29, roleType: 'creator', color: 'indigo', recommended: true, features: ['接单服务费 3%', '每月提现 5 次', '优先作品推荐', 'AI 辅助创作 (每日 50次)', '专属身份标识'] },
  { id: 'max', name: '旗舰版 Max', price: 99, roleType: 'creator', color: 'amber', features: ['接单 0 服务费', '无限次提现', '首页精选推荐', 'AI 辅助创作 (无限次)', '1对1 客服经理', '法律合同审核服务'] }
];

export const MEMBERSHIP_PLANS_ENTERPRISE: MembershipPlan[] = [
  { id: 'none', name: '基础版', price: 0, roleType: 'enterprise', color: 'slate', features: ['发布需求 (需审核)', '基础人才库搜索', '标准合同模板'] },
  { id: 'pro', name: '企业版 Pro', price: 299, roleType: 'enterprise', color: 'indigo', recommended: true, features: ['需求优先展示', '高级人才筛选', '企业级 DAM (50GB)', '增值税专用发票', '多账号协作 (3人)'] },
  { id: 'max', name: '集团版 Max', price: 999, roleType: 'enterprise', color: 'amber', features: ['专属项目经理', '定制化人才推荐', '企业级 DAM (1TB)', 'API 对接支持', '私有化部署选项', '多账号协作 (无限)'] }
];

// Helper Function
export const getProfileById = (profileId: string): UserProfile => {
  // Mock Profile Generator based on ID
  const isCreator = profileId.includes('neon') || profileId.includes('art') || profileId.includes('ink');
  return {
    id: profileId,
    userId: isCreator ? 'u3' : 'u2',
    displayName: isCreator ? (profileId.includes('neon') ? 'NeonDreamer' : 'InkFlow') : 'TechNova 科技',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(isCreator ? (profileId.includes('neon') ? 'Neon' : 'Ink') : 'Tech')}&background=random&color=fff`,
    coverImage: isCreator 
      ? 'https://image.pollinations.ai/prompt/cyberpunk%20city%20panorama%20night%20neon?width=1200&height=400&nologo=true' 
      : 'https://image.pollinations.ai/prompt/modern%20tech%20office%20building%20interior?width=1200&height=400&nologo=true',
    bio: isCreator 
      ? '热衷于探索光影与色彩的数字艺术家，擅长赛博朋克与未来主义风格。' 
      : '专注 AI 与大数据的科技创新企业，期待与优秀的创意人才合作。',
    location: '上海 · 徐汇',
    website: 'www.portfolio.com',
    skills: isCreator ? ['插画', '概念设计', '3D辅助', '厚涂'] : ['人工智能', 'SaaS', '大数据'],
    stats: {
      followers: 12580,
      following: 45,
      likes: 38900,
      views: 150000
    },
    joinedDate: '2022-05-15',
    isVerified: true,
    creditScore: isCreator ? 720 : 850,
    membershipLevel: isCreator ? 'pro' : 'max'
  };
};
