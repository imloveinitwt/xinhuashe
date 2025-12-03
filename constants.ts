import { Artwork, Asset, Project, Task, Transaction, Invoice } from './types';

export const MOCK_ARTWORKS: Artwork[] = [
  {
    id: '1',
    title: '赛博朋克都市夜景',
    artist: 'NeonDreamer',
    artistAvatar: 'https://picsum.photos/32/32?random=1',
    imageUrl: 'https://picsum.photos/600/800?random=101',
    likes: 1240,
    views: 5400,
    tags: ['科幻', '场景', '概念设计'],
    isVerified: true
  },
  {
    id: '2',
    title: '森林守护者',
    artist: 'NatureStroke',
    artistAvatar: 'https://picsum.photos/32/32?random=2',
    imageUrl: 'https://picsum.photos/600/400?random=102',
    likes: 890,
    views: 3200,
    tags: ['奇幻', '角色', '插画'],
    isVerified: true
  },
  {
    id: '3',
    title: 'SaaS 仪表盘 UI 套件',
    artist: 'PixelMaster',
    artistAvatar: 'https://picsum.photos/32/32?random=3',
    imageUrl: 'https://picsum.photos/600/600?random=103',
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
    artistAvatar: 'https://picsum.photos/32/32?random=4',
    imageUrl: 'https://picsum.photos/600/900?random=104',
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
    artistAvatar: 'https://picsum.photos/32/32?random=5',
    imageUrl: 'https://picsum.photos/600/500?random=105',
    likes: 3400,
    views: 8900,
    tags: ['抽象', '材质'],
    isVerified: false
  }
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
    description: '针对夏季促销活动的二次元风格主视觉海报，包含3个角色和海滩背景。'
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
    description: '包含 Logo 规范、名片、PPT 模板及官网 UI 的全套 VI 升级。'
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
    description: '一款放置类手游的 Q 版角色立绘，共 10 个角色。'
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
    description: '高精度机甲战士3D模型，包含贴图与骨骼绑定，用于虚幻引擎5。'
  }
];

export const MOCK_TASKS: Task[] = [
  // p1 Tasks: KV
  {
    id: 't1', projectId: 'p1', title: '角色A线稿细化', assignee: 'Alex', assigneeAvatar: 'https://picsum.photos/32/32?random=10',
    status: 'done', priority: 'high', dueDate: '10月20日', comments: 3, attachments: 2
  },
  {
    id: 't2', projectId: 'p1', title: '背景色彩氛围设定', assignee: 'Sam', assigneeAvatar: 'https://picsum.photos/32/32?random=11',
    status: 'in-progress', priority: 'medium', dueDate: '10月25日', comments: 5, attachments: 1
  },
  {
    id: 't3', projectId: 'p1', title: '角色B/C 草图绘制', assignee: 'Alex', assigneeAvatar: 'https://picsum.photos/32/32?random=10',
    status: 'in-progress', priority: 'high', dueDate: '10月26日', comments: 0, attachments: 0
  },
  {
    id: 't4', projectId: 'p1', title: '最终光影合成', assignee: 'Lead', assigneeAvatar: 'https://picsum.photos/32/32?random=12',
    status: 'todo', priority: 'high', dueDate: '11月01日', comments: 0, attachments: 0
  },
  {
    id: 't1_1', projectId: 'p1', title: '海浪特效绘制', assignee: 'Sam', assigneeAvatar: 'https://picsum.photos/32/32?random=11',
    status: 'todo', priority: 'low', dueDate: '10月28日', comments: 1, attachments: 0
  },

  // p2 Tasks: VI
  {
    id: 't5', projectId: 'p2', title: 'Logo 矢量文件输出', assignee: 'DesignTeam', assigneeAvatar: 'https://picsum.photos/32/32?random=13',
    status: 'done', priority: 'high', dueDate: '10月15日', comments: 1, attachments: 4
  },
  {
    id: 't6', projectId: 'p2', title: '官网 UI 视觉规范', assignee: 'DesignTeam', assigneeAvatar: 'https://picsum.photos/32/32?random=13',
    status: 'review', priority: 'medium', dueDate: '10月28日', comments: 8, attachments: 2
  },
  {
    id: 't2_1', projectId: 'p2', title: 'PPT 母版样式微调', assignee: 'DesignTeam', assigneeAvatar: 'https://picsum.photos/32/32?random=13',
    status: 'done', priority: 'low', dueDate: '10月22日', comments: 2, attachments: 1
  },

  // p3 Tasks: Chara
  {
    id: 't7', projectId: 'p3', title: '需求文档确认', assignee: 'PM', assigneeAvatar: 'https://picsum.photos/32/32?random=14',
    status: 'done', priority: 'high', dueDate: '10月10日', comments: 12, attachments: 1
  },
  {
    id: 't8', projectId: 'p3', title: '风格探索 (Moodboard)', assignee: 'Artist1', assigneeAvatar: 'https://picsum.photos/32/32?random=15',
    status: 'in-progress', priority: 'medium', dueDate: '11月05日', comments: 2, attachments: 5
  },

  // p4 Tasks: 3D
  {
    id: 't4_1', projectId: 'p4', title: '头部高模雕刻', assignee: '3D_Max', assigneeAvatar: 'https://picsum.photos/32/32?random=16',
    status: 'done', priority: 'high', dueDate: '11月01日', comments: 4, attachments: 3
  },
  {
    id: 't4_2', projectId: 'p4', title: '身体机甲结构搭建', assignee: '3D_Max', assigneeAvatar: 'https://picsum.photos/32/32?random=16',
    status: 'in-progress', priority: 'high', dueDate: '11月10日', comments: 1, attachments: 0
  },
  {
    id: 't4_3', projectId: 'p4', title: '低模拓扑 (Retopology)', assignee: 'Junior_Mod', assigneeAvatar: 'https://picsum.photos/32/32?random=17',
    status: 'todo', priority: 'medium', dueDate: '11月15日', comments: 0, attachments: 0
  },
  {
    id: 't4_4', projectId: 'p4', title: 'UV 拆分与整理', assignee: 'Junior_Mod', assigneeAvatar: 'https://picsum.photos/32/32?random=17',
    status: 'todo', priority: 'low', dueDate: '11月18日', comments: 0, attachments: 0
  }
];

