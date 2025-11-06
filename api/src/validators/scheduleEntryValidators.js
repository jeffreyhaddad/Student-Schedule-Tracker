/**
 * scheduleEntryValidators.js
 *
 * Validators for schedule entry endpoints. Exports reusable param and body
 * validators that can be composed in the schedule entry routes.
 *
 * Notes:
 * - `start_time` and `end_time` must use HH:MM:SS format.
 * - `weekday` uses 0 (Sunday) through 6 (Saturday).
 */
import { body, param } from 'express-validator';

export const idParam = [
    param('id')
        .isInt({ gt: 0 }).withMessage('ID must be a positive integer')
];

export const studentIdParam = [
    param('studentId')
        .isInt({ gt: 0 }).withMessage('Student ID must be a positive integer')
];

export const weekdayParam = [
    param('weekday')
        .isInt({ min: 0, max: 6 }).withMessage('Weekday must be an integer between 0 (Sunday) and 6 (Saturday)')
];

export const upsertScheduleEntry = [
    body('weekday')
        .isInt({ min: 0, max: 6 }).withMessage('Weekday must be an integer between 0 (Sunday) and 6 (Saturday)'),
    body('start_time')
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('Start time must be in format HH:MM:SS'),
    body('end_time')
        .matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).withMessage('End time must be in format HH:MM:SS')
        .custom((end_time, { req }) => {
            if (req.body.start_time && end_time <= req.body.start_time) {
                throw new Error('End time must be after start time');
            }
            return true;
        }),
    body('subject')
        .isString().isLength({ min: 1, max: 255 }).withMessage('Subject must be a string between 1 and 255 characters'),
    body('location')
        .optional()
        .isString().isLength({ max: 255 }).withMessage('Location must be a string with max 255 characters'),
    body('notes')
        .optional()
        .isString().withMessage('Notes must be a string'),
    body('is_active')
        .optional()
        .isBoolean().withMessage('is_active must be a boolean')
];
