/**
 * Student Entity
 *
 * Domain representation of a student row. Field names are snake_case to match
 * the database columns so repositories can pass rows directly into the
 * constructor.
 */
export class Student {
    constructor({ id, first_name, last_name, username, email, password_hash, created_at, updated_at }) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}
