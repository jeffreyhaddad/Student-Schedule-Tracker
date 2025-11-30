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
import { ScheduleService } from './schedule.service';
import { CreateScheduleDTO } from './dto/create-schedule.dto';
import { UpdateScheduleDTO } from './dto/update-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Request() req: any,
    @Body() dto: CreateScheduleDTO,
  ) {
    return this.scheduleService.create(req.user.id, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Request() req: any,
    @Query('weekday', new ParseIntPipe({ optional: true })) weekday?: number,
  ) {
    return this.scheduleService.findAll(req.user.id, weekday);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.scheduleService.findOne(id, req.user.id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
    @Body() dto: UpdateScheduleDTO,
  ) {
    return this.scheduleService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any,
  ) {
    return this.scheduleService.delete(id, req.user.id);
  }
}
