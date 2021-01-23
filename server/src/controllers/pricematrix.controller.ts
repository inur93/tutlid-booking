import { DocumentType } from '@typegoose/typegoose';
import { differenceInCalendarDays } from 'date-fns';
import { BookingWithPrice, CreateBookingDto } from '../models/booking/booking.dto';
import { CreatePriceMatrix } from '../models/pricematrix/pricematrix.dto';
import { PriceMatrix, PriceMatrixModel } from '../models/pricematrix/pricematrix.entity';

class PriceMatrixController {

    public async get(from?: Date): Promise<DocumentType<PriceMatrix>> {

        return await PriceMatrixModel.find({
            validFrom: { $gte: from }
        })
            .sort({ validFrom: 1 })
            .exec();
    }
    public async calculatePrice(booking: CreateBookingDto): Promise<BookingWithPrice> {

        //use only the price valid on the first day
        const priceMatrix = await PriceMatrixModel.findOne({
            validFrom: { $lte: booking.from },
            $or: [
                { validTo: { $exists: false } },
                { validTo: { $gte: booking.from } }
            ]
        }).exec() as PriceMatrix;

        const days = differenceInCalendarDays(booking.from, booking.to) + 1;

        return {
            ...booking,
            price: (priceMatrix?.price || 350) * (booking.pplCount || 0) * (days || 1),
            tubPrice: (priceMatrix?.tubPrice || 50) * (booking.tubCount || 0)
        }

    }

    public async create(priceMatrix: CreatePriceMatrix): Promise<DocumentType<PriceMatrix>> {
        await PriceMatrixModel.findOneAndUpdate({
            validTo: { $exists: false }
        }, {
            validTo: priceMatrix.validFrom
        });

        return await PriceMatrixModel.create({
            ...priceMatrix
        });
    }


}

export default PriceMatrixController;