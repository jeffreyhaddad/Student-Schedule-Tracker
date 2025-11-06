/**
 * useAuth Hook
 * 
 * Manages authentication state and operations
 */

import { useState, useCallback } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
    const [user, setUser] = useState(() => authService.getCurrentUser());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Register new user
    const register = useCallback(async (userData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authService.register(userData);
            setUser(response.user);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Login user
    const login = useCallback(async (credentials) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login(credentials);
            setUser(response.user);
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Logout user
    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
    }, []);

    // Get current profile
    const getProfile = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const profile = await authService.getProfile();
            setUser(profile);
            return profile;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Check authentication based on current user state
    const isAuthenticated = !!user && !!localStorage.getItem('sessionId');

    return {
        user,
        loading,
        error,
        isAuthenticated,
        register,
        login,
        logout,
        getProfile,
        clearError
    };
}