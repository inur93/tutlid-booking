import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { IContainer } from '../container';
import { IBankInformationController } from '../controllers/BankInformationController';
import { IBookingController } from '../controllers/BookingController';
import { IGroupController } from '../controllers/GroupController';
import { IUnitController } from '../controllers/UnitController';
import { IUserController } from '../controllers/UserController';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/authMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';
import { UpdateBankInformation } from '../models/bankinformation/UpdateBankInformation';
import { ReservationStatus } from '../models/booking/ReservationStatus';
import { UpdateBookingStatus } from '../models/booking/UpdateBookingStatus';
import { CreateUnit } from '../models/unit/CreateUnit';
import { UpdateUserRole } from '../models/user/UpdateUserRole';
import { UpdateUserStatus } from '../models/user/UpdateUserStatus';
import { UserRole } from '../models/user/UserRole';
import { UserStatus } from '../models/user/UserStatus';

export default class AdminRoute implements IRoute {
    public path = '/admin';
    public router = Router();
    private readonly userController: IUserController;
    private readonly bookingController: IBookingController;
    private readonly bankInformationController: IBankInformationController;

    constructor({
        userController,
        bookingController,
        bankInformationController
    }: IContainer) {
        this.userController = userController;
        this.bookingController = bookingController;
        this.bankInformationController = bankInformationController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(this.path, authMiddleware([UserRole.admin]))
            .get(`${this.path}/users`, this.getUsers)
            .get(`${this.path}/users/:id`, this.getUser)
            .put(`${this.path}/users/:id/status`, validationMiddleware(UpdateUserStatus), this.changeUserStatus)
            .put(`${this.path}/users/:id/role`, validationMiddleware(UpdateUserRole), this.addUserRole)
            .delete(`${this.path}/users/:id/role/:role`, this.removeUserRole)
            .get(`${this.path}/bookings`, authMiddleware([UserRole.admin]), this.getBookings)
            .put(`${this.path}/bookings/:id/status`, validationMiddleware(UpdateBookingStatus), this.changeBookingStatus)
            .get(`${this.path}/bankinformation`, this.getBankInformation)
            .put(`${this.path}/bankinformation/:id`, validationMiddleware(UpdateBankInformation), this.updateBankInformation);
    }

    private readonly getUsers = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.send(await this.userController.get(request.query.status as UserStatus));
        } catch (e) {
            next(e);
        }
    }

    private readonly getUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.send(await this.userController.getDetailsById(Types.ObjectId(request.params.id)));
        } catch (e) {
            next(e);
        }
    }

    private readonly addUserRole = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userController.addRole(Types.ObjectId(request.params.id), request.body.role);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }

    private readonly removeUserRole = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userController.removeRole(Types.ObjectId(request.params.id), request.params.role as UserRole);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }
    private readonly changeUserStatus = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const user = await this.userController.changeStatus(Types.ObjectId(request.params.id), request.body.status);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }

    private readonly getBookings = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const query = request.query;
            const from = query.from ? new Date(Date.parse(query.from as string)) : undefined;
            const to = query.to ? new Date(Date.parse(query.to as string)) : undefined;
            const status = query.status ? query.status as unknown as ReservationStatus : undefined;
            const count = query.count ? Number.parseInt(query.count as string) : undefined;

            const bookings = await this.bookingController.search({
                from, to, status, count
            }, request.user);
            response.send(bookings);
        } catch (e) {
            next(e);
        }
    }

    private readonly changeBookingStatus = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const booking = await this.bookingController.updateStatus(Types.ObjectId(request.params.id), request.body);
            response.send(booking);
        } catch (e) {
            next(e);
        }
    }

    private readonly getBankInformation = async (_: Request, response: Response, next: NextFunction) => {
        try {
            response.send(await this.bankInformationController.current());
        } catch (e) {
            next(e);
        }
    }

    private readonly updateBankInformation = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.send(await this.bankInformationController.update(Types.ObjectId(request.params.id), request.body));
        } catch (e) {
            next(e);
        }
    }
}
