/**
 * Authentication Service
 * 
 * Handles authentication API calls: register, login, profile, logout
 * Uses session-based authentication (no JWT tokens)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class AuthService {
    /**
     * Make HTTP request with session
     */
    async request(url, options = {}) {
        const sessionId = localStorage.getItem('sessionId');
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...(sessionId && { 'X-Session-Id': sessionId }),
                ...options.headers
            },
            credentials: 'include', // Important for session cookies
            ...options
        };

        try {
            const response = await fetch(`${API_BASE_URL}${url}`, config);

            // Store session ID from response header
            const newSessionId = response.headers.get('X-Session-Id');
            if (newSessionId) {
                localStorage.setItem('sessionId', newSessionId);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error. Please check your connection.');
            }
            throw error;
        }
    }

    /**
     * Register a new student
     */
    async register(userData) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        // Store user data (no token needed)
        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    }

    /**
     * Login with username/email and password
     */
    async login(credentials) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        // Store user data (no token needed)
        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    }

    /**
     * Get current user profile
     */
    async getProfile() {
        return this.request('/auth/profile');
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            await this.request('/auth/logout', {
                method: 'POST'
            });
        } finally {
            // Clear local storage
            localStorage.removeItem('sessionId');
            localStorage.removeItem('user');
        }
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!localStorage.getItem('sessionId') && !!localStorage.getItem('user');
    }

    /**
     * Get current user from localStorage
     */
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}

// Export singleton instance
export const authService = new AuthService();
