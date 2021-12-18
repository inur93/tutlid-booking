import { Types } from 'mongoose';
import { IContainer } from '../container';
import InvalidCredentialsException from '../exceptions/InvalidCredentialsException';
import MissingPermissionsException from '../exceptions/MissingPermissionsException';
import UserWithThatEmailAlreadyExistsException from '../exceptions/UserWithThatEmailAlreadyExistsException';
import { Login } from '../models/auth/Login';
import { TokenData } from '../models/auth/tokenData';
import { CreateUser } from '../models/user/CreateUser';
import { GetAdminUser } from '../models/user/GetAdminUser';
import { ResetUserPassword } from '../models/user/ResetUserPassword';
import { UpdateUserPassword } from '../models/user/UpdateUserPassword';
import { UserRole } from '../models/user/UserRole';
import { UserStatus } from '../models/user/UserStatus';
import { IUserRepository } from '../repositories/UserRepository';
import { comparePassword, createToken, decodeToken, hashPassword } from '../utils/security';
import { IMailController } from './MailController';


export interface IAuthenticationController {
    refreshToken(user: GetAdminUser): Promise<TokenData>;
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
    public async refreshToken(user: GetAdminUser): Promise<TokenData> {
        return createToken(user);
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

        return createToken(user)
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

        return createToken(user);
    }


    public async resetPassword({ email }: ResetUserPassword): Promise<void> {

        try {
            const user = await this.userRepository.findOne({ email });
            if (!user) return;
            const tokenData = createToken(user, 60 * 60); // 1 hour
            console.log('token', tokenData.token);
            this.mailController.sendResetPassword(user, tokenData.token);

        } catch (e) {
            console.error(`could not reset password for ${email}`, e);
            throw e;
        }
    }

    public async updatePassword({ password, token }: UpdateUserPassword): Promise<void> {
        try {
            const { id } = decodeToken(token);
            const user = await this.userRepository.findById(Types.ObjectId(id));
            user.password = await hashPassword(password);
            user.save();
        } catch (e) {
            console.warn('could not update password', e);
            throw e;
        }
    }




}
