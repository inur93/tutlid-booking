import { Document, Model, Schema, Types } from 'mongoose';
import { Unit } from '../unit/Unit';


export interface BookingItem {
    unit: Types.ObjectId | Unit,
    unitPrice: number,
    quantity: number,
    totalPrice: number,
    discount: number
}

const BookingItemSchemaFields: Record<keyof BookingItem, any> = {
    unit: {
        type: Schema.Types.ObjectId,
        ref: "Unit",
        required: true
    },
    unitPrice: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    }
}

export interface BookingItemDoc extends Omit<BookingItem, '_id'>, Document { }
export interface BookingItemModel extends Model<BookingItemDoc> { }
export const BookingItemSchema = new Schema<BookingItemDoc, BookingItemModel>(BookingItemSchemaFields);

