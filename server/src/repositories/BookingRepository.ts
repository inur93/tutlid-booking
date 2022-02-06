import { Types } from "mongoose";
import { BookingDoc, BookingModel, BookingQuery as QueryBooking, CreateBooking, UpdateBooking } from "../models/booking/BookingModels";



export interface IBookingRepository {
    create(booking: CreateBooking): Promise<BookingDoc>
    findById(id: Types.ObjectId): Promise<BookingDoc | null>
    find(query: QueryBooking): Promise<BookingDoc[]>
    update(_id: Types.ObjectId, update: UpdateBooking): Promise<BookingDoc>
    delete(_id: Types.ObjectId): Promise<void>
}

export default class BookingRepository implements IBookingRepository {

    async create(booking: CreateBooking): Promise<BookingDoc> {
        return BookingModel.create(booking);
    }
    async findById(id: Types.ObjectId): Promise<BookingDoc | null> {
        return BookingModel
            .findById(id)
            .populate('bookedBy', {
                fullName: true
            });
    }
    async find({ from, to, status, count, user }: QueryBooking): Promise<BookingDoc[]> {
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
        if (user) {
            query.bookedBy = Types.ObjectId(user);
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

    async update(_id: Types.ObjectId, update: UpdateBooking): Promise<BookingDoc> {
        await BookingModel.updateOne({ _id }, update);
        const updated = await this.findById(_id);
        if (!updated) {
            throw new Error(`could not update booking. ${_id} was not found`);
        }
        return updated;
    }

    async delete(_id: Types.ObjectId): Promise<void> {
        return BookingModel.deleteOne({ _id });
    }
}
