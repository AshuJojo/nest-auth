import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { SignUpDto } from './dto/signUp.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService) { }

    async validateUser(email: string, pass: string) {
        const user = await this.userService.getUserByEmail(email);

        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }

        return null
    }

    async loginUser(user: any) {
        const payload = { email: user.email, id: user._id };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUpUser(signUpDto: SignUpDto) {
        try {
            const { email, password, confirmPassword } = signUpDto;

            if (password !== confirmPassword)
                throw new Error('Password Does not match.')

            const hashedPassword = await bcrypt.hash(password, 10)
            const user = await this.userService.createUser({ email, password: hashedPassword });

            const res = { email: user.email, userId: user._id };

            if (!user)
                throw new Error('Some Error Occurred!');

            return res;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
