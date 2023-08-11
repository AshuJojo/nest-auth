import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) { }

    async validateUser(email: string, pass: string) {
        const user = await this.userService.getUserByEmail(email);

        if (user && user.password === pass) {
            const { password, ...result } = user.toObject();
            return result;
        }

        return null
    }

    async login(user: any) {
        const payload = { email: user.email, id: user._id };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
