/**
 * Schedule Entry Service
 * 
 * Handles API calls for schedule entries CRUD operations
 * Uses session-based authentication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

class ScheduleEntryService {
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
     * Get all schedule entries
     */
    async getAll() {
        return this.request('/schedule-entries');
    }

    /**
     * Get schedule entry by ID
     */
    async getById(id) {
        return this.request(`/schedule-entries/${id}`);
    }

    /**
     * Get schedule entries for a student
     */
    async getByStudent(studentId) {
        return this.request(`/schedule-entries/student/${studentId}`);
    }

    /**
     * Get schedule entries by weekday (0-6)
     */
    async getByWeekday(weekday) {
        return this.request(`/schedule-entries/weekday/${weekday}`);
    }

    /**
     * Create a new schedule entry
     */
    async create(entryData) {
        return this.request('/schedule-entries', {
            method: 'POST',
            body: JSON.stringify(entryData)
        });
    }

    /**
     * Update a schedule entry
     */
    async update(id, entryData) {
        return this.request(`/schedule-entries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(entryData)
        });
    }

    /**
     * Delete a schedule entry
     */
    async delete(id) {
        return this.request(`/schedule-entries/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Search schedule entries
     */
    async search(query) {
        return this.request(`/schedule-entries/search?q=${encodeURIComponent(query)}`);
    }
}

// Export singleton instance
export const scheduleEntryService = new ScheduleEntryService();