export const MOCK_ASSETS: Asset[] = [
  { id: 'f1', name: '2023 营销物料', type: 'folder', modified: '2天前', version: '-', tags: [] },
  { id: 'f2', name: '游戏资产 v2', type: 'folder', modified: '1周前', version: '-', tags: [] },
  { id: 'f3', name: '机甲项目_P4', type: 'folder', modified: '刚刚', version: '-', tags: [] },
  { id: 'a1', name: '首页_Banner_终版.psd', type: 'psd', size: '145 MB', modified: '3小时前', version: 'v2.1', tags: ['活动', 'Banner'] },
  { id: 'a2', name: 'Logo_演绎动画.mp4', type: 'video', size: '24 MB', modified: '昨天', version: 'v1.0', tags: ['品牌'] },
  { id: 'a3', name: '角色_三视图.jpg', type: 'image', size: '2.4 MB', modified: '昨天', version: 'v1.5', tags: ['设定'] },
  { id: 'a4', name: '合同_已签署.pdf', type: 'doc', size: '1.2 MB', modified: '10月20日', version: 'v1.0', tags: ['法务'] },
];

export const CHART_DATA = [
  { name: '周一', revenue: 4000, active: 24 },
  { name: '周二', revenue: 3000, active: 13 },
  { name: '周三', revenue: 2000, active: 38 },
  { name: '周四', revenue: 2780, active: 39 },
  { name: '周五', revenue: 1890, active: 48 },
  { name: '周六', revenue: 2390, active: 38 },
  { name: '周日', revenue: 3490, active: 43 },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tr_1', type: 'income', amount: 12000, date: '2023-10-26 14:30', description: '项目 P1 阶段一验收款', status: 'completed', relatedProject: 'p1' },
  { id: 'tr_2', type: 'withdrawal', amount: -5000, date: '2023-10-25 09:15', description: '提现至支付宝 (尾号 9876)', status: 'completed' },
  { id: 'tr_3', type: 'payment', amount: -200, date: '2023-10-24 18:00', description: '平台技术服务费 (10月)', status: 'completed' },
  { id: 'tr_4', type: 'escrow_release', amount: 45000, date: '2023-10-20 11:20', description: '项目 P2 资金托管释放', status: 'completed', relatedProject: 'p2' },
  { id: 'tr_5', type: 'withdrawal', amount: -20000, date: '2023-10-18 16:45', description: '提现至招商银行 (尾号 8888)', status: 'completed' },
  { id: 'tr_6', type: 'escrow_frozen', amount: 5000, date: '2023-10-15 10:00', description: '项目 P3 预付款托管冻结', status: 'completed', relatedProject: 'p3' },
  { id: 'tr_7', type: 'income', amount: 8000, date: '2023-10-12 13:20', description: '稿件 C34 版权转让费', status: 'completed' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2023-1001', amount: 45000, createdDate: '2023-10-20', title: '技术服务费 - TechNova 科技', status: 'paid', companyName: 'TechNova 科技' },
  { id: 'INV-2023-1002', amount: 12000, createdDate: '2023-10-26', title: '美术设计费 - 网易游戏', status: 'paid', companyName: '网易游戏' },
  { id: 'INV-2023-1003', amount: 5000, createdDate: '2023-10-28', title: '创意咨询费 - 独立工作室', status: 'processing', companyName: '独立工作室' },
];