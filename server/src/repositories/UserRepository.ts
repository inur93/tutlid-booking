import { Types } from "mongoose";
import { CreateUser, QueryUser, UpdateUser, UpdateUserRole, User, UserDoc, UserModel, UserRole } from "../models/user/UserModels";


export interface IUserRepository {
    create(user: CreateUser): Promise<UserDoc>
    findById(id: Types.ObjectId): Promise<UserDoc | null>
    findOne(query: QueryUser): Promise<UserDoc | null>
    findMany(query: QueryUser): Promise<UserDoc[]>
    findAdmins(): Promise<UserDoc[]>
    updateOne(_id: Types.ObjectId, user: UpdateUser): Promise<UserDoc>
    addRole(_id: Types.ObjectId, update: UpdateUserRole): Promise<UserDoc>
    removeRole(_id: Types.ObjectId, update: UpdateUserRole): Promise<UserDoc>
}

export default class UserRepository implements IUserRepository {

    async create(user: CreateUser): Promise<UserDoc> {
        return UserModel.create(user);
    }

    async findById(id: Types.ObjectId): Promise<UserDoc | null> {
        return UserModel.findById(id);
    }

    async findOne(query: QueryUser): Promise<UserDoc | null> {
        return UserModel.findOne(query);
    }

    async findAdmins(): Promise<UserDoc[]> {
        return UserModel.find({ roles: UserRole.admin });
    }
    async findMany(query: QueryUser): Promise<UserDoc[]> {
        return UserModel.find(query);
    }
    async updateOne(_id: Types.ObjectId, update: UpdateUser): Promise<UserDoc> {
        await UserModel.updateOne(
            { _id },
            update);
        const updated = await UserModel.findById(_id);
        if (!updated) {
            throw new Error(`Could not update user. ${_id} was not found`);
        }
        return updated;
    }
    async addRole(_id: Types.ObjectId, { role, ...update }: UpdateUserRole): Promise<UserDoc> {
        await UserModel.updateOne(
            { _id },
            {
                ...update,
                $addToSet: { roles: role }
            })
        const updated = await UserModel.findById(_id);
        if (!updated) {
            throw new Error(`Could not update user. ${_id} was not found`);
        }
        return updated;
    }
    async removeRole(_id: Types.ObjectId, { role, ...update }: UpdateUserRole): Promise<UserDoc> {
        await UserModel.updateOne({ _id }, {
            ...update,
            $pull: { roles: role }
        })
        const updated = await UserModel.findById(_id);
        if (!updated) {
            throw new Error(`Could not update user. ${_id} was not found`);
        }
        return updated;
    }
}
