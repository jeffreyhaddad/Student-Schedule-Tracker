import { useState, useEffect } from 'react';
import type { Task } from '../services/tasksService';
import { tasksService } from '../services/tasksService';
import { useAuth } from './useAuth';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = await tasksService.getAll(user.id);
        setTasks(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user?.id]);

  const createTask = async (taskData: any) => {
    const newTask = await tasksService.create(user!.id, taskData);
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = async (taskId: number, taskData: any) => {
    const updated = await tasksService.update(user!.id, taskId, taskData);
    setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));
    return updated;
  };

  const deleteTask = async (taskId: number) => {
    await tasksService.delete(user!.id, taskId);
    setTasks(tasks.filter((t) => t.id !== taskId));
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
  };
}
