import { Types } from "mongoose";
import { CreateUser, QueryUser, UpdateUser, UpdateUserRole, User, UserModel } from "../models/user/UserModels";


export interface IUserRepository {
    create(user: CreateUser): Promise<User>
    findById(id: Types.ObjectId): Promise<User>
    findOne(query: QueryUser): Promise<User>
    findMany(query: QueryUser): Promise<User[]>
    updateOne(_id: Types.ObjectId, user: UpdateUser): Promise<User>
    addRole(_id: Types.ObjectId, update: UpdateUserRole): Promise<User>
    removeRole(_id: Types.ObjectId, update: UpdateUserRole): Promise<User>
}

export default class UserRepository implements IUserRepository {

    async create(user: CreateUser): Promise<User> {
        const created = await UserModel.create(user);
        return this.findById(created.id);
    }

    async findById(id: Types.ObjectId): Promise<User> {
        return UserModel.findById(id);
    }

    async findOne(query: QueryUser): Promise<User> {
        return UserModel.findOne(query);
    }
    async findMany(query: QueryUser): Promise<User[]> {
        return UserModel.find(query);
    }
    async updateOne(_id: Types.ObjectId, update: UpdateUser): Promise<User> {
        await UserModel.updateOne(
            { _id },
            update);
        return UserModel.findById(_id);
    }
    async addRole(_id: Types.ObjectId, { role, ...update }: UpdateUserRole): Promise<User> {
        await UserModel.updateOne(
            { _id },
            {
                ...update,
                $addToSet: { roles: role }
            })
        return UserModel.findById(_id);
    }
    async removeRole(_id: Types.ObjectId, { role, ...update }: UpdateUserRole): Promise<User> {
        await UserModel.updateOne({ _id }, {
            ...update,
            $pull: { roles: role }
        })
        return UserModel.findById(_id);
    }
}
