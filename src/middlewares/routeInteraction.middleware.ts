import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RouteInteractionMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const routePath = req.originalUrl;
        const routeMethod = req.method;

        // Log or track user interaction with the route
        console.log(`User accessed ${routeMethod} ${routePath}`);

        // Proceed to the route handler
        next();
    }
}
