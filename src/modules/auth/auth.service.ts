import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService) { }

    async validateUser(email: string, pass: string) {
        const user = await this.userService.getUserByEmail(email);

        if (!user || user.password !== pass) {
            throw new UnauthorizedException();
        }

        const { password, ...result } = user.toObject();

        return result;
    }
}
