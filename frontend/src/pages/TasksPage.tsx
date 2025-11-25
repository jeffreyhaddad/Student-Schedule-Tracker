import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import './TasksPage.css';

export default function TasksPage() {
  const { tasks, loading, createTask, deleteTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueAt: '',
    priority: 'normal',
    category: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createTask(formData);
      setFormData({
        title: '',
        description: '',
        dueAt: '',
        priority: 'normal',
        category: '',
      });
      setShowForm(false);
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>📋 My Tasks</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="What needs to be done?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add more details..."
              rows={3}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dueAt">Due Date</label>
              <input
                type="datetime-local"
                id="dueAt"
                name="dueAt"
                value={formData.dueAt}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Development"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Create Task
          </button>
        </form>
      )}

      <div className="tasks-list">
        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks yet. Create one to get started!</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(task.id)}
                  title="Delete task"
                >
                  ✕
                </button>
              </div>

              {task.description && <p className="task-description">{task.description}</p>}

              <div className="task-footer">
                <div className="task-badges">
                  <span className={`badge status-${task.status}`}>{task.status}</span>
                  <span className={`badge priority-${task.priority}`}>{task.priority}</span>
                  {task.category && <span className="badge category">{task.category}</span>}
                </div>

                {task.dueAt && (
                  <div className="task-due">
                    📅 {new Date(task.dueAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
