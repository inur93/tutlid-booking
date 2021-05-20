import { Booking } from "../api";


export function isAnonymous(booking: Booking): boolean {
    return !booking.bookedBy;
}