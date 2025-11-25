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

const API_URL = 'http://localhost:3000/tasks';

export const tasksService = {
  getAll: async (studentId: number): Promise<Task[]> => {
    const response = await fetch(API_URL, {
      headers: {
        'x-student-id': studentId.toString(),
      },
    });

    if (!response.ok) throw new Error('Failed to fetch tasks');
    return response.json();
  },

  create: async (studentId: number, taskData: CreateTaskDTO): Promise<Task> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': studentId.toString(),
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error('Failed to create task');
    return response.json();
  },

  update: async (studentId: number, taskId: number, taskData: Partial<CreateTaskDTO>): Promise<Task> => {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': studentId.toString(),
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error('Failed to update task');
    return response.json();
  },

  delete: async (studentId: number, taskId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${taskId}`, {
      method: 'DELETE',
      headers: {
        'x-student-id': studentId.toString(),
      },
    });

    if (!response.ok) throw new Error('Failed to delete task');
  },
};
