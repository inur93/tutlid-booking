
import jwt from 'jsonwebtoken';
import { IContainer } from '../container';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import TokenData from '../interfaces/tokenData.interface';
import LogInDto from '../models/auth/loginDto';
import { CreateUserDto } from '../models/user/user.dto';
import { UserLoginData } from '../models/user/user.entity';
import { IUserRepository } from '../repositories/user.repo';
import { comparePassword, hashPassword } from '../utils/security';

export interface IAuthenticationController {
    register(data: CreateUserDto): Promise<TokenData>
    login({ email, password }: LogInDto): Promise<TokenData>
}
export default class AuthenticationController implements IAuthenticationController {
    private readonly userRepository: IUserRepository
    constructor({ userRepository }: IContainer) {
        this.userRepository = userRepository;
    }
    public async register({ email, password, fullName }: CreateUserDto): Promise<TokenData> {

        const existing = await this.userRepository.findOne({ email });
        if (existing) {
            throw new UserWithThatEmailAlreadyExistsException(email);
        }

        const { password: hash, ...user } = await this.userRepository.create({
            fullName,
            email,
            password: await hashPassword(password)
        });

        return this.createToken(user)
    }

    public async login({ email, password }: LogInDto): Promise<TokenData> {
        const existingUser = await this.userRepository.findOne({ email }, true);
        if (!existingUser) {
            throw new InvalidCredentialsException();
        }

        const { password: hash, ...user } = existingUser;
        if (!await comparePassword(password, hash)) {
            throw new InvalidCredentialsException();
        }

        return this.createToken(user);
    }

    public createToken(user: UserLoginData): TokenData {
        const expiresIn = 60 * 60 * 12; // 12 hours
        const secret = process.env.JWT_SECRET || '';
        const dataStoredInToken = {
            id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
            user
        };
    }
}
