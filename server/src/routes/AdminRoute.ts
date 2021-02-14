import { NextFunction, Request, Response, Router } from 'express';
import { Types } from 'mongoose';
import { IContainer } from '../container';
import { IBankInformationController } from '../controllers/bankinformation.controller';
import { IBookingController } from '../controllers/booking.controller';

import { IPriceMatrixController } from '../controllers/pricematrix.controller';
import { IUserController } from '../controllers/user.controller';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/authMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';
import { BankInformation } from '../models/bankinformation/bankinformation.entity';
import { ChangeBookingStatusDto } from '../models/booking/booking.dto';
import { BookingStatus } from '../models/booking/booking.entity';
import { CreatePriceMatrix } from '../models/pricematrix/pricematrix.dto';
import { UpdateUserRoleDto, UpdateUserStatusDto } from '../models/user/user.dto';
import { User, UserRole, UserStatus } from '../models/user/user.entity';
import MailController from '../controllers/MailController';

export default class AdminRoute implements IRoute {
    public path = '/admin';
    public router = Router();
    private readonly userController: IUserController;
    private readonly bookingController: IBookingController;
    private readonly priceMatrixController: IPriceMatrixController;
    private readonly bankInformationController: IBankInformationController;
    private readonly mailController: MailController;


    constructor({
        mailController,
        userController,
        bookingController,
        priceMatrixController,
        bankInformationController }: IContainer) {
        this.mailController = mailController;
        this.userController = userController;
        this.bookingController = bookingController;
        this.priceMatrixController = priceMatrixController;
        this.bankInformationController = bankInformationController;
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
            .delete(`${this.path}/pricematrix/:id`, this.deletePriceMatrix)
            .get(`${this.path}/bankinformation`, this.getBankInformation)
            .put(`${this.path}/bankinformation/:id`, validationMiddleware(BankInformation), this.updateBankInformation);
    }

    private readonly getUsers = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.send(await this.userController.get(request.query.status as UserStatus));
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

    private readonly changeBookingStatus = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const booking = await this.bookingController.changeStatus({
                id: Types.ObjectId(request.params.id),
                status: request.body.status,
                messageFromAdmin: request.body.messageFromAdmin
            })

            if (!(booking.bookedBy as User).roles.includes(UserRole.admin)) {
                if (booking.status === BookingStatus.accepted) {
                    const bankInfo = await this.bankInformationController.current();
                    this.mailController.sendConfirmation(booking, booking.bookedBy as User, bankInfo);
                } else {
                    this.mailController.sendRejection(booking, booking.bookedBy as User);
                }
            }
            response.send(booking);
        } catch (e) {
            next(e);
        }

    }

    private readonly createPriceMatrix = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.send(await this.priceMatrixController.create(request.body));
        } catch (e) {
            next(e);
        }
    }

    private readonly deletePriceMatrix = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.send(await this.priceMatrixController.delete(Types.ObjectId(request.params.id)));
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
