import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'

import { IS_PUBLIC_KEY } from '../decorators/auth.decorator';

@Injectable()
export class JwtGaurd extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext) {
        console.log('JWT Context: ', context)
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        if (isPublic)
            return true;

        return super.canActivate(context);
    }
}
