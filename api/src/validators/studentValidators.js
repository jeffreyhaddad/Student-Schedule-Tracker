/**
 * studentValidators.js
 *
 * Express-validator middlewares used to validate incoming student payloads and
 * route parameters. Exported validators are intended to be composed in routes.
 *
 * Exports:
 * - idParam: validates :id route param (positive integer)
 * - upsertStudent: validates request body for creating/updating students
 */
import { body, param } from 'express-validator';

export const idParam = [param('id')
    .isInt({ gt: 0 }).withMessage('ID must be a positive integer')
];

export const upsertStudent = [
    body('first_name')
        .isString().isLength({ min: 1, max: 225 }).withMessage('First Name must be a string'),
    body('last_name')
        .isString().isLength({ min: 1, max: 225 }).withMessage('Last Name must be a string'),
    body('username')
        .isString().isLength({ min: 1, max: 225 }).withMessage('Username must be a string'),
    body('email')
        .isEmail().withMessage('Email must be a valid email address')
];
