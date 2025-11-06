import { pool } from '../../config/db.js';
import { ScheduleEntry } from '../entities/ScheduleEntry.js';

/**
 * ScheduleEntryRepository
 *
 * Handles persistence for schedule_entries. Returns ScheduleEntry entities or
 * boolean flags for delete operations.
 *
 * Public methods:
 * - create(data): Promise<ScheduleEntry>
 * - update(id, data): Promise<ScheduleEntry|null>
 * - findAll(): Promise<ScheduleEntry[]>
 * - findById(id): Promise<ScheduleEntry|null>
 * - findByStudentId(student_id): Promise<ScheduleEntry[]>
 * - findByWeekday(weekday): Promise<ScheduleEntry[]>
 * - delete(id): Promise<boolean>
 */
export class ScheduleEntryRepository {
    /**
     * Insert a new schedule entry and return the entity.
     */
    async create({ student_id, weekday, start_time, end_time, subject, location, notes, is_active }) {
        const sql = `INSERT INTO schedule_entries (student_id, weekday, start_time, end_time, subject, location, notes, is_active)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                    RETURNING id, student_id, weekday, start_time, end_time, subject, location, notes, is_active, created_at, updated_at`;
        const { rows } = await pool.query(sql, [student_id, weekday, start_time, end_time, subject, location, notes, is_active ?? true]);
        return new ScheduleEntry(rows[0]);
    }

    /**
     * Update an existing schedule entry. Returns entity or null.
     */
    async update(id, { student_id, weekday, start_time, end_time, subject, location, notes, is_active }) {
        const sql = `UPDATE schedule_entries
                    SET student_id = $1, weekday = $2, start_time = $3, end_time = $4, subject = $5, location = $6, notes = $7, is_active = $8
                    WHERE id = $9
                    RETURNING id, student_id, weekday, start_time, end_time, subject, location, notes, is_active, created_at, updated_at`;
        const { rows } = await pool.query(sql, [student_id, weekday, start_time, end_time, subject, location, notes, is_active, id]);
        return rows[0] ? new ScheduleEntry(rows[0]) : null;
    }

    /**
     * Return all schedule entries ordered by weekday/start_time.
     */
    async findAll() {
        const sql = `SELECT id, student_id, weekday, start_time, end_time, subject, location, notes, is_active, created_at, updated_at 
                    FROM schedule_entries ORDER BY weekday, start_time`;
        const { rows } = await pool.query(sql);
        return rows.map(row => new ScheduleEntry(row));
    }

    /**
     * Find by id or return null.
     */
    async findById(id) {
        const sql = `SELECT id, student_id, weekday, start_time, end_time, subject, location, notes, is_active, created_at, updated_at 
                    FROM schedule_entries WHERE id = $1`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0] ? new ScheduleEntry(rows[0]) : null;
    }

    /**
     * Return schedule entries for a student id.
     */
    async findByStudentId(student_id) {
        const sql = `SELECT id, student_id, weekday, start_time, end_time, subject, location, notes, is_active, created_at, updated_at 
                    FROM schedule_entries WHERE student_id = $1 ORDER BY weekday, start_time`;
        const { rows } = await pool.query(sql, [student_id]);
        return rows.map(row => new ScheduleEntry(row));
    }

    /**
     * Return active schedule entries for a given weekday.
     */
    async findByWeekday(weekday) {
        const sql = `SELECT id, student_id, weekday, start_time, end_time, subject, location, notes, is_active, created_at, updated_at 
                    FROM schedule_entries WHERE weekday = $1 AND is_active = true ORDER BY start_time`;
        const { rows } = await pool.query(sql, [weekday]);
        return rows.map(row => new ScheduleEntry(row));
    }

    /**
     * Delete a schedule entry by id. Returns true when a row was removed.
     */
    async delete(id) {
        const { rowCount } = await pool.query('DELETE FROM schedule_entries WHERE id = $1', [id]);
        return rowCount > 0;
    }
}
