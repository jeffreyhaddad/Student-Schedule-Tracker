import { StudentDTO } from '../domain/dto/StudentDTO.js';

/**
 * StudentService
 *
 * Business logic layer for students. The service receives raw inputs from
 * controllers, delegates persistence to the repository, and returns DTOs that
 * are safe to serialize to clients.
 *
 * Public methods:
 * - listStudents(): Promise<StudentDTO[]>
 * - getStudent(id): Promise<StudentDTO|null>
 * - createStudent(data): Promise<StudentDTO>
 * - updateStudent(id, data): Promise<StudentDTO|null>
 * - deleteStudent(id): Promise<boolean>
 * - searchStudents(query): Promise<StudentDTO[]>
 */
export class StudentService {
    constructor(StudentRepository) {
        this.studentRepository = StudentRepository;
    }

    /**
     * List all students.
     * Returns an array of StudentDTO instances.
     */
    async listStudents() {
        return (await this.studentRepository.findAll()).map(StudentDTO.fromEntity);
    }

    /**
     * Get a single student by id. Returns null if not found.
     */
    async getStudent(id) {
        const student = await this.studentRepository.findById(id);
        if (!student) return null;
        return StudentDTO.fromEntity(student);
    }

    /**
     * Create a student. `data` should contain { first_name, last_name, username, email }
     * Returns the created StudentDTO.
     */
    async createStudent(data) {
        return StudentDTO.fromEntity(
            await this.studentRepository.create(data));
    }

    /**
     * Update a student by id. Returns the updated StudentDTO or null if not found.
     */
    async updateStudent(id, data) {
        const student = await this.studentRepository.update(id, data);
        if (!student) return null;
        return StudentDTO.fromEntity(student);
    }

    /**
     * Delete a student by id. Returns true if deleted.
     */
    async deleteStudent(id) {
        return await this.studentRepository.delete(id);
    }

    /**
     * Search students by first_name, last_name or username (case-insensitive).
     * Performs an in-memory filter of all students. For large datasets, consider
     * adding a repository-level search using a SQL LIKE or full-text index.
     */
    async searchStudents(query) {
        const students = await this.studentRepository.findAll();
        return students
            .filter(student =>
                student.first_name.toLowerCase().includes(query.toLowerCase()) ||
                student.last_name.toLowerCase().includes(query.toLowerCase()) ||
                student.username.toLowerCase().includes(query.toLowerCase()))
            .map(student => StudentDTO.fromEntity(student));
    }
}


