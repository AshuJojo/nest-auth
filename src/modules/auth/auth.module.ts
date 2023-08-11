import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1m' }
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
