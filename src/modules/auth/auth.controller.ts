import { Controller, Get, Post, Body, UseGuards, Request, ValidationPipe } from '@nestjs/common';

import { LocalAuthGuard } from './gaurds/local-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/auth.decorator';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return this.authService.loginUser(req.user);
    }

    @Get('/me')
    getProfile(@Request() req) {
        return req.user;
    }

    @Public()
    @Post('signup')
    async signUp(@Body(new ValidationPipe) signUpDto: SignUpDto) {
        return this.authService.signUpUser(signUpDto);
    }

    @Get('logout')
    logout() {

    }
}
