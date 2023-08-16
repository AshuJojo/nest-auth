import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { SignUpDto } from './dto/signUp.dto';
import { UsersService } from '../users/users.service';
import { Role } from './enum/role.enum';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { ResetPasswordDto } from './dto/resetPasswordDto';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService, private configService: ConfigService) { }

    // Method to validate user email & password passed through loginUser() method
    async validateUser(email: string, pass: string) {
        const user = await this.userService.getUserByEmail(email);

        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }

        return null
    }

    // TODO: Check if email is verified or not
    // TODO: create a proper response
    // Login current User
    async loginUser(user: any) {
        const payload = { email: user.email, _id: user._id, roles: user.roles };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    // TODO: send email verification link
    // TODO: create a proper response
    // SignUp new User
    async signUpUser(signUpDto: SignUpDto) {
        try {
            const { email, password, confirmPassword } = signUpDto;

            if (password !== confirmPassword)
                throw new Error('Password Does not match.')

            // const hashedPassword = await bcrypt.hash(password, 10)
            const user = await this.userService.createUser({ email, password: password, roles: [Role.User] });

            if (!user)
                throw new Error('Some Error Occurred!');

            const res = { email: user.email, _id: user._id };

            const emailVerificationToken = await this.jwtService.signAsync(res, { secret: this.configService.get<string>('EMAIL_JWT_SECRET'), expiresIn: '1d' });

            console.log('Email Verification Token: ', emailVerificationToken);

            // Send an email with email verification link

            return res;
        } catch (err) {
            throw new Error(err.message);
        }
    }

    // Email Verification with User Token
    async verifyUserEmail(token: string) {
        try {
            const user = await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>('JWT_SECRET') });
            console.log("User: ", user);
            const isUser = await this.userService.updateUser(user._id, { isActive: 1 })
            console.log('Token Verified: ', isUser);
            return { isVerified: true, message: 'Email Successfully Verified!' };
        } catch (err) {
            console.error(err.message);
            return { isVerified: false, message: 'Token has expired!' };
        }
    }

    async resendEmailVerification(email: string) {
        // Check if email exists in database
        // create jwt token for email with userID
        // Send verification mail
        console.log('Auth Service Email: ', email)

        if (!email)
            throw new Error('All fields are required.')

        const user = await this.userService.getUserByEmail(email);

        console.log("User: ", user)

        if (!user)
            throw new Error('User does not exists');

        const payload = { _id: user._id, email: user.email }

        const token = await this.jwtService.signAsync(payload, { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: '1d' })

        console.log('Token: ', token)

        return { emailVerificationToken: token }
    }

    async resetPassword(user: User, resetPasswordDto: ResetPasswordDto) {
        const { password, confirmPassword } = resetPasswordDto;

        if (!password || !confirmPassword)
            throw new Error('All Fields are required.');

        if (password !== confirmPassword)
            throw new Error('Password does not match');

        // const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password: ', password)
        // console.log('Hashed Password: ', hashedPassword);

        console.log('user: ', user);

        const updatedUser = await this.userService.updateUser(user._id.toString(), { password })

        console.log(updatedUser);

        return updatedUser;
    }

    async sendEmailVerificationMail(_id: string, email: string) {

    }
}
