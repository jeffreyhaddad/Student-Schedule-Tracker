import { useState, useEffect } from 'react';
import { tasksService } from '../services/tasksService';
import { useAuth } from './useAuth';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = await tasksService.getAll(user.id);
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user?.id]);

  const createTask = async (taskData) => {
    const newTask = await tasksService.create(user.id, taskData);
    setTasks([...tasks, newTask]);
    return newTask;
  };

  const updateTask = async (taskId, taskData) => {
    const updated = await tasksService.update(user.id, taskId, taskData);
    setTasks(tasks.map(t => t.id === taskId ? updated : t));
    return updated;
  };

  const deleteTask = async (taskId) => {
    await tasksService.delete(user.id, taskId);
    setTasks(tasks.filter(t => t.id !== taskId));
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
