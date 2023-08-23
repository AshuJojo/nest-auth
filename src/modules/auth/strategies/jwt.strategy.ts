import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { ConfigService } from "@nestjs/config";
import { Constants } from "src/constants/constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            usernameField: Constants.attributes.EMAIL,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get<string>('JWT_SECRET'),
            ignoreExpiration: false
        })
    }

    async validate(payload: any) {
        return { _id: payload._id, email: payload.email, roles: payload.roles }
    }
}