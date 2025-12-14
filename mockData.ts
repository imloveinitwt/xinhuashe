
import { 
  ProjectCase, Notification, Project, Artwork, 
  Asset, Task, Transaction, Invoice, SavingsGoal, DepartmentBudget, 
  User, SystemLog, VerificationRequest, Creator, EnterpriseProfile, UserProfile
} from './types';
import { Target, Palette } from 'lucide-react';

// --- ASSET HELPERS ---
// 使用稳定的头像服务 (Notion 风格)
export const getAvatar = (seed: string) => `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e5e7eb,b6e3f4,c0aede,d1d4f9,ffd5dc`;
// 使用 Picsum 作为更稳定的图片源 (替代 Unsplash)
export const getImage = (id: string, w = 800, h = 600) => `https://picsum.photos/seed/${id}/${w}/${h}`;

export const MOCK_PROJECT_CASES: ProjectCase[] = [
  {
    id: 'case1',
    title: '《幻界：觉醒》全套角色原画设定',
    year: '2023',
    category: '游戏娱乐',
    description: '协助某头部游戏厂商，在 2 个月内完成了 50+ 个核心角色的概念设计与立绘细化，统一了美术风格，确保了项目如期上线。',
    coverImage: getImage('game_art_fantasy', 800, 600),
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
    coverImage: getImage('brand_minimal', 800, 600),
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
    coverImage: getImage('3d_abstract_tech', 800, 600),
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
    coverImage: getImage('illustration_book', 800, 600),
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
    coverImage: getImage('ui_app_interface', 800, 600),
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
    coverImage: getImage('3d_commerce_neon', 800, 600),
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
    avatar: getAvatar('FanOne')
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
    tags: ['国潮', '包装设计', '节日'],
    coverImage: getImage('pkg_red_festive', 800, 600)
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
    tags: ['二次元', '赛博朋克', '角色设计'],
    coverImage: getImage('game_cyberpunk_char', 800, 600)
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
    tags: ['Web设计', 'B端', '极简'],
    coverImage: getImage('ui_web_clean', 800, 600)
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
    tags: ['C4D', '动态设计', '运动'],
    coverImage: getImage('3d_motion_abstract', 800, 600)
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
    tags: ['IP设计', '卡通', '吉祥物'],
    coverImage: getImage('mascot_cute_toy', 800, 600)
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
    tags: ['电商设计', 'C4D', '合成'],
    coverImage: getImage('3d_scene_stage', 800, 600)
  },
  {
    id: 'p7',
    title: '虚拟主播 Live2D 模型制作',
    client: '次元文化',
    status: '招募中',
    budget: 35000,
    deadline: '2023-12-15',
    progress: 0,
    phase: '报名筛选',
    description: '需要一位经验丰富的画师+建模师（或团队），制作一套高精度的虚拟主播皮套。风格参考 Hololive，需要包含 5 种表情和 3 种发型切换。',
    category: '游戏原画',
    tags: ['Live2D', '虚拟主播', '二次元'],
    coverImage: getImage('vtuber_live2d', 800, 600)
  },
  {
    id: 'p8',
    title: '咖啡连锁品牌 2024 节日限定杯套',
    client: 'CoffeeTime',
    status: '进行中',
    budget: 9000,
    deadline: '2023-11-25',
    progress: 60,
    phase: '色稿确认',
    description: '为我们的圣诞季和春节季设计两款限定杯套。风格需温馨治愈，符合品牌调性。',
    category: '插画',
    tags: ['包装设计', '节日', '治愈系'],
    coverImage: getImage('coffee_cup_art', 800, 600)
  }
];

