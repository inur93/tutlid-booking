
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { IContainer } from '../container';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import MissingPermissionsException from '../exceptions/MissingPermissionsException';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import { Login } from '../models/auth/Login';
import { TokenContent } from '../models/auth/TokenContent';
import { TokenData } from '../models/auth/tokenData';
import { CreateUser } from '../models/user/CreateUser';
import { GetAdminUser } from '../models/user/GetAdminUser';
import { ResetUserPassword } from '../models/user/ResetUserPassword';
import { UpdateUserPassword } from '../models/user/UpdateUserPassword';
import { UserRole } from '../models/user/UserRole';
import { UserStatus } from '../models/user/UserStatus';
import { IUserRepository } from '../repositories/UserRepository';
import { comparePassword, hashPassword } from '../utils/security';
import { IMailController } from './MailController';


export interface IAuthenticationController {
    register(data: CreateUser): Promise<TokenData>
    login({ email, password }: Login): Promise<TokenData>
    resetPassword({ email }: ResetUserPassword): Promise<void>
    updatePassword({ password, token }: UpdateUserPassword): Promise<void>
}
export default class AuthenticationController implements IAuthenticationController {
    private readonly userRepository: IUserRepository
    private readonly mailController: IMailController
    constructor({ userRepository, mailController }: IContainer) {
        this.userRepository = userRepository;
        this.mailController = mailController;
    }
    public async register({ email, password, fullName }: CreateUser): Promise<TokenData> {

        const existing = await this.userRepository.findOne({ email });
        if (existing) {
            throw new UserWithThatEmailAlreadyExistsException(email);
        }

        const { _id } = await this.userRepository.create({
            fullName,
            email,
            password: await hashPassword(password),
            deleted: false,
            roles: [UserRole.read],
            status: UserStatus.pendingApproval
        });

        //make sure to get object with all fields populated
        const user = await this.userRepository.findById(_id);

        return this.createToken(user)
    }

    public async login({ email, password }: Login): Promise<TokenData> {
        const existingUser = await this.userRepository.findOne({ email });
        if (!existingUser) {
            throw new InvalidCredentialsException();
        }

        const { password: hash } = existingUser;
        const same = await comparePassword(password, hash);
        if (!same) {
            throw new InvalidCredentialsException();
        }

        const user = await this.userRepository.findById(existingUser._id);

        if (user.status !== UserStatus.approved) {
            throw new MissingPermissionsException("Your account has not yet been approved");
        }

        return this.createToken(user);
    }


    public async resetPassword({ email }: ResetUserPassword): Promise<void> {

        try {
            const user = await this.userRepository.findOne({ email });
            if (!user) return;
            const tokenData = this.createToken(user, 60 * 60); // 1 hour
            console.log('token', tokenData.token);
            this.mailController.sendResetPassword(user, tokenData.token);

        } catch (e) {
            console.error(`could not reset password for ${email}`, e);
            throw e;
        }
    }

    public async updatePassword({ password, token }: UpdateUserPassword): Promise<void> {
        try {
            const { id } = this.decodeToken(token);
            const user = await this.userRepository.findById(Types.ObjectId(id));
            user.password = await hashPassword(password);
            user.save();
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

    private createToken(user: GetAdminUser, expiration: number = 0): TokenData {
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
