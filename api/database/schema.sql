-- Create students table

CREATE TABLE if NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to update the updated_at column on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to call the function before any update on the students table
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON students
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Insert sample data into students table
INSERT INTO students (first_name, last_name, username, email, password_hash) VALUES
('John', 'Doe', 'johndoe', 'johndoe@email.com', '$2b$10$EIXZQ1z5Q5Z5Q5Z5Q5Z5QO'),
('Jane', 'Smith', 'janesmith', 'janesmith@email.com', '$2b$10$EIXZQ1z5Q5Z5Q5Z5Q5Z5QO'),
('Alice', 'Johnson', 'alicej', 'alichjohnson@email.com', '$2b$10$EIXZQ1z5Q5Z5Q5Z5Q5Z5QO')
ON CONFLICT DO NOTHING;

-- Create tasks table
CREATE TABLE if NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_at TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending' | 'in-progress' | 'completed'
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',   -- 'low' | 'normal' | 'high'
    category VARCHAR(50),    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Function to update the updated_at column on row update
CREATE OR REPLACE FUNCTION update_tasks_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to call the function before any update on the tasks table
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE PROCEDURE update_tasks_updated_at_column();

-- Create schedule_entries table
CREATE TABLE IF NOT EXISTS schedule_entries (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    weekday SMALLINT NOT NULL CHECK (weekday >= 0 AND weekday <= 6), -- 0=Sunday, 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Function to update the updated_at column on row update
CREATE OR REPLACE FUNCTION update_schedule_entries_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to call the function before any update on the schedule_entries table
CREATE TRIGGER update_schedule_entries_updated_at
BEFORE UPDATE ON schedule_entries
FOR EACH ROW
EXECUTE PROCEDURE update_schedule_entries_updated_at_column();