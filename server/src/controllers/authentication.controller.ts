
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import LogInDto from '../models/auth/login.dto';
import { CreateUserDto } from '../models/user/user.dto';
import { User, UserModel, UserRole } from '../models/user/user.entity';
import { comparePassword, hashPassword } from '../utils/security';
class AuthenticationController {

    public async register(userData: CreateUserDto): Promise<User> {
        const existing = await UserModel.findOne({ email: userData.email }).exec();
        if (existing) {
            throw new UserWithThatEmailAlreadyExistsException(userData.email);
        }
        const user = await UserModel.create({
            ...userData,
            password: await hashPassword(userData.password),
            approvedByAdmin: false,
            roles: [UserRole.read]
        });
        user.password = undefined;
        return user;
    }

    public async login(loginData: LogInDto): Promise<User> {
        const user = await UserModel.findOne({ email: loginData.email });
        if (!user) throw new InvalidCredentialsException();

        if (!comparePassword(loginData.password, user.password)) throw new InvalidCredentialsException();
        user.password = undefined;
        return user;
    }

}

export default AuthenticationController;