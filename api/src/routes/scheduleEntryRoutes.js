/**
 * scheduleEntryRoutes.js
 *
 * Router for schedule entry endpoints. Important: `/search` is declared
 * before `/:id` to avoid route conflicts. This module wires repository ->
 * service -> controller and exports an Express Router for mounting.
 */
import { Router } from 'express';
import { ScheduleEntryController } from '../controllers/ScheduleEntryController.js';
import { ScheduleEntryService } from '../services/ScheduleEntryService.js';
import { ScheduleEntryRepository } from '../domain/repositories/ScheduleEntryRepository.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { idParam, studentIdParam, weekdayParam, upsertScheduleEntry } from '../validators/scheduleEntryValidators.js';

const scheduleEntryRepository = new ScheduleEntryRepository();
const scheduleEntryService = new ScheduleEntryService(scheduleEntryRepository);
const scheduleEntryController = new ScheduleEntryController(scheduleEntryService);

export const scheduleEntryRoutes = Router();

// All schedule entry routes require authentication
scheduleEntryRoutes.use(authenticate);

// Get all schedule entries
scheduleEntryRoutes.get('/', scheduleEntryController.list);

// Search schedule entries (must be before /:id to avoid route conflict)
scheduleEntryRoutes.get('/search', scheduleEntryController.search);

// Get schedule entries by student ID
scheduleEntryRoutes.get('/student/:studentId', studentIdParam, scheduleEntryController.getByStudent);

// Get schedule entries by weekday (0-6)
scheduleEntryRoutes.get('/weekday/:weekday', weekdayParam, scheduleEntryController.getByWeekday);

// Get schedule entry by ID
scheduleEntryRoutes.get('/:id', idParam, scheduleEntryController.get);

// Create new schedule entry
scheduleEntryRoutes.post('/', upsertScheduleEntry, scheduleEntryController.create);

// Update schedule entry
scheduleEntryRoutes.put('/:id', [...idParam, ...upsertScheduleEntry], scheduleEntryController.update);

// Delete schedule entry
scheduleEntryRoutes.delete('/:id', idParam, scheduleEntryController.delete);
