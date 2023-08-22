import { IsBoolean, IsEmail, IsEnum, IsOptional, MinLength } from "@nestjs/class-validator";
import { ObjectId } from "mongoose";
import { RoleEnum } from "src/modules/roles/role.enum";

export class UserDto {
    _id?: ObjectId;

    @IsEmail({}, { message: 'Please enter correct email address.' })
    email?: string;

    @MinLength(3, { message: "Minimum password length is 3." })
    password?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsEnum(RoleEnum, { each: true })
    @IsOptional()
    roles?: RoleEnum[];
}