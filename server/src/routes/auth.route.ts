import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationController from '../controllers/authentication.controller';
import { IRoute } from '../interfaces/route.interface';
import TokenData from '../interfaces/tokenData.interface';
import validationMiddleware from '../middleware/validation.middleware';
import LogInDto from '../models/auth/login.dto';
import { CreateUserDto } from '../models/user/user.dto';
import { User } from '../models/user/user.entity';

export default class AuthRoute implements IRoute {
    public path = '/auth';
    public router = Router();
    private authController = new AuthenticationController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.login);
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.register)
    }
    private register = async (request: Request, response: Response, next: NextFunction) => {
        try {
            console.log('register', request.body);
            const user = await this.authController.register(request.body);
            this.attachTokenAndCookie(response, user);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }
    private login = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.authController.login(request.body);
            this.attachTokenAndCookie(response, user);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }

    private attachTokenAndCookie = async (response: Response, user: User) => {
        const tokenData = this.createToken(user);
        const cookie = this.createCookie(tokenData);
        response.setHeader('Set-Cookie', [cookie]);
    }
    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; Max-Age=${tokenData.expiresIn}; path=/; HttpOnly`;
    }
    public createToken(user: User): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken = {
            id: user._id,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn })
        };
    }
}