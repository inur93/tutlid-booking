import { NextFunction, Response, Router } from 'express';
import BookingController from '../controllers/booking.controller';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { ChangeBookingStatusDto, CreateBookingDto } from '../models/booking/booking.dto';
import { UserRole } from '../models/user/user.entity';

export default class BookingRoute implements IRoute {
    public path = '/bookings';
    public router = Router();
    private bookingController = new BookingController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware(), this.get);
        this.router.post(this.path, authMiddleware([UserRole.basic]), validationMiddleware(CreateBookingDto), this.create);
        this.router.put(`${this.path}/:id/changestatus`, validationMiddleware(ChangeBookingStatusDto), authMiddleware([UserRole.admin]), this.changeStatus);
    }

    private get = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            var from = new Date(Date.parse(request.query.from as string));
            var to = new Date(Date.parse(request.query.to as string));
            response.send(await this.bookingController.getByRange(from, to));
        } catch (e) {
            next(e);
        }
    }

    private create = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const booking = await this.bookingController.create(request.body, request.user);
            response.send(booking);
        } catch (e) {
            next(e);
        }
    }

    private changeStatus = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {

            const booking = await this.bookingController.changeStatus(request.body);
            response.send(booking);
        } catch (e) {
            next(e);
        }
    }

}