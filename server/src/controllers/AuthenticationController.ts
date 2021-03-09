
import jwt from 'jsonwebtoken';
import { IContainer } from '../container';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import TokenData from '../interfaces/tokenData.interface';
import LogInDto from '../models/auth/loginDto';
import { CreateUserDto } from '../models/user/userViewModels';
import { UserLoginData } from '../models/user/UserModels';
import { IUserRepository } from '../repositories/UserRepository';
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

        const { _id } = await this.userRepository.create({
            fullName,
            email,
            password: await hashPassword(password)
        });

        //make sure to get object with all fields populated
        const user = await this.userRepository.findById(_id);

        return this.createToken(user)
    }

    public async login({ email, password }: LogInDto): Promise<TokenData> {
        const existingUser = await this.userRepository.findOne({ email });
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
        const secret = process.env.JWT_SECRET || 'secret';
        const dataStoredInToken = {
            id: user._id,
            email: user.email,
            fullName: user.fullName
        };
        
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
            user
        };
    }
}
