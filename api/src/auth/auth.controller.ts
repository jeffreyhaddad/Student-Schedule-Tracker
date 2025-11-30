import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { CreateStudentDTO } from 'src/student/dto/create-student.dto';
import { LoginDto } from './Dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() dto: CreateStudentDTO) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
