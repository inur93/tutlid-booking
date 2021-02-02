import { DocumentType, getModelForClass, prop } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Model } from 'mongoose';

export enum UserRole {
    read = 'read',
    basic = 'basic',
    admin = 'admin',
}

export enum UserStatus {
    pendingApproval = 'pendingApproval',
    approved = 'approved',
    rejected = 'rejected'
}
class User extends Base {
    @prop({ required: true })
    public fullName!: string

    @prop({ unique: true, required: true })
    email!: string;

    @prop({ required: true })
    password!: string;

    @prop({ enum: UserRole, default: [UserRole.read], type: String })
    roles: UserRole[] = [];

    @prop({ enum: UserStatus, default: UserStatus.pendingApproval, type: String })
    status!: UserStatus;

    @prop({ default: false })
    deleted!: boolean;
}

const UserModel = getModelForClass(User) as Model<DocumentType<User>>;
export {
    UserModel, User
};