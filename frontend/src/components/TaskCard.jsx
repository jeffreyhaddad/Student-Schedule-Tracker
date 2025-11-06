/**
 * TaskCard Component
 * 
 * Reusable card component for displaying a task
 */

import React from 'react';
import './TaskCard.css';

export function TaskCard({ task, onEdit, onDelete, onView }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="task-card">
            <div className="task-card-header">
                <h3 className="task-card-title">{task.title}</h3>
                <div className="task-badges">
                    <span className={`badge status-${task.status}`}>
                        {task.status}
                    </span>
                    <span className={`badge priority-${task.priority}`}>
                        {task.priority}
                    </span>
                </div>
            </div>

            <div className="task-card-body">
                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}

                <div className="task-meta">
                    {task.category && (
                        <div className="task-meta-item">
                            <span className="label">Category:</span>
                            <span className="value">{task.category}</span>
                        </div>
                    )}
                    <div className="task-meta-item">
                        <span className="label">Due:</span>
                        <span className="value">{formatDate(task.due_at)}</span>
                    </div>
                </div>
            </div>

            <div className="task-card-actions">
                {onView && (
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onView(task)}
                    >
                        View
                    </button>
                )}

                {onEdit && (
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => onEdit(task)}
                    >
                        Edit
                    </button>
                )}

                {onDelete && (
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(task.id)}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

export default TaskCard;
