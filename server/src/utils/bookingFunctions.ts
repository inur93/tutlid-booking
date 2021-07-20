import { Booking } from "../models/booking/Booking";
import { User } from "../models/user/User";
import { UserRole } from "../models/user/UserRole";


export function shouldBeAnonymous(booking: Booking, user?: User): boolean {
    const bookedBy = booking.bookedBy as User;
    return !(String(bookedBy._id) === String(user?._id) || (user?.roles?.includes(UserRole.admin)));
}