import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './gaurds/local-auth.guard';

import { AuthService } from './auth.service';
import { JwtGaurd } from './gaurds/jwt.guard';
import { Public } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
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
