
import { 
  MOCK_USERS_ADMIN_VIEW, MOCK_ARTWORKS, MOCK_PROJECTS, 
  MOCK_ASSETS, MOCK_TRANSACTIONS, MOCK_SYSTEM_LOGS, 
  MOCK_VERIFICATION_REQUESTS, MOCK_NOTIFICATIONS 
} from '../constants';
import { User, Project, Artwork, Asset, Transaction, SystemLog, VerificationRequest, Notification } from '../types';

// Database Keys
const KEYS = {
  USERS: 'xhs_users',
  ARTWORKS: 'xhs_artworks',
  PROJECTS: 'xhs_projects',
  ASSETS: 'xhs_assets',
  TRANSACTIONS: 'xhs_transactions',
  LOGS: 'xhs_system_logs',
  VERIFICATIONS: 'xhs_verifications',
  NOTIFICATIONS: 'xhs_notifications',
  SESSION: 'xhs_session'
};

// Generic Collection Manager
class Collection<T extends { id: string }> {
  private key: string;
  private initialData: T[];

  constructor(key: string, initialData: T[]) {
    this.key = key;
    this.initialData = initialData;
  }

  getAll(): T[] {
    try {
      const stored = localStorage.getItem(this.key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(`Error loading ${this.key}`, e);
    }
    // If empty or error, verify if we should seed
    if (!localStorage.getItem(this.key)) {
      this.save(this.initialData);
      return this.initialData;
    }
    return [];
  }

  find(predicate: (item: T) => boolean): T[] {
    return this.getAll().filter(predicate);
  }

  findById(id: string): T | undefined {
    return this.getAll().find(item => item.id === id);
  }

  add(item: T): T {
    const all = this.getAll();
    all.unshift(item); // Add to top
    this.save(all);
    return item;
  }

  update(id: string, updates: Partial<T>): T | null {
    const all = this.getAll();
    const idx = all.findIndex(item => item.id === id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates };
      this.save(all);
      return all[idx];
    }
    return null;
  }

  delete(id: string): boolean {
    const all = this.getAll();
    const filtered = all.filter(item => item.id !== id);
    if (filtered.length !== all.length) {
      this.save(filtered);
      return true;
    }
    return false;
  }

  save(data: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(data));
  }
  
  // For bulk replacement (e.g., reordering or mass update)
  replaceAll(data: T[]): void {
    this.save(data);
  }
}

class LocalDatabase {
  users: Collection<User>;
  artworks: Collection<Artwork>;
  projects: Collection<Project>;
  assets: Collection<Asset>;
  transactions: Collection<Transaction>;
  logs: Collection<SystemLog>;
  verifications: Collection<VerificationRequest>;
  notifications: Collection<Notification>;

  constructor() {
    this.users = new Collection<User>(KEYS.USERS, MOCK_USERS_ADMIN_VIEW);
    this.artworks = new Collection<Artwork>(KEYS.ARTWORKS, MOCK_ARTWORKS);
    this.projects = new Collection<Project>(KEYS.PROJECTS, MOCK_PROJECTS);
    this.assets = new Collection<Asset>(KEYS.ASSETS, MOCK_ASSETS);
    this.transactions = new Collection<Transaction>(KEYS.TRANSACTIONS, MOCK_TRANSACTIONS);
    this.logs = new Collection<SystemLog>(KEYS.LOGS, MOCK_SYSTEM_LOGS);
    this.verifications = new Collection<VerificationRequest>(KEYS.VERIFICATIONS, MOCK_VERIFICATION_REQUESTS);
    this.notifications = new Collection<Notification>(KEYS.NOTIFICATIONS, MOCK_NOTIFICATIONS);
    
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    // Ensure all collections are seeded if empty
    this.users.getAll();
    this.artworks.getAll();
    this.projects.getAll();
    this.assets.getAll();
    this.transactions.getAll();
    this.logs.getAll();
    this.verifications.getAll();
    this.notifications.getAll();
  }

  // Session Management
  getSession(): User | null {
    const s = localStorage.getItem(KEYS.SESSION);
    return s ? JSON.parse(s) : null;
  }

  setSession(user: User) {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
  }

  clearSession() {
    localStorage.removeItem(KEYS.SESSION);
  }
  
  // Helper to expose KEYS
  get KEYS() {
    return KEYS;
  }
}

export const DB = new LocalDatabase();
