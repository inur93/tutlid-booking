import { NextFunction, Request, Response, Router } from 'express';
import { IContainer } from '../container';
import { IAuthenticationController } from '../controllers/AuthenticationController';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/authMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';
import { Login } from '../models/auth/Login';
import { TokenData } from '../models/auth/tokenData';
import { CreateUser } from '../models/user/CreateUser';
import { ResetUserPassword } from '../models/user/ResetUserPassword';
import { UpdateUserPassword } from '../models/user/UpdateUserPassword';

export default class AuthRoute implements IRoute {
    public path = '/auth';
    public router = Router();
    private readonly authenticationController: IAuthenticationController;
    constructor({ authenticationController }: IContainer) {
        this.authenticationController = authenticationController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, validationMiddleware(Login), this.login);
        this.router.get(`${this.path}/logout`, this.logout);
        this.router.post(`${this.path}/token/refresh`, authMiddleware(), this.refreshToken);
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUser), this.register);
        this.router.post(`${this.path}/reset-password`, validationMiddleware(ResetUserPassword), this.resetPassword)
        this.router.post(`${this.path}/update-password`, validationMiddleware(UpdateUserPassword), this.updatePassword)
    }
    private readonly register = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const token = await this.authenticationController.register(request.body);
            this.attachTokenAndCookie(response, token);
            response.send(token.user);
        } catch (e) {
            next(e);
        }
    }
    private readonly login = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const token = await this.authenticationController.login(request.body);
            this.attachTokenAndCookie(response, token);
            response.send(token);
        } catch (e) {
            next(e);
        }
    }

    private readonly refreshToken = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const token = await this.authenticationController.refreshToken(request.user);
            this.attachTokenAndCookie(response, token);
            response.send(token);
        } catch (e) {
            next(e);
        }
    }

    private readonly logout = async (_: Request, response: Response) => {
        response.setHeader('Set-Cookie', this.createCookie({ token: '', expiresIn: 0 }));
        response.send();
    }

    private readonly resetPassword = async (request: Request, response: Response, next: NextFunction) => {
        try {
            this.authenticationController.resetPassword(request.body);
            response.send();
        } catch (e) {
            next(e);
        }
    }

    private readonly updatePassword = async (request: Request, response: Response, next: NextFunction) => {
        try {
            this.authenticationController.updatePassword(request.body);
            response.send();
        } catch (e) {
            next(e);
        }
    }

    private readonly attachTokenAndCookie = async (response: Response, token: TokenData) => {
        const cookie = this.createCookie(token);
        response.setHeader('Set-Cookie', [cookie]);
    }
    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}; path=/; HttpOnly`;
    }

}
