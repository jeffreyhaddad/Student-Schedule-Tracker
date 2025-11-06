/**
 * ScheduleEntry Entity
 *
 * Domain model for schedule_entries. Fields are snake_case and match the
 * database column names so repository rows can be passed through.
 */
export class ScheduleEntry {
    constructor({ id, student_id, weekday, start_time, end_time, subject, location, notes, is_active, created_at, updated_at }) {
        this.id = id;
        this.student_id = student_id;
        this.weekday = weekday;
        this.start_time = start_time;
        this.end_time = end_time;
        this.subject = subject;
        this.location = location;
        this.notes = notes;
        this.is_active = is_active;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
