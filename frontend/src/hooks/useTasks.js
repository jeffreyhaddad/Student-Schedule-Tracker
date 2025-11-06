/**
 * useTasks Hook
 * 
 * Manages tasks state and CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import { taskService } from '../services/taskService';

export function useTasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all tasks
    const fetchTasks = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await taskService.getAll();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Create task
    const createTask = useCallback(async (taskData) => {
        setLoading(true);
        setError(null);

        try {
            const newTask = await taskService.create(taskData);
            setTasks(prev => [newTask, ...prev]);
            return newTask;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Update task
    const updateTask = useCallback(async (id, taskData) => {
        setLoading(true);
        setError(null);

        try {
            const updatedTask = await taskService.update(id, taskData);
            setTasks(prev => prev.map(task =>
                task.id === id ? updatedTask : task
            ));
            return updatedTask;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Delete task
    const deleteTask = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            await taskService.delete(id);
            setTasks(prev => prev.filter(task => task.id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Search tasks
    const searchTasks = useCallback(async (query) => {
        setLoading(true);
        setError(null);

        try {
            const data = await taskService.search(query);
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Clear error
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    // Load tasks on mount
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    return {
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        searchTasks,
        clearError
    };
}
