import { NextFunction, Response, Router, Request } from 'express';
import { IContainer } from '../container';
import { IUserController } from '../controllers/UserController';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/authMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';
import { UpdateSelfDto } from '../models/user/userViewModels';
import { UserRole } from '../models/user/UserModels';
import { IBookingController } from '../controllers/BookingController';

export default class UserRoute implements IRoute {
    public path = '/users';
    public router = Router();
    private readonly userController: IUserController;
    private readonly bookingController: IBookingController;

    constructor({ userController, bookingController }: IContainer) {
        this.userController = userController;
        this.bookingController = bookingController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(`${this.path}/self`, authMiddleware([UserRole.read]))
            .get(`${this.path}/self`, this.self)
            .put(`${this.path}/self`, validationMiddleware(UpdateSelfDto), this.updateSelf)
            .get(`${this.path}/self/bookings`,authMiddleware([UserRole.read]), this.myBookings);
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

    private readonly myBookings = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const q = request.query;
            const from = q.from ? new Date(Date.parse(q.from as string)) : undefined;
            const to = q.to ? new Date(Date.parse(q.to as string)) : undefined;
            const user = request.user._id;
            const bookings = await this.bookingController.get({ from, to, user });
            response.send(bookings);
        } catch (e) {
            next(e);
        }
    }
}
