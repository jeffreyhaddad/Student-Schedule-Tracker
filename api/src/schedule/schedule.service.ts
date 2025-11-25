import { Injectable, NotFoundException } from '@nestjs/common';
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
  ) {}

  async create(studentId: number, data: CreateScheduleDTO) {
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
    await this.findOne(id, studentId);

    await this.scheduleRepository.update(id, data);
    return this.scheduleRepository.findOneBy({ id });
  }

  async delete(id: number, studentId: number) {
    await this.findOne(id, studentId);

    return this.scheduleRepository.delete(id);
  }
}
