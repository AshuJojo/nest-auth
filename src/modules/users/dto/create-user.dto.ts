import { IsEnum } from '@nestjs/class-validator';
import { IsEmail, IsOptional, MinLength } from 'class-validator';
import { Role } from 'src/modules/auth/enum/role.enum';

export class CreateUserDto {
    @IsEmail({}, { message: 'Please enter correct email address.' })
    email: string;

    @MinLength(3, { message: "Minimum password length is 3." })
    password: string;

    @IsEnum(Role, { each: true })
    @IsOptional()
    roles: Role[];

}
