import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'

import { IS_PUBLIC_KEY } from './auth.decorator'


@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    async canActivate(
        context: ExecutionContext
    ): Promise<boolean> {
        // get if the route is private or public from controller route
        // If route have @Public annotation that means the route is Public,
        // else it is protected with AuthGaurd
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // if the route is public,
        // anyone can use that route
        if (isPublic) {
            return true;
        }

        // Get bearer token from request header
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        // if token is not available return unauthorized exception
        if (!token)
            throw new UnauthorizedException();

        // verify jwt token from request header elsewise return unauthorized exception
        try {
            const payload = await this.jwtService.verifyAsync(token);
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException();
        }

        // Return true if user is authorized 
        return true;
    }

    // Method to extract token from request header
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
