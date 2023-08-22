import { ConflictException, NotFoundException, BadRequestException, InternalServerErrorException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { CastError } from 'mongoose/lib/error';
import { RoleEnum } from '../roles/role.enum';
import { Constants } from 'src/constants/constants';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ) { }

    // Create a new User in database
    async createUser(createUserDto: CreateUserDto) {
        try {
            if (!createUserDto.roles) {
                createUserDto.roles = [RoleEnum.User];
            }

            const newUser = await this.userModel.create(createUserDto);

            const { password, ...res } = newUser.toObject();
            return res;
        } catch (error) {
            if (error.code === 11000)
                throw new ConflictException(Constants.ErrorMessages.EMAIL_CONFLICT);

            throw new InternalServerErrorException(Constants.ErrorMessages.FAILED_CREATE_USER);
        }
    }

    // Get all users from database
    async getUsers() {
        try {
            const users = await this.userModel.find();
            const processedUsers = users.map(user => {
                if (!user) {
                    return [];
                }
                const { password, ...res } = user.toObject();
                return res;
            });
            return processedUsers;
        } catch (error) {
            throw new InternalServerErrorException(Constants.ErrorMessages.FAILED_FETCH_USERS);
        }
    }


    // Get user with id
    async getUserById(id: string) {
        const user = await this.userModel.findById(id);

        if (!user) {
            throw new NotFoundException(Constants.ErrorMessages.USER_NOT_FOUND);
        }

        return user;
    }

    // Get user by email
    async getUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email: email.toLowerCase() })

        if (!user)
            throw new NotFoundException(Constants.ErrorMessages.EMAIL_NOT_FOUND)

        return user;
    }

    // Update a existing user
    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        try {
            await this.userModel.findByIdAndUpdate(id, updateUserDto)

            const { _id, email } = await this.userModel.findById(id);

            return { _id, email }
        } catch (error) {
            if (error instanceof CastError) {
                throw new BadRequestException(Constants.ErrorMessages.INVALID_ID_FORMAT);
            } else if (error instanceof TypeError) {
                throw new NotFoundException(Constants.ErrorMessages.USER_NOT_FOUND);
            } else {
                console.error('Error during updateUser operation:', error);
                throw new InternalServerErrorException(Constants.ErrorMessages.FAILED_UPDATE_USER);
            }
        }
    }

    // delete a user from database
    async removeUser(id: string) {
        try {
            const { _id, email } = await this.userModel.findByIdAndDelete(id);
            return { _id, email };
        } catch (error) {
            if (error instanceof CastError) {
                throw new BadRequestException(Constants.ErrorMessages.INVALID_ID_FORMAT);
            } else if (error instanceof TypeError) {
                throw new NotFoundException(Constants.ErrorMessages.USER_NOT_FOUND);
            } else {
                console.error('Error during updateUser operation:', error);
                throw new InternalServerErrorException(Constants.ErrorMessages.FAILED_DELETE_USER);
            }
        }
    }
}
