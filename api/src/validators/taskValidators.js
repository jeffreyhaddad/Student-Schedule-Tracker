/**
 * taskValidators.js
 *
 * Express-validator middlewares for task endpoints. Use these in routes to
 * validate params and request bodies before hitting controllers.
 *
 * Exports:
 * - idParam: ensures :id is a positive integer
 * - upsertTask: validates request body for creating/updating tasks
 */
import { body, param, query } from 'express-validator';

export const idParam = [param('id')
    .isInt({ gt: 0 }).withMessage('ID must be a positive integer')
];

export const upsertTask = [
    body('title')
        .isString().isLength({ min: 1, max: 225 }).withMessage("Title must be a string"),
    body('description')
        .optional()
        .isString().isLength({ min: 1, max: 1000 }).withMessage("Description must be a string"),
    body('status')
        .isIn(['pending', 'in-progress', 'completed']).withMessage("Status must be one of 'pending', 'in-progress', 'completed'"),
    body('due_at')
        .optional()
        .isISO8601().withMessage("Due date must be a valid date"),
    body('priority')
        .isIn(['low', 'normal', 'high']).withMessage("Priority must be one of 'low', 'normal', 'high'"),
    body('category')
        .optional()
        .isString().isLength({ min: 1, max: 100 }).withMessage("Category must be a string")
];