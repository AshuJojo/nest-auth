import { IsNotEmpty, IsString, MaxLength, MinLength } from "@nestjs/class-validator";

export class ResetPasswordDto {
    @IsString()
    @MinLength(4, { message: "Minimum password length is 4." })
    @MaxLength(15, { message: "Maximum password length is 15." })
    @IsNotEmpty({message: 'All fields are required.'})
    password: string;

    @IsString()
    @IsNotEmpty({message: 'All fields are required.'})
    confirmPassword: string;
}