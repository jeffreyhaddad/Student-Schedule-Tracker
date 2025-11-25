import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { useSchedule } from '../hooks/useSchedule';
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();
  const { entries, loading: entriesLoading } = useSchedule();

  const todaySchedule = entries.filter((e) => {
    const today = new Date().getDay();
    return e.weekday === today && e.isActive;
  });

  const upcomingTasks = tasks.filter((t) => t.status !== 'completed').slice(0, 5);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.firstName}! 👋</h1>
        <p>Here's your overview for today</p>
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
    </div>
  );
}
