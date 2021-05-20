import { Types } from "mongoose";
import { Booking, BookingModel, BookingQuery as QueryBooking, CreateBooking, UpdateBooking } from "../models/booking/BookingModels";



export interface IBookingRepository {
    create(booking: CreateBooking): Promise<Booking>
    findById(id: Types.ObjectId): Promise<Booking>
    find(query: QueryBooking): Promise<Booking[]>
    update(_id: Types.ObjectId, update: UpdateBooking): Promise<Booking>
    delete(_id: Types.ObjectId): Promise<void>
}

export default class BookingRepository implements IBookingRepository {

    async create(booking: CreateBooking): Promise<Booking> {
        const created = await BookingModel.create(booking);
        return BookingModel.findById(created._id);
    }
    async findById(id: Types.ObjectId): Promise<Booking> {
        return BookingModel
            .findById(id)
            .populate('bookedBy', {
                fullName: true
            });
    }
    async find({ from, to, status, count }: QueryBooking): Promise<Booking[]> {
        const query: any = {};
        if (from) {
            query.to = { $gte: from };
        }
        if (to) {
            query.from = { $lte: to };
        }
        if (status) {
            query.status = status;
        }
        return BookingModel
            .find(query)
            .sort({
                from: 'ascending'
            })
            .limit(count || 1000) //1000 must be a reasonable limit
            .populate('bookedBy', {
                fullName: true
            });
    }

    async update(_id: Types.ObjectId, update: UpdateBooking): Promise<Booking> {
        await BookingModel.updateOne({ _id }, update);
        return this.findById(_id);
    }

    async delete(_id: Types.ObjectId): Promise<void> {
        return BookingModel.deleteOne({ _id });
    }
}
