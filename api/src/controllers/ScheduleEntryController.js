import { validationResult } from 'express-validator';

/**
 * ScheduleEntryController
 *
 * HTTP handlers for schedule entries. Each handler validates input (using
 * express-validator middleware + the internal _validate helper) and delegates
 * to the ScheduleEntryService. Responses are JSON with appropriate status codes:
 * - 200 for OK, 201 for created, 204 for no-content, 400 for validation, 404 when not found.
 */
export class ScheduleEntryController {
    constructor(scheduleEntryService) {
        this.scheduleEntryService = scheduleEntryService;
    }

    _validate(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        return null;
    }

    /**
     * GET / - list schedule entries for the authenticated user
     */
    list = async (req, res, next) => {
        try {
            res.json(await this.scheduleEntryService.getScheduleEntriesByStudent(req.user.id));
        } catch (e) {
            next(e);
        }
    }

    /**
     * GET /:id - get schedule entry by id
     */
    get = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            const data = await this.scheduleEntryService.getScheduleEntry(req.params.id);
            if (!data) return res.status(404).json({ message: 'Schedule entry not found' });
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    /**
     * GET /student/:studentId - get schedule entries for a given student
     */
    getByStudent = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            const studentId = req.params.studentId;
            const data = await this.scheduleEntryService.getScheduleEntriesByStudent(studentId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    /**
     * GET /weekday/:weekday - get schedule entries for a specific weekday (0-6)
     */
    getByWeekday = async (req, res, next) => {
        try {
            const weekday = parseInt(req.params.weekday);
            if (isNaN(weekday) || weekday < 0 || weekday > 6) {
                return res.status(400).json({ message: 'Invalid weekday. Must be between 0 (Sunday) and 6 (Saturday)' });
            }
            const data = await this.scheduleEntryService.getScheduleEntriesByWeekday(weekday);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    /**
     * POST / - create schedule entry
     */
    create = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            const entryData = {
                ...req.body,
                student_id: req.user.id
            };
            const data = await this.scheduleEntryService.createScheduleEntry(entryData);
            res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    /**
     * PUT /:id - update schedule entry
     */
    update = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            const entryData = {
                ...req.body,
                student_id: req.user.id
            };
            const data = await this.scheduleEntryService.updateScheduleEntry(req.params.id, entryData);
            if (!data) return res.status(404).json({ message: 'Schedule entry not found' });
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    /**
     * DELETE /:id - delete schedule entry
     */
    delete = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            const success = await this.scheduleEntryService.deleteScheduleEntry(req.params.id);
            if (!success) return res.status(404).json({ message: 'Schedule entry not found' });
            res.status(204).end();
        } catch (e) {
            next(e);
        }
    }

    /**
     * GET /search?q= - search schedule entries by subject, location or notes
     */
    search = async (req, res, next) => {
        try {
            const query = req.query.q;
            if (!query) {
                return res.status(400).json({ message: 'Search query is required' });
            }
            const scheduleEntries = await this.scheduleEntryService.searchScheduleEntries(query);
            res.json(scheduleEntries);
        } catch (e) {
            next(e);
        }
    }
}
