
import { MOCK_USERS_ADMIN_VIEW, MOCK_ARTWORKS, MOCK_PROJECTS } from '../constants';

const KEYS = {
  USERS: 'xhs_users',
  ARTWORKS: 'xhs_artworks',
  PROJECTS: 'xhs_projects',
  CURRENT_USER: 'xhs_current_user_session'
};

// 初始化数据（如果本地没有，则加载 Mock 数据）
export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS_ADMIN_VIEW));
  }
  if (!localStorage.getItem(KEYS.ARTWORKS)) {
    localStorage.setItem(KEYS.ARTWORKS, JSON.stringify(MOCK_ARTWORKS));
  }
  if (!localStorage.getItem(KEYS.PROJECTS)) {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(MOCK_PROJECTS));
  }
};

export const StorageService = {
  getItem: <T>(key: string): T | null => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  
  setItem: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // 模拟数据库查询：获取所有用户
  getUsers: () => StorageService.getItem<any[]>(KEYS.USERS) || [],

  // 模拟数据库插入：添加用户
  addUser: (user: any) => {
    const users = StorageService.getUsers();
    users.push(user);
    StorageService.setItem(KEYS.USERS, users);
  },

  // Session 管理
  setSession: (user: any) => localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user)),
  getSession: () => {
    const session = localStorage.getItem(KEYS.CURRENT_USER);
    return session ? JSON.parse(session) : null;
  },
  clearSession: () => localStorage.removeItem(KEYS.CURRENT_USER),

  KEYS
};

// 立即初始化
initializeStorage();
