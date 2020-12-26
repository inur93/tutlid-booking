import { NextFunction, Response, Router } from 'express';
import UserController from '../controllers/user.controller';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { UpdateSelfDto } from '../models/user/user.dto';
import { UserRole } from '../models/user/user.entity';

export default class UserRoute implements IRoute {
    public path = '/users';
    public router = Router();
    private userController = new UserController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(`${this.path}/self`, authMiddleware([UserRole.basic]))
            .get(`${this.path}/self`, this.self)
            .put(`${this.path}/self`, validationMiddleware(UpdateSelfDto),  this.updateSelf);
    }

    private updateSelf = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const user = await this.userController.update({
                ...request.body,
                id: request.user._id
            })
            user.password = undefined;
            response.send(user);
        } catch (e) {
            next(e);
        }
    }

    private self = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const user = await this.userController.getById(request.user._id);
            user.password = undefined;
            response.send(user);
        } catch (e) {
            next(e);
        }
    }


}