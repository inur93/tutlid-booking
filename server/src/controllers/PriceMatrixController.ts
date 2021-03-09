import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Types } from 'mongoose';
import { IContainer } from '../container';
import { CreateBookingDto } from '../models/booking/BookingViewModels';
import { CreatePriceMatrix } from '../models/pricematrix/PriceMatrixViewModels';
import { PriceMatrix } from '../models/pricematrix/PriceMatrixModels';
import { IPriceMatrixRepository } from '../repositories/PriceMatrixRepository';
import { BookingWithPrice } from '../models/booking/BookingModels';

export interface IPriceMatrixController {
    get(from?: Date): Promise<PriceMatrix[]>
    calculatePrice(booking: CreateBookingDto): Promise<BookingWithPrice>
    create(priceMatrix: CreatePriceMatrix): Promise<PriceMatrix>
    delete(id: Types.ObjectId): Promise<void>
}
class PriceMatrixController {

    private readonly priceMatrixRepository: IPriceMatrixRepository;
    constructor({ priceMatrixRepository }: IContainer) {
        this.priceMatrixRepository = priceMatrixRepository;
    }
    public async get(from?: Date): Promise<PriceMatrix[]> {
        return this.priceMatrixRepository.find(from);
    }
    public async calculatePrice(booking: CreateBookingDto): Promise<BookingWithPrice> {
        const from = parseISO(booking.from);
        const to = parseISO(booking.to);

        //use only the price valid on the first day
        const priceMatrix = await this.priceMatrixRepository.findValidPriceMatrix(from);
        const days = Math.abs(differenceInCalendarDays(to, from));

        return {
            days,
            price: priceMatrix?.price || 350,
            tubPrice: priceMatrix?.tubPrice || 50,
            priceTotal: (priceMatrix?.price || 350) * (booking.pplCount || 0) * (days || 0),
            tubPriceTotal: (priceMatrix?.tubPrice || 50) * (booking.tubCount || 0)
        }
    }

    public async create(priceMatrix: CreatePriceMatrix): Promise<PriceMatrix> {
        const latest = await this.priceMatrixRepository.getLatest();
        if (latest) {
            await this.priceMatrixRepository.updateValidTo(latest._id, priceMatrix.validFrom)
        }
        return this.priceMatrixRepository.create(priceMatrix);
    }

    public async delete(_id: Types.ObjectId): Promise<void> {
        const toDelete = await this.priceMatrixRepository.findOne({ _id });
        const toUpdate = await this.priceMatrixRepository.findOne({ validTo: toDelete.validFrom });
        if (toUpdate) {
            await this.priceMatrixRepository.updateValidTo(toUpdate._id, toDelete.validTo);
        }
        await this.priceMatrixRepository.delete(_id);
    }
}

export default PriceMatrixController;