// --- GENERATED ARTWORK COLLECTION (50+ DISTINCT ITEMS) ---
const RAW_ARTWORK_DATA = [
  // === 1. GAME ART & CONCEPT (12 items) ===
  { id: 'art_game_1', title: '霓虹特工 2077', artist: '夜色霓虹', tags: ['Game Art', 'Cyberpunk', 'Character'], dims: {w:600, h:800} },
  { id: 'art_game_2', title: '龙之谷：遗迹', artist: '造梦铁匠铺', tags: ['Game Art', 'Fantasy', 'Environment'], dims: {w:800, h:450} },
  { id: 'art_game_3', title: '机甲少女 A-01', artist: '机甲核心', tags: ['Game Art', 'Sci-Fi', 'Character'], dims: {w:600, h:900} },
  { id: 'art_game_4', title: '夜之城全景', artist: '赛博观察者', tags: ['Game Art', 'Cyberpunk', 'Cityscape'], dims: {w:800, h:600} },
  { id: 'art_game_5', title: '深海巨兽', artist: '潜渊', tags: ['Game Art', 'Monster', 'Dark'], dims: {w:800, h:500} },
  { id: 'art_game_6', title: '电竞传说皮肤', artist: '绘皮师·阿杰', tags: ['Game Art', 'Esports', 'Character'], dims: {w:800, h:800} },
  { id: 'art_game_7', title: '废土生存指南', artist: '荒野拾荒者', tags: ['Game Art', 'Concept', 'Post-Apo'], dims: {w:800, h:600} },
  { id: 'art_game_8', title: '星际穿越', artist: '星际漫游指南', tags: ['Game Art', 'Space', 'Sci-Fi'], dims: {w:800, h:400} },
  { id: 'art_game_9', title: '古堡惊魂', artist: '暗夜哥特', tags: ['Game Art', 'Horror', 'Environment'], dims: {w:600, h:800} },
  { id: 'art_game_10', title: '像素勇者', artist: '像素君', tags: ['Game Art', 'Pixel', 'Retro'], dims: {w:800, h:800} },
  { id: 'art_game_11', title: '迷雾森林', artist: '森之语', tags: ['Game Art', 'Nature', 'Fantasy'], dims: {w:800, h:500} },
  { id: 'art_game_12', title: '赛博武士', artist: '浪人甲', tags: ['Game Art', 'Cyberpunk', 'Character'], dims: {w:600, h:800} },

  // === 2. UI/UX DESIGN (10 items) ===
  { id: 'ui_1', title: 'FinTech 仪表盘', artist: '界面魔术师', tags: ['UI/UX', 'Dashboard', 'Clean'], dims: {w:800, h:600} },
  { id: 'ui_2', title: '极简电商 App', artist: '交互体验馆', tags: ['UI/UX', 'Mobile', 'Ecommerce'], dims: {w:600, h:1000} },
  { id: 'ui_3', title: '数据可视化大屏', artist: '数据视界', tags: ['UI/UX', 'Data', 'Web'], dims: {w:800, h:450} },
  { id: 'ui_4', title: '冥想 App 界面', artist: '禅意空间', tags: ['UI/UX', 'Mobile', 'Wellness'], dims: {w:600, h:1000} },
  { id: 'ui_5', title: 'SaaS 后台系统', artist: '架构美学', tags: ['UI/UX', 'B2B', 'Web'], dims: {w:800, h:600} },
  { id: 'ui_6', title: '智能家居控制', artist: '智绘生活', tags: ['UI/UX', 'IoT', 'Mobile'], dims: {w:600, h:1000} },
  { id: 'ui_7', title: '旅游预订平台', artist: '途游设计', tags: ['UI/UX', 'Web', 'Travel'], dims: {w:800, h:1200} },
  { id: 'ui_8', title: '深色模式 UI Kit', artist: '夜间模式', tags: ['UI/UX', 'Kit', 'Dark'], dims: {w:800, h:600} },
  { id: 'ui_9', title: '社交媒体概念', artist: '社交通路', tags: ['UI/UX', 'Social', 'Concept'], dims: {w:600, h:1000} },
  { id: 'ui_10', title: '在线教育平台', artist: '未来教育设计', tags: ['UI/UX', 'Education', 'Web'], dims: {w:800, h:600} },

  // === 3. 3D & ABSTRACT (10 items) ===
  { id: '3d_1', title: '流体金属', artist: '流体实验室', tags: ['3D', 'Abstract', 'C4D'], dims: {w:800, h:800} },
  { id: '3d_2', title: '几何秩序', artist: '几何构造', tags: ['3D', 'Geometry', 'Blender'], dims: {w:800, h:600} },
  { id: '3d_3', title: '低多边形世界', artist: '低多边形建造者', tags: ['3D', 'LowPoly', 'Scene'], dims: {w:800, h:600} },
  { id: '3d_4', title: '玻璃质感渲染', artist: '透视光影', tags: ['3D', 'Material', 'Abstract'], dims: {w:800, h:800} },
  { id: '3d_5', title: '超现实主义空间', artist: '超现实梦境', tags: ['3D', 'Surreal', 'Art'], dims: {w:800, h:1000} },
  { id: '3d_6', title: '霓虹隧道', artist: '逐光少年', tags: ['3D', 'Neon', 'Loop'], dims: {w:800, h:450} },
  { id: '3d_7', title: '彩色烟雾', artist: '云烟', tags: ['3D', 'Abstract', 'Colorful'], dims: {w:800, h:600} },
  { id: '3d_8', title: '复古未来主义', artist: '复古电波', tags: ['3D', 'Synthwave', 'Retro'], dims: {w:800, h:600} },
  { id: '3d_9', title: '数字雕塑', artist: '数字雕刻家', tags: ['3D', 'Sculpt', 'Art'], dims: {w:600, h:800} },
  { id: '3d_10', title: '微观粒子', artist: '粒子效应', tags: ['3D', 'Particles', 'Science'], dims: {w:800, h:500} },

  // === 4. BRANDING & PACKAGING (8 items) ===
  { id: 'brand_1', title: '纯净护肤 VI', artist: '纯粹设计', tags: ['Branding', 'Packaging', 'Minimal'], dims: {w:800, h:600} },
  { id: 'brand_2', title: '精品咖啡包装', artist: '每日咖啡', tags: ['Branding', 'Coffee', 'Packaging'], dims: {w:800, h:800} },
  { id: 'brand_3', title: '果汁品牌形象', artist: '鲜榨创意', tags: ['Branding', 'Colorful', 'Logo'], dims: {w:800, h:600} },
  { id: 'brand_4', title: '文具套装设计', artist: '手帐生活', tags: ['Branding', 'Mockup', 'Stationery'], dims: {w:800, h:500} },
  { id: 'brand_5', title: '科技公司 VI', artist: '科技前沿', tags: ['Branding', 'Corporate', 'Tech'], dims: {w:800, h:450} },
  { id: 'brand_6', title: '手工皂包装', artist: '绿色生机', tags: ['Branding', 'Eco', 'Packaging'], dims: {w:800, h:800} },
  { id: 'brand_7', title: '时尚杂志排版', artist: '字里行间', tags: ['Branding', 'Editorial', 'Typography'], dims: {w:600, h:900} },
  { id: 'brand_8', title: '潮牌 Logo 设计', artist: '街头潮流', tags: ['Branding', 'Logo', 'Fashion'], dims: {w:800, h:800} },

  // === 5. ILLUSTRATION & DIGITAL ART (12 items) ===
  { id: 'illus_1', title: '梦境边缘', artist: '绘梦的小蓝', tags: ['Illustration', 'Surreal', 'Digital'], dims: {w:800, h:600} },
  { id: 'illus_2', title: '水墨山水', artist: '墨染流年', tags: ['Illustration', 'Traditional', 'Ink'], dims: {w:800, h:400} },
  { id: 'illus_3', title: '夏日海滩', artist: '夏日汽水', tags: ['Illustration', 'Anime', 'Bright'], dims: {w:600, h:800} },
  { id: 'illus_4', title: '赛博艺妓', artist: '赛博朋克猫', tags: ['Illustration', 'Cyberpunk', 'Character'], dims: {w:600, h:900} },
  { id: 'illus_5', title: '秋日私语', artist: '秋叶', tags: ['Illustration', 'Landscape', 'Warm'], dims: {w:800, h:500} },
  { id: 'illus_6', title: '浮世绘重构', artist: '浮世绘重制', tags: ['Illustration', 'Japanese', 'Art'], dims: {w:800, h:400} },
  { id: 'illus_7', title: '治愈系云朵', artist: '云端画师', tags: ['Illustration', 'Healing', 'Sky'], dims: {w:800, h:600} },
  { id: 'illus_8', title: '未来都市人', artist: '未来人类', tags: ['Illustration', 'Concept', 'Sci-Fi'], dims: {w:600, h:800} },
  { id: 'illus_9', title: '故障艺术', artist: '故障信号', tags: ['Illustration', 'Glitch', 'Abstract'], dims: {w:800, h:800} },
  { id: 'illus_10', title: '手绘美食', artist: '深夜食堂绘', tags: ['Illustration', 'Food', 'Hand-drawn'], dims: {w:800, h:600} },
  { id: 'illus_11', title: '极简线条', artist: '一线之间', tags: ['Illustration', 'Minimal', 'Line'], dims: {w:800, h:1000} },
  { id: 'illus_12', title: '创意拼贴', artist: '拼贴日记', tags: ['Illustration', 'Collage', 'Mixed'], dims: {w:800, h:800} },
  
  // === NEW ADDITIONS (8 items) ===
  { id: 'illus_13', title: '春日野餐', artist: '暖暖', tags: ['Illustration', 'Spring', 'Cute'], dims: {w:800, h:600} },
  { id: '3d_11', title: '失重空间', artist: 'ZeroG', tags: ['3D', 'Space', 'Abstract'], dims: {w:800, h:1200} },
  { id: 'ui_11', title: '医疗健康 App', artist: 'MedUI', tags: ['UI/UX', 'Mobile', 'Health'], dims: {w:600, h:1000} },
  { id: 'art_game_13', title: '废弃神庙', artist: '遗迹猎人', tags: ['Game Art', 'Concept', 'Ruins'], dims: {w:800, h:450} },
  { id: 'brand_9', title: '有机茶叶包装', artist: '茶语', tags: ['Branding', 'Packaging', 'Tea'], dims: {w:800, h:800} },
  { id: 'illus_14', title: '雨夜霓虹', artist: 'RainMan', tags: ['Illustration', 'Cyberpunk', 'Rain'], dims: {w:800, h:500} },
  { id: '3d_12', title: '可爱怪兽', artist: 'MonsterFactory', tags: ['3D', 'Character', 'Cute'], dims: {w:600, h:600} },
  { id: 'ui_12', title: '加密货币钱包', artist: 'CryptoDesign', tags: ['UI/UX', 'Dark', 'Finance'], dims: {w:800, h:600} }
];

