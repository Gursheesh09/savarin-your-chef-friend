const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set auth token
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Remove auth token
  removeToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Get auth headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData)
    });
  }

  // Chef endpoints
  async getAllChefs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/chefs${queryString ? `?${queryString}` : ''}`);
  }

  async getChef(id) {
    return this.request(`/chefs/${id}`);
  }

  async searchChefs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/chefs/search${queryString ? `?${queryString}` : ''}`);
  }

  async getFeaturedChefs(limit = 6) {
    return this.request(`/chefs/featured?limit=${limit}`);
  }

  async updateChefProfile(profileData) {
    return this.request('/chefs/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async updateChefAvailability(availability) {
    return this.request('/chefs/availability', {
      method: 'PUT',
      body: JSON.stringify({ availability })
    });
  }

  async updateChefStatus(statusData) {
    return this.request('/chefs/status', {
      method: 'PUT',
      body: JSON.stringify(statusData)
    });
  }

  // Session endpoints
  async getAllSessions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/sessions${queryString ? `?${queryString}` : ''}`);
  }

  async getSession(id) {
    return this.request(`/sessions/${id}`);
  }

  async searchSessions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/sessions/search${queryString ? `?${queryString}` : ''}`);
  }

  async getAvailableSessions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/sessions/available${queryString ? `?${queryString}` : ''}`);
  }

  async createSession(sessionData) {
    return this.request('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  }

  async updateSession(id, sessionData) {
    return this.request(`/sessions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData)
    });
  }

  async deleteSession(id) {
    return this.request(`/sessions/${id}`, {
      method: 'DELETE'
    });
  }

  async publishSession(id) {
    return this.request(`/sessions/${id}/publish`, {
      method: 'PUT'
    });
  }

  async joinSession(id) {
    return this.request(`/sessions/${id}/join`, {
      method: 'POST'
    });
  }

  async leaveSession(id) {
    return this.request(`/sessions/${id}/leave`, {
      method: 'POST'
    });
  }

  async startSession(id) {
    return this.request(`/sessions/${id}/start`, {
      method: 'PUT'
    });
  }

  async endSession(id) {
    return this.request(`/sessions/${id}/end`, {
      method: 'PUT'
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
