//import api from './axios.config';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
  role?: 'student' | 'tutor' | 'parent' | 'school' | 'ministry';
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'tutor' | 'parent' | 'school' | 'ministry';
  phone?: string;
  dateOfBirth?: string;
  organization?: string;
  grade?: number;
  subjects?: string[];
  parentEmail?: string;
  schoolId?: string;
  ministryId?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface TwoFactorSetup {
  qrCode: string;
  secret: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

class AuthAPI {
  private static instance: AuthAPI;
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'user';
  
  private constructor() {}
  
  static getInstance(): AuthAPI {
    if (!AuthAPI.instance) {
      AuthAPI.instance = new AuthAPI();
    }
    return AuthAPI.instance;
  }

  // Login user
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // TODO: Uncomment when backend is ready
      // const response = await api.post<AuthResponse>('/auth/login', credentials);
      // this.setAuthData(response.data);
      // return response.data;
      
      // Mock response for development
      const mockResponse = this.getMockLoginResponse(credentials);
      this.setAuthData(mockResponse);
      return mockResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Register user
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // TODO: Uncomment when backend is ready
      // const response = await api.post<AuthResponse>('/auth/register', data);
      // this.setAuthData(response.data);
      // return response.data;
      
      // Mock response for development
      const mockResponse = this.getMockRegisterResponse(data);
      this.setAuthData(mockResponse);
      return mockResponse;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // TODO: Uncomment when backend is ready
      // await api.post('/auth/logout');
      this.clearAuthData();
    } catch (error) {
      console.error('Logout error:', error);
      this.clearAuthData();
    } finally {
      window.location.href = '/login';
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      // TODO: Uncomment when backend is ready
      // const response = await api.post<{ message: string }>('/auth/verify-email', { token });
      // return response.data;
      
      // Mock response
      console.log(`Verifying email with token: ${token}`);
      return { message: 'Email verified successfully' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Request password reset
  async requestPasswordReset(data: PasswordResetRequest): Promise<{ message: string }> {
    try {
      // TODO: Uncomment when backend is ready
      // const response = await api.post<{ message: string }>('/auth/forgot-password', data);
      // return response.data;
      
      // Mock response
      return { message: 'Password reset email sent' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Reset password
  async resetPassword(data: PasswordResetConfirm): Promise<{ message: string }> {
    try {
      // TODO: Uncomment when backend is ready
      // const response = await api.post<{ message: string }>('/auth/reset-password', data);
      // return response.data;
      
      // Mock response
      return { message: 'Password reset successfully' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Setup 2FA
  async setupTwoFactor(): Promise<TwoFactorSetup> {
    try {
      // TODO: Uncomment when backend is ready
      // const response = await api.post<TwoFactorSetup>('/auth/2fa/setup');
      // return response.data;
      
      // Mock response
      return { 
        qrCode: 'mock-qr-code', 
        secret: 'mock-secret' 
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Verify 2FA
  async verifyTwoFactor(token: string): Promise<{ message: string }> {
    try {
      // TODO: Uncomment when backend is ready
      // const response = await api.post<{ message: string }>('/auth/2fa/verify', { token });
      // return response.data;
      
      // Mock response
      console.log(`Verifying 2FA with token: ${token}`);
      return { message: '2FA verified successfully' };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Refresh token
  async refreshToken(): Promise<{ accessToken: string }> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // TODO: Uncomment when backend is ready
      // const response = await api.post<{ accessToken: string }>('/auth/refresh', { refreshToken });
      // this.setAccessToken(response.data.accessToken);
      // return response.data;
      
      // Mock response
      console.log(`Refreshing token with: ${refreshToken.substring(0, 10)}...`);
      const newAccessToken = `new-mock-token-${Date.now()}`;
      this.setAccessToken(newAccessToken);
      return { accessToken: newAccessToken };
    } catch (error) {
      // If refresh fails, clear auth data
      this.clearAuthData();
      throw this.handleError(error);
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  // Get access token
  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;
    
    // Optional: Check token expiration
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      // If token is invalid format, assume not authenticated
      return false;
    }
  }

  // Update user profile locally
  updateLocalUser(user: Partial<User>): void {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...user };
      localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
    }
  }

  // Private helper methods
  private setAuthData(data: AuthResponse): void {
    this.setAccessToken(data.accessToken);
    this.setRefreshToken(data.refreshToken);
    this.setUser(data.user);
  }

  private setAccessToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private getMockLoginResponse(credentials: LoginCredentials): AuthResponse {
    return {
      user: {
        id: `user-${Date.now()}`,
        email: credentials.email,
        firstName: 'John',
        lastName: 'Doe',
        role: credentials.role || 'student',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      accessToken: `mock-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    };
  }

  private getMockRegisterResponse(data: RegisterData): AuthResponse {
    return {
      user: {
        id: `user-${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        isEmailVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      accessToken: `mock-token-${Date.now()}`,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    };
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error
      return {
        message: error.response.data?.message || 'An error occurred',
        status: error.response.status,
        errors: error.response.data?.errors,
      };
    } else if (error.request) {
      // Request made but no response
      return {
        message: 'No response from server. Please check your connection.',
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
      };
    }
  }
}

// Export singleton instance
export default AuthAPI.getInstance();