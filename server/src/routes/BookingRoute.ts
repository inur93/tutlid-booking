import { NextFunction, Request, Response, Router } from 'express';
import { IContainer } from '../container';
import { IBookingController } from '../controllers/booking.controller';
import MailController from '../controllers/MailController';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/authMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';
import { CreateBookingDto } from '../models/booking/booking.dto';
import { BookingStatus } from '../models/booking/booking.entity';
import { UserRole } from '../models/user/user.entity';

export default class BookingRoute implements IRoute {
    public path = '/bookings';
    public router = Router();
    private readonly bookingController: IBookingController;
    private readonly mailController: MailController;

    constructor({ bookingController, mailController }: IContainer) {
        this.bookingController = bookingController;
        this.mailController = mailController;
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
            const { from, to, status } = request.query;
            const qFrom = from ? new Date(Date.parse(request.query.from as string)) : undefined;
            const qTo = to ? new Date(Date.parse(request.query.to as string)) : undefined;
            const qStatus = status ? status as BookingStatus : undefined;
            response.send(await this.bookingController.get(qFrom, qTo, qStatus));
        } catch (e) {
            next(e);
        }
    }

    private readonly create = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = request.user;
            const booking = await this.bookingController.create(request.body, user);
            if (!user.roles.includes(UserRole.admin)) {
                await this.mailController.sendReceipt(booking, user);
            }
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