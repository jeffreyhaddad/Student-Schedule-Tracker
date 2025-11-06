/**
 * TaskForm Component
 * 
 * Form for creating/editing tasks
 */

import React, { useState, useEffect } from 'react';
import './TaskForm.css';

export function TaskForm({ task, onSubmit, onCancel, loading }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_at: '',
        status: 'pending',
        priority: 'normal',
        category: ''
    });

    useEffect(() => {
        if (task) {
            setFormData({
                title: task.title || '',
                description: task.description || '',
                due_at: task.due_at ? task.due_at.split('T')[0] : '',
                status: task.status || 'pending',
                priority: task.priority || 'normal',
                category: task.category || ''
            });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert date to timestamp if provided
        const submitData = {
            ...formData,
            due_at: formData.due_at ? new Date(formData.due_at).toISOString() : null
        };

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    disabled={loading}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="status">Status *</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority *</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input
                        type="text"
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="e.g., Homework, Project"
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="due_at">Due Date</label>
                    <input
                        type="date"
                        id="due_at"
                        name="due_at"
                        value={formData.due_at}
                        onChange={handleChange}
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : (task ? 'Update Task' : 'Create Task')}
                </button>
            </div>
        </form>
    );
}

export default TaskForm;
