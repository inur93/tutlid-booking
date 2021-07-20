import { IsEnum } from "class-validator";
import { Booking } from "./Booking";
import { ReservationStatus } from "./ReservationStatus";

export class UpdateBookingStatus implements Pick<Booking, 'status'> {

    @IsEnum(ReservationStatus)
    public status!: ReservationStatus;
}