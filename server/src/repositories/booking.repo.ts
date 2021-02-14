import { Types } from "mongoose";
import { Booking, BookingModel, BookingStatus } from "../models/booking/booking.entity";
import { BaseRepository, IBaseRepository } from "./base.repo";


type BookingQuery = {
    from?: Date,
    to?: Date,
    status?: BookingStatus
}

type CreateBooking = {
    bookedBy: Types.ObjectId,
    from: Date,
    to: Date,
    pplCount: number,
    tubCount: number,
    comment?: string,
    pricePpl: number,
    priceTub: number,
    status: BookingStatus
}

type UpdateBooking = {
    _id: Types.ObjectId,
    from?: Date,
    to?: Date,
    pplCount?: number,
    tubCount?: number,
    comment?: string,
    pricePpl?: number,
    priceTub?: number,
    status?: BookingStatus,
    messageFromAdmin?: string
}

export interface IBookingRepository extends IBaseRepository<Booking, CreateBooking, UpdateBooking> {
    find(query: BookingQuery): Promise<Booking[]>
}

export default class BookingRepository extends BaseRepository<Booking, CreateBooking, UpdateBooking> implements IBookingRepository {

    constructor() {
        super(BookingModel);
    }

    async findById(id: Types.ObjectId): Promise<Booking> {
        return BookingModel
            .findById(id)
            .populate('bookedBy', {
                fullName: true
            });
    }
    async find({ from, to, status }: BookingQuery): Promise<Booking[]> {
        const query: any = {};
        if (from) { query.to = { $gte: from }; }
        if (to) { query.from = { $lte: to }; }
        if (status) { query.status = status; }
        return BookingModel
            .find(query)
            .populate('bookedBy', {
                fullName: true
            });
    }

    async update({ _id, ...update }: UpdateBooking): Promise<Booking> {
        await BookingModel.updateOne({ _id }, update);
        return this.findById(_id);
    }
}
