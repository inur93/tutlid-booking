import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { IContainer } from '../container';
import { IAuthenticationController } from '../controllers/authentication.controller';
import { IRoute } from '../interfaces/route.interface';
import TokenData from '../interfaces/tokenData.interface';
import validationMiddleware from '../middleware/validationMiddleware';
import LogInDto from '../models/auth/loginDto';
import { CreateUserDto } from '../models/user/user.dto';
import { User } from '../models/user/user.entity';

export default class AuthRoute implements IRoute {
    public path = '/auth';
    public router = Router();
    private readonly authenticationController: IAuthenticationController;
    constructor({ authenticationController }: IContainer) {
        this.authenticationController = authenticationController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.login);
        this.router.get(`${this.path}/logout`, this.logout);
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.register)
    }
    private readonly register = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.authenticationController.register(request.body);
            this.attachTokenAndCookie(response, user);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }
    private readonly login = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.authenticationController.login(request.body);
            this.attachTokenAndCookie(response, user);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }

    private readonly logout = async (_: Request, response: Response) => {
        response.setHeader('Set-Cookie', this.createCookie({ token: '', expiresIn: 0 }));
        response.send();
    }

    private readonly attachTokenAndCookie = async (response: Response, user: User) => {
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        response.setHeader('Set-Cookie', [cookie]);
    }
    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}; path=/; HttpOnly`;
    }
    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60 * 12; // 12 hours
        const secret = process.env.JWT_SECRET || '';
        const dataStoredInToken = {
            id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn })
        };
    }
}
