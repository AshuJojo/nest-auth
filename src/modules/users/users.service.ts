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
                throw new ConflictException(Constants.errorMessages.EMAIL_CONFLICT);

            throw new InternalServerErrorException(Constants.errorMessages.FAILED_CREATE_USER);
        }
    }

    // Get all users from database
    async getUsers() {
        const users = await this.userModel.find()
            .catch(error => {
                console.error('getUsers(): ', error);
                throw new InternalServerErrorException(Constants.errorMessages.FAILED_FETCH_USERS);
            });
        const processedUsers = users
            .map(user => {
                if (!user) {
                    return [];
                }
                const { password, ...res } = user.toObject();
                return res;
            });
        return processedUsers;

    }


    // Get user with id
    async getUserById(id: string) {
        const user = await this.userModel.findById(id)
            .catch(error => {
                console.log('getUserById(): ', error)
                throw new InternalServerErrorException(Constants.errorMessages.FAILED_FETCH_USERS)
            });

        if (!user) {
            throw new NotFoundException(Constants.errorMessages.USER_NOT_FOUND);
        }

        return user;
    }

    // Get user by email
    async getUserByEmail(email: string) {
        const user = await this.userModel.findOne({ email: email.toLowerCase() })
            .catch((error) => {
                console.log('getUserByEmail(): ', error)
                throw new InternalServerErrorException(Constants.errorMessages.FAILED_FETCH_USERS)
            })

        if (!user)
            throw new NotFoundException(Constants.errorMessages.EMAIL_NOT_FOUND)

        return user;
    }

    // Update a existing user
    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        try {
            await this.userModel.findByIdAndUpdate(id, updateUserDto)

            const { _id, email } = await this.userModel.findById(id);

            return { _id, email }
        } catch (error) {
            console.error('updateUser(): ', error)
            
            if (error instanceof CastError) {
                throw new BadRequestException(Constants.errorMessages.INVALID_ID_FORMAT);
            } else if (error instanceof TypeError) {
                throw new NotFoundException(Constants.errorMessages.USER_NOT_FOUND);
            }

            throw new InternalServerErrorException(Constants.errorMessages.FAILED_UPDATE_USER);
        }
    }

    // delete a user from database
    async removeUser(id: string) {
        const { _id, email } = await this.userModel.findByIdAndDelete(id)
            .catch(error => {
                console.error('removeUser(): ', error)
                if (error instanceof CastError) {
                    throw new BadRequestException(Constants.errorMessages.INVALID_ID_FORMAT);
                } else if (error instanceof TypeError) {
                    throw new NotFoundException(Constants.errorMessages.USER_NOT_FOUND);
                }
                console.error('Error during removeUser operation:', error);
                throw new InternalServerErrorException(Constants.errorMessages.FAILED_DELETE_USER);
            });
        return { _id, email };

    }
}
