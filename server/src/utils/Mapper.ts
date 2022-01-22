import { Booking, BasicBooking, AnonymousBooking, BookingDoc } from "../models/booking/BookingModels";
import { DetailedUser, User, BasicUser, UserDoc } from "../models/user/UserModels";


export default class Mapper {

    static toBooking({ _id, from, to, bookedBy, pplCount, pricePpl, priceTub, tubCount, status, paid }: BookingDoc): Booking {
        return { _id, from, to, bookedBy, pplCount, priceTub, pricePpl, tubCount, status, paid };
    }
    static toAnonymousBooking({ _id, from, to }: BookingDoc): AnonymousBooking {
        return { _id, from, to }
    }

    static toViewBasicBooking({ _id, from, to, bookedBy, pplCount, tubCount, status }: BookingDoc): BasicBooking {
        return { _id, from, to, bookedBy, pplCount, tubCount, status }
    }

    static toUser({ _id, status, fullName, email, roles, deleted }: UserDoc): User {
        return { _id, status, fullName, email, roles, deleted, password: '' };
    }

    static toViewBasicUser({ _id, fullName }: UserDoc): BasicUser {
        return { _id, fullName }
    }

    static toDetailedUser({ _id, fullName, email, roles, status, deleted }: UserDoc): DetailedUser {
        return { _id, fullName, email, roles, status, deleted }
    }

    static toAdminViewUser({ _id, fullName, status, email, deleted, roles }: UserDoc): DetailedUser {
        return { _id, fullName, status, email, deleted, roles }
    }
}