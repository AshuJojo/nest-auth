import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

import { AuthService } from './auth.service';
import { Public } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('login')
  login(@Body() singInDto: Record<string, any>) {
    return this.authService.validateUser(singInDto.email, singInDto.password);
  }

  @Get('/me')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @Post()
  signup() {

  }

  @Get()
  logout() {

  }
}
