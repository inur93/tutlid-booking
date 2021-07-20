import { IsDate, IsDateString, IsNumber, IsPositive, IsString, Length, ValidateNested } from "class-validator";
import { Booking } from "./Booking";
import { CreateBookingItem } from "./CreateBookingItem";

type Type = Pick<Booking, 'from' | 'to' | 'guests' | 'currency'>
    & Record<keyof Pick<Booking, 'items'>, CreateBookingItem[]>

export class CreateBooking implements Type {
    @IsDate()
    public from!: Date;
    @IsDate()
    public to!: Date;

    @IsPositive()
    @IsNumber({ maxDecimalPlaces: 0 })
    public guests!: number;

    @IsString({})
    @Length(3, 3)
    public currency!: string;

    @ValidateNested({ each: true })
    public items!: CreateBookingItem[]

}
