import { FilterQuery, QueryOptions, Types } from "mongoose";
import Model, { BookingDoc } from "../models/booking/Booking";
import { BaseRepository, IBaseRepository } from "./BaseRepository";



export interface IBookingRepository extends IBaseRepository<BookingDoc> {
}

export default class BookingRepository extends BaseRepository<BookingDoc> implements IBookingRepository {

    constructor() {
        super(Model)
    }

    async findById(id: Types.ObjectId): Promise<BookingDoc> {
        // const res = await super.findById(id);
        const res = await this.model.findById(id).populate({
            path: 'bookedBy',
            select: 'fullName'
        });

        if (!res) throw new Error(`Booking with id ${id} does not exist.`)
        return res;
    }

    async find(query: FilterQuery<BookingDoc>, options?: QueryOptions): Promise<BookingDoc[]> {

        return await this.model.find(query, undefined, options)
            .populate({
                path: 'bookedBy',
                select: 'fullName'
            });
    }
}
