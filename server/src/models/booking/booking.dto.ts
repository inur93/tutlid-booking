import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Types } from 'mongoose';
import { BookingStatus } from './booking.entity';
export class CreateBookingDto {
    @IsDateString() @IsNotEmpty()
    public from!: string;

    @IsDateString() @IsNotEmpty()
    public to!: string;

    @IsInt()
    @Min(0) @IsNotEmpty()
    public pplCount!: number;

    @IsInt()
    @Min(0) @IsNotEmpty()
    public tubCount!: number;

    @IsString() @IsOptional()
    public comment?: string;
}

export class BookingWithPrice extends CreateBookingDto {
    public days!: number;
    public price!: number;
    public priceTotal!: number;
    public tubPrice!: number;
    public tubPriceTotal!: number;
}

export class ChangeBookingStatusDto {
    @IsUUID()
    public id!: Types.ObjectId;
    @IsEnum(BookingStatus)
    public status!: BookingStatus;
    @IsString() @IsOptional()
    public messageFromAdmin?: string;
}
