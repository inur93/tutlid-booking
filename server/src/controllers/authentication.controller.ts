import * as bcrypt from 'bcrypt';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import LogInDto from '../models/auth/login.dto';
import { CreateUserDto } from '../models/user/user.dto';
import { User, UserModel, UserRole } from '../models/user/user.entity';
class AuthenticationController {

    public async register(userData: CreateUserDto): Promise<User> {
        console.log('finding existing...');
        const existing = await UserModel.findOne({ email: userData.email }).exec();
        console.log('existing', existing);
        if (existing) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = await UserModel.create({
            ...userData,
            password: hashedPassword,
            approvedByAdmin: false,
            roles: [UserRole.read]
        });
        user.password = undefined;
        return user;
    }

    public async login(loginData: LogInDto): Promise<User> {
        const user = await UserModel.findOne({ email: loginData.email });
        if (!user) throw new InvalidCredentialsException();

        if (!bcrypt.compareSync(loginData.password, user.password)) throw new InvalidCredentialsException();
        user.password = undefined;
        return user;
    }

}

export default AuthenticationController;