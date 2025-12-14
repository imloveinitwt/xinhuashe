
import { DB } from './db';

// This file is maintained for backward compatibility with existing components
// that import StorageService directly. It now proxies calls to the unified DB instance.

export const StorageService = {
  // Generic Helpers (Mapped to DB collections if possible, or direct local storage)
  getItem: <T>(key: string): T | null => {
    // Map keys to DB collections for read access if needed, 
    // but generally direct local storage read is fine for raw access
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },
  
  setItem: <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // User Methods
  getUsers: () => DB.users.getAll(),
  addUser: (user: any) => DB.users.add(user),
  
  // Entity Accessors
  getArtworks: () => DB.artworks.getAll(),
  getProjects: () => DB.projects.getAll(),
  getAssets: () => DB.assets.getAll(),
  getTransactions: () => DB.transactions.getAll(),

  // Session Methods
  setSession: (user: any) => DB.setSession(user),
  getSession: () => DB.getSession(),
  clearSession: () => DB.clearSession(),

  // Expose Keys
  KEYS: DB.KEYS
};

// No initialization needed here as DB initializes itself
