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
import { ScheduleService } from './schedule.service';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Post()
  create(
    @Headers('x-student-id') studentIdHeader: string,
    @Body() dto: CreateScheduleDTO,
  ) {
    const studentId = parseInt(studentIdHeader, 10);
    return this.scheduleService.create(studentId, dto);
  }

  @Get()
  findAll(
    @Headers('x-student-id') studentIdHeader: string,
    @Query('weekday', new ParseIntPipe({ optional: true })) weekday?: number,
  ) {
    const studentId = parseInt(studentIdHeader, 10);
    return this.scheduleService.findAll(studentId, weekday);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-student-id') studentIdHeader: string,
  ) {
    const studentId = parseInt(studentIdHeader, 10);
    return this.scheduleService.findOne(id, studentId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-student-id') studentIdHeader: string,
    @Body() dto: UpdateScheduleDTO,
  ) {
    const studentId = parseInt(studentIdHeader, 10);
    return this.scheduleService.update(id, studentId, dto);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Headers('x-student-id') studentIdHeader: string,
  ) {
    const studentId = parseInt(studentIdHeader, 10);
    return this.scheduleService.delete(id, studentId);
  }
}
