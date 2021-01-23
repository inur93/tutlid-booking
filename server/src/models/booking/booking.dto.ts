import { IsDateString, IsInt, IsString, Min } from 'class-validator';
import { BookingStatus } from './booking.entity';
import { Types } from 'mongoose';
export class CreateBookingDto {
    @IsDateString()
    public from: Date;

    @IsDateString()
    public to: Date;

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

    public price: number;
    public tubPrice: number;
}

export class ChangeBookingStatusDto {
    public id: Types.ObjectId;
    public status: BookingStatus;
}