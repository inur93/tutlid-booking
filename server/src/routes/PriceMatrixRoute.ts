import { NextFunction, Response, Router, Request } from 'express';
import { IContainer } from '../container';
import { IPriceMatrixController } from '../controllers/PriceMatrixController';
import { IRoute } from '../interfaces/route.interface';
import authMiddleware from '../middleware/authMiddleware';
import validationMiddleware from '../middleware/validationMiddleware';
import { CreateBookingDto } from '../models/booking/BookingViewModels';
import { parseDate } from '../utils/dateFunctions';

export default class PriceMatrixRoute implements IRoute {
    public path = '/pricematrix';
    public router = Router();
    private readonly priceMatrixController: IPriceMatrixController;

    constructor({ priceMatrixController }: IContainer) {
        this.priceMatrixController = priceMatrixController;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.all(this.path, authMiddleware())
            .get(`${this.path}`, this.get)
            .post(`${this.path}/calculateprice`, validationMiddleware(CreateBookingDto), this.calculatePrice)
    }

    private readonly get = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const validFrom = request.query.validFrom as string;
            const from = validFrom ? parseDate(validFrom) : undefined;
            response.send(await this.priceMatrixController.get(from));
        } catch (e) {
            next(e);
        }
    }


    private readonly calculatePrice = async (request: Request, response: Response, next: NextFunction) => {
        try {
            response.send(await this.priceMatrixController.calculatePrice(request.body));
        } catch (e) {
            next(e);
        }
    }
}
