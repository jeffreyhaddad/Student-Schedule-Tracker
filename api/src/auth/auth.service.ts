import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentService } from 'src/student/student.service';
import { CreateStudentDTO } from 'src/student/dto/create-student.dto';
import { LoginDto } from './Dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private studentService: StudentService,
    private jwtService: JwtService,
  ) { }

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

    const payload = { sub: student.id, username: student.username };
    const access_token = this.jwtService.sign(payload);

    const { password, ...safe } = student as any;
    return {
      access_token,
      user: safe,
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

    const payload = { sub: student.id, username: student.username };
    const access_token = this.jwtService.sign(payload);

    const { password, ...safe } = student as any;
    return {
      access_token,
      user: safe,
    };
  }

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      const student = await this.studentService.findById(payload.sub);
      return student;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async getProfile(studentId: number) {
    const student = await this.studentService.findById(studentId);
    const { password, ...safe } = student as any;
    return safe;
  }
}
