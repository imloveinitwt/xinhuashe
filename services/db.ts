import { MOCK_USERS_ADMIN_VIEW, MOCK_ARTWORKS, MOCK_PROJECTS, MOCK_ASSETS, MOCK_TRANSACTIONS } from '../constants';

const KEYS = {
  USERS: 'xhs_users',
  ARTWORKS: 'xhs_artworks',
  PROJECTS: 'xhs_projects',
  ASSETS: 'xhs_assets',
  TRANSACTIONS: 'xhs_transactions',
  CURRENT_USER: 'xhs_current_user_session'
};

// Initialize DB with seed data if empty
export const initializeDB = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify(MOCK_USERS_ADMIN_VIEW));
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

// Generic DB Helpers
const getTable = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const saveTable = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const DB = {
  // Users
  users: {
    find: () => getTable(KEYS.USERS),
    findById: (id: string) => getTable(KEYS.USERS).find((u: any) => u.id === id),
    findByEmail: (email: string) => getTable(KEYS.USERS).find((u: any) => u.email === email || u.name === email),
    create: (user: any) => {
      const users = getTable(KEYS.USERS);
      users.push(user);
      saveTable(KEYS.USERS, users);
      return user;
    }
  },

  // Projects
  projects: {
    find: (filter?: (p: any) => boolean) => {
      const all = getTable(KEYS.PROJECTS);
      return filter ? all.filter(filter) : all;
    },
    create: (project: any) => {
      const list = getTable(KEYS.PROJECTS);
      const newProject = { ...project, id: project.id || `p_${Date.now()}` };
      list.unshift(newProject);
      saveTable(KEYS.PROJECTS, list);
      return newProject;
    },
    update: (id: string, updates: any) => {
      const list = getTable<any>(KEYS.PROJECTS);
      const idx = list.findIndex((p: any) => p.id === id);
      if (idx > -1) {
        list[idx] = { ...list[idx], ...updates };
        saveTable(KEYS.PROJECTS, list);
        return list[idx];
      }
      return null;
    }
  },

  // Artworks
  artworks: {
    find: (filter?: (a: any) => boolean) => {
      const all = getTable(KEYS.ARTWORKS);
      return filter ? all.filter(filter) : all;
    },
    create: (artwork: any) => {
      const list = getTable(KEYS.ARTWORKS);
      const newArt = { ...artwork, id: artwork.id || `a_${Date.now()}` };
      list.unshift(newArt);
      saveTable(KEYS.ARTWORKS, list);
      return newArt;
    }
  },

  // Session
  session: {
    get: () => {
      const s = localStorage.getItem(KEYS.CURRENT_USER);
      return s ? JSON.parse(s) : null;
    },
    set: (user: any) => localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user)),
    clear: () => localStorage.removeItem(KEYS.CURRENT_USER)
  }
};

// Auto init on load
initializeDB();