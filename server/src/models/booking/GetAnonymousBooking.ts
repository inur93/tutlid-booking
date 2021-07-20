import { Booking } from "./Booking";

export type GetAnonymousBooking = Pick<Booking, '_id' | 'from' | 'to'>