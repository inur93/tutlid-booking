import { Types } from 'mongoose';
import NotFoundException from '../exceptions/NotFoundException';
import { UpdateSelfDto } from '../models/user/user.dto';
import { User, UserRole, UserStatus } from '../models/user/user.entity';
import { IUserRepository } from '../repositories/user.repo';
import { IContainer } from '../container';

export interface IUserController {
    get(status?: UserStatus): Promise<User[]>
    getById(id: Types.ObjectId): Promise<User>
    update(id: Types.ObjectId, update: UpdateSelfDto): Promise<User>
    changeStatus(id: Types.ObjectId, status: UserStatus): Promise<User>
    addRole(id: Types.ObjectId, role: UserRole): Promise<User>
    removeRole(id: Types.ObjectId, role: UserRole): Promise<User>
}
export default class UserController implements IUserController {
    userRepository: IUserRepository;
    constructor({ userRepository }: IContainer) {
        this.userRepository = userRepository;
    }
    public async get(status?: UserStatus) {
        const query: any = {};
        if (status) { query.status = status; }
        return this.userRepository.findMany({
            status
        })
    }

    public async getById(id: Types.ObjectId) {

        try {
            const user = await this.userRepository.findById(id);

            if (!user) { throw new NotFoundException(`user id ${id} was not found`); }
            return user;
        } catch (e) {
            console.log('e', e);
        }
        return await this.userRepository.findById(id);
    }

    public async update(id: Types.ObjectId, update: UpdateSelfDto) {
        const user = this.userRepository.updateOne({
            _id: id,
            ...update
        })
        if (!user) { throw new NotFoundException(`user id ${id} was not found`); }
        return user;
    }

    public async changeStatus(id: Types.ObjectId, status: UserStatus) {

        const update = {
            _id: id,
            status,
            role: UserRole.basic
        };

        return (status === UserStatus.approved ?
            this.userRepository.addRole(update) :
            this.userRepository.removeRole(update))
    }

    public async addRole(id: Types.ObjectId, role: UserRole) {
        return this.userRepository.addRole({
            _id: id,
            role: role
        });
    }

    public async removeRole(id: Types.ObjectId, role: UserRole) {
        return this.userRepository.removeRole({
            _id: id,
            role: role
        });
    }
}
