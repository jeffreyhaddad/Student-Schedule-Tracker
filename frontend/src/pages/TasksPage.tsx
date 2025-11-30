import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import './TasksPage.css';

export default function TasksPage() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();
  const [showForm, setShowForm] = useState(false);
  const [inlineEditingId, setInlineEditingId] = useState<number | null>(null);
  const [inlineEditingField, setInlineEditingField] = useState<string | null>(null);
  const [inlineEditValue, setInlineEditValue] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueAt: '',
    priority: 'normal',
    category: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueAt: '',
      priority: 'normal',
      category: '',
    });
    setShowForm(false);
    setError(null);
  };

  const startInlineEdit = (task: any, field: string) => {
    setInlineEditingId(task.id);
    setInlineEditingField(field);
    setInlineEditValue(task[field] || '');
    setError(null);
  };

  const saveInlineEdit = async () => {
    if (inlineEditingId && inlineEditingField && inlineEditValue !== '') {
      try {
        await updateTask(inlineEditingId, {
          [inlineEditingField]: inlineEditValue,
        });
        setInlineEditingId(null);
        setInlineEditingField(null);
        setInlineEditValue('');
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save changes');
      }
    }
  };

  const cancelInlineEdit = () => {
    setInlineEditingId(null);
    setInlineEditingField(null);
    setInlineEditValue('');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await createTask(formData);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    }
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteTask(taskId);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (task: any) => {
    const statuses = ['pending', 'in-progress', 'completed'];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      await updateTask(task.id, {
        status: nextStatus,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task status');
    }
  };

  const handlePriorityChange = async (task: any) => {
    const priorities = ['low', 'normal', 'high'];
    const currentIndex = priorities.indexOf(task.priority);
    const nextPriority = priorities[(currentIndex + 1) % priorities.length];

    try {
      await updateTask(task.id, {
        priority: nextPriority,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task priority');
    }
  };

  const location = useLocation();

  // Scroll and highlight a task if `?id=<taskId>` is present in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (!id) return;
    const el = document.getElementById(`task-${id}`);
    if (el) {
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight');
        setTimeout(() => el.classList.remove('highlight'), 3000);
      } catch (err) {
        // ignore
      }
    }
  }, [location.search, tasks]);

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>📋 My Tasks</h1>
        <button className="btn btn-primary" onClick={() => {
          resetForm();
          setShowForm(!showForm);
        }}>
          {showForm ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {showForm && (
        <form className="task-form" onSubmit={handleSubmit}>
          {error && <div className="error-alert">{error}</div>}

          <div className="form-title">
            ➕ Create New Task
          </div>

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

          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              Create Task
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="tasks-list">
        {error && <div className="error-alert" style={{ marginBottom: '20px' }}>{error}</div>}

        {loading ? (
          <p>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p>No tasks yet. Create one to get started!</p>
        ) : (
          tasks.map((task) => (
            <div
              id={`task-${task.id}`}
              key={task.id}
              className="task-card"
            >
              <div className="task-header">
                {inlineEditingId === task.id && inlineEditingField === 'title' ? (
                  <div className="inline-edit-container" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={inlineEditValue}
                      onChange={(e) => setInlineEditValue(e.target.value)}
                      onBlur={saveInlineEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveInlineEdit();
                        if (e.key === 'Escape') cancelInlineEdit();
                      }}
                      autoFocus
                      className="inline-edit-input"
                    />
                  </div>
                ) : (
                  <h3 onClick={() => startInlineEdit(task, 'title')} className="editable-field">
                    {task.title}
                  </h3>
                )}
                <div className="task-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(task.id)}
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {inlineEditingId === task.id && inlineEditingField === 'description' ? (
                <div className="inline-edit-container" onClick={(e) => e.stopPropagation()}>
                  <textarea
                    value={inlineEditValue}
                    onChange={(e) => setInlineEditValue(e.target.value)}
                    onBlur={saveInlineEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) saveInlineEdit();
                      if (e.key === 'Escape') cancelInlineEdit();
                    }}
                    autoFocus
                    className="inline-edit-textarea"
                    rows={2}
                  />
                </div>
              ) : task.description ? (
                <p className="task-description editable-field" onClick={() => startInlineEdit(task, 'description')}>
                  {task.description}
                </p>
              ) : (
                <p className="task-description placeholder editable-field" onClick={() => startInlineEdit(task, 'description')}>
                  Click to add description...
                </p>
              )}

              <div className="task-footer">
                <div className="task-badges">
                  <button
                    className={`badge status-${task.status} status-badge`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(task);
                    }}
                    title="Click to change status"
                  >
                    {task.status}
                  </button>
                  <button
                    className={`badge priority-${task.priority} status-badge`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePriorityChange(task);
                    }}
                    title="Click to change priority"
                  >
                    {task.priority}
                  </button>
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