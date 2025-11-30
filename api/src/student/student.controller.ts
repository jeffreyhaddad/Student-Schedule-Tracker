import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { StudentService } from './student.service';
import { CreateStudentDTO } from './dto/create-student.dto';
import { UpdateStudentDTO } from './dto/update-student.dto';

@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentStudent(@Request() req: any) {
    return this.studentService.findById(req.user.id);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateCurrentStudent(
    @Request() req: any,
    @Body() dto: UpdateStudentDTO,
  ) {
    return this.studentService.update(req.user.id, dto);
  }
}
