import { NextFunction, Request, Response, Router } from 'express';
import { IContainer } from '../container';
import { IBookingController } from '../controllers/BookingController';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/authMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';
import { BookingStatus } from '../models/booking/BookingModels';
import { CreateBookingDto } from '../models/booking/BookingViewModels';
import { UserRole } from '../models/user/UserModels';

export default class BookingRoute implements IRoute {
    public path = '/bookings';
    public router = Router();
    private readonly bookingController: IBookingController;

    constructor({ bookingController }: IContainer) {
        this.bookingController = bookingController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(this.path, authMiddleware([UserRole.read]))
            .get(this.path, this.get)
            .post(this.path, authMiddleware([UserRole.basic]), validationMiddleware(CreateBookingDto), this.create)
            .delete(`${this.path}/:id`, authMiddleware([UserRole.basic]), this.delete)
    }

    private readonly get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const q = request.query;
            const from = q.from ? new Date(Date.parse(q.from as string)) : undefined;
            const to = q.to ? new Date(Date.parse(q.to as string)) : undefined;
            const status = q.status ? q.status as BookingStatus : undefined;
            const count = q.count ? Number.parseInt(q.count as string) : undefined;
            const bookings = await this.bookingController.get({
                from, to, status, count
            }, request.user);

            response.send(bookings);
        } catch (e) {
            next(e);
        }
    }

    private readonly create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const booking = await this.bookingController.create(request.body, request.user);
            response.send(booking);
        } catch (e) {
            next(e);
        }
    }

    private readonly delete = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.bookingController.delete(request.params.id, request.user);
            response.send();
        } catch (e) {
            next(e);
        }
    }
}
