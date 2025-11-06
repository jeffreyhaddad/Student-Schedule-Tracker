/**
 * AuthController
 *
 * Handles authentication operations: user registration, login, and profile retrieval.
 * Uses bcrypt for password hashing and session-based authentication.
 */
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { StudentRepository } from '../domain/repositories/StudentRepository.js';
import { StudentDTO } from '../domain/dto/StudentDTO.js';

const studentRepository = new StudentRepository();

export class AuthController {
    /**
     * Register a new student account
     * POST /api/auth/register
     */
    register = async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { first_name, last_name, username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await studentRepository.findByUsername(username);
            if (existingUser) {
                return res.status(409).json({
                    message: 'Username already exists'
                });
            }

            const existingEmail = await studentRepository.findByEmail(email);
            if (existingEmail) {
                return res.status(409).json({
                    message: 'Email already registered'
                });
            }

            // Hash password
            const password_hash = await bcrypt.hash(password, 10);

            // Create user
            const student = await studentRepository.create({
                first_name,
                last_name,
                username,
                email,
                password_hash
            });

            // Store user in session (update existing session object, don't replace)
            req.session.userId = student.id;
            req.session.username = student.username;
            req.session.email = student.email;

            // Return user data (exclude password_hash)
            const studentDTO = StudentDTO.fromEntity(student);

            res.status(201).json({
                message: 'Registration successful',
                user: studentDTO
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Login with username/email and password
     * POST /api/auth/login
     */
    login = async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { username, password } = req.body;

            // Find user by username or email
            let student = await studentRepository.findByUsername(username);
            if (!student) {
                student = await studentRepository.findByEmail(username);
            }

            if (!student) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(password, student.password_hash);
            if (!isValidPassword) {
                return res.status(401).json({
                    message: 'Invalid credentials'
                });
            }

            // Store user in session (update existing session object, don't replace)
            req.session.userId = student.id;
            req.session.username = student.username;
            req.session.email = student.email;

            // Return user data (exclude password_hash)
            const studentDTO = StudentDTO.fromEntity(student); res.json({
                message: 'Login successful',
                user: studentDTO
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get current user profile (protected route)
     * GET /api/auth/profile
     */
    getProfile = async (req, res, next) => {
        try {
            // req.session contains user data
            if (!req.session || !req.session.userId) {
                return res.status(401).json({
                    message: 'Not authenticated'
                });
            }

            const student = await studentRepository.findById(req.session.userId);

            if (!student) {
                return res.status(404).json({
                    message: 'User not found'
                });
            }

            const studentDTO = StudentDTO.fromEntity(student);
            res.json(studentDTO);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Logout user
     * POST /api/auth/logout
     */
    logout = async (req, res, next) => {
        try {
            // Clear session properties (don't replace the session object)
            delete req.session.userId;
            delete req.session.username;
            delete req.session.email;

            res.json({ message: 'Logout successful' });
        } catch (error) {
            next(error);
        }
    }
}

export const authController = new AuthController();
