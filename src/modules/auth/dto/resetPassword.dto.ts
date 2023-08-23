import { IsNotEmpty, IsString, MaxLength, MinLength } from "@nestjs/class-validator";
import { Constants } from "src/constants/constants";

export class ResetPasswordDto {
    @IsString()
    @MinLength(4, { message: Constants.errorMessages.MIN_PASSWORD })
    @MaxLength(15, { message: Constants.errorMessages.MAX_PASSWORD })
    @IsNotEmpty({message: Constants.errorMessages.ALL_FIELDS_REQUIRED})
    password: string;

    @IsString()
    @IsNotEmpty({message: Constants.errorMessages.ALL_FIELDS_REQUIRED})
    confirmPassword: string;
}