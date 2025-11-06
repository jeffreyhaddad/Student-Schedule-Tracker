/**
 * studentRoutes.js
 *
 * Router for student endpoints. This module wires a repository -> service ->
 * controller pipeline and exports an Express Router that can be mounted by
 * the application (e.g. app.use('/students', studentRoutes)).
 */
import { Router } from 'express';
import { StudentController } from '../controllers/StudentController.js';
import { StudentService } from '../services/StudentService.js';
import { StudentRepository } from '../domain/repositories/StudentRepository.js';

import { idParam, upsertStudent } from '../validators/studentValidators.js';

const repository = new StudentRepository();
const service = new StudentService(repository);
const controller = new StudentController(service);

export const studentRoutes = Router();

studentRoutes.get('/', controller.list);
studentRoutes.get('/search', controller.search);
studentRoutes.get('/:id', idParam, controller.get);
studentRoutes.put('/:id', [...idParam, ...upsertStudent], controller.update);
studentRoutes.post('/', upsertStudent, controller.create);
studentRoutes.delete('/:id', idParam, controller.delete);
