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
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskService } from './task.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { UpdateTaskDTO } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req: any,
    @Body() dto: CreateTaskDTO,
  ) {
    return this.taskService.create(req.user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Request() req: any,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
  ) {
    return this.taskService.findAll(req.user.id, sort, order);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.taskService.findOne(id, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() dto: UpdateTaskDTO,
  ) {
    return this.taskService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.taskService.delete(id, req.user.id);
  }
}
