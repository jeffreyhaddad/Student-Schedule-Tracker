import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(studentId: number, data: CreateTaskDTO) {
    const task = this.taskRepository.create({
      ...data,
      studentId,
    });
    return this.taskRepository.save(task);
  }

  async findAll(studentId: number, sort?: string, order?: string) {
    const orderBy: any = {};
    const sortField = sort || 'dueAt';
    const sortOrder = order === 'desc' ? 'DESC' : 'ASC';

    orderBy[sortField] = sortOrder;

    return this.taskRepository.find({
      where: { studentId },
      order: orderBy,
    });
  }

  async findOne(id: number, studentId: number) {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (task.studentId !== studentId) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: number, studentId: number, data: UpdateTaskDTO) {
    await this.findOne(id, studentId);

    await this.taskRepository.update(id, data);
    return this.taskRepository.findOneBy({ id });
  }

  async delete(id: number, studentId: number) {
    await this.findOne(id, studentId);

    return this.taskRepository.delete(id);
  }
}
