import { authService } from './authService';

export interface Task {
  id: number;
  studentId: number;
  title: string;
  description?: string;
  dueAt?: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'normal' | 'high';
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueAt?: string;
  status?: string;
  priority?: string;
  category?: string;
}

const API_URL = 'http://localhost:3000/task';

const getAuthHeaders = (): HeadersInit => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const tasksService = {
  getAll: async (studentId: number): Promise<Task[]> => {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  create: async (studentId: number, taskData: CreateTaskDTO): Promise<Task> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create task');
    }
    return response.json();
  },

  update: async (studentId: number, taskId: number, taskData: Partial<CreateTaskDTO>): Promise<Task> => {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update task');
    }
    return response.json();
  },

  delete: async (studentId: number, taskId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete task');
  },
};
