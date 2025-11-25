import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { StudentService } from 'src/student/student.service';
import { CreateStudentDTO } from 'src/student/dto/create-student.dto';
import { LoginDto } from './Dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private sessions: Map<string, number> = new Map(); // sessionId -> studentId

  constructor(private studentService: StudentService) {}

  private generateSessionId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  async register(dto: CreateStudentDTO) {
    try {
      // Check if username or email already exists
      await this.studentService.findByUsername(dto.username);
      throw new ConflictException('Username already exists');
    } catch {
      // Expected - student doesn't exist yet
    }

    try {
      await this.studentService.findByEmail(dto.email);
      throw new ConflictException('Email already exists');
    } catch {
      // Expected - student doesn't exist yet
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const student = await this.studentService.create({
      ...dto,
      password: hashedPassword,
    });

    const sessionId = this.generateSessionId();
    this.sessions.set(sessionId, student.id);

    const { password, ...safe } = student as any;
    return {
      ...safe,
      sessionId,
      message: 'Registration successful',
    };
  }

  async login(dto: LoginDto) {
    const student = await this.studentService.findByUsername(dto.username);

    if (!student) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, student.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const sessionId = this.generateSessionId();
    this.sessions.set(sessionId, student.id);

    const { password, ...safe } = student as any;
    return {
      ...safe,
      sessionId,
      message: 'Login successful',
    };
  }

  async getProfile(sessionId: string) {
    const studentId = this.sessions.get(sessionId);

    if (!studentId) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    return this.studentService.findOne(studentId);
  }
}
