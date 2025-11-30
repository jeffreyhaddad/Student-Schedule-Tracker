import { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import './SchedulePage.css';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SchedulePage() {
  const { entries, loading, createEntry, updateEntry, deleteEntry } = useSchedule();
  const [showForm, setShowForm] = useState(false);
  const [inlineEditingId, setInlineEditingId] = useState<number | null>(null);
  const [inlineEditingField, setInlineEditingField] = useState<string | null>(null);
  const [inlineEditValue, setInlineEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copyingEntryId, setCopyingEntryId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    weekday: 0,
    startTime: '09:00',
    endTime: '10:00',
    subject: '',
    location: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setError(null);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startInlineEdit = (entry: any, field: string) => {
    setInlineEditingId(entry.id);
    setInlineEditingField(field);
    setInlineEditValue(entry[field] || '');
  };

  const saveInlineEdit = async () => {
    if (inlineEditingId && inlineEditingField && inlineEditValue !== '') {
      try {
        await updateEntry(inlineEditingId, {
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

  const saveTimeEdit = async (field: 'startTime' | 'endTime') => {
    if (inlineEditingId && inlineEditValue !== '') {
      try {
        // Ensure time format is HH:MM
        const formattedTime = formatTimeForInput(inlineEditValue);
        await updateEntry(inlineEditingId, {
          [field]: formattedTime,
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

    // Validate times
    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
      return;
    }

    try {
      const submitData = {
        ...formData,
        weekday: parseInt(formData.weekday as unknown as string),
        startTime: formatTimeForInput(formData.startTime),
        endTime: formatTimeForInput(formData.endTime),
      };

      await createEntry(submitData);
      setFormData({
        weekday: 0,
        startTime: '09:00',
        endTime: '10:00',
        subject: '',
        location: '',
        notes: '',
      });
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save schedule entry');
    }
  };

  const formatTimeForInput = (time: string): string => {
    // Ensure time is in HH:MM format
    if (!time) return '09:00';
    const parts = time.split(':');
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
    }
    return time;
  };

  const handleDuplicate = (entry: any) => {
    setCopyingEntryId(entry.id);
  };

  const copyToDay = async (entry: any, targetDay: number) => {
    try {
      await createEntry({
        weekday: targetDay,
        startTime: formatTimeForInput(entry.startTime),
        endTime: formatTimeForInput(entry.endTime),
        subject: entry.subject,
        location: entry.location || '',
        notes: entry.notes || '',
      });
      setCopyingEntryId(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to copy class');
    }
  };

  const handleDelete = async (entryId: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteEntry(entryId);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to delete schedule entry');
      }
    }
  };

  const scheduleByDay = DAYS.reduce(
    (acc, _day, index) => {
      acc[index] = entries
        .filter((e) => e.weekday === index)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      return acc;
    },
    {} as Record<number, typeof entries>,
  );

  return (
    <div className="schedule-page">
      <div className="schedule-header">
        <h1>📅 Weekly Schedule</h1>
        <button className="btn btn-primary" onClick={() => {
          setFormData({
            weekday: 0,
            startTime: '09:00',
            endTime: '10:00',
            subject: '',
            location: '',
            notes: '',
          });
          setError(null);
          setShowForm(!showForm);
        }}>
          {showForm ? 'Cancel' : '+ Add Class'}
        </button>
      </div>

      {showForm && (
        <form className="schedule-form" onSubmit={handleSubmit}>
          {error && <div className="error-alert">{error}</div>}

          <div className="form-title">
            ➕ Add New Class
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="weekday">Day</label>
              <select id="weekday" name="weekday" value={formData.weekday} onChange={handleChange}>
                {DAYS.map((day, index) => (
                  <option key={index} value={index}>
                    {day}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="e.g., Mathematics"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Room 101"
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <input
                type="text"
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes"
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn btn-primary">
              Add to Schedule
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowForm(false);
                setError(null);
                setFormData({
                  weekday: 0,
                  startTime: '09:00',
                  endTime: '10:00',
                  subject: '',
                  location: '',
                  notes: '',
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="schedule-grid">
        {error && <div className="error-alert" style={{ gridColumn: '1 / -1', marginBottom: '20px' }}>{error}</div>}

        {loading ? (
          <p>Loading schedule...</p>
        ) : (
          DAYS.map((day, index) => (
            <div key={index} className="day-column">
              <h3 className="day-header">{day}</h3>
              <div className="entries">
                {scheduleByDay[index]?.length === 0 ? (
                  <p className="no-entries">No classes</p>
                ) : (
                  scheduleByDay[index]?.map((entry) => (
                    <div
                      key={entry.id}
                      className="entry-card"
                    >
                      <div className="entry-header">
                        <div>
                          <div className="entry-time-container">
                            {inlineEditingId === entry.id && inlineEditingField === 'startTime' ? (
                              <input
                                type="time"
                                value={inlineEditValue}
                                onChange={(e) => setInlineEditValue(e.target.value)}
                                onBlur={() => saveTimeEdit('startTime')}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveTimeEdit('startTime');
                                  if (e.key === 'Escape') cancelInlineEdit();
                                }}
                                autoFocus
                                className="inline-edit-time"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span
                                className="entry-time editable-field"
                                onClick={() => startInlineEdit(entry, 'startTime')}
                              >
                                {entry.startTime}
                              </span>
                            )}
                            <span> - </span>
                            {inlineEditingId === entry.id && inlineEditingField === 'endTime' ? (
                              <input
                                type="time"
                                value={inlineEditValue}
                                onChange={(e) => setInlineEditValue(e.target.value)}
                                onBlur={() => saveTimeEdit('endTime')}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveTimeEdit('endTime');
                                  if (e.key === 'Escape') cancelInlineEdit();
                                }}
                                autoFocus
                                className="inline-edit-time"
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span
                                className="entry-time editable-field"
                                onClick={() => startInlineEdit(entry, 'endTime')}
                              >
                                {entry.endTime}
                              </span>
                            )}
                          </div>
                          {inlineEditingId === entry.id && inlineEditingField === 'subject' ? (
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
                                className="inline-edit-input-small"
                              />
                            </div>
                          ) : (
                            <div className="entry-subject editable-field" onClick={() => startInlineEdit(entry, 'subject')}>
                              {entry.subject}
                            </div>
                          )}
                        </div>
                        <div className="entry-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="btn-duplicate"
                            onClick={() => handleDuplicate(entry)}
                            title="Duplicate to another day"
                          >
                            📋
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(entry.id)}
                            title="Delete class"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      {inlineEditingId === entry.id && inlineEditingField === 'location' ? (
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
                            className="inline-edit-input-small"
                          />
                        </div>
                      ) : entry.location ? (
                        <div className="entry-location editable-field" onClick={() => startInlineEdit(entry, 'location')}>
                          📍 {entry.location}
                        </div>
                      ) : null}
                      {inlineEditingId === entry.id && inlineEditingField === 'notes' ? (
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
                            className="inline-edit-input-small"
                          />
                        </div>
                      ) : entry.notes ? (
                        <div className="entry-notes editable-field" onClick={() => startInlineEdit(entry, 'notes')}>
                          {entry.notes}
                        </div>
                      ) : null}
                      {copyingEntryId === entry.id && (
                        <div className="day-selector-popup" onClick={(e) => e.stopPropagation()}>
                          <div className="day-selector-title">Copy to:</div>
                          <div className="day-selector-buttons">
                            {DAYS.map((day, index) => (
                              <button
                                key={index}
                                className={`day-button ${index === entry.weekday ? 'current' : ''}`}
                                onClick={() => copyToDay(entry, index)}
                                disabled={index === entry.weekday}
                                title={index === entry.weekday ? 'Current day' : `Copy to ${day}`}
                              >
                                {day.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                          <button
                            className="close-selector"
                            onClick={() => setCopyingEntryId(null)}
                            title="Close"
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
