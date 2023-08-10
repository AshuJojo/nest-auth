import { Injectable } from '@nestjs/common';
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

    async create(createUserDto: CreateUserDto) {
        try {
            const newUser = await this.userModel.create(createUserDto);
            return newUser;
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async findAll() {
        return await this.userModel.find();
    }

    async findOne(id: string) {
        const user = await this.userModel.findById(id);

        if (!user)
            throw new Error("No User Found")

        return user;
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        try {
            const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto)
            return await this.userModel.findById(id)
        } catch (err) {
            throw new Error(err.message)
        }
    }

    async remove(id: string) {
        try {
            const deletedUser = await this.userModel.findByIdAndDelete(id);
            return deletedUser;
        } catch (err) {
            throw new Error(err.message)
        }
    }
}
