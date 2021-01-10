import { NextFunction, Response, Router } from 'express';
import { Types } from 'mongoose';
import BookingController from '../controllers/booking.controller';
import UserController from '../controllers/user.controller';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/auth.middleware';
import { UserRole } from '../models/user/user.entity';

export default class AdminRoute implements IRoute {
    public path = '/admin';
    public router = Router();
    private userController = new UserController();
    private bookingController = new BookingController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(this.path, authMiddleware([UserRole.admin]))
            .put(`${this.path}/users/:id/respond`, this.respondPendingUser)
            .get(`${this.path}/users/pending`, this.getPendingUsers)
            .get(`${this.path}/bookings/pending`, this.getPendingBookings)
            .put(`${this.path}/bookings/:id/respond`, this.respondPendingBooking)
            ;
    }

    private getPendingUsers = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const users = await this.userController.getPendingApproval();
            response.send(users);
        } catch (e) {
            next(e);
        }
    }
    private getPendingBookings = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const bookings = await this.bookingController.getPendingApproval();
            response.send(bookings);
        } catch (e) {
            next(e);
        }
    }

    private respondPendingUser = async (request: RequestWithUser, response: Response, next: NextFunction) => {

        try {
            const user = await this.userController.changeStatus({
                id: Types.ObjectId(request.params.id),
                status: request.body.status,
            })
            response.send(user);
        } catch (e) {
            next(e);
        }

    }

    private respondPendingBooking = async (request: RequestWithUser, response: Response, next: NextFunction) => {

        try {
            const booking = await this.bookingController.changeStatus({
                id: Types.ObjectId(request.params.id),
                status: request.body.status
            })
            response.send(booking);
        } catch (e) {
            next(e);
        }

    }
}