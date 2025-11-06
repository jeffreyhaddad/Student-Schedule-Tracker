/**
 * taskRoutes.js
 *
 * Router for task endpoints. Wires repository -> service -> controller and
 * exports an Express Router meant to be mounted by the application (e.g.
 * app.use('/tasks', taskRoutes)).
 */
import { Router } from 'express';
import { TaskController } from '../controllers/TaskController.js';
import { TaskService } from '../services/TaskService.js';
import { TaskRepository } from '../domain/repositories/TaskRepository.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { idParam, upsertTask } from '../validators/taskValidators.js';

const repository = new TaskRepository();
const service = new TaskService(repository);
const controller = new TaskController(service);

export const taskRoutes = Router();

// All task routes require authentication
taskRoutes.use(authenticate);

taskRoutes.get('/', controller.list);
taskRoutes.get('/search', controller.search);
taskRoutes.get('/:id', idParam, controller.get);
taskRoutes.put('/:id', [...idParam, ...upsertTask], controller.update);
taskRoutes.post('/', upsertTask, controller.create);
taskRoutes.delete('/:id', idParam, controller.delete);