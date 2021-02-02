import { NextFunction, Response, Router, Request } from 'express';
import { IContainer } from '../container';
import { IPriceMatrixController } from '../controllers/pricematrix.controller';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/auth.middleware';
import validationMiddleware from '../middleware/validation.middleware';
import { CreateBookingDto } from '../models/booking/booking.dto';

export default class PriceMatrixRoute implements IRoute {
    public path = '/pricematrix';
    public router = Router();
    private priceMatrixController: IPriceMatrixController;

    constructor({ priceMatrixController }: IContainer) {
        this.priceMatrixController = priceMatrixController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(this.path, authMiddleware())
            .get(`${this.path}`, this.get)
            .post(`${this.path}/calculateprice`, validationMiddleware(CreateBookingDto), this.calculatePrice)
    }

    private get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const validFrom = request.query.validFrom;
            const from = validFrom ? new Date(Date.parse(request.query.validFrom as string)) : undefined;
            response.send(await this.priceMatrixController.get(from));
        } catch (e) {
            next(e);
        }
    }


    private calculatePrice = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.send(await this.priceMatrixController.calculatePrice(request.body));
        } catch (e) {
            next(e);
        }
    }
}