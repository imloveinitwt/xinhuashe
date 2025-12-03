
export type ViewMode = 'discovery' | 'workspace';
export type WorkspaceTab = 'dashboard' | 'projects' | 'dam' | 'finance';

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
}

export interface Project {
  id: string;
  title: string;
  client: string;
  status: string; // Changed from literal union to string to support Chinese values
  budget: number;
  deadline: string;
  progress: number; // 0-100
  phase: string; // Changed from literal union to string to support Chinese values
  description?: string;
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
}

export interface Invoice {
  id: string;
  amount: number;
  createdDate: string;
  title: string;
  status: 'paid' | 'unpaid' | 'processing';
  companyName: string;
}