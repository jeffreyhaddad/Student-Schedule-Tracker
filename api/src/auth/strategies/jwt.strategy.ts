import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StudentService } from 'src/student/student.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private studentService: StudentService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key',
        });
    }

    async validate(payload: any) {
        const student = await this.studentService.findById(payload.sub);
        return student;
    }
}
