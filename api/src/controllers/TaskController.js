/**
 * TaskController
 *
 * HTTP handlers for task resources. Expects a `taskService` instance exposing
 * list/get/create/update/delete/search operations. All methods return TaskDTO
 * objects or arrays of TaskDTO.
 */
import { validationResult } from "express-validator";

export class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }

    _validate(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        return null;
    }

    list = async (req, res, next) => {
        try {
            res.json(await this.taskService.getTasksByStudent(req.user.id));
        } catch (e) {
            next(e);
        }
    }

    get = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            const data = await this.taskService.getTask(req.params.id);
            if (!data) return res.status(404).json({ message: 'Task not found' });
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    create = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            const taskData = {
                ...req.body,
                student_id: req.user.id
            };
            const data = await this.taskService.createTask(taskData);
            res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    update = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            const taskData = {
                ...req.body,
                student_id: req.user.id
            };
            const data = await this.taskService.updateTask(req.params.id, taskData);
            if (!data) return res.status(404).json({ message: 'Task not found' });
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    delete = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            const success = await this.taskService.deleteTask(req.params.id);
            if (!success) return res.status(404).json({ message: 'Task not found' });
            res.status(204).end();
        } catch (e) {
            next(e);
        }
    }

    search = async (req, res, next) => {
        try {
            const query = req.query.q;
            if (!query) {
                return res.status(400).json({ message: 'Search query is required' });
            }
            // returns filtered TaskDTO array
            const tasks = await this.taskService.searchTasks(query);
            res.json(tasks);
        } catch (e) {
            next(e);
        }
    }


}