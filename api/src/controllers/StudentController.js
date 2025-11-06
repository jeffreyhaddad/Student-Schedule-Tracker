/**
 * StudentController
 *
 * HTTP handlers for student resources. Methods are used as Express route
 * handlers and delegate to the `studentService` for business logic.
 *
 * Exports:
 * - StudentController class which expects an instance of StudentService
 */
import { validationResult } from 'express-validator';

export class StudentController {
    constructor(studentService) {
        this.studentService = studentService;
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
            // Returns an array of StudentDTO
            res.json(await this.studentService.listStudents());
        } catch (e) {
            next(e);
        }
    }

    get = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            // req.params.id expected to be an integer ID
            const data = await this.studentService.getStudent(req.params.id);
            if (!data) return res.status(404).json({ message: 'Student not found' });
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    create = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            // req.body should match validator: first_name, last_name, username, email
            const data = await this.studentService.createStudent(req.body);
            res.status(201).json(data);
        } catch (e) {
            next(e);
        }
    }

    update = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            const data = await this.studentService.updateStudent(req.params.id, req.body);
            if (!data) return res.status(404).json({ message: 'Student not found' });
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    delete = async (req, res, next) => {
        try {
            if (this._validate(req, res)) return;
            const success = await this.studentService.deleteStudent(req.params.id);
            if (!success) return res.status(404).json({ message: 'Student not found' });
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
            // returns an array of StudentDTO
            const students = await this.studentService.searchStudents(query);
            res.json(students);
        } catch (e) {
            next(e);
        }
    }

}


