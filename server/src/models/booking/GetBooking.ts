import { User } from "../user/User";
import { Booking } from "./Booking";
import { BookingItem } from "./BookingItem";

export type GetBooking = Pick<Booking, '_id' | 'from' | 'to' | 'status' | 'guests' | 'currency'>
    & Record<keyof Pick<Booking, 'bookedBy'>, User>
    & Record<keyof Pick<Booking, 'items'>, BookingItem[]>