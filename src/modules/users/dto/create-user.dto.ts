import { IsEnum, IsEmail, IsOptional, IsString, MaxLength, MinLength } from '@nestjs/class-validator';
import { Constants } from 'src/constants/constants';
import { RoleEnum } from 'src/modules/roles/role.enum';

export class CreateUserDto {
    @IsEmail({}, { message: Constants.ErrorMessages.INVALID_EMAIL})
    email: string;

    @IsString()
    @MinLength(4, { message: Constants.ErrorMessages.MIN_PASSWORD})
    @MaxLength(15, { message: Constants.ErrorMessages.MAX_PASSWORD })
    password: string;

    @IsEnum(RoleEnum, { each: true })
    @IsOptional()
    roles?: RoleEnum[];
}
