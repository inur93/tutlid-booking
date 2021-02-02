import { Types } from 'mongoose';
import NotFoundException from '../exceptions/NotFoundException';
import { UpdateSelfDto } from '../models/user/user.dto';
import { User, UserRole, UserStatus } from '../models/user/user.entity';
import { IUserRepository } from '../repositories/user.repo';

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
    constructor(userRepository: IUserRepository) {
        this.userRepository = userRepository;
    }
    public async get(status?: UserStatus) {
        let query: any = {};
        if (status) query.status = status;
        return await this.userRepository.findMany({
            status
        })
    }

    public async getById(id: Types.ObjectId) {
        const user = await this.userRepository.findById(id);
        if (!user) throw new NotFoundException(`user id ${id} was not found`);
        return user;

    }

    public async update(id: Types.ObjectId, update: UpdateSelfDto) {
        const user = this.userRepository.updateOne({
            _id: id,
            ...update
        })
        if (!user) throw new NotFoundException(`user id ${id} was not found`);
        return user;
    }

    public async changeStatus(id: Types.ObjectId, status: UserStatus) {

        const update = {
            _id: id,
            status,
            role: UserRole.basic
        };

        return await (status === UserStatus.approved ?
            this.userRepository.addRole(update) :
            this.userRepository.removeRole(update))
    }

    public async addRole(id: Types.ObjectId, role: UserRole) {
        return await this.userRepository.addRole({
            _id: id,
            role: role
        });
    }

    public async removeRole(id: Types.ObjectId, role: UserRole) {
        return await this.userRepository.removeRole({
            _id: id,
            role: role
        });
    }
}