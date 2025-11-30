import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDTO } from './dto/create-student.dto';
import { UpdateStudentDTO } from './dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) { }

  async create(data: CreateStudentDTO) {
    const student = this.studentRepository.create(data);
    return this.studentRepository.save(student);
  }

  async findAll() {
    return this.studentRepository.find({
      relations: ['tasks', 'schedules'],
    });
  }

  async findById(id: number) {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['tasks', 'schedules'],
    });

    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    return student;
  }

  async findByEmail(email: string) {
    const student = await this.studentRepository.findOneBy({ email });

    if (!student) {
      throw new NotFoundException(`Student with email ${email} not found`);
    }

    return student;
  }

  async findByUsername(username: string) {
    const student = await this.studentRepository.findOneBy({ username });

    if (!student) {
      throw new NotFoundException(`Student with username ${username} not found`);
    }

    return student;
  }

  async update(id: number, data: UpdateStudentDTO) {
    const student = await this.studentRepository.findOneBy({ id });

    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    await this.studentRepository.update(id, data);
    return this.studentRepository.findOneBy({ id });
  }

  async delete(id: number) {
    const student = await this.studentRepository.findOneBy({ id });

    if (!student) {
      throw new NotFoundException(`Student with id ${id} not found`);
    }

    return this.studentRepository.delete(id);
  }
}
