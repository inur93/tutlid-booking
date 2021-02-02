import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Types } from 'mongoose';
import { IContainer } from '../container';
import { BookingWithPrice, CreateBookingDto } from '../models/booking/booking.dto';
import { CreatePriceMatrix } from '../models/pricematrix/pricematrix.dto';
import { PriceMatrix } from '../models/pricematrix/pricematrix.entity';
import { IPriceMatrixRepository } from '../repositories/pricematrix.repo';

export interface IPriceMatrixController {
    get(from?: Date): Promise<PriceMatrix[]>
    calculatePrice(booking: CreateBookingDto): Promise<BookingWithPrice>
    create(priceMatrix: CreatePriceMatrix): Promise<PriceMatrix>
    delete(id: Types.ObjectId): Promise<void>
}
class PriceMatrixController {

    priceMatrixRepository: IPriceMatrixRepository;
    constructor({ priceMatrixRepository }: IContainer) {
        this.priceMatrixRepository = priceMatrixRepository;
    }
    public async get(from?: Date): Promise<PriceMatrix[]> {
        return await this.priceMatrixRepository.find(from);
    }
    public async calculatePrice(booking: CreateBookingDto): Promise<BookingWithPrice> {
        const from = parseISO(booking.from);
        const to = parseISO(booking.to);

        //use only the price valid on the first day
        const priceMatrix = await this.priceMatrixRepository.getByDate(from);
        const days = Math.abs(differenceInCalendarDays(to, from));

        return {
            ...booking,
            days,
            price: priceMatrix?.price || 350,
            tubPrice: priceMatrix?.tubPrice || 50,
            priceTotal: (priceMatrix?.price || 350) * (booking.pplCount || 0) * (days || 0),
            tubPriceTotal: (priceMatrix?.tubPrice || 50) * (booking.tubCount || 0),

        }
    }

    public async create(priceMatrix: CreatePriceMatrix): Promise<PriceMatrix> {
        const latest = await this.priceMatrixRepository.getLatest();
        if (latest) {
            await this.priceMatrixRepository.update({
                _id: latest._id,
                validTo: priceMatrix.validFrom
            })
        }
        return await this.priceMatrixRepository.create(priceMatrix);
    }

    public async delete(id: Types.ObjectId): Promise<void> {
        const toDelete = await this.priceMatrixRepository.findById(id);
        await this.priceMatrixRepository.updateValidToByDate(toDelete.validFrom, toDelete.validTo);
        await this.priceMatrixRepository.delete(id);
    }
}

export default PriceMatrixController;