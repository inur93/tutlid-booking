
import { Document, Model, model, models, ObjectId, Schema, Types } from 'mongoose';
import { UserRole } from './UserRole';
import { UserStatus } from './UserStatus';

export interface User {
    _id?: Types.ObjectId,
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


export interface UserDoc extends Omit<User, '_id'>, Document { }
export interface UserModel extends Model<UserDoc> { }
export const UserSchema = new Schema<UserDoc, UserModel>(UserSchemaFields);
export default models.User || model<UserDoc>('User', UserSchema);


