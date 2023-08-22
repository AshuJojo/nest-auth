import { IsBoolean, IsEmail, IsEnum, IsOptional, MinLength } from "@nestjs/class-validator";
import { RoleEnum } from "src/modules/roles/role.enum";

export class UserDto {
    _id?: string;

    @IsEmail({}, { message: 'Please enter correct email address.' })
    email?: string;


    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsEnum(RoleEnum, { each: true })
    @IsOptional()
    roles?: RoleEnum[];
}