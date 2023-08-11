import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) { }

    async validateUser(email: string, pass: string) {
        const user = await this.userService.getUserByEmail(email);

        if (!user || user.password !== pass) {
            throw new UnauthorizedException();
        }

        const payload = { id: user.id, email: user.email };

        return {
            accessToken: await this.jwtService.signAsync(payload)
        };
    }
}
