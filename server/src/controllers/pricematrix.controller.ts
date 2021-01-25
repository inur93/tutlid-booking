import { DocumentType } from '@typegoose/typegoose';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Types } from 'mongoose';
import { BookingWithPrice, CreateBookingDto } from '../models/booking/booking.dto';
import { CreatePriceMatrix } from '../models/pricematrix/pricematrix.dto';
import { PriceMatrix, PriceMatrixModel } from '../models/pricematrix/pricematrix.entity';
class PriceMatrixController {

    public async get(from?: Date): Promise<DocumentType<PriceMatrix>> {
        let filter = from ? { validFrom: { $gte: from } } : undefined;
        return await PriceMatrixModel.find(filter)
            .sort({ validFrom: 1 })
            .exec();
    }
    public async calculatePrice(booking: CreateBookingDto): Promise<BookingWithPrice> {
        const from = parseISO(booking.from);
        const to = parseISO(booking.to);

        //use only the price valid on the first day
        const priceMatrix = await PriceMatrixModel.findOne({
            validFrom: { $lte: from },
            $or: [
                { validTo: { $exists: false } },
                { validTo: { $gte: from } }
            ]
        }).exec() as PriceMatrix;

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

    public async delete(id: Types.ObjectId): Promise<void> {
        const toDelete = await PriceMatrixModel.findById(id);
        let update: any = toDelete?.validTo ?
            { validTo: toDelete.validTo as Date } :
            { $unset: { validTo: true } };
        const toUpdate = await PriceMatrixModel.findOneAndUpdate({
            validTo: toDelete.validFrom
        }, update);
        console.log('updated pm', toUpdate);
        console.log('deleting price matrix', id);
        await PriceMatrixModel.deleteOne({ _id: id });
    }
}

export default PriceMatrixController;