import { pool } from '../../config/db.js';
import { Student } from '../entities/Student.js';

/**
 * StudentRepository
 *
 * Repository responsible for persistence operations against the `students`
 * table. Methods return Entity instances (Student) or primitives (boolean).
 *
 * Public methods:
 * - create(data): Promise<Student>
 * - update(id, data): Promise<Student|null>
 * - findAll(): Promise<Student[]>
 * - findById(id): Promise<Student|null>
 * - delete(id): Promise<boolean>
 */
export class StudentRepository {
    /**
     * Insert a new student and return the Student entity.
     */
    async create({ first_name, last_name, username, email, password_hash }) {
        const sql = `INSERT INTO students (first_name, last_name, username, email, password_hash)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING id, first_name, last_name, username, email, created_at, updated_at`;
        const { rows } = await pool.query(sql, [first_name, last_name, username, email, password_hash]);
        return new Student(rows[0]);
    }

    /**
     * Update an existing student by id. Returns Student entity or null.
     */
    async update(id, { first_name, last_name, username, email }) {
        const sql = `UPDATE students
                    SET first_name = $1, last_name = $2, username = $3, email = $4
                    WHERE id = $5
                    RETURNING id, first_name, last_name, username, email, created_at, updated_at`;
        const { rows } = await pool.query(sql, [first_name, last_name, username, email, id]);
        return rows[0] ? new Student(rows[0]) : null;
    }

    /**
     * Return all students as Entity instances.
     */
    async findAll() {
        const sql = `SELECT id, first_name, last_name, username, email, created_at, updated_at 
                    FROM students ORDER BY id`;
        const { rows } = await pool.query(sql);
        return rows.map(row => new Student(row));
    }

    /**
     * Find a student by id or return null.
     */
    async findById(id) {
        const sql = `SELECT id, first_name, last_name, username, email, created_at, updated_at 
                    FROM students WHERE id = $1
                    ORDER BY id`;
        const { rows } = await pool.query(sql, [id]);
        return rows[0] ? new Student(rows[0]) : null;
    }

    /**
     * Delete a student by id. Returns true when a row was removed.
     */
    async delete(id) {
        const { rowCount } = await pool.query('DELETE FROM students WHERE id = $1', [id]);
        return rowCount > 0;
    }

    /**
     * Find a student by username (includes password_hash for auth).
     */
    async findByUsername(username) {
        const sql = `SELECT id, first_name, last_name, username, email, password_hash, created_at, updated_at 
                    FROM students WHERE username = $1`;
        const { rows } = await pool.query(sql, [username]);
        return rows[0] ? new Student(rows[0]) : null;
    }

    /**
     * Find a student by email (includes password_hash for auth).
     */
    async findByEmail(email) {
        const sql = `SELECT id, first_name, last_name, username, email, password_hash, created_at, updated_at 
                    FROM students WHERE email = $1`;
        const { rows } = await pool.query(sql, [email]);
        return rows[0] ? new Student(rows[0]) : null;
    }
}
