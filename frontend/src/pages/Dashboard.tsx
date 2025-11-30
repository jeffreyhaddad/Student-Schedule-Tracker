import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useSchedule } from '../hooks/useSchedule';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();
  const { entries, loading: entriesLoading } = useSchedule();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const todaySchedule = entries.filter((e) => {
    const today = new Date().getDay();
    return e.weekday === today && e.isActive;
  });

  const upcomingTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 5);

  // Statistics
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in-progress').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Search functionality
  const searchResults = searchQuery.trim() ? {
    tasks: tasks.filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    schedules: entries.filter((e) =>
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.notes?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  } : { tasks: [], schedules: [] };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>Welcome back, {user?.firstName}! 👋</h1>
            <p>Here's your overview for today</p>
          </div>
          <div className="header-date">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search tasks and classes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchResults(e.target.value.trim().length > 0);
            }}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            onFocus={() => setShowSearchResults(searchQuery.trim().length > 0)}
            className="search-input"
          />
        </div>
      </div>

      {showSearchResults && searchQuery.trim() && (
        <div className="search-results-section">
          <h2>Search Results for "{searchQuery}"</h2>

          {searchResults.tasks.length === 0 && searchResults.schedules.length === 0 ? (
            <p className="no-results">No tasks or classes match your search</p>
          ) : (
            <>
              {searchResults.tasks.length > 0 && (
                <div className="search-result-group">
                  <h3>📋 Tasks ({searchResults.tasks.length})</h3>
                  <div className="task-list">
                    {searchResults.tasks.map((task) => (
                      <div key={task.id} className="task-item">
                        <div className="task-info">
                          <div className="task-title">{task.title}</div>
                          {task.description && <div className="task-description">{task.description}</div>}
                          <div className="task-meta">
                            <span className={`badge status-${task.status}`}>{task.status}</span>
                            <span className={`badge priority-${task.priority}`}>{task.priority}</span>
                            {task.category && <span className="badge">{task.category}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.schedules.length > 0 && (
                <div className="search-result-group">
                  <h3>📅 Classes ({searchResults.schedules.length})</h3>
                  <div className="schedule-list">
                    {searchResults.schedules.map((entry) => (
                      <div key={entry.id} className="schedule-item">
                        <div className="time">
                          {entry.startTime} - {entry.endTime}
                        </div>
                        <div className="subject">{entry.subject}</div>
                        {entry.location && <div className="location">📍 {entry.location}</div>}
                        {entry.notes && <div className="notes">📝 {entry.notes}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!showSearchResults && (
        <>
          <div className="stats-grid">
            <div className="stat-card completed">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <div className="stat-label">Completed</div>
                <div className="stat-value">{completedTasks}</div>
              </div>
            </div>
            <div className="stat-card pending">
              <div className="stat-icon">⏳</div>
              <div className="stat-content">
                <div className="stat-label">Pending</div>
                <div className="stat-value">{pendingTasks}</div>
              </div>
            </div>
            <div className="stat-card in-progress">
              <div className="stat-icon">🔄</div>
              <div className="stat-content">
                <div className="stat-label">In Progress</div>
                <div className="stat-value">{inProgressTasks}</div>
              </div>
            </div>
            <div className="stat-card completion">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <div className="stat-label">Completion Rate</div>
                <div className="stat-value">{completionRate}%</div>
              </div>
            </div>
          </div>

          <div className="dashboard-sections">
            <div className="section">
              <h2>📅 Today's Schedule</h2>
              {entriesLoading ? (
                <p>Loading schedule...</p>
              ) : todaySchedule.length === 0 ? (
                <p>No schedule for today</p>
              ) : (
                <div className="schedule-list">
                  {todaySchedule.map((entry) => (
                    <div key={entry.id} className="schedule-item">
                      <div className="time">
                        {entry.startTime} - {entry.endTime}
                      </div>
                      <div className="subject">{entry.subject}</div>
                      {entry.location && <div className="location">📍 {entry.location}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="section">
              <h2>📋 Upcoming Tasks</h2>
              {tasksLoading ? (
                <p>Loading tasks...</p>
              ) : upcomingTasks.length === 0 ? (
                <p>No pending tasks</p>
              ) : (
                <div className="task-list">
                  {upcomingTasks.map((task) => (
                    <div key={task.id} className="task-item">
                      <div className="task-info">
                        <div className="task-title">{task.title}</div>
                        <div className="task-meta">
                          <span className={`badge status-${task.status}`}>{task.status}</span>
                          <span className={`badge priority-${task.priority}`}>{task.priority}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
