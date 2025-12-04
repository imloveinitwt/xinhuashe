

import { MOCK_USERS_ADMIN_VIEW, MOCK_ARTWORKS, MOCK_PROJECTS, MOCK_ASSETS, MOCK_TRANSACTIONS } from '../constants';

const KEYS = {
  USERS: 'xhs_users',
  ARTWORKS: 'xhs_artworks',
  PROJECTS: 'xhs_projects',
  ASSETS: 'xhs_assets',
  TRANSACTIONS: 'xhs_transactions',
  CURRENT_USER: 'xhs_current_user_session'
};

export const initializeStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(KEYS.USERS)) {
    // Add an 'email' field to mock users for login simulation if missing
    const usersWithEmail = MOCK_USERS_ADMIN_VIEW.map(u => ({
        ...u,
        email: u.id === 'u1' ? 'admin@xinhuashe.com' : `${u.name?.toLowerCase().replace(/\s/g, '')}@example.com`
    }));
    localStorage.setItem(KEYS.USERS, JSON.stringify(usersWithEmail));
  }
  if (!localStorage.getItem(KEYS.ARTWORKS)) {
    localStorage.setItem(KEYS.ARTWORKS, JSON.stringify(MOCK_ARTWORKS));
  }
  if (!localStorage.getItem(KEYS.PROJECTS)) {
    localStorage.setItem(KEYS.PROJECTS, JSON.stringify(MOCK_PROJECTS));
  }
  if (!localStorage.getItem(KEYS.ASSETS)) {
    localStorage.setItem(KEYS.ASSETS, JSON.stringify(MOCK_ASSETS));
  }
  if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(MOCK_TRANSACTIONS));
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

  getUsers: () => StorageService.getItem<any[]>(KEYS.USERS) || [],

  addUser: (user: any) => {
    const users = StorageService.getUsers();
    users.push(user);
    StorageService.setItem(KEYS.USERS, users);
  },
  
  // 新增的数据访问方法
  getArtworks: () => StorageService.getItem<any[]>(KEYS.ARTWORKS) || [],
  getProjects: () => StorageService.getItem<any[]>(KEYS.PROJECTS) || [],
  getAssets: () => StorageService.getItem<any[]>(KEYS.ASSETS) || [],
  getTransactions: () => StorageService.getItem<any[]>(KEYS.TRANSACTIONS) || [],

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