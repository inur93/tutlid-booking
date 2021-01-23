import { NextFunction, Response, Router } from 'express';
import { Types } from 'mongoose';
import BookingController from '../controllers/booking.controller';
import PriceMatrixController from '../controllers/pricematrix.controller';
import UserController from '../controllers/user.controller';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { ChangeBookingStatusDto } from '../models/booking/booking.dto';
import { CreatePriceMatrix } from '../models/pricematrix/pricematrix.dto';
import { UpdateUserRoleDto, UpdateUserStatusDto } from '../models/user/user.dto';
import { UserRole, UserStatus } from '../models/user/user.entity';
import BankInformationController from '../controllers/bankinformation.controller';
import { BankInformation } from '../models/bankinformation/bankinformation.entity';

export default class AdminRoute implements IRoute {
    public path = '/admin';
    public router = Router();
    private userController = new UserController();
    private bookingController = new BookingController();
    private priceMatrixController = new PriceMatrixController();
    private bankInformationController = new BankInformationController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(this.path, authMiddleware([UserRole.admin]))
            .get(`${this.path}/users`, this.getUsers)
            .put(`${this.path}/users/:id/status`, validationMiddleware(UpdateUserStatusDto), this.changeUserStatus)
            .put(`${this.path}/users/:id/role`, validationMiddleware(UpdateUserRoleDto), this.addUserRole)
            .delete(`${this.path}/users/:id/role/:role`, this.removeUserRole)
            .put(`${this.path}/bookings/:id/status`, validationMiddleware(ChangeBookingStatusDto), this.changeBookingStatus)
            .post(`${this.path}/pricematrix`, validationMiddleware(CreatePriceMatrix), this.createPriceMatrix)
            .get(`${this.path}/bankinformation`, this.getBankInformation)
            .put(`${this.path}/bankinformation/:id`, validationMiddleware(BankInformation), this.updateBankInformation);
    }

    private getUsers = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            response.send(await this.userController.get(request.query.status as UserStatus));
        } catch (e) {
            next(e);
        }
    }

    private addUserRole = async (request: RequestWithUser, response: Response, next: NextFunction) => {

        try {
            const user = await this.userController.addRole(Types.ObjectId(request.params.id), request.body.role);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }

    private removeUserRole = async (request: RequestWithUser, response: Response, next: NextFunction) => {

        try {
            const user = await this.userController.removeRole(Types.ObjectId(request.params.id), request.params.role as UserRole);
            response.send(user);
        } catch (e) {
            next(e);
        }
    }
    private changeUserStatus = async (request: RequestWithUser, response: Response, next: NextFunction) => {

        try {
            const user = await this.userController.changeStatus(Types.ObjectId(request.params.id), request.body.status);
            response.send(user);
        } catch (e) {
            next(e);
        }

    }

    private changeBookingStatus = async (request: RequestWithUser, response: Response, next: NextFunction) => {

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

    private createPriceMatrix = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            response.send(await this.priceMatrixController.create(request.body));
        } catch (e) {
            next(e);
        }
    }

    private getBankInformation = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            response.send(await this.bankInformationController.current());
        } catch (e) {
            next(e);
        }
    }

    private updateBankInformation = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            response.send(await this.bankInformationController.update(Types.ObjectId(request.params.id), request.body));
        } catch (e) {
            next(e);
        }
    }
}