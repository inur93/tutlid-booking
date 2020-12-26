import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Base } from '@typegoose/typegoose/lib/defaultClasses';
import { User } from '../user/user.entity';

export enum BookingStatus {
    reserved = "reserved",
    accepted = "accepted",
    declined = "declined"
}

class Booking extends Base {

    @prop({ reuqired: true })
    public from: Date;

    @prop({ required: true })
    public to: Date;

    @prop({ default: 0 })
    public pplCount: number;

    @prop({ default: 0 })
    public tubCount: number;

    @prop({ default: 0 })
    public pricePpl: number;

    @prop({ default: 0 })
    public priceTub: number;

    @prop({ default: false })
    public paid: boolean;

    @prop({ enum: BookingStatus, default: () => BookingStatus.reserved, type: String })
    public status: string;

    @prop({ required: true, ref: () => User })
    public bookedBy: Ref<User>;

    @prop()
    public comment: string;
}

const BookingModel = getModelForClass(Booking);
export {
    Booking, BookingModel
};