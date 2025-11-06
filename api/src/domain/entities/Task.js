/**
 * Task Entity
 *
 * Domain model representing a row in the tasks table. Field names use
 * snake_case to match DB column names so repository rows can be passed
 * directly to the constructor.
 */
export class Task {
    constructor({ id, student_id, title, description, status, due_at, priority, category, created_at, updated_at }) {
        this.id = id;
        this.student_id = student_id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.due_at = due_at;
        this.priority = priority;
        this.category = category;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}