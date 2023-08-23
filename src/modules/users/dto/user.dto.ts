import { IsBoolean, IsEmail, IsEnum, IsOptional, MinLength } from "@nestjs/class-validator";
import { Constants } from "src/constants/constants";
import { RoleEnum } from "src/modules/roles/role.enum";

export class UserDto {
    _id?: string;

    @IsEmail({}, { message: Constants.errorMessages.INVALID_EMAIL })
    email?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsEnum(RoleEnum, { each: true })
    @IsOptional()
    roles?: RoleEnum[];
}