import { apiClient, TokenManager } from './api';
import { 
  User, 
  AuthTokens, 
  LoginRequest, 
  RegisterRequest 
} from '../types';

// Auth response interfaces
interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', data);
      const { user, accessToken, refreshToken } = response.data;
      
      // Store tokens and user info
      TokenManager.setTokens(accessToken, refreshToken);
      TokenManager.setUser(user);
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', data);
      const { user, accessToken, refreshToken } = response.data;
      
      // Store tokens and user info
      TokenManager.setTokens(accessToken, refreshToken);
      TokenManager.setUser(user);
      
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.warn('Logout request failed:', error);
    } finally {
      // Always clear tokens locally
      TokenManager.clearTokens();
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<RefreshResponse> {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await apiClient.post<RefreshResponse>('/auth/refresh', {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      TokenManager.setTokens(accessToken, newRefreshToken);

      return response.data;
    } catch (error: any) {
      // If refresh fails, clear tokens and redirect to login
      TokenManager.clearTokens();
      const message = error.response?.data?.message || 'Session expired';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }

  /**
   * Get current authentication status
   */
  isAuthenticated(): boolean {
    return TokenManager.isAuthenticated();
  }

  /**
   * Get current tokens
   */
  getTokens(): AuthTokens | null {
    const accessToken = TokenManager.getAccessToken();
    const refreshToken = TokenManager.getRefreshToken();
    
    if (accessToken && refreshToken) {
      return { accessToken, refreshToken };
    }
    
    return null;
  }

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    TokenManager.clearTokens();
  }

  /**
   * Get current user information from the server
   */
  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/users/me');
      // Store user info in localStorage for persistence
      TokenManager.setUser(response.data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get user info';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;