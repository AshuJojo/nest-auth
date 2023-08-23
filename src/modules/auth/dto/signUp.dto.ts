import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Constants } from "src/constants/constants";

export class SignUpDto {
    @IsEmail({}, { message: Constants.errorMessages.INVALID_EMAIL })
    @IsNotEmpty({ message: Constants.errorMessages.ALL_FIELDS_REQUIRED })
    email: string;

    @IsString()
    @IsNotEmpty({ message: Constants.errorMessages.ALL_FIELDS_REQUIRED })
    password: string;

    @IsString()
    @IsNotEmpty({ message: Constants.errorMessages.ALL_FIELDS_REQUIRED })
    confirmPassword: string;
}