export const MOCK_ARTWORKS: Artwork[] = RAW_ARTWORK_DATA.map((item, index) => ({
  id: `art_${index + 1}`,
  title: item.title,
  artist: item.artist,
  artistAvatar: getAvatar(item.artist),
  imageUrl: getImage(item.id, item.dims.w, item.dims.h),
  likes: Math.floor(Math.random() * 5000) + 100,
  views: Math.floor(Math.random() * 50000) + 1000,
  tags: item.tags,
  isAiGenerated: item.tags.includes('AI') || index % 8 === 0,
  isVerified: index % 3 === 0,
  description: `深入探索《${item.title}》的视觉语言。这幅作品巧妙融合了 ${item.tags.join('、')} 等核心元素，构建出独特的艺术氛围，非常适合应用于 ${item.tags[0]} 相关的创意项目中。`,
  publishDate: '2023-10-27',
  tools: item.tags.includes('3D') ? ['Blender', 'Octane'] : item.tags.includes('UI') ? ['Figma', 'Sketch'] : ['Photoshop', 'Procreate']
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
  logo: getImage('tech_office_building', 256, 256),
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

// --- ENHANCED ASSET MOCKS WITH FOLDERS & VERSIONS & ANNOTATIONS ---
export const MOCK_ASSETS: Asset[] = [
  // FOLDERS
  { id: 'f1', parentId: null, name: 'Marketing', type: 'folder', modified: '2023-10-25', version: '-', tags: ['Dept'] },
  { id: 'f2', parentId: 'f1', name: '2024_Q1_Campaign', type: 'folder', modified: '2023-10-25', version: '-', tags: ['Campaign'] },
  { id: 'f3', parentId: null, name: 'Brand_Assets', type: 'folder', modified: '2023-09-15', version: '-', tags: ['VI'] },
  { id: 'f4', parentId: 'f2', name: 'Social_Media', type: 'folder', modified: '2023-10-26', version: '-', tags: ['Social'] },
  // NEW FOLDERS
  { id: 'f5', parentId: null, name: 'Development', type: 'folder', modified: '2023-10-28', version: '-', tags: ['Dev'] },
  { id: 'f6', parentId: 'f5', name: 'UI_Assets', type: 'folder', modified: '2023-10-28', version: '-', tags: ['UI'] },
  { id: 'f7', parentId: 'f5', name: 'Sprites', type: 'folder', modified: '2023-10-29', version: '-', tags: ['Game'] },

  // FILES IN ROOT
  { id: '1', parentId: null, name: 'Contract_Template.doc', type: 'doc', size: '2.5 MB', modified: '2023-08-30', version: 'v1.0', tags: ['Legal'] },
  // NEW ROOT FILE
  { id: '100', parentId: null, name: 'Showreel_2024.mp4', type: 'video', size: '150 MB', modified: '2023-10-30', version: 'v1.0', tags: ['Video', 'Promo'] },
  
  // FILES IN Marketing/2024_Q1_Campaign
  { 
    id: '2', 
    parentId: 'f2', 
    name: 'Key_Visual_Draft.jpg', 
    type: 'image', 
    size: '8.5 MB', 
    modified: '2023-10-27', 
    version: 'v2.1', 
    tags: ['KV', 'Draft'],
    url: 'https://picsum.photos/seed/kv_draft/1920/1080',
    versions: [
      { id: 'v1', version: 'v1.0', url: 'https://picsum.photos/seed/kv_draft_v1/1920/1080', size: '8.0 MB', createdAt: '2023-10-20', author: 'Admin' },
      { id: 'v2', version: 'v2.0', url: 'https://picsum.photos/seed/kv_draft/1920/1080', size: '8.5 MB', createdAt: '2023-10-25', author: 'Designer_A', changeLog: 'Adjusted color balance' }
    ],
    annotations: [
      { id: 'a1', x: 20, y: 30, content: "Logo 位置太靠左了，建议居中", author: "Product Manager", createdAt: "2023-10-27 10:00" },
      { id: 'a2', x: 60, y: 70, content: "这里的阴影有点太重，看不清细节", author: "Art Director", createdAt: "2023-10-27 11:30" }
    ]
  },
  { id: '3', parentId: 'f2', name: 'Campaign_Brief.pdf', type: 'doc', size: '1.2 MB', modified: '2023-10-20', version: 'v1.0', tags: ['Brief'] },

  // FILES IN Brand_Assets
  { id: '4', parentId: 'f3', name: 'Logo_Pack.zip', type: 'folder', size: '56 MB', modified: '2023-09-15', version: 'v1.0', tags: ['Logo', 'VI'] }, // Zip treated as folder for icon
  { id: '5', parentId: 'f3', name: 'Brand_Guidelines.pdf', type: 'doc', size: '15 MB', modified: '2023-09-10', version: 'v2.0', tags: ['VI'] },

  // FILES IN Marketing/2024_Q1_Campaign/Social_Media
  { id: '6', parentId: 'f4', name: 'Instagram_Post_01.jpg', type: 'image', size: '2.1 MB', modified: '2023-10-26', version: 'v1.0', tags: ['Social'], url: 'https://picsum.photos/seed/insta_1/1080/1080' },
  { id: '7', parentId: 'f4', name: 'Instagram_Post_02.jpg', type: 'image', size: '2.3 MB', modified: '2023-10-26', version: 'v1.0', tags: ['Social'], url: 'https://picsum.photos/seed/insta_2/1080/1080' },

  // NEW FILES IN Development/UI_Assets
  { id: '8', parentId: 'f6', name: 'Login_Screen.png', type: 'image', size: '3.2 MB', modified: '2023-10-28', version: 'v1.0', tags: ['UI'], url: 'https://picsum.photos/seed/login_ui/1280/800' },
  { id: '9', parentId: 'f6', name: 'Dashboard_Mockup.png', type: 'image', size: '4.5 MB', modified: '2023-10-28', version: 'v2.0', tags: ['UI', 'Dashboard'], url: 'https://picsum.photos/seed/dashboard_ui/1920/1080' },

  // NEW FILES IN Development/Sprites
  { id: '10', parentId: 'f7', name: 'Hero_Idle.gif', type: 'image', size: '1.2 MB', modified: '2023-10-29', version: 'v1.0', tags: ['Sprite'], url: 'https://picsum.photos/seed/hero_idle/256/256' },
  { id: '11', parentId: 'f7', name: 'Enemy_Run.gif', type: 'image', size: '1.1 MB', modified: '2023-10-29', version: 'v1.0', tags: ['Sprite'], url: 'https://picsum.photos/seed/enemy_run/256/256' },
];

export const MOCK_TASKS: Task[] = [
  { id: 't1', projectId: 'p1', title: '完成线稿细化', assignee: '夜色霓虹', assigneeAvatar: getAvatar('夜色霓虹'), status: 'in-progress', priority: 'high', dueDate: '10月28日', comments: 3, attachments: 1 },
  { id: 't2', projectId: 'p1', title: '提交配色方案 A/B', assignee: '夜色霓虹', assigneeAvatar: getAvatar('夜色霓虹'), status: 'todo', priority: 'medium', dueDate: '10月30日', comments: 0, attachments: 0 },
  { id: 't3', projectId: 'p2', title: '角色三视图绘制', assignee: '墨染流年', assigneeAvatar: getAvatar('墨染流年'), status: 'review', priority: 'high', dueDate: '10月26日', comments: 5, attachments: 2 },
  { id: 't4', projectId: 'p3', title: '首页视觉风格确认', assignee: '界面魔术师', assigneeAvatar: getAvatar('界面魔术师'), status: 'done', priority: 'medium', dueDate: '10月20日', comments: 8, attachments: 4 },
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
  { id: 'u1', name: '系统管理员', email: 'admin@xinhuashe.com', role: 'root_admin', roleName: '超级管理员', status: 'active', avatar: getAvatar('Admin'), permissions: [], isAuthenticated: true, creditScore: 999 },
  { id: 'u2', name: '科技创造', email: 'contact@technova.com', role: 'enterprise', roleName: '企业主', status: 'active', avatar: getImage('company_avatar', 128, 128), permissions: [], isAuthenticated: true, creditScore: 850 },
  { id: 'u3', name: '夜色霓虹', email: 'neon@art.com', role: 'creator', roleName: '创作者', status: 'active', avatar: getAvatar('夜色霓虹'), permissions: [], isAuthenticated: true, creditScore: 720 },
  { id: 'u4', name: '违规账号', email: 'spam@bot.com', role: 'general', roleName: '普通用户', status: 'banned', avatar: getAvatar('SpamUser'), permissions: [], isAuthenticated: true, creditScore: 300 },
];

export const MOCK_SYSTEM_LOGS: SystemLog[] = [
  { id: 'l1', timestamp: '2023-10-25 14:30:22', operator: '系统管理员', action: 'Approved Project', target: 'Project #p1', ip: '192.168.1.10', status: 'success' },
  { id: 'l2', timestamp: '2023-10-25 14:15:10', operator: 'System', action: 'Auto-Backup', target: 'Database', ip: '127.0.0.1', status: 'success' },
  { id: 'l3', timestamp: '2023-10-25 13:45:00', operator: '科技创造', action: 'Login Failed', target: 'User #u2', ip: '202.106.0.1', status: 'failure' },
];

export const MOCK_VERIFICATION_REQUESTS: VerificationRequest[] = [
  { 
    id: 'v1', userId: 'u5', userName: '张三 (申请中)', userAvatar: getAvatar('ZhangSan'), 
    type: 'personal', status: 'pending', submitTime: '2023-10-25 10:00',
    realName: '张三', idCardNumber: '110101199001011234', 
    idCardFront: 'https://placehold.co/400x250/e2e8f0/64748b?text=ID+Front', 
    idCardBack: 'https://placehold.co/400x250/e2e8f0/64748b?text=ID+Back'
  },
  {
    id: 'v2', userId: 'u6', userName: '创意工作室', userAvatar: getAvatar('CreativeStudio'),
    type: 'enterprise', status: 'pending', submitTime: '2023-10-24 16:30',
    companyName: '北京创意无限科技有限公司', creditCode: '91110105MA000000XX', legalRep: '李四',
    businessLicense: 'https://placehold.co/300x400/e2e8f0/64748b?text=License'
  },
  {
    id: 'v3', userId: 'u3', userName: '夜色霓虹', userAvatar: getAvatar('夜色霓虹'),
    type: 'personal', status: 'approved', submitTime: '2023-10-20 09:00', reviewTime: '2023-10-20 11:00', reviewer: '系统管理员'
  }
];

export const MOCK_CREATORS: Creator[] = [
  { id: 'c1', name: '夜色霓虹', avatar: getAvatar('夜色霓虹'), tags: ['Cyberpunk', 'Illustration', 'Concept'], followers: 12500, isVerified: true, trend: 'up', weeklyGrowth: 850, hotScore: 980, rank: 1 },
  { id: 'c2', name: '墨染流年', avatar: getAvatar('墨染流年'), tags: ['Ink', 'Traditional', 'Character'], followers: 8900, isVerified: true, trend: 'stable', weeklyGrowth: 200, hotScore: 850, rank: 2 },
  { id: 'c3', name: '低多边形建造者', avatar: getAvatar('低多边形建造者'), tags: ['3D', 'LowPoly', 'Scene'], followers: 15000, isVerified: true, trend: 'up', weeklyGrowth: 1200, hotScore: 920, rank: 3 },
  { id: 'c4', name: '界面魔术师', avatar: getAvatar('界面魔术师'), tags: ['UI/UX', 'Web', 'B2B'], followers: 6000, isVerified: false, trend: 'down', weeklyGrowth: 50, hotScore: 600, rank: 4 },
];

// Helper Function
export const getProfileById = (profileId: string): UserProfile => {
  // Mock Profile Generator based on ID
  const isCreator = profileId.includes('p_neon') || profileId.includes('p_artmaster') || profileId.includes('p_ink') || profileId.includes('p_sumo');
  return {
    id: profileId,
    userId: isCreator ? 'u3' : 'u2',
    displayName: isCreator ? (profileId.includes('p_ink') ? '墨染流年' : '夜色霓虹') : 'TechNova 科技',
    avatar: isCreator ? (profileId.includes('p_ink') ? getAvatar('墨染流年') : getAvatar('夜色霓虹')) : getImage('tech_logo', 128, 128),
    coverImage: isCreator 
      ? getImage('neon_city_night', 1200, 400)
      : getImage('modern_office_space', 1200, 400),
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
