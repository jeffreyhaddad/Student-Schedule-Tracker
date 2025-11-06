/**
 * Schedule Page
 * 
 * Full CRUD page for schedule entries using ScheduleCard components
 */

import React, { useState } from 'react';
import { useScheduleEntries } from '../hooks/useScheduleEntries';
import { ScheduleCard } from '../components/ScheduleCard';
import { ScheduleEntryForm } from '../components/ScheduleEntryForm';
import './SchedulePage.css';

export function SchedulePage() {
    const {
        entries,
        loading,
        error,
        createEntry,
        updateEntry,
        deleteEntry,
        searchEntries,
        getByWeekday,
        clearError
    } = useScheduleEntries();

    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [selectedDay, setSelectedDay] = useState('all');

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const handleDeleteEntry = async (entryId) => {
        if (window.confirm('Are you sure you want to delete this schedule entry?')) {
            try {
                await deleteEntry(entryId);
            } catch (error) {
                // Error handled by hook
            }
        }
    };

    const handleEditEntry = (entry) => {
        setEditingEntry(entry);
        setShowForm(true);
    };

    const handleCreateEntry = async (entryData) => {
        try {
            await createEntry(entryData);
            setShowForm(false);
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleUpdateEntry = async (entryData) => {
        try {
            await updateEntry(editingEntry.id, entryData);
            setEditingEntry(null);
            setShowForm(false);
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingEntry(null);
    };

    const handleDayFilter = (day) => {
        setSelectedDay(day);
        // No page reload needed - state update triggers re-render
        if (day !== 'all') {
            getByWeekday(parseInt(day));
        }
    };

    // Group entries by weekday
    const entriesByDay = entries.reduce((acc, entry) => {
        if (!acc[entry.weekday]) {
            acc[entry.weekday] = [];
        }
        acc[entry.weekday].push(entry);
        return acc;
    }, {});

    return (
        <div className="schedule-page">
            <div className="page-header">
                <h1>📅 Schedule Management</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    Add New Entry
                </button>
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

            {showForm && (
                <div className="form-section">
                    <h2>{editingEntry ? 'Edit Schedule Entry' : 'Add New Schedule Entry'}</h2>
                    <ScheduleEntryForm
                        entry={editingEntry}
                        onSubmit={editingEntry ? handleUpdateEntry : handleCreateEntry}
                        onCancel={handleCancelForm}
                        loading={loading}
                    />
                </div>
            )}

            <div className="filter-section">
                <label>Filter by day:</label>
                <select
                    value={selectedDay}
                    onChange={(e) => handleDayFilter(e.target.value)}
                    className="day-select"
                >
                    <option value="all">All Days</option>
                    {weekdays.map((day, index) => (
                        <option key={index} value={index}>{day}</option>
                    ))}
                </select>
            </div>

            <div className="schedule-section">
                <h2>Weekly Schedule ({entries.length} entries)</h2>

                {loading && (
                    <div className="loading">
                        <p>Loading schedule...</p>
                    </div>
                )}

                {!loading && entries.length === 0 && (
                    <div className="no-entries">
                        <p>No schedule entries found. Add your first entry!</p>
                    </div>
                )}

                {!loading && entries.length > 0 && selectedDay === 'all' && (
                    <div className="schedule-by-day">
                        {weekdays.map((day, dayIndex) => (
                            entriesByDay[dayIndex] && entriesByDay[dayIndex].length > 0 && (
                                <div key={dayIndex} className="day-section">
                                    <h3 className="day-header">{day}</h3>
                                    <div className="schedule-grid">
                                        {entriesByDay[dayIndex].map(entry => (
                                            <ScheduleCard
                                                key={entry.id}
                                                entry={entry}
                                                onEdit={handleEditEntry}
                                                onDelete={handleDeleteEntry}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}

                {!loading && entries.length > 0 && selectedDay !== 'all' && (
                    <div className="schedule-grid">
                        {entries.map(entry => (
                            <ScheduleCard
                                key={entry.id}
                                entry={entry}
                                onEdit={handleEditEntry}
                                onDelete={handleDeleteEntry}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SchedulePage;
