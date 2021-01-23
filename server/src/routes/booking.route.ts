import { NextFunction, Response, Router } from 'express';
import BookingController from '../controllers/booking.controller';
import mailController from '../controllers/mail.controller';
import MissingPermissionsException from '../exceptions/MissingPermissionsException';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { CreateBookingDto } from '../models/booking/booking.dto';
import { BookingStatus } from '../models/booking/booking.entity';
import { UserRole } from '../models/user/user.entity';

export default class BookingRoute implements IRoute {
    public path = '/bookings';
    public router = Router();
    private bookingController = new BookingController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(this.path, authMiddleware([UserRole.read]))
            .get(this.path, this.get)
            .post(this.path, authMiddleware([UserRole.basic]), validationMiddleware(CreateBookingDto), this.create)
            .delete(`${this.path}/:id`, authMiddleware([UserRole.basic]), this.delete)
    }

    private get = async (request: RequestWithUser, response: Response, next: NextFunction) => {
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

    private create = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const user = request.user;
            const booking = await this.bookingController.create(request.body, request.user);
            if (!user.roles.includes(UserRole.admin)) {
                await mailController.sendReceipt(booking, request.user);
            }
            response.send(booking);
        } catch (e) {
            next(e);
        }
    }

    private delete = async (request: RequestWithUser, response: Response, next: NextFunction) => {

        const booking = await this.bookingController.getById(request.params.id);
        if (request.user._id.toHexString() !== booking.bookedBy.toString()) {
            next(new MissingPermissionsException());
        } else {
            await this.bookingController.delete(request.params.id);
            response.send();
        }
    }

}