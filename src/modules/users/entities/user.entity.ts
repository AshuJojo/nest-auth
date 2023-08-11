import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes, Types } from 'mongoose';

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
}

export const UserSchema = SchemaFactory.createForClass(User);