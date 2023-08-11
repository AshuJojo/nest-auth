import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';


@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' }
            }),
            inject: [ConfigService],
        })
    ],

    controllers: [AuthController],

    providers: [
        AuthService,
        {
            // Provide Auth Gaurd to complete application
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AuthModule { }
