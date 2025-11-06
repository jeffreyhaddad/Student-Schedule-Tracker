/**
 * TaskDTO
 *
 * DTO used to serialize Task entities to clients. Fields mirror the tasks
 * table: id, student_id, title, description, status, due_at, priority, category,
 * created_at, updated_at
 */
export class TaskDTO {
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

    static fromEntity(entity) {
        return new TaskDTO(entity);
    }
}