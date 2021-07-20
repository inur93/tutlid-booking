import { Types } from 'mongoose';
import { IContainer } from '../container';
import { GetAdminUser } from '../models/user/GetAdminUser';
import { GetSelf } from '../models/user/GetSelf';
import { UpdateSelf } from '../models/user/UpdateSelf';
import { UserRole } from '../models/user/UserRole';
import { UserStatus } from '../models/user/UserStatus';
import { IUserRepository } from '../repositories/UserRepository';
import Mapper from '../utils/Mapper';

export interface IUserController {
    get(status?: UserStatus): Promise<GetAdminUser[]>
    getById(id: Types.ObjectId): Promise<GetSelf>
    getDetailsById(id: Types.ObjectId): Promise<GetAdminUser>
    getSelf(id: Types.ObjectId): Promise<GetSelf>
    update(id: Types.ObjectId, update: UpdateSelf): Promise<GetSelf>
    changeStatus(id: Types.ObjectId, status: UserStatus): Promise<GetAdminUser>
    addRole(id: Types.ObjectId, role: UserRole): Promise<GetAdminUser>
    removeRole(id: Types.ObjectId, role: UserRole): Promise<GetAdminUser>
}
export default class UserController implements IUserController {
    userRepository: IUserRepository;
    constructor({ userRepository }: IContainer) {
        this.userRepository = userRepository;
    }
    public async get(status?: UserStatus): Promise<GetAdminUser[]> {
        const query: any = {};
        if (status) { query.status = status; }
        const users = await this.userRepository.find({
            status
        })
        return users.map(Mapper.toGetAdminUser);
    }

    public async getById(id: Types.ObjectId): Promise<GetSelf> {
        const user = await this.userRepository.findById(id);
        return Mapper.toGetSelf(user);
    }

    public async getDetailsById(id: Types.ObjectId): Promise<GetAdminUser> {
        const user = await this.userRepository.findById(id);
        return Mapper.toGetAdminUser(user);
    }

    public async getSelf(id: Types.ObjectId): Promise<GetAdminUser> {
        const user = await this.userRepository.findById(id);
        return Mapper.toGetAdminUser(user);
    }

    public async update(id: Types.ObjectId, update: UpdateSelf): Promise<GetSelf> {
        const user = await this.userRepository.findById(id);
        await user.update(update).exec();
        return Mapper.toGetSelf(user);
    }

    public async changeStatus(id: Types.ObjectId, status: UserStatus): Promise<GetAdminUser> {

        const user = await this.userRepository.findById(id);

        user.status = status;
        if (status === UserStatus.approved) {
            if (!user.roles.includes(UserRole.basic)) {
                user.roles.push(UserRole.basic)
            }
        } else {
            user.roles = user.roles.filter(x => x != UserRole.basic && x != UserRole.admin)
        }
        await user.save();
        return Mapper.toGetAdminUser(user);
    }

    public async addRole(id: Types.ObjectId, role: UserRole): Promise<GetAdminUser> {
        const user = await this.userRepository.findById(id);
        if (!user.roles.includes(role)) {
            user.roles.push(role);
            await user.save();
        }

        return Mapper.toGetAdminUser(user);
    }

    public async removeRole(id: Types.ObjectId, role: UserRole): Promise<GetAdminUser> {
        const user = await this.userRepository.findById(id);
        user.roles = user.roles.filter(x => x != role);
        await user.save();
        return Mapper.toGetAdminUser(user);
    }
}
