import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Types } from 'mongoose';
import { IContainer } from '../container';
import { CreateBookingDto } from '../models/booking/BookingViewModels';
import { CreatePriceMatrix } from '../models/pricematrix/PriceMatrixViewModels';
import { PriceMatrix, PriceMatrixDoc } from '../models/pricematrix/PriceMatrixModels';
import { IPriceMatrixRepository } from '../repositories/PriceMatrixRepository';
import { BookingWithPrice } from '../models/booking/BookingModels';

export interface IPriceMatrixController {
    get(from?: Date): Promise<PriceMatrixDoc[]>
    calculatePrice(booking: CreateBookingDto): Promise<BookingWithPrice>
    create(priceMatrix: CreatePriceMatrix): Promise<PriceMatrixDoc>
    delete(id: Types.ObjectId): Promise<void>
}
class PriceMatrixController {

    private readonly priceMatrixRepository: IPriceMatrixRepository;
    constructor({ priceMatrixRepository }: IContainer) {
        this.priceMatrixRepository = priceMatrixRepository;
    }
    public async get(from?: Date): Promise<PriceMatrixDoc[]> {
        return this.priceMatrixRepository.find(from);
    }
    public async calculatePrice(booking: CreateBookingDto): Promise<BookingWithPrice> {
        const from = parseISO(booking.from);
        const to = parseISO(booking.to);

        //use only the price valid on the first day
        const priceMatrix = await this.priceMatrixRepository.findValidPriceMatrix(from);
        const days = Math.abs(differenceInCalendarDays(to, from));

        return {
            days: days || 1, //pay minimum for one day
            tubCount: booking.tubCount,
            price: priceMatrix?.price || 350,
            tubPrice: priceMatrix?.tubPrice || 500,
            priceTotal: (priceMatrix?.price || 1000) * (days || 1),
            tubPriceTotal: (priceMatrix?.tubPrice || 500) * (booking.tubCount || 0)
        }
    }

    public async create(priceMatrix: CreatePriceMatrix): Promise<PriceMatrixDoc> {
        const latest = await this.priceMatrixRepository.getLatest();
        if (latest) {
            await this.priceMatrixRepository.updateValidTo(latest._id, priceMatrix.validFrom)
        }
        return this.priceMatrixRepository.create(priceMatrix);
    }

    public async delete(_id: Types.ObjectId): Promise<void> {
        const toDelete = await this.priceMatrixRepository.findOne({ _id });
        if (!toDelete) {
            throw new Error(`No price matrix with id ${_id} exists.`);
        }
        const toUpdate = await this.priceMatrixRepository.findOne({ validTo: toDelete.validFrom });
        if (toUpdate) {
            await this.priceMatrixRepository.updateValidTo(toUpdate._id, toDelete.validTo);
        }
        await this.priceMatrixRepository.delete(_id);
    }
}

export default PriceMatrixController;
