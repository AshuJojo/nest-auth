import { SetMetadata } from '@nestjs/common';

// Decoraters to check if the route is public or protected
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);