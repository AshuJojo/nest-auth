import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CastError } from 'mongoose/lib/error';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError } from 'jsonwebtoken'

import { SignUpDto } from './dto/signUp.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { ResetPasswordDto } from './dto/resetPasswordDto';
import { Constants } from 'src/constants/constants';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService, private jwtService: JwtService, private configService: ConfigService) { }


    // Login current User
    async loginUser(user: any) {
        const payload = { email: user.email, _id: user._id, roles: user.roles };
        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
    }

    // TODO: send email verification link
    // TODO: create a proper response
    // SignUp new User
    async signUpUser(signUpDto: SignUpDto) {
        try {
            const { email, password, confirmPassword } = signUpDto;

            if (password !== confirmPassword)
                throw new BadRequestException(Constants.ErrorMessages.PASSWORD_MISMATCH)

            const user = await this.userService.createUser({ email, password });
            console.log("User: ", user);

            const token = await this.generateEmailVerificationToken(user.email)

            // Send Email Verification to email via NodeMailer or other service

            return { emailVerificationToken: token };
        } catch (error) {
            if (error instanceof ConflictException || error instanceof NotFoundException || error instanceof JsonWebTokenError)
                throw error

            throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED);
        }
    }

    // Email Verification with User Token
    async verifyUserEmail(token: string) {
        try {
            const user = await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>('JWT_EMAIL_SECRET') });
            console.log("User: ", user);
            const isUser = await this.userService.updateUser(user._id, { isActive: true })
            console.log('Token Verified: ', isUser);
            return { message: Constants.messages.EMAIL_VERIFICATION_SUCCESS };
        } catch (error) {
            console.log(error)

            if (error instanceof CastError || error instanceof TypeError)
                throw error

            if (error instanceof JsonWebTokenError)
                throw new UnauthorizedException(Constants.ErrorMessages.JWT_TOKEN_EXPIRED)

            throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED)
        }
    }

    async resendEmailVerification(email: string) {
        const token = await this.generateEmailVerificationToken(email);

        // Send email verification to email

        return { emailVerificationToken: token };
    }

    async generateEmailVerificationToken(email: string) {
        const user = await this.userService.getUserByEmail(email);

        const payload = { _id: user._id, email: user.email }

        try {
            const token = await this.jwtService.signAsync(payload, { secret: this.configService.get<string>('JWT_EMAIL_SECRET'), expiresIn: '1d' })
            console.log('Email Verification Token: ', token)

            return token
        } catch (error) {
            console.error(error);
            if (error instanceof JsonWebTokenError)
                throw new JsonWebTokenError(Constants.ErrorMessages.JWT_TOKEN_GENERATION_ERROR)

            throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED);
        }
    }

    async resetPassword(user: User, resetPasswordDto: ResetPasswordDto) {
        const { password, confirmPassword } = resetPasswordDto;

        if (password !== confirmPassword)
            throw new BadRequestException('Password does not match');
        
        console.log('user: ', user);

        try {

            const updatedUser = await this.userService.updateUser(user._id.toString(), { password })

            console.log(updatedUser);

            return updatedUser;
        } catch (error) {
            if (error instanceof CastError || error instanceof TypeError)
                throw error

            throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED);
        }
    }

    // Method to validate user email & password passed through loginUser() method
    async validateUser(email: string, pass: string) {
        const user = await this.userService.getUserByEmail(email);

        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user.toObject();
            return result;
        }

        return null
    }
    async sendEmailVerificationMail(_id: string, email: string) {

    }
}
