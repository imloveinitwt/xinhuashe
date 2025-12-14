
import { RoleDefinition, MembershipPlan } from './types';
import { 
  Users, Palette, Briefcase, Shield
} from 'lucide-react';

// --- System Configuration & Static Options ---

export const CATEGORIES = ['全部', 'UI/UX', '插画', '3D/动画', '平面设计', '游戏原画', '网站设计', '品牌全案'];

export const BUDGET_RANGES = [
  { id: 'all', label: '不限预算', min: 0, max: Infinity },
  { id: 'low', label: '5k以下', min: 0, max: 5000 },
  { id: 'mid', label: '5k - 20k', min: 5000, max: 20000 },
  { id: 'high', label: '20k - 50k', min: 20000, max: 50000 },
  { id: 'premium', label: '50k以上', min: 50000, max: Infinity },
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

export const CREDIT_DIMENSIONS = [
  { subject: '身份特质', A: 85, fullMark: 100 },
  { subject: '履约能力', A: 92, fullMark: 100 },
  { subject: '行为积累', A: 78, fullMark: 100 },
  { subject: '资产证明', A: 65, fullMark: 100 },
  { subject: '合规历史', A: 98, fullMark: 100 },
];

export const CREDIT_LEVELS = [
  { level: 'AAA', min: 800, title: '极好', privileges: ['0% 提现手续费', '极速审核通道', '首页优先推荐', '专属客服经理'] },
  { level: 'AA', min: 700, title: '优秀', privileges: ['提现手续费 5折', '优先审核通道', '加V认证标识'] },
  { level: 'A', min: 600, title: '良好', privileges: ['正常接单/发布', '基础额度提现', '标准客服支持'] },
  { level: 'B', min: 500, title: '中等', privileges: ['每日接单限制', '提现T+3到账'] },
  { level: 'C', min: 350, title: '一般', privileges: ['需缴纳保证金', '提现人工审核'] },
];
