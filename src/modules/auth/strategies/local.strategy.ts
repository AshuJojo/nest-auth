import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Constants } from 'src/constants/constants';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: Constants.attributes.EMAIL
        });
    }

    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);

        if (!user)
            throw new UnauthorizedException("Please check your password.");

        if (!user.isActive)
            throw new UnauthorizedException("Please verify your email address.");

        return user;
    }
}