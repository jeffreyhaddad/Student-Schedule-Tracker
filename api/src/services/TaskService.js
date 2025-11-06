import { TaskDTO } from "../domain/dto/TaskDTO.js";

/**
 * TaskService
 *
 * Business logic for task-related operations. The service transforms
 * repository entities into DTOs for controller responses.
 *
 * Public methods:
 * - listTasks(): Promise<TaskDTO[]>
 * - getTask(id): Promise<TaskDTO|null>
 * - createTask(data): Promise<TaskDTO>
 * - updateTask(id, data): Promise<TaskDTO|null>
 * - deleteTask(id): Promise<boolean>
 * - searchTasks(query): Promise<TaskDTO[]>
 */
export class TaskService {
    constructor(taskRepository) {
        this.taskRepository = taskRepository;
    }

    /**
     * Return all tasks as DTOs.
     */
    async listTasks() {
        const tasks = await this.taskRepository.findAll();
        return tasks.map(task => TaskDTO.fromEntity(task));
    }

    /**
     * Return tasks for a specific student as DTOs.
     */
    async getTasksByStudent(student_id) {
        const tasks = await this.taskRepository.findByStudentId(student_id);
        return tasks.map(task => TaskDTO.fromEntity(task));
    }

    /**
     * Get a task by id or null if not found.
     */
    async getTask(id) {
        const task = await this.taskRepository.findById(id);
        if (!task) return null;
        return TaskDTO.fromEntity(task);
    }

    /**
     * Create a new task and return its DTO.
     */
    async createTask(data) {
        const task = await this.taskRepository.create(data);
        return TaskDTO.fromEntity(task);
    }

    /**
     * Update existing task. Returns DTO or null when not found.
     */
    async updateTask(id, data) {
        const task = await this.taskRepository.update(id, data);
        return task ? TaskDTO.fromEntity(task) : null;
    }

    /**
     * Delete a task by id. Returns true if deletion occurred.
     */
    async deleteTask(id) {
        return await this.taskRepository.delete(id);
    }

    /**
     * Simple in-memory search across title and description.
     * For large datasets, implement repository-level search.
     */
    async searchTasks(query) {
        const tasks = await this.taskRepository.findAll();
        return tasks
            .filter(task =>
                task.title.toLowerCase().includes(query.toLowerCase()) ||
                task.description.toLowerCase().includes(query.toLowerCase()))
            .map(task => TaskDTO.fromEntity(task));
    }
}

