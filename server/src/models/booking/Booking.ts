import { Document, Model, model, models, Schema, Types } from 'mongoose';
import { User } from '../user/User';
import { BookingItem, BookingItemSchema } from './BookingItem';
import { ReservationStatus } from './ReservationStatus';


export interface Booking {
    _id?: Types.ObjectId,
    items: BookingItem[]

    from: Date
    to: Date
    status: ReservationStatus
    guests: number

    currency: string
    totalAmount: number
    paidAmount: number

    bookedBy: Types.ObjectId | User
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
    items: {
        type: [BookingItemSchema],
        required: true
    },

    currency: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ReservationStatus,
        default: ReservationStatus.Reserved
    },
    bookedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}


export interface BookingDoc extends Omit<Booking, '_id'>, Document { }
export interface BookingModel extends Model<BookingDoc> { }
const BookingSchema = new Schema<BookingDoc, BookingModel>(BookingSchemaFields);
export default models.Booking || model<BookingDoc>('Booking', BookingSchema);

