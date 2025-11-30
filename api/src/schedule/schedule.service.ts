import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleEntry } from '../entities/schedule-entry.entity';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(ScheduleEntry)
    private scheduleRepository: Repository<ScheduleEntry>,
  ) { }

  /**
   * Check if a time slot conflicts with existing schedules
   * Two time slots conflict if they overlap on the same weekday
   */
  private async checkTimeConflict(
    studentId: number,
    weekday: number,
    startTime: string,
    endTime: string,
    excludeId?: number,
  ): Promise<boolean> {
    const existingSchedules = await this.scheduleRepository.find({
      where: { studentId, weekday },
    });

    // Filter out the current schedule if updating
    const schedulesToCheck = excludeId
      ? existingSchedules.filter((s) => s.id !== excludeId)
      : existingSchedules;

    // Convert time strings (HH:MM) to minutes for comparison
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    // Check for overlaps
    for (const schedule of schedulesToCheck) {
      const existingStart = timeToMinutes(schedule.startTime);
      const existingEnd = timeToMinutes(schedule.endTime);

      // Times overlap if: new start < existing end AND new end > existing start
      if (newStart < existingEnd && newEnd > existingStart) {
        return true;
      }
    }

    return false;
  }

  async create(studentId: number, data: CreateScheduleDTO) {
    // Check for time conflicts
    const hasConflict = await this.checkTimeConflict(
      studentId,
      data.weekday,
      data.startTime,
      data.endTime,
    );

    if (hasConflict) {
      throw new ConflictException(
        `A class is already scheduled at this time on ${this.getWeekdayName(data.weekday)}`,
      );
    }

    const schedule = this.scheduleRepository.create({
      ...data,
      studentId,
    });
    return this.scheduleRepository.save(schedule);
  }

  async findAll(studentId: number, weekday?: number) {
    const where: any = { studentId };
    if (weekday !== undefined) {
      where.weekday = weekday;
    }

    return this.scheduleRepository.find({
      where,
      order: { weekday: 'ASC', startTime: 'ASC' },
    });
  }

  async findOne(id: number, studentId: number) {
    const schedule = await this.scheduleRepository.findOneBy({ id });

    if (!schedule) {
      throw new NotFoundException(`Schedule entry with id ${id} not found`);
    }

    if (schedule.studentId !== studentId) {
      throw new NotFoundException('Schedule entry not found');
    }

    return schedule;
  }

  async update(id: number, studentId: number, data: UpdateScheduleDTO) {
    const existingSchedule = await this.findOne(id, studentId);

    // Check for time conflicts only if time is being updated
    if (data.weekday !== undefined || data.startTime !== undefined || data.endTime !== undefined) {
      const weekday = data.weekday ?? existingSchedule.weekday;
      const startTime = data.startTime ?? existingSchedule.startTime;
      const endTime = data.endTime ?? existingSchedule.endTime;

      const hasConflict = await this.checkTimeConflict(
        studentId,
        weekday,
        startTime,
        endTime,
        id, // Exclude current schedule from conflict check
      );

      if (hasConflict) {
        throw new ConflictException(
          `A class is already scheduled at this time on ${this.getWeekdayName(weekday)}`,
        );
      }
    }

    await this.scheduleRepository.update(id, data);
    return this.scheduleRepository.findOneBy({ id });
  }

  private getWeekdayName(weekday: number): string {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[weekday] || 'Unknown';
  }

  async delete(id: number, studentId: number) {
    await this.findOne(id, studentId);

    return this.scheduleRepository.delete(id);
  }
}
