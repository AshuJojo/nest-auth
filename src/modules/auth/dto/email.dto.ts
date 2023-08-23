import { IsEmail, IsNotEmpty } from "class-validator";
import { Constants } from "src/constants/constants";

export class EmailDto {
    @IsEmail({}, { message: Constants.errorMessages.INVALID_EMAIL})
    @IsNotEmpty({ message: Constants.errorMessages.ALL_FIELDS_REQUIRED })
    email: string;
}