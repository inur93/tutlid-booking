import { Booking } from "../models/booking/BookingModels";
import { User, UserRole } from "../models/user/UserModels";


export function shouldBeAnonymous(booking: Booking, user?: User): boolean{
    const bookedBy = booking.bookedBy as User;
    return !(bookedBy._id.equals(user?._id || '')  || (user?.roles?.includes(UserRole.admin)));
}