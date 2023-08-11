import { IsEmail, IsNotEmpty } from "class-validator";

export class SignUpDto {
    @IsEmail({}, { message: 'Please enter correct email address.' })
    @IsNotEmpty({ message: 'All fields are required.' })
    email: string;

    @IsNotEmpty({ message: 'All fields are required.' })
    password: string;

    @IsNotEmpty({ message: 'All fields are required.' })
    confirmPassword: string;
}