/**
 * Tasks Page
 * 
 * Full CRUD page for tasks using TaskCard components
 */

import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import './TasksPage.css';

export function TasksPage() {
    const {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        deleteTask,
        searchTasks,
        clearError
    } = useTasks();

    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(taskId);
            } catch (error) {
                // Error handled by hook
            }
        }
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            searchTasks(query);
        } else {
            // Reset to all tasks without page reload
            tasks.length > 0 && setSearchQuery('');
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            await createTask(taskData);
            setShowForm(false);
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleUpdateTask = async (taskData) => {
        try {
            await updateTask(editingTask.id, taskData);
            setEditingTask(null);
            setShowForm(false);
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    const handleMarkAllComplete = async () => {
        // Filter tasks that are NOT already completed
        const pendingTasks = tasks.filter(task => task.status !== 'completed');
        
        if (pendingTasks.length === 0) {
            alert('All tasks are already completed!');
            return;
        }

        if (window.confirm(`Mark ${pendingTasks.length} task(s) as completed?`)) {
            try {
                // Update each pending task to completed
                for (const task of pendingTasks) {
                    await updateTask(task.id, { ...task, status: 'completed' });
                }
            } catch (error) {
                // Error handled by hook
            }
        }
    };

    return (
        <div className="tasks-page">
            <div className="page-header">
                <h1>📋 Task Management</h1>
                <div className="header-actions">
                    <button
                        className="btn btn-success"
                        onClick={handleMarkAllComplete}
                        disabled={loading || tasks.length === 0}
                    >
                        ✓ Mark All Complete
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        Add New Task
                    </button>
                </div>
            </div>

            {error && (
                <div className="alert alert-danger">
                    <p>{error}</p>
                    <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={clearError}
                    >
                        Dismiss
                    </button>
                </div>
            )}

            <div className="search-section">
                <input
                    type="text"
                    placeholder="Search tasks by title or description..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="search-input"
                />
            </div>

            {showForm && (
                <div className="form-section">
                    <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
                    <TaskForm
                        task={editingTask}
                        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                        onCancel={handleCancelForm}
                        loading={loading}
                    />
                </div>
            )}

            <div className="tasks-section">
                <h2>All Tasks ({tasks.length})</h2>

                {loading && (
                    <div className="loading">
                        <p>Loading tasks...</p>
                    </div>
                )}

                {!loading && tasks.length === 0 && (
                    <div className="no-tasks">
                        <p>No tasks found. Add your first task!</p>
                    </div>
                )}

                {!loading && tasks.length > 0 && (
                    <div className="tasks-grid">
                        {tasks.map(task => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TasksPage;
