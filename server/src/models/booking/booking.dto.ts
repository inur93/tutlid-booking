import { IsDateString, IsInt, IsString, Min } from 'class-validator';
import { Types } from 'mongoose';
import { BookingStatus } from './booking.entity';
export class CreateBookingDto {
    @IsDateString()
    public from: string;

    @IsDateString()
    public to: string;

    @IsInt()
    @Min(0)
    public pplCount: number;

    @IsInt()
    @Min(0)
    public tubCount: number;

    @IsString()
    public comment: string;
}

export class BookingWithPrice extends CreateBookingDto {
    public days: number;
    public price: number;
    public priceTotal: number;
    public tubPrice: number;
    public tubPriceTotal: number;
}

export class ChangeBookingStatusDto {
    public id: Types.ObjectId;
    public status: BookingStatus;
    public messageFromAdmin: string;
}