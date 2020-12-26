import { getModelForClass, prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';

export enum UserRole {
    read = 'read',
    basic = 'basic',
    admin = 'admin',
}

class User extends Base {
    @prop({ required: true })
    public fullName: string

    @prop({ unique: true, required: true })
    email: string;

    @prop({ required: true })
    password: string;

    @prop({ enum: UserRole, default: UserRole.read, type: String })
    roles: UserRole[];

    @prop({ default: false })
    approvedByAdmin: boolean;
}

const UserModel = getModelForClass(User);
export {
    UserModel, User
};