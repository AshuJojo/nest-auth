import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsEmail({}, { message: 'Please enter correct email address.' })
    email: string;

    @MinLength(3, { message: "Minimum password length is 3." })
    password: string;
}
