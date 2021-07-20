import { IsNumber, IsUUID, Min } from "class-validator";
import { Types } from "mongoose";
import { BookingItem } from "./BookingItem";

type Type = Pick<BookingItem, 'quantity'>
    & Record<keyof Pick<BookingItem, 'unit'>, Types.ObjectId>

export class CreateBookingItem implements Type {

    @IsNumber({ maxDecimalPlaces: 0 })
    @Min(0)
    public quantity!: number;

    @IsUUID('5')
    public unit!: Types.ObjectId;

}