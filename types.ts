
export type ViewMode = 'discovery' | 'workspace' | 'profile' | 'artworks' | 'projects_hub' | 'rising_creators' | 'rankings' | 'help_center' | 'painter_guide_full' | 'employer_guide_full' | 'terms_service_full' | 'enterprise_showcase' | 'messages';
export type WorkspaceTab = 'dashboard' | 'projects' | 'dam' | 'finance' | 'admin_users' | 'admin_roles';

// 2.2 角色定义
export type UserRole = 
  | 'root_admin'      // 系统根管理员
  | 'platform_admin'  // 平台管理员
  | 'content_ops'     // 内容运营/审核
  | 'creator'         // 创作者
  | 'enterprise'      // 企业用户
  | 'general';        // 普通用户

// 3.3 核心权限代码
export type PermissionCode = 
  // 用户管理
  | 'USER_VIEW' | 'USER_EDIT' | 'USER_ROLE_ASSIGN' | 'USER_AUTH_REVIEW'
  // 内容管理
  | 'CONTENT_UPLOAD' | 'CONTENT_REVIEW' | 'CONTENT_DELETE' | 'CONTENT_RECOMMEND'
  // 交易管理
  | 'TRANSACTION_CREATE' | 'TRANSACTION_VIEW' | 'INVOICE_APPLY' | 'WITHDRAW_APPLY'
  // 协作管理
  | 'PROJECT_CREATE' | 'PROJECT_VIEW' | 'TASK_ASSIGN'
  // 系统管理
  | 'SYSTEM_CONFIG' | 'ROLE_MANAGE' | 'LOG_VIEW' | 'DATA_BACKUP';

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  roleName: string; // Display name for the role
  permissions: PermissionCode[]; // Computed final permissions
  isAuthenticated: boolean;
  email?: string; // Added for admin view and login
  phone?: string; // Added for phone registration
  status?: 'active' | 'banned' | 'inactive'; // Added for admin view
}

export type ThemeColor = 'indigo' | 'pink' | 'blue' | 'purple' | 'emerald';

export interface UserProfilePreferences {
  themeColor: ThemeColor;
  layoutMode: 'grid' | 'list';
}

export interface UserProfile {
  id: string;
  userId: string; // Links to User.id
  displayName: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  website?: string;
  skills: string[];
  stats: {
    followers: number;
    following: number;
    likes: number;
    views: number;
  };
  joinedDate: string;
  isVerified: boolean;
  preferences?: UserProfilePreferences;
}

// For Admin View
export interface RoleDefinition {
  code: UserRole;
  name: string;
  description: string;
  defaultPermissions: PermissionCode[];
}

export interface SystemLog {
  id: string;
  action: string;
  operator: string;
  target: string;
  timestamp: string;
  ip: string;
  status: 'success' | 'failure';
}

export interface SystemConfig {
  maintenanceMode: boolean;
  allowRegistration: boolean;
  contentAuditLevel: 'low' | 'medium' | 'high' | 'strict';
  maxUploadSize: number;
}

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  artistAvatar: string;
  imageUrl: string;
  likes: number;
  views: number;
  tags: string[];
  isAiGenerated?: boolean;
  isVerified?: boolean;
  // Details for modal
  description?: string;
  publishDate?: string;
  tools?: string[];
  resolution?: string;
  // Admin fields
  status?: 'approved' | 'pending' | 'rejected';
}

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  tags: string[];
  followers: number;
  isVerified: boolean;
  // Trending fields
  trend?: 'up' | 'down' | 'stable';
  weeklyGrowth?: number;
  hotScore?: number;
  rank?: number;
}

export interface Event {
  id: string;
  title: string;
  coverUrl: string;
  deadline: string;
  prize: string;
  status: 'active' | 'upcoming';
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: string; 
  budget: number;
  deadline: string;
  progress: number; 
  phase: string; 
  description?: string;
  coverImage?: string; // New field for project visual
}

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  assignee: string;
  assigneeAvatar: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  comments: number;
  attachments: number;
}

export interface Asset {
  id: string;
  name: string;
  type: 'folder' | 'image' | 'psd' | 'video' | 'doc';
  size?: string;
  modified: string;
  version: string;
  tags: string[];
}

export interface NavItem {
  id: WorkspaceTab;
  label: string;
  icon: any;
  requiredPermission?: PermissionCode; // RBAC integration
}

// Finance Types
export type TransactionType = 'income' | 'withdrawal' | 'payment' | 'escrow_frozen' | 'escrow_release';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  status: TransactionStatus;
  relatedProject?: string;
  category?: string; // For personal finance analysis
}

export interface Invoice {
  id: string;
  amount: number;
  createdDate: string;
  title: string;
  status: 'paid' | 'unpaid' | 'processing';
  companyName: string;
}

export interface Article {
  id: string;
  title: string;
  coverImage: string;
  date: string;
}

// New Types for Differentiated Finance View
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
  icon: any;
}

export interface DepartmentBudget {
  id: string;
  department: string;
  totalBudget: number;
  usedBudget: number;
  head: string;
  status: 'healthy' | 'warning' | 'critical';
}

// === NEW TYPES FOR ENTERPRISE DASHBOARD ===

export interface HistoryMilestone {
  year: string;
  title: string;
  description: string;
}

export interface OrgNode {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  children?: OrgNode[];
}

export interface EnterpriseProfile {
  name: string;
  description: string;
  industry: string;
  size: string;
  founded: string;
  website: string;
  logo: string;
  coreBusiness: string[];
  history: HistoryMilestone[];
  structure: OrgNode;
}

export interface ProjectCase {
  id: string;
  title: string;
  year: string;
  category: string;
  description: string;
  coverImage: string;
  results: { label: string; value: string }[];
  clientTestimonial?: {
    text: string;
    author: string;
  };
}

// === NOTIFICATION TYPES ===
export type NotificationType = 'system' | 'project' | 'social' | 'finance';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  avatar?: string; // For social interactions
  actionLabel?: string;
  linkTo?: ViewMode; // Simplified navigation link
}

// === VERIFICATION TYPES ===
export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  type: 'personal' | 'enterprise';
  status: 'pending' | 'approved' | 'rejected';
  submitTime: string;
  reviewTime?: string;
  reviewer?: string;
  rejectReason?: string;
  // Personal fields
  realName?: string;
  idCardNumber?: string;
  idCardFront?: string;
  idCardBack?: string;
  // Enterprise fields
  companyName?: string;
  creditCode?: string;
  legalRep?: string;
  businessLicense?: string;
}