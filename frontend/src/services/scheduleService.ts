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

export const scheduleService = {
  getAll: async (studentId: number): Promise<ScheduleEntry[]> => {
    const response = await fetch(API_URL, {
      headers: {
        'x-student-id': studentId.toString(),
      },
    });

    if (!response.ok) throw new Error('Failed to fetch schedule');
    return response.json();
  },

  create: async (studentId: number, scheduleData: CreateScheduleDTO): Promise<ScheduleEntry> => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': studentId.toString(),
      },
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) throw new Error('Failed to create schedule entry');
    return response.json();
  },

  update: async (
    studentId: number,
    scheduleId: number,
    scheduleData: Partial<CreateScheduleDTO>,
  ): Promise<ScheduleEntry> => {
    const response = await fetch(`${API_URL}/${scheduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-student-id': studentId.toString(),
      },
      body: JSON.stringify(scheduleData),
    });

    if (!response.ok) throw new Error('Failed to update schedule entry');
    return response.json();
  },

  delete: async (studentId: number, scheduleId: number): Promise<void> => {
    const response = await fetch(`${API_URL}/${scheduleId}`, {
      method: 'DELETE',
      headers: {
        'x-student-id': studentId.toString(),
      },
    });

    if (!response.ok) throw new Error('Failed to delete schedule entry');
  },
};
