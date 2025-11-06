/**
 * StudentCard Component
 * 
 * Reusable card component for displaying a student
 */

import React from 'react';
import './StudentCard.css';

export function StudentCard({ student, onEdit, onDelete, onView }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <div className="student-card">
            <div className="student-card-header">
                <div className="student-avatar">
                    {student.first_name?.[0]}{student.last_name?.[0]}
                </div>
                <div className="student-info">
                    <h3 className="student-name">
                        {student.first_name} {student.last_name}
                    </h3>
                    <p className="student-username">@{student.username}</p>
                </div>
            </div>

            <div className="student-card-body">
                <div className="student-detail">
                    <span className="label">Email:</span>
                    <span className="value">{student.email}</span>
                </div>
                <div className="student-detail">
                    <span className="label">Member since:</span>
                    <span className="value">{formatDate(student.created_at)}</span>
                </div>
            </div>

            <div className="student-card-actions">
                {onView && (
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onView(student)}
                    >
                        View
                    </button>
                )}

                {onEdit && (
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => onEdit(student)}
                    >
                        Edit
                    </button>
                )}

                {onDelete && (
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(student.id)}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

export default StudentCard;
