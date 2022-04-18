import { Document, Model, model, models, Schema, Types } from 'mongoose';
import { User } from '../user/UserModels';

export enum BookingStatus {
    reserved = "reserved",
    accepted = "accepted",
    declined = "declined"
}

export interface Booking {
    _id: Types.ObjectId,
    from: Date;
    to: Date;
    guests: number;
    tubCount: number;
    priceGuests: number;
    priceTub: number;
    paid: boolean;
    status: string;
    bookedBy: Types.ObjectId | User
    comment?: string;
    messageFromAdmin?: string;
}

export type BookingQuery = Partial<Pick<Booking, 'from' | 'to' | 'status'>> & { count?: number, user?: string }
export type CreateBooking = Pick<Booking, 'from' | 'to' | 'guests' | 'tubCount' | 'comment' | 'messageFromAdmin' | 'priceGuests' | 'priceTub' | 'status'> & { bookedBy: Types.ObjectId }
export type UpdateBooking = Partial<Omit<CreateBooking, 'bookedBy'>>
export type BasicBooking = Pick<Booking, '_id' | 'from' | 'to' | 'guests' | 'tubCount' | 'status' | 'bookedBy'>
export type AnonymousBooking = Pick<Booking, '_id' | 'from' | 'to'>
export type DetailedBooking = BasicBooking & Pick<Booking, 'priceGuests' | 'priceTub' | 'paid'>

export type BookingWithPrice = {
    days: number;
    tubCount: number;
    price: number;
    priceTotal: number;
    tubPrice: number;
    tubPriceTotal: number;
}
const BookingSchemaFields: Record<keyof Omit<Booking, '_id'>, any> = {
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    guests: {
        type: Number,
        default: 0
    },
    tubCount: {
        type: Number,
        default: 0
    },
    priceGuests: {
        type: Number,
        default: 0
    },
    priceTub: {
        type: Number,
        default: 0
    },
    paid: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: BookingStatus,
        default: BookingStatus.reserved
    },
    bookedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: String,
    messageFromAdmin: String
}

const BookingSchema = new Schema(BookingSchemaFields);
export interface BookingDoc extends Omit<Booking, '_id'>, Document { }
export const BookingModel: Model<BookingDoc> = models.Booking || model<BookingDoc>('Booking', BookingSchema);

