/**
 * authRoutes.js
 *
 * Authentication routes for user registration, login, and profile access.
 * 
 * Public routes:
 * - POST /register - Create new user account
 * - POST /login - Authenticate and create session
 * - POST /logout - Clear session
 * 
 * Protected routes:
 * - GET /profile - Get current user profile (requires session)
 */
import { Router } from 'express';
import { authController } from '../controllers/AuthController.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';
import { authenticate } from '../middlewares/authMiddleware.js';

export const authRoutes = Router();

// Public routes
authRoutes.post('/register', registerValidator, authController.register);
authRoutes.post('/login', loginValidator, authController.login);
authRoutes.post('/logout', authController.logout);

// Protected routes
authRoutes.get('/profile', authenticate, authController.getProfile);
