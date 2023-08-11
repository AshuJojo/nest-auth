import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { Role } from '../enum/role.enum'

@Injectable()
export class RolesGaurd implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ])

        // Check for @Roles(Role) annotation in controller
        // if it is not available return user can use this route
        if (!requiredRoles) {
            return true
        }

        const { user } = context.switchToHttp().getRequest();

        return requiredRoles.some((role) => user.roles?.includes(role));
    }
}