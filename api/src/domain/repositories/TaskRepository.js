import { pool } from '../../config/db.js';
import { Task } from '../entities/Task.js';

/**
 * TaskRepository
 *
 * Persistence layer for tasks. Returns Task entities or boolean success flags.
 *
 * Public methods:
 * - findAll(): Promise<Task[]>
 * - findById(id): Promise<Task|null>
 * - create(data): Promise<Task|null>
 * - update(id, data): Promise<Task|null>
 * - delete(id): Promise<boolean>
 */
export class TaskRepository {
    /**
     * Return all tasks.
     */
    async findAll() {
        const sql = `SELECT id, student_id, title, description, status, due_at, priority, category, created_at, updated_at 
                    FROM tasks ORDER BY id`;
        const { rows } = await pool.query(sql);
        return rows.map(row => new Task(row));
    }

    /**
     * Find a task by id.
     */
    async findById(id) {
        const sql = `SELECT id, student_id, title, description, status, due_at, priority, category, created_at, updated_at 
                    FROM tasks WHERE id = $1
                    ORDER BY id`;
        const { rows } = await pool.query(sql, [id]);
        return rows.length ? new Task(rows[0]) : null;
    }

    /**
     * Find all tasks for a specific student.
     */
    async findByStudentId(student_id) {
        const sql = `SELECT id, student_id, title, description, status, due_at, priority, category, created_at, updated_at 
                    FROM tasks WHERE student_id = $1 ORDER BY due_at, id`;
        const { rows } = await pool.query(sql, [student_id]);
        return rows.map(row => new Task(row));
    }

    /**
     * Create a new task and return the Task entity.
     */
    async create({ student_id, title, description, status, due_at, priority, category }) {
        const sql = `INSERT INTO tasks (student_id, title, description, status, due_at, priority, category)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                    RETURNING id, student_id, title, description, status, due_at, priority, category, created_at, updated_at`;
        const { rows } = await pool.query(sql, [student_id, title, description, status, due_at, priority, category]);
        return rows.length ? new Task(rows[0]) : null;
    }

    /**
     * Update an existing task. Returns Task entity or null.
     */
    async update(id, { student_id, title, description, status, due_at, priority, category }) {
        const sql = `UPDATE tasks
                    SET student_id = $1, title = $2, description = $3, status = $4, due_at = $5, priority = $6, category = $7
                    WHERE id = $8
                    RETURNING id, student_id, title, description, status, due_at, priority, category, created_at, updated_at`;
        const { rows } = await pool.query(sql, [student_id, title, description, status, due_at, priority, category, id]);
        return rows.length ? new Task(rows[0]) : null;
    }

    /**
     * Delete a task by id. Returns true when a row was removed.
     */
    async delete(id) {
        const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        return rowCount > 0;
    }
}