/**
 * Database configuration and helpers
 *
 * Exports:
 * - pool: pg Pool instance for querying the PostgreSQL database
 * - healthCheck(): simple function to validate DB connectivity
 */
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
});

export const healthCheck = async () => {
    const { rows } = await pool.query('SELECT 1 as ok');
    return rows[0].ok === 1;
};