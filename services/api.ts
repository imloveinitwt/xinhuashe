
import { DB } from './db';

// Toggle this to true to force using local DB simulation
// Toggle to false to try connecting to http://localhost:3001
const USE_MOCK_BACKEND = true;
const API_BASE_URL = 'http://localhost:3001/api';

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiClient {
  private async mockRequest(method: string, endpoint: string, data?: any) {
    await delay(400 + Math.random() * 400); // 400-800ms latency

    console.log(`[Mock API] ${method} ${endpoint}`, data);

    // --- Mock Routes ---
    
    // Auth
    if (endpoint === '/auth/login' && method === 'POST') {
      const user = DB.users.findByEmail(data.email);
      if (user) {
        DB.session.set(user);
        return { user, token: 'mock-jwt-token' };
      }
      throw new Error('Invalid credentials');
    }

    if (endpoint === '/auth/logout' && method === 'POST') {
      DB.session.clear();
      return { success: true };
    }

    // Projects
    if (endpoint === '/projects') {
      if (method === 'GET') return DB.projects.find();
      if (method === 'POST') return DB.projects.create(data);
    }
    
    // Artworks
    if (endpoint === '/artworks') {
      if (method === 'GET') return DB.artworks.find();
    }

    throw new Error(`Route not found: ${endpoint}`);
  }

  private async realRequest(method: string, endpoint: string, data?: any) {
    const headers: any = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('auth_token'); // Simplified
    if (token) headers['Authorization'] = token;

    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  async get(endpoint: string) {
    return USE_MOCK_BACKEND ? this.mockRequest('GET', endpoint) : this.realRequest('GET', endpoint);
  }

  async post(endpoint: string, data: any) {
    return USE_MOCK_BACKEND ? this.mockRequest('POST', endpoint, data) : this.realRequest('POST', endpoint, data);
  }

  async put(endpoint: string, data: any) {
    return USE_MOCK_BACKEND ? this.mockRequest('PUT', endpoint, data) : this.realRequest('PUT', endpoint, data);
  }

  async delete(endpoint: string) {
    return USE_MOCK_BACKEND ? this.mockRequest('DELETE', endpoint) : this.realRequest('DELETE', endpoint);
  }
}

export const api = new ApiClient();
