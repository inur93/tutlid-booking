import { Types } from "mongoose";
import { User, UserModel, UserRole, UserStatus } from "../models/user/user.entity";
import { BaseRepository, IBaseRepository } from './base.repo';

type UserQuery = {
    status?: UserStatus,
    email?: string
}

type CreateUser = {
    fullName: string,
    email: string,
    password: string
}
type UpdateUser = {
    _id: Types.ObjectId;
    status?: UserStatus;
    fullName?: string;
    password?: string;
    roles?: UserRole[];
}

type UpdateUserRoleDto = {
    _id: Types.ObjectId;
    status?: UserStatus;
    role: UserRole;
}
export interface IUserRepository extends IBaseRepository<User, CreateUser, UpdateUser> {
    findById(id: Types.ObjectId, includePassword?: boolean): Promise<User>
    findOne(query: UserQuery, includePassword?: boolean): Promise<User>
    findMany(query: UserQuery): Promise<User[]>
    updateOne(user: UpdateUser): Promise<User>
    addRole(update: UpdateUserRoleDto): Promise<User>
    removeRole(update: UpdateUserRoleDto): Promise<User>
}

export default class UserRepository extends BaseRepository<User, CreateUser, UpdateUser> implements IUserRepository {

    constructor() {
        super(UserModel);
    }

    async create(user: CreateUser): Promise<User> {
        const created = await UserModel.create(user);
        return this.findById(created.id);
    }

    async findById(id: Types.ObjectId, includePassword: boolean = false): Promise<User> {
        return UserModel.findById(id, { password: includePassword });
    }

    async findOne(query: UserQuery, includePassword: boolean = false): Promise<User> {
        return UserModel.findOne(query, { password: includePassword });
    }
    async findMany(query: UserQuery): Promise<User[]> {
        return UserModel.find(query, { password: false });
    }
    async updateOne({ _id, ...update }: UpdateUser): Promise<User> {
        return UserModel.findOneAndUpdate(
            { _id },
            update,
            { projection: { password: false } });
    }
    async addRole({ _id, role, ...update }: UpdateUserRoleDto): Promise<User> {
        return UserModel.findOneAndUpdate({ _id }, {
            ...update,
            $addToSet: { roles: role }
        }, { projection: { password: false } })
    }
    async removeRole({ _id, role, ...update }: UpdateUserRoleDto): Promise<User> {
        return UserModel.findOneAndUpdate({ _id }, {
            ...update,
            $pull: { roles: role }
        }, { projection: { password: false } })
    }
}
