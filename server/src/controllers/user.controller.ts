import { Types } from 'mongoose';
import NotFoundException from '../exceptions/NotFoundException';
import { UpdateUserDto } from '../models/user/user.dto';
import { UserModel } from '../models/user/user.entity';
class UserController {

    public async getById(id: Types.ObjectId) {
        const user = await UserModel.findOne(id);
        return user;
    }

    public async update(update: UpdateUserDto) {
        const { id, ...data } = update;
        await UserModel.update(id, data);
        const user = await UserModel.findOne(id);
        if (user) {
            return user;
        } else {
            throw new NotFoundException(`user id ${id} was not found`);
        }
    }
}

export default UserController;