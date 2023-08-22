import { Controller, Get, Post, Body, UseGuards, Request, ValidationPipe, Param } from '@nestjs/common';

import { LocalAuthGuard } from './gaurds/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/auth.decorator';
import { SignUpDto } from './dto/signUp.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/role.enum';
import { EmailVerificationDto } from './dto/emailVerificationDto';
import { ResetPasswordDto } from './dto/resetPasswordDto';

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
    async resendEmailVerification(@Body(ValidationPipe) emailVerificationDto: EmailVerificationDto) {
        console.log('Email: ', emailVerificationDto.email);
        return this.authService.resendEmailVerification(emailVerificationDto.email);
    }

    @Post('reset-password')
    async resetPassword(@Request() req, @Body(ValidationPipe) resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(req.user, resetPasswordDto);
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
