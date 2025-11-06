/**
 * StudentDTO
 *
 * Lightweight transport object used by controllers to serialize student data.
 * Fields mirror the students table and Student entity (snake_case):
 * - id, first_name, last_name, username, email, created_at, updated_at
 */
export class StudentDTO {
    constructor({ id, first_name, last_name, username, email, created_at, updated_at }) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.email = email;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    // Mapper to convert an Entity-like object into a DTO instance
    static fromEntity(entity) {
        return new StudentDTO(entity);
    }
}
