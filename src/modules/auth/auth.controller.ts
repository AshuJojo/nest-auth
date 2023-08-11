import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() singInDto: Record<string, any>) {
    return this.authService.validateUser(singInDto.email, singInDto.password);
  }

  @Post()
  signup() {

  }

  @Get()
  logout() {

  }
}