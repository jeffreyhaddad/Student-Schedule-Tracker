/**
 * Task Service
 * 
 * Handles API calls for tasks CRUD operations
 * Uses session-based authentication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class TaskService {
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
            credentials: 'include',
            ...options
        };

        try {
            const response = await fetch(`${API_BASE_URL}${url}`, config);

            // Update session ID if provided
            const newSessionId = response.headers.get('X-Session-Id');
            if (newSessionId) {
                localStorage.setItem('sessionId', newSessionId);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            // Handle 204 No Content
            if (response.status === 204) {
                return null;
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
     * Get all tasks
     */
    async getAll() {
        return this.request('/tasks');
    }

    /**
     * Get task by ID
     */
    async getById(id) {
        return this.request(`/tasks/${id}`);
    }

    /**
     * Create a new task
     */
    async create(taskData) {
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    }

    /**
     * Update a task
     */
    async update(id, taskData) {
        return this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    }

    /**
     * Delete a task
     */
    async delete(id) {
        return this.request(`/tasks/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Search tasks
     */
    async search(query) {
        return this.request(`/tasks/search?q=${encodeURIComponent(query)}`);
    }
}

// Export singleton instance
export const taskService = new TaskService();
