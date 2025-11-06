/**
 * Application entry point (Express app)
 *
 * Exports:
 * - app (Express instance) configured with JSON/body parsing, CORS, sessions, and routes
 *
 * Important routes:
 * - GET /health           -> DB + service health check
 * - /auth                 -> Authentication routes (register, login, profile, logout)
 * - /students             -> Student CRUD routes
 * - /tasks                -> Task CRUD routes
 * - /schedule-entries     -> Schedule entry CRUD routes
 *
 * Middlewares:
 * - Session management    -> in-memory session storage (simple, no JWT)
 * - errorHandler          -> centralized error handling
 */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRoutes } from './routes/authRoutes.js';
import { studentRoutes } from './routes/studentRoutes.js';
import { taskRoutes } from './routes/taskRoutes.js';
import { scheduleEntryRoutes } from './routes/scheduleEntryRoutes.js';
import { healthCheck } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';


dotenv.config();

export const app = express();

// CORS configuration - allow credentials for sessions
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['X-Session-Id'] // Allow frontend to read this custom header
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple in-memory session middleware (no external package needed)
const sessions = new Map(); // Store sessions in memory

app.use((req, res, next) => {
    const sessionId = req.headers['x-session-id'];

    if (sessionId && sessions.has(sessionId)) {
        // Use existing session
        req.sessionId = sessionId;
        req.session = sessions.get(sessionId);
    } else {
        // Create new session
        const newSessionId = Date.now() + Math.random().toString(36);
        req.sessionId = newSessionId;
        req.session = {};
        sessions.set(newSessionId, req.session);
    }

    // Send session ID back to client
    res.setHeader('X-Session-Id', req.sessionId);
    next();
}); app.get('/health', async (req, res) => {
    try {
        res.json({ ok: await healthCheck() })
    } catch (e) {
        res.status(500).json({ ok: false })
    }
});

// Mount routes
app.use('/auth', authRoutes);
app.use('/students', studentRoutes);
app.use('/tasks', taskRoutes);
app.use('/schedule-entries', scheduleEntryRoutes);

app.use(errorHandler);