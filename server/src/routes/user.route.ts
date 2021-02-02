import { NextFunction, Response, Router, Request } from 'express';
import { IContainer } from '../container';
import { IUserController } from '../controllers/user.controller';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { UpdateSelfDto } from '../models/user/user.dto';
import { UserRole } from '../models/user/user.entity';

export default class UserRoute implements IRoute {
    public path = '/users';
    public router = Router();
    private userController: IUserController;

    constructor({ userController }: IContainer) {
        this.userController = userController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(`${this.path}/self`, authMiddleware([UserRole.read]))
            .get(`${this.path}/self`, this.self)
            .put(`${this.path}/self`, validationMiddleware(UpdateSelfDto), this.updateSelf);
    }

    private updateSelf = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userController.update(request.user!._id, request.body);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }

    private self = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userController.getById(request.user!._id);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }


}