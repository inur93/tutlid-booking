import { NextFunction, Request, Response, Router } from 'express';
import { IContainer } from '../container';
import { IAuthenticationController } from '../controllers/AuthenticationController';
import { IRoute } from '../interfaces/route.interface';
import TokenData from '../interfaces/tokenData.interface';
import validationMiddleware from '../middleware/validationMiddleware';
import LogInDto from '../models/auth/loginDto';
import { CreateUserDto } from '../models/user/userViewModels';

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
            response.send(token.user);
        } catch (e) {
            next(e);
        }
    }

    private readonly logout = async (_: Request, response: Response) => {
        response.setHeader('Set-Cookie', this.createCookie({ token: '', expiresIn: 0 }));
        response.send();
    }

    private readonly attachTokenAndCookie = async (response: Response, token: TokenData) => {
        const cookie = this.createCookie(token);
        response.setHeader('Set-Cookie', [cookie]);
    }
    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}; path=/; HttpOnly`;
    }

}
