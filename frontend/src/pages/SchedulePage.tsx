import { useState } from 'react';
import { useSchedule } from '../hooks/useSchedule';
import './SchedulePage.css';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function SchedulePage() {
  const { entries, loading, createEntry, deleteEntry } = useSchedule();
  const [showForm, setShowForm] = useState(false);
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createEntry({
        ...formData,
        weekday: parseInt(formData.weekday as unknown as string),
      });
      setFormData({
        weekday: 0,
        startTime: '09:00',
        endTime: '10:00',
        subject: '',
        location: '',
        notes: '',
      });
      setShowForm(false);
    } catch (err) {
      alert('Failed to create schedule entry');
    }
  };

  const handleDelete = async (entryId: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteEntry(entryId);
      } catch (err) {
        alert('Failed to delete schedule entry');
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
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Class'}
        </button>
      </div>

      {showForm && (
        <form className="schedule-form" onSubmit={handleSubmit}>
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

          <button type="submit" className="btn btn-primary">
            Add to Schedule
          </button>
        </form>
      )}

      <div className="schedule-grid">
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
                    <div key={entry.id} className="entry-card">
                      <div className="entry-time">
                        {entry.startTime} - {entry.endTime}
                      </div>
                      <div className="entry-subject">{entry.subject}</div>
                      {entry.location && (
                        <div className="entry-location">📍 {entry.location}</div>
                      )}
                      {entry.notes && <div className="entry-notes">{entry.notes}</div>}
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(entry.id)}
                        title="Delete entry"
                      >
                        ✕
                      </button>
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
