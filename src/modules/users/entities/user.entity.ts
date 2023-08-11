import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes, Types } from 'mongoose';
import { Role } from 'src/modules/auth/enum/role.enum';

@Schema({
    timestamps: true
})
export class User {
    @Prop({ type: SchemaTypes.ObjectId })
    id: Types.ObjectId;

    @Prop({ type: SchemaTypes.String, unique: true })
    email: string;

    @Prop({ type: SchemaTypes.String })
    password: string;

    @Prop({ type: SchemaTypes.Array, default: 'user' })
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);