import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Task } from './entities/task.entity';
import { ScheduleEntry } from './entities/schedule-entry.entity';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from './schedule/schedule.module';
import { typeOrmConfig } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TypeOrmModule.forFeature([Student, Task, ScheduleEntry]),
    AuthModule,
    StudentModule,
    TaskModule,
    ScheduleModule,
  ],
})
export class AppModule {}
