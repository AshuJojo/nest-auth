import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>
    ) { }

    // Create a new User in database
    async createUser(createUserDto: CreateUserDto) {
        try {
            const user = await this.getUserByEmail(createUserDto.email);
            if (user)
                throw new BadRequestException('Email address already exists in our database.')
            const newUser = await this.userModel.create(createUserDto);
            return newUser;
        } catch (err) {
            throw new Error(err.message)
        }
    }

    // Get all users from database
    async getUsers() {
        return await this.userModel.find();
    }

    // Get user with id
    async getUserById(id: string) {
        const user = await this.userModel.findById(id);

        if (!user)
            throw new Error("No User Found")

        return user;
    }

    // Get user by email
    async getUserByEmail(email: string) {
        return await this.userModel.findOne({ email });
    }

    // Update a existing user
    async updateUser(id: string, updateUserDto: UpdateUserDto) {
        try {
            await this.userModel.findByIdAndUpdate(id, updateUserDto)
            const { _id, email, ...etc } = (await this.userModel.findById(id)).toObject();
            return { user: { _id, email } }
        } catch (err) {
            throw new Error(err.message)
        }
    }

    // delete a user from database
    async removeUser(id: string) {
        try {
            const deletedUser = await this.userModel.findByIdAndDelete(id);
            return deletedUser;
        } catch (err) {
            throw new Error(err.message)
        }
    }
}
