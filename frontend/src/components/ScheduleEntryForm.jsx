/**
 * ScheduleEntryForm Component
 * 
 * Form for creating/editing schedule entries
 */

import React, { useState, useEffect } from 'react';
import './ScheduleEntryForm.css';

export function ScheduleEntryForm({ entry, onSubmit, onCancel, loading }) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const [formData, setFormData] = useState({
        weekday: 1, // Default to Monday
        start_time: '09:00',
        end_time: '10:00',
        subject: '',
        location: '',
        notes: '',
        is_active: true
    });

    useEffect(() => {
        if (entry) {
            setFormData({
                weekday: entry.weekday || 1,
                start_time: entry.start_time ? entry.start_time.substring(0, 5) : '09:00',
                end_time: entry.end_time ? entry.end_time.substring(0, 5) : '10:00',
                subject: entry.subject || '',
                location: entry.location || '',
                notes: entry.notes || '',
                is_active: entry.is_active !== undefined ? entry.is_active : true
            });
        }
    }, [entry]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name === 'weekday' ? parseInt(value) : value)
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Convert time to HH:MM:SS format
        const submitData = {
            ...formData,
            start_time: `${formData.start_time}:00`,
            end_time: `${formData.end_time}:00`
        };

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="schedule-entry-form">
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="weekday">Day of Week *</label>
                    <select
                        id="weekday"
                        name="weekday"
                        value={formData.weekday}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        {weekdays.map((day, index) => (
                            <option key={index} value={index}>{day}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g., Mathematics"
                        required
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="start_time">Start Time *</label>
                    <input
                        type="time"
                        id="start_time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="end_time">End Time *</label>
                    <input
                        type="time"
                        id="end_time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Room 101, Building A"
                    disabled={loading}
                />
            </div>

            <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Additional notes..."
                    disabled={loading}
                />
            </div>

            <div className="form-group-checkbox">
                <label>
                    <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <span>Active</span>
                </label>
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
                    {loading ? 'Saving...' : (entry ? 'Update Entry' : 'Create Entry')}
                </button>
            </div>
        </form>
    );
}

export default ScheduleEntryForm;
