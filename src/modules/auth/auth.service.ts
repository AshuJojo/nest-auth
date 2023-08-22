import {
    Injectable,
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
    ConflictException,
    UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CastError } from 'mongoose/lib/error';
import * as bcrypt from 'bcrypt';
import { JsonWebTokenError } from 'jsonwebtoken'

import { SignUpDto } from './dto/signUp.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { Constants } from 'src/constants/constants';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService
    ) { }


    // Login current User
    async loginUser(user: any) {
        const payload = { email: user.email, _id: user._id, roles: user.roles };
        return {
            accessToken: await this.jwtService.signAsync(payload),
        };
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

    // SignUp new User
    async signUpUser(signUpDto: SignUpDto) {
        const { email, password, confirmPassword } = signUpDto;

        if (password !== confirmPassword)
            throw new BadRequestException(Constants.ErrorMessages.PASSWORD_MISMATCH)

        const user = await this.userService.createUser({ email, password })
            .catch((error) => {
                console.error('signUpUser(): ', error)
                if (error instanceof ConflictException)
                    throw error
                throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED)
            });
        console.log("User: ", user);

        const token = await this.generateEmailVerificationToken(user.email)

        this.mailService.sendEmailVerificationMail(email, token);

        return { message: 'User signed up successfully!' };
    }

    // Resend User Email Verification Mail
    async resendEmailVerification(email: string) {
        // Generate Token
        const token = await this.generateEmailVerificationToken(email);

        // Send Mail
        this.mailService.sendEmailVerificationMail(email, token)

        return { message: 'Email sent successfully!' };
    }

    // Verify User Email with email verification token
    async verifyUserEmail(token: string) {
        // Get User from email after token verification
        const user = await this.verifyEmailToken(token);

        // Activate user account after email verification
        const updatedUser = await this.userService.updateUser(user._id, { isActive: true })
            .catch(error => {
                console.error('verifyUserEmail(): ', error)
                if (error instanceof CastError || error instanceof TypeError)
                    throw error

                throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED)
            })

        console.log('Token Verified: ', updatedUser);

        return { message: Constants.messages.EMAIL_VERIFICATION_SUCCESS };
    }

    // Method to generate Email Verification Token
    async generateEmailVerificationToken(email: string) {
        // Get User from Email
        const user = await this.userService.getUserByEmail(email);

        const payload = { _id: user._id, email: user.email }

        // Sign Token 
        const token = await this.jwtService.signAsync(payload,
            {
                secret: this.configService.get<string>('JWT_EMAIL_SECRET'),
                expiresIn: '1d'
            })
            .catch((error) => {
                console.error(error)
                throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED);
            })
        console.log('Email Verification Token: ', token)

        return token
    }

    // Method to verify Email Token
    async verifyEmailToken(token: string) {

        // Verify User Email token
        const user = await this.jwtService.verifyAsync(token,
            {
                secret: this.configService.get<string>('JWT_EMAIL_SECRET')
            })
            .catch(error => {
                console.error(error);

                if (error instanceof JsonWebTokenError)
                    throw new UnauthorizedException(Constants.ErrorMessages.JWT_TOKEN_EXPIRED)

                throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED);
            });

        return user;
    }

    // Method to send Frogot Password mail 
    async forgotPassword(email: string) {
        // Generate Password Reset Token for email
        const token = await this.generateResetPasswordToken(email);

        // Send Reset Password Mail 
        await this.mailService.sendResetPasswordMail(email, token)

        return { message: 'Email sent successfully!' };
    }

    // Method to reset Password 
    async resetPassword(token: string, resetPasswordDto: ResetPasswordDto) {
        // Verify Reset Password Token and get email
        const { _id } = await this.verifyResetPasswordToken(token);

        const { password, confirmPassword } = resetPasswordDto;

        if (password !== confirmPassword) {
            throw new BadRequestException(Constants.ErrorMessages.PASSWORD_MISMATCH);
        }

        // Update User Password
        const updatedUser = await this.userService
            .updateUser(_id, { password })
            .catch((error) => {
                if (error instanceof CastError || error instanceof TypeError)
                    throw error

                throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED);
            })

        console.log(updatedUser);

        return { message: 'Password reset successful!' };
    }

    // Method to verify Reset Password Token
    async verifyResetPasswordToken(token: string) {

        const user = await this.jwtService.verifyAsync(token,
            {
                secret: this.configService.get<string>('JWT_RESET_PASSWORD_SECRET')
            })
            .catch(error => {
                console.error(error);

                if (error instanceof JsonWebTokenError)
                    throw new UnauthorizedException(Constants.ErrorMessages.JWT_TOKEN_EXPIRED)

                throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED);
            });

        return user;
    }


    // Method to generate Reset Password Token
    async generateResetPasswordToken(email: string) {
        // Find User by email
        const user = await this.userService.getUserByEmail(email);

        const payload = { _id: user._id, email: user.email };

        // Sign the token
        const token = await this.jwtService.signAsync(payload,
            {
                secret: this.configService.get<string>('JWT_RESET_PASSWORD_SECRET'),
                expiresIn: '1d',
            }).catch(error => {
                throw new InternalServerErrorException(Constants.ErrorMessages.SOME_ERROR_OCCURRED);
            });
        console.log('Reset Password Token: ', token);

        return token;
    }
}
