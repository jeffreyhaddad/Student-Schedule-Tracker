/**
 * Dashboard Page
 * 
 * Main dashboard showing tasks and schedule overview
 */

import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useScheduleEntries } from '../hooks/useScheduleEntries';
import './Dashboard.css';

export default function Dashboard() {
    const { user } = useAuth();
    const { tasks, loading: tasksLoading } = useTasks();
    const { entries, loading: entriesLoading } = useScheduleEntries();

    const todaySchedule = entries.filter(e => {
        const today = new Date().getDay();
        return e.weekday === today && e.is_active;
    });

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.first_name}! 👋</h1>
                <p>Here's your overview for today</p>
            </div>

            <div className="dashboard-sections">
                <div className="section">
                    <h2>Today's Schedule</h2>
                    {entriesLoading ? (
                        <p>Loading schedule...</p>
                    ) : todaySchedule.length === 0 ? (
                        <p>No schedule for today</p>
                    ) : (
                        <div className="schedule-list">
                            {todaySchedule.map(entry => (
                                <div key={entry.id} className="schedule-item">
                                    <div className="time">{entry.start_time} - {entry.end_time}</div>
                                    <div className="subject">{entry.subject}</div>
                                    {entry.location && <div className="location">📍 {entry.location}</div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="section">
                    <h2>Recent Tasks</h2>
                    {tasksLoading ? (
                        <p>Loading tasks...</p>
                    ) : tasks.length === 0 ? (
                        <p>No tasks yet</p>
                    ) : (
                        <div className="task-list">
                            {tasks.slice(0, 5).map(task => (
                                <div key={task.id} className="task-item">
                                    <div className="task-info">
                                        <div className="task-title">{task.title}</div>
                                        <div className="task-meta">
                                            <span className={`status ${task.status}`}>{task.status}</span>
                                            <span className={`priority ${task.priority}`}>{task.priority}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

