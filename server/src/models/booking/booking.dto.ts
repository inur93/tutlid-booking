import { IsDate, IsDateString, IsPositive, IsString } from 'class-validator';
import { BookingStatus } from './booking.entity';
export class CreateBookingDto {
    @IsDateString()
    public from: Date;

    @IsDateString()
    public to: Date;

    @IsPositive()
    public pplCount: number;

    @IsPositive()
    public tubCount: number;

    @IsString()
    public comment: string;

}

export class ChangeBookingStatusDto {
    public id: string;
    public status: BookingStatus;
}