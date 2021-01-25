import { Types } from 'mongoose';
import NotFoundException from '../exceptions/NotFoundException';
import { UpdateSelfDto } from '../models/user/user.dto';
import { UserModel, UserRole, UserStatus } from '../models/user/user.entity';
class UserController {

    public async get(status?: UserStatus) {
        let query: any = {};
        if (status) query.status = status;

        return await UserModel.find(query, { password: false });
    }

    public async getById(id: Types.ObjectId) {
        const user = await UserModel.findOne(id, { password: false });
        return user;
    }

    public async update(id: Types.ObjectId, update: UpdateSelfDto) {
        await UserModel.updateOne({ _id: id }, update);
        const user = await UserModel.findOne(id, { password: false });
        if (user) {
            return user;
        } else {
            throw new NotFoundException(`user id ${id} was not found`);
        }
    }

    public async changeStatus(id: Types.ObjectId, status: UserStatus) {
        if (status === UserStatus.approved) {
            await UserModel.updateOne({ _id: id }, {
                status,
                $addToSet: { roles: UserRole.basic }
            })
        } else {
            await UserModel.updateOne({ _id: id }, {
                status
            })
        }
        return await UserModel.findOne(id, { password: false });
    }

    public async addRole(id: Types.ObjectId, role: UserRole) {
        await UserModel.updateOne({ _id: id }, {
            $addToSet: { roles: role }
        })

        return await UserModel.findOne(id, { password: false });
    }

    public async removeRole(id: Types.ObjectId, role: UserRole) {
        await UserModel.updateOne({ _id: id }, {
            $pull: { roles: role }
        })

        return await UserModel.findOne(id, { password: false });
    }
}

export default UserController;