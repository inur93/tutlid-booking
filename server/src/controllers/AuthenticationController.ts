
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { IContainer } from '../container';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import MissingPermissionsException from '../exceptions/MissingPermissionsException';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import TokenData, { TokenContent } from '../interfaces/tokenData.interface';
import LogInDto from '../models/auth/loginDto';
import { UserLoginData, UserStatus } from '../models/user/UserModels';
import { CreateUserDto, ResetPasswordDto, UpdatePasswordDto } from '../models/user/userViewModels';
import { IUserRepository } from '../repositories/UserRepository';
import Mapper from '../utils/Mapper';
import { comparePassword, hashPassword } from '../utils/security';
import { IMailController } from './MailController';

export interface IAuthenticationController {
    register(data: CreateUserDto): Promise<TokenData>
    login({ email, password }: LogInDto): Promise<TokenData>
    resetPassword({ email }: ResetPasswordDto): Promise<void>
    updatePassword({ password, token }: UpdatePasswordDto): Promise<void>
}
export default class AuthenticationController implements IAuthenticationController {
    private readonly userRepository: IUserRepository
    private readonly mailController: IMailController
    constructor({ userRepository, mailController }: IContainer) {
        this.userRepository = userRepository;
        this.mailController = mailController;
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
        const userDoc = await this.userRepository.findById(_id);
        if (!userDoc) {
            throw new Error(`Something went wrong when creating the user`);
        }
        return this.createToken(Mapper.toUser(userDoc))
    }

    public async login({ email, password }: LogInDto): Promise<TokenData> {
        const existingUser = await this.userRepository.findOne({ email });
        if (!existingUser) {
            throw new InvalidCredentialsException();
        }

        const { password: hash } = existingUser;
        const same = await comparePassword(password, hash);
        if (!same) {
            throw new InvalidCredentialsException();
        }

        if (existingUser.status !== UserStatus.approved) {
            throw new MissingPermissionsException("Your account has not yet been approved");
        }

        return this.createToken(Mapper.toUser(existingUser));
    }


    public async resetPassword({ email }: ResetPasswordDto): Promise<void> {

        try {
            const userDoc = await this.userRepository.findOne({ email });
            if (!userDoc) return;
            const user = Mapper.toUser(userDoc);
            const tokenData = this.createToken(user, 60 * 60); // 1 hour
            this.mailController.sendResetPassword(user, tokenData.token);

        } catch (e) {
            console.error(`could not reset password for ${email}`, e);
            throw e;
        }
    }

    public async updatePassword({ password, token }: UpdatePasswordDto): Promise<void> {
        try {
            const { id } = this.decodeToken(token);
            await this.userRepository.updateOne(Types.ObjectId(id), {
                password: await hashPassword(password)
            })
        } catch (e) {
            console.warn('could not update password', e);
            throw e;
        }
    }

    private decodeToken(token: string): TokenContent {
        if (!jwt.verify(token, process.env.JWT_SECRET || 'secret')) {
            throw new Error('The token is no longer valid');
        }
        return jwt.decode(token) as TokenContent;
    }

    private createToken(user: UserLoginData, expiration: number = 0): TokenData {
        const expiresIn = expiration || (60 * 60 * 12); // 12 hours
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
