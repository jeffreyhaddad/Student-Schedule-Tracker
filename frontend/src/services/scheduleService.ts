import { authService } from './authService';

export interface ScheduleEntry {
  id: number;
  studentId: number;
  weekday: number;
  startTime: string;
  endTime: string;
  subject: string;
  location?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleDTO {
  weekday: number;
  startTime: string;
  endTime: string;
  subject: string;
  location?: string;
  notes?: string;
  isActive?: boolean;
}

const API_URL = 'http://localhost:3000/schedule';

const getAuthHeaders = (): HeadersInit => {
  const token = authService.getToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const scheduleService = {
  getAll: async (studentId: number): Promise<ScheduleEntry[]> => {
    const response = await fetch(API_URL, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to fetch schedule');
    return response.json();
  },

  create: async (studentId: number, scheduleData: CreateScheduleDTO): Promise<ScheduleEntry> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create schedule entry');
    }
    return response.json();
  },

  update: async (
    studentId: number,
    scheduleId: number,
    scheduleData: Partial<CreateScheduleDTO>,
  ): Promise<ScheduleEntry> => {
    const response = await fetch(`${API_URL}/${scheduleId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update schedule entry');
    }
    return response.json();
  },

  delete: async (studentId: number, scheduleId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${scheduleId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) throw new Error('Failed to delete schedule entry');
  },
};
