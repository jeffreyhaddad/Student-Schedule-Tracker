import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Student } from '../entities/student.entity';
import { Task } from '../entities/task.entity';
import { ScheduleEntry } from '../entities/schedule-entry.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'student_tracker',
  entities: [Student, Task, ScheduleEntry],
  synchronize: false,
  logging: true,
};
