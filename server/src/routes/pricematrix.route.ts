import { NextFunction, Response, Router } from 'express';
import PriceMatrixController from '../controllers/pricematrix.controller';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { ChangeBookingStatusDto, CreateBookingDto } from '../models/booking/booking.dto';
import { CreatePriceMatrix } from '../models/pricematrix/pricematrix.dto';
import { UserRole } from '../models/user/user.entity';

export default class PriceMatrixRoute implements IRoute {
    public path = '/pricematrix';
    public router = Router();
    private priceMatrixController = new PriceMatrixController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(this.path, authMiddleware())
            .get(`${this.path}`, this.get)
            .post(`${this.path}/calculateprice`, validationMiddleware(CreateBookingDto), this.calculatePrice)
    }

    private get = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            const validFrom = request.query.validFrom;
            const from = validFrom ? new Date(Date.parse(request.query.validFrom as string)) : undefined;
            response.send(await this.priceMatrixController.get(from));
        } catch (e) {
            next(e);
        }
    }


    private calculatePrice = async (request: RequestWithUser, response: Response, next: NextFunction) => {
        try {
            response.send(await this.priceMatrixController.calculatePrice(request.body));
        } catch (e) {
            next(e);
        }
    }
}