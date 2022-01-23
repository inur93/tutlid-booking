import { BookingDoc } from "../models/booking/BookingModels";
import { User, UserRole } from "../models/user/UserModels";


export function shouldBeAnonymous(booking: BookingDoc, user?: User): boolean{
    const bookedBy = booking.bookedBy as User;
    return !(bookedBy._id.toHexString() === (user?._id.toHexString() || '')  || (user?.roles?.includes(UserRole.admin)));
}