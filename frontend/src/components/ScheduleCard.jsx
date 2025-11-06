/**
 * ScheduleCard Component
 * 
 * Reusable card component for displaying a schedule entry
 */

import React from 'react';
import './ScheduleCard.css';

export function ScheduleCard({ entry, onEdit, onDelete, onView }) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
        <div className={`schedule-card ${!entry.is_active ? 'inactive' : ''}`}>
            <div className="schedule-card-header">
                <div className="schedule-day">
                    {weekdays[entry.weekday]}
                </div>
                {!entry.is_active && (
                    <span className="badge-inactive">Inactive</span>
                )}
            </div>

            <div className="schedule-card-body">
                <h3 className="schedule-subject">{entry.subject}</h3>

                <div className="schedule-time">
                    🕐 {entry.start_time} - {entry.end_time}
                </div>

                {entry.location && (
                    <div className="schedule-location">
                        📍 {entry.location}
                    </div>
                )}

                {entry.notes && (
                    <div className="schedule-notes">
                        📝 {entry.notes}
                    </div>
                )}
            </div>

            <div className="schedule-card-actions">
                {onView && (
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onView(entry)}
                    >
                        View
                    </button>
                )}

                {onEdit && (
                    <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => onEdit(entry)}
                    >
                        Edit
                    </button>
                )}

                {onDelete && (
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDelete(entry.id)}
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
}

export default ScheduleCard;
