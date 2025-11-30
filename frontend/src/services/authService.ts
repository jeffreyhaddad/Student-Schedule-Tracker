const API_URL = 'http://localhost:3000/auth';
const TOKEN_KEY = 'access_token';
const USER_KEY = 'user';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  register: async (data: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    const data_response = await response.json();
    localStorage.setItem(TOKEN_KEY, data_response.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data_response.user));
    return data_response;
  },

  login: async (credentials: {
    username: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    const data = await response.json();
    localStorage.setItem(TOKEN_KEY, data.access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),

  isAuthenticated: (): boolean => !!localStorage.getItem(TOKEN_KEY),
};
