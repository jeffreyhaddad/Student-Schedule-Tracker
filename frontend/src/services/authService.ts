const API_URL = 'http://localhost:3000/auth';

export interface AuthResponse {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  sessionId: string;
  message: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
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
    return response.json();
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
    localStorage.setItem('sessionId', data.sessionId);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  },

  logout: () => {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getSessionId: (): string | null => localStorage.getItem('sessionId'),
};
