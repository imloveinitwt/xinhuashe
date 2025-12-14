
import { DB } from './db';

// Toggle this to true to force using local DB simulation
// In production, this would be set via environment variable
const USE_MOCK_BACKEND = true;
const API_BASE_URL = 'http://localhost:3001/api/v1'; // Standardized V1 prefix

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Standard Response Format
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

class ApiClient {
  /**
   * Mock Backend Handler (Simulates Server-Side Logic)
   */
  private async mockRequest<T>(method: string, endpoint: string, body?: any): Promise<T> {
    await delay(300 + Math.random() * 200); // 300-500ms latency

    console.log(`[Mock API] ${method} ${endpoint}`, body);

    let result: any = null;

    try {
      // --- Auth Routes ---
      if (endpoint === '/auth/login' && method === 'POST') {
        const identifier = body.email || body.identifier;
        // User Collection find returns array
        const users = DB.users.find(u => u.email === identifier || u.name === identifier || (u.phone && u.phone === identifier)); 
        const user = users[0];
        
        if (user) {
          DB.setSession(user);
          result = { token: 'mock-jwt-token-' + Date.now(), user };
        } else {
          throw new Error('Invalid credentials');
        }
      }
      else if (endpoint === '/auth/logout' && method === 'POST') {
        DB.clearSession();
        result = { success: true };
      }
      else if (endpoint === '/auth/me' && method === 'GET') {
        const user = DB.getSession();
        if (user) result = user;
        else throw new Error('Unauthorized');
      }

      // --- Project Routes ---
      else if (endpoint === '/projects' && method === 'GET') {
        result = DB.projects.getAll();
      }
      else if (endpoint === '/projects' && method === 'POST') {
        // Auto-generate ID for mock creation
        const newProject = {
          id: `p_${Date.now()}`,
          ...body
        };
        result = DB.projects.add(newProject);
      }
      else if (endpoint.startsWith('/projects/') && method === 'PUT') {
        const id = endpoint.split('/')[2];
        result = DB.projects.update(id, body);
      }

      // --- Artwork Routes ---
      else if (endpoint === '/artworks' && method === 'GET') {
        result = DB.artworks.getAll();
      }

      // --- Default Fallback ---
      else {
        // If no specific route logic, try to match generic REST
        // This is a simplification for the prototype
        if (method === 'GET') {
           // Basic routing simulation
           if(endpoint.includes('users')) result = DB.users.getAll();
        }
      }

      // Wrap in standard response format
      if (result !== undefined) {
        return result as T;
      } else {
        throw new Error(`Route not found: ${method} ${endpoint}`);
      }

    } catch (error: any) {
      console.error('[Mock API Error]', error);
      throw error;
    }
  }

  /**
   * Real API Handler (Uses fetch)
   */
  private async realRequest<T>(method: string, endpoint: string, body?: any): Promise<T> {
    const headers: HeadersInit = { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Add Auth Token if available
    const token = localStorage.getItem('auth_token'); // Or get from cookie
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      // Handle non-200 responses
      if (!response.ok) {
        if (response.status === 401) {
          // Handle token expiration
          // window.location.href = '/login'; 
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const json: ApiResponse<T> = await response.json();
      
      // Standardize backend response handling
      if (json.code && json.code !== 200) {
         throw new Error(json.message || 'Business Error');
      }
      
      return json.data; // Return clean data
    } catch (error) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  // Public Methods
  async get<T>(endpoint: string) {
    return USE_MOCK_BACKEND ? this.mockRequest<T>('GET', endpoint) : this.realRequest<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, data: any) {
    return USE_MOCK_BACKEND ? this.mockRequest<T>('POST', endpoint, data) : this.realRequest<T>('POST', endpoint, data);
  }

  async put<T>(endpoint: string, data: any) {
    return USE_MOCK_BACKEND ? this.mockRequest<T>('PUT', endpoint, data) : this.realRequest<T>('PUT', endpoint, data);
  }

  async delete<T>(endpoint: string) {
    return USE_MOCK_BACKEND ? this.mockRequest<T>('DELETE', endpoint) : this.realRequest<T>('DELETE', endpoint);
  }
}

export const api = new ApiClient();
