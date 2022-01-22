import { Types } from 'mongoose';
import { IContainer } from '../container';
import NotFoundException from '../exceptions/NotFoundException';
import { BasicUser, DetailedUser, UserRole, UserStatus } from '../models/user/UserModels';
import { UpdateSelfDto } from '../models/user/userViewModels';
import { IUserRepository } from '../repositories/UserRepository';
import Mapper from '../utils/Mapper';

export interface IUserController {
    get(status?: UserStatus): Promise<DetailedUser[]>
    getById(id: Types.ObjectId): Promise<BasicUser>
    getDetailsById(id: Types.ObjectId): Promise<DetailedUser>
    getSelf(id: Types.ObjectId): Promise<DetailedUser>
    update(id: Types.ObjectId, update: UpdateSelfDto): Promise<BasicUser>
    changeStatus(id: Types.ObjectId, status: UserStatus): Promise<DetailedUser>
    addRole(id: Types.ObjectId, role: UserRole): Promise<DetailedUser>
    removeRole(id: Types.ObjectId, role: UserRole): Promise<DetailedUser>
}
export default class UserController implements IUserController {
    userRepository: IUserRepository;
    constructor({ userRepository }: IContainer) {
        this.userRepository = userRepository;
    }
    public async get(status?: UserStatus): Promise<DetailedUser[]> {
        const query: any = {};
        if (status) { query.status = status; }
        const users = await this.userRepository.findMany({
            status
        })
        return users.map(Mapper.toAdminViewUser);
    }

    public async getById(id: Types.ObjectId): Promise<BasicUser> {

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`user id ${id} was not found`);
        }

        return Mapper.toViewBasicUser(user);
    }

    public async getDetailsById(id: Types.ObjectId): Promise<DetailedUser> {

        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`user id ${id} was not found`);
        }

        return Mapper.toAdminViewUser(user);
    }

    public async getSelf(id: Types.ObjectId): Promise<DetailedUser> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException(`user id ${id} was not found`);
        }

        return Mapper.toDetailedUser(user);
    }

    public async update(id: Types.ObjectId, update: UpdateSelfDto): Promise<BasicUser> {
        const user = await this.userRepository.updateOne(id, update);
        if (!user) {
            throw new NotFoundException(`user id ${id} was not found`);
        }
        return Mapper.toViewBasicUser(user);
    }

    public async changeStatus(id: Types.ObjectId, status: UserStatus): Promise<DetailedUser> {

        const update = {
            status,
            role: UserRole.basic
        };

        const user = await (status === UserStatus.approved ?
            this.userRepository.addRole(id, update) :
            this.userRepository.removeRole(id, update))
        return Mapper.toAdminViewUser(user);
    }

    public async addRole(id: Types.ObjectId, role: UserRole): Promise<DetailedUser> {
        const user = await this.userRepository.addRole(id, { role });
        return Mapper.toAdminViewUser(user);
    }

    public async removeRole(id: Types.ObjectId, role: UserRole): Promise<DetailedUser> {
        const user = await this.userRepository.removeRole(id, { role });
        return Mapper.toAdminViewUser(user);
    }
}
