import { Document, Model, model, models, Schema, Types } from 'mongoose';

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

export type UserLoginData = Omit<User, "password">
export type QueryUser = Partial<Pick<User, 'status' | 'email'>>
export type CreateUser = Pick<User, 'fullName' | 'email' | 'password'>;
export type UpdateUser = Partial<Pick<User, 'status' | 'fullName' | 'password' | 'roles'>>;
export type UpdateUserRole = Partial<Pick<User, 'status'>> & { role: UserRole; }
export type BasicUser = Pick<User, '_id' | 'fullName'>
export type DetailedUser = BasicUser & Pick<User, 'email' | 'roles' | 'status' | 'deleted'>
export type AuthUser = DetailedUser & Pick<User, 'password'>
export interface User {
    _id: Types.ObjectId,
    fullName: string;
    email: string;
    password: string;
    roles: UserRole[];
    status: UserStatus;
    deleted: boolean;
}

const UserSchemaFields: Record<keyof Omit<User, '_id'>, any> = {
    fullName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    roles: {
        type: [String],
        enum: UserRole,
        default: [UserRole.read]
    },
    status: {
        type: String,
        enum: UserStatus,
        default: UserStatus.pendingApproval
    },
    deleted: {
        type: Boolean,
        default: false
    }
}

const UserSchema = new Schema(UserSchemaFields);
export interface UserDoc extends Omit<User, '_id'>, Document { }
export const UserModel: Model<UserDoc> = models.User || model<UserDoc>('User', UserSchema);


