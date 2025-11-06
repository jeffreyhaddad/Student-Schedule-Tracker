/**
 * authValidators.js
 *
 * Express-validator middlewares for authentication endpoints.
 */
import { body } from 'express-validator';

export const registerValidator = [
    body('first_name')
        .isString().isLength({ min: 1, max: 255 }).withMessage('First name is required and must be less than 255 characters'),
    body('last_name')
        .isString().isLength({ min: 1, max: 255 }).withMessage('Last name is required and must be less than 255 characters'),
    body('username')
        .isString().isLength({ min: 3, max: 100 }).withMessage('Username must be between 3 and 100 characters'),
    body('email')
        .isEmail().withMessage('Must be a valid email address'),
    body('password')
        .isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

export const loginValidator = [
    body('username')
        .isString().notEmpty().withMessage('Username or email is required'),
    body('password')
        .isString().notEmpty().withMessage('Password is required')
];
