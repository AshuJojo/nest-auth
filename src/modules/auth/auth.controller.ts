import { Controller, Get, Post, Body, UseGuards, Request, ValidationPipe, Param } from '@nestjs/common';

import { LocalAuthGuard } from './gaurds/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/auth.decorator';
import { SignUpDto } from './dto/signUp.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/role.enum';
import { EmailDto } from './dto/email.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.loginUser(req.user);
    }


    @Public()
    @Post('signup')
    async signUp(@Body(new ValidationPipe) signUpDto: SignUpDto) {
        return this.authService.signUpUser(signUpDto);
    }

    @Public()
    @Get('verify-email/:token')
    async verifyEmail(@Param('token') verificationToken: string) {
        return this.authService.verifyUserEmail(verificationToken);
    }

    @Public()
    @Post('resend-email-verification')
    async resendEmailVerification(@Body(ValidationPipe) emailDto: EmailDto) {
        console.log('Email: ', emailDto.email);
        return this.authService.resendEmailVerification(emailDto.email);
    }

    @Public()
    @Post('forgot-password')
    async forgotPassword(@Body(ValidationPipe) emailDto: EmailDto) {
        return this.authService.forgotPassword(emailDto.email)
    }

    @Public()
    @Post('reset-password/:token')
    async resetPassword(@Param('token') token: string, @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(token, resetPasswordDto);
    }

    @Get('me')
    getProfile(@Request() req) {
        return req.user;
    }

    @Roles(RoleEnum.Admin)
    @Get('check-admin')
    checkAdminRole() {
        return 'Admin Role working'
    }

    @Roles(RoleEnum.User)
    @Get('check-user')
    checkUserRole() {
        return 'User Role working'
    }
}
