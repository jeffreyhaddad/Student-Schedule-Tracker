import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  Query,
  Headers,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Post()
  create(
    @Headers('x-student-id') studentIdHeader: string,
    @Body() dto: CreateTaskDTO,
  ) {
    const studentId = parseInt(studentIdHeader, 10);
    return this.taskService.create(studentId, dto);
  }

  @Get()
  findAll(
    @Headers('x-student-id') studentIdHeader: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    const studentId = parseInt(studentIdHeader, 10);
    return this.taskService.findAll(studentId, sort, order);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-student-id') studentIdHeader: string,
  ) {
    const studentId = parseInt(studentIdHeader, 10);
    return this.taskService.findOne(id, studentId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-student-id') studentIdHeader: string,
    @Body() dto: UpdateTaskDTO,
  ) {
    const studentId = parseInt(studentIdHeader, 10);
    return this.taskService.update(id, studentId, dto);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-student-id') studentIdHeader: string,
  ) {
    const studentId = parseInt(studentIdHeader, 10);
    return this.taskService.delete(id, studentId);
  }
}
