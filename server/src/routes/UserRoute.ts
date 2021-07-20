import { NextFunction, Response, Router, Request } from 'express';
import { IContainer } from '../container';
import { IUserController } from '../controllers/UserController';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/authMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';
import { UpdateSelf } from '../models/user/UpdateSelf';
import { UserRole } from '../models/user/UserRole';

export default class UserRoute implements IRoute {
    public path = '/users';
    public router = Router();
    private readonly userController: IUserController;

    constructor({ userController }: IContainer) {
        this.userController = userController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(`${this.path}/self`, authMiddleware([UserRole.read]))
            .get(`${this.path}/self`, this.self)
            .put(`${this.path}/self`, validationMiddleware(UpdateSelf), this.updateSelf);
    }

    private readonly updateSelf = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userController.update(request.user._id, request.body);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }

    private readonly self = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userController.getSelf(request.user._id);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }
}
