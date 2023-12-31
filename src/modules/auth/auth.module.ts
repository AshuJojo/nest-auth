import { Module, Request } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt/dist';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtGaurd } from './gaurds/jwt.guard';
import { RolesGaurd } from '../roles/roles.gaurds';
import { MailModule } from '../mail/mail.module';


@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: '1h' }
            }),
            inject: [ConfigService],
        }),
        
        MailModule,
        UsersModule,
        PassportModule
    ],

    controllers: [AuthController],

    providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        {
            // Provide JWT Gaurd to complete application
            provide: APP_GUARD,
            useClass: JwtGaurd
        },
        {
            // Provide Roles Gaurd to complete application
            provide: APP_GUARD,
            useClass: RolesGaurd
        },
    ],

    exports: [AuthService]
})
export class AuthModule {
}
