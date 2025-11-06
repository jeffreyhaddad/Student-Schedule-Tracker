import { ScheduleEntryDTO } from '../domain/dto/ScheduleEntryDTO.js';

/**
 * ScheduleEntryService
 *
 * Business logic for schedule entries. This layer transforms repository
 * entities into DTOs and provides convenience methods used by controllers.
 *
 * Public methods:
 * - listScheduleEntries(): Promise<ScheduleEntryDTO[]>
 * - getScheduleEntry(id): Promise<ScheduleEntryDTO|null>
 * - getScheduleEntriesByStudent(student_id): Promise<ScheduleEntryDTO[]>
 * - getScheduleEntriesByWeekday(weekday): Promise<ScheduleEntryDTO[]>
 * - createScheduleEntry(data): Promise<ScheduleEntryDTO>
 * - updateScheduleEntry(id, data): Promise<ScheduleEntryDTO|null>
 * - deleteScheduleEntry(id): Promise<boolean>
 * - searchScheduleEntries(query): Promise<ScheduleEntryDTO[]>
 */
export class ScheduleEntryService {
    constructor(scheduleEntryRepository) {
        this.scheduleEntryRepository = scheduleEntryRepository;
    }

    /**
     * Return all schedule entries as DTOs.
     */
    async listScheduleEntries() {
        const scheduleEntries = await this.scheduleEntryRepository.findAll();
        return scheduleEntries.map(entry => ScheduleEntryDTO.fromEntity(entry));
    }

    /**
     * Get a single schedule entry by id. Returns null if not found.
     */
    async getScheduleEntry(id) {
        const scheduleEntry = await this.scheduleEntryRepository.findById(id);
        if (!scheduleEntry) return null;
        return ScheduleEntryDTO.fromEntity(scheduleEntry);
    }

    /**
     * Get schedule entries for a specific student id.
     */
    async getScheduleEntriesByStudent(student_id) {
        const scheduleEntries = await this.scheduleEntryRepository.findByStudentId(student_id);
        return scheduleEntries.map(entry => ScheduleEntryDTO.fromEntity(entry));
    }

    /**
     * Get schedule entries for a specific weekday (0-6).
     */
    async getScheduleEntriesByWeekday(weekday) {
        const scheduleEntries = await this.scheduleEntryRepository.findByWeekday(weekday);
        return scheduleEntries.map(entry => ScheduleEntryDTO.fromEntity(entry));
    }

    /**
     * Create a new schedule entry and return its DTO.
     */
    async createScheduleEntry(data) {
        const scheduleEntry = await this.scheduleEntryRepository.create(data);
        return ScheduleEntryDTO.fromEntity(scheduleEntry);
    }

    /**
     * Update a schedule entry. Returns DTO or null when not found.
     */
    async updateScheduleEntry(id, data) {
        const scheduleEntry = await this.scheduleEntryRepository.update(id, data);
        if (!scheduleEntry) return null;
        return ScheduleEntryDTO.fromEntity(scheduleEntry);
    }

    /**
     * Delete a schedule entry by id. Returns true if deleted.
     */
    async deleteScheduleEntry(id) {
        return await this.scheduleEntryRepository.delete(id);
    }

    /**
     * Simple in-memory search across subject, location and notes fields.
     */
    async searchScheduleEntries(query) {
        const scheduleEntries = await this.scheduleEntryRepository.findAll();
        return scheduleEntries
            .filter(entry =>
                entry.subject.toLowerCase().includes(query.toLowerCase()) ||
                (entry.location && entry.location.toLowerCase().includes(query.toLowerCase())) ||
                (entry.notes && entry.notes.toLowerCase().includes(query.toLowerCase())))
            .map(entry => ScheduleEntryDTO.fromEntity(entry));
    }
}
