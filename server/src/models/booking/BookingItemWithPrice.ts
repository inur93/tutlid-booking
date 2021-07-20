import { BookingItem } from "./BookingItem";
import { CreateBookingItem } from "./CreateBookingItem";

export type BookingItemWithPrice = CreateBookingItem
    & Pick<BookingItem, 'totalPrice' | 'unitPrice' | 'discount'>