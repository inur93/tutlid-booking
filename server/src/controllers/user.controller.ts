import { Types } from 'mongoose';
import NotFoundException from '../exceptions/NotFoundException';
import { UpdateUserDto } from '../models/user/user.dto';
import { UserModel, UserStatus } from '../models/user/user.entity';
class UserController {

    public async getById(id: Types.ObjectId) {
        const user = await UserModel.findOne(id, { password: false });
        return user;
    }

    public async update(update: UpdateUserDto) {
        const { id, ...data } = update;
        await UserModel.updateOne({ _id: id }, data);
        const user = await UserModel.findOne(id, { password: false });
        if (user) {
            return user;
        } else {
            throw new NotFoundException(`user id ${id} was not found`);
        }
    }

    public async getPendingApproval() {
        return await UserModel.find({
            status: UserStatus.pendingApproval
        }, { password: false });
    }
}

export default UserController;