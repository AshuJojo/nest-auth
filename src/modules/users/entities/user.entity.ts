import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { SchemaTypes, Types } from 'mongoose';
import { Role } from 'src/modules/auth/enum/role.enum';
import * as bcrypt from 'bcrypt';

@Schema({
    timestamps: true
})
export class User {
    @Prop({ type: SchemaTypes.ObjectId, required: false, auto: true })
    _id: Types.ObjectId;

    @Prop({ type: SchemaTypes.String, unique: true })
    email: string;

    @Prop({ type: SchemaTypes.String })
    password: string;

    @Prop({ type: SchemaTypes.Number, default: false })
    isActive: boolean;

    @Prop({ type: SchemaTypes.Array, default: 'user' })
    roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// called before saving a user in database
UserSchema.pre('save', async function (next) {
    try {
        if (!this.isModified('password')) {
            return next();
        }
        console.log(this);
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    } catch (err) {
        return next(err);
    }
})

// called before updating a user in database
UserSchema.pre('findOneAndUpdate', async function (next) {
    const updateFields = this.getUpdate() as { password: string };
    console.log("updateFields: ", updateFields);
    const password = updateFields.password;
    try {
        const rounds = bcrypt.getRounds(password);
        if (rounds === 0) {
            updateFields.password = await bcrypt.hash(password, 10);
        }
        return next();
    } catch (error) {
        updateFields.password = await bcrypt.hash(password, 10);
        return next();
    }
});