
import { IContainer } from '../container';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import LogInDto from '../models/auth/loginDto';
import { CreateUserDto } from '../models/user/user.dto';
import { User } from '../models/user/user.entity';
import { IUserRepository } from '../repositories/user.repo';
import { comparePassword, hashPassword } from '../utils/security';

export interface IAuthenticationController {
    register(data: CreateUserDto): Promise<User>
    login({ email, password }: LogInDto): Promise<User>
}
export default class AuthenticationController implements IAuthenticationController {
    private readonly userRepository: IUserRepository
    constructor({ userRepository }: IContainer) {
        this.userRepository = userRepository;
    }
    public async register({ email, password, fullName }: CreateUserDto): Promise<User> {

        const existing = await this.userRepository.findOne({ email });
        if (existing) {
            throw new UserWithThatEmailAlreadyExistsException(email);
        }
        return this.userRepository.create({
            fullName,
            email,
            password: await hashPassword(password)
        });
    }

    public async login({ email, password }: LogInDto): Promise<User> {
        const user = await this.userRepository.findOne({ email }, true);
        if (!user) {
            throw new InvalidCredentialsException();
        }

        if (!await comparePassword(password, user.password)) {
            throw new InvalidCredentialsException();
        }

        return this.userRepository.findById(user._id);
    }
}
