import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { IContainer } from '../container';
import { IGroupController } from '../controllers/GroupController';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/authMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';
import { CreateGroup } from '../models/group/CreateGroup';
import { UserRole } from '../models/user/UserRole';

export default class AdminGroupRoute implements IRoute {
    public path = '/admin/groups';
    public router = Router();
    private readonly controller: IGroupController;
    constructor({ groupController }: IContainer) {
        this.controller = groupController
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(this.path, authMiddleware([UserRole.admin]))
            .get(`${this.path}`, this.search)
            .post(`${this.path}`, validationMiddleware(CreateGroup), this.create)
            .patch(`${this.path}/:id`, this.update)
            .delete(`${this.path}/:id`, this.delete)
    }

    private readonly search = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.send(await this.controller.adminSearch({}));
        } catch (e) {
            next(e);
        }
    }

    private readonly create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.send(await this.controller.create(request.body));
        } catch (e) {
            next(e);
        }
    }

    private readonly update = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.controller.patch(Types.ObjectId(request.params.id), request.body);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }

    private readonly delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.controller.delete(Types.ObjectId(request.params.id));
            response.sendStatus(201);
        } catch (e) {
            next(e);
        }
    }
}
