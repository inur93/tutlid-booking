import { Booking } from "./Booking";
import { BookingItemWithPrice } from "./BookingItemWithPrice";
import { CreateBooking } from "./CreateBooking";

export type BookingWithPrice = Omit<CreateBooking, 'items'>
    & Pick<Booking, 'currency' | 'totalAmount'>
    & Record< keyof Pick<CreateBooking, 'items'>, BookingItemWithPrice[]> 