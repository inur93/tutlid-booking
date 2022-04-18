import { BankInformation, BankInformationDoc } from "../models/bankinformation/BankInformationModels";
import { Booking, BasicBooking, AnonymousBooking, BookingDoc } from "../models/booking/BookingModels";
import { DetailedUser, User, BasicUser, UserDoc } from "../models/user/UserModels";


export default class Mapper {

    static toBooking({ _id, from, to, bookedBy, guests: guests, priceGuests, priceTub, tubCount, status, paid }: BookingDoc): Booking {
        return { _id, from, to, bookedBy, guests: guests, priceTub, priceGuests, tubCount, status, paid };
    }
    static toAnonymousBooking({ _id, from, to }: BookingDoc): AnonymousBooking {
        return { _id, from, to }
    }

    static toViewBasicBooking({ _id, from, to, bookedBy, guests: guests, tubCount, status }: BookingDoc): BasicBooking {
        return { _id, from, to, bookedBy, guests: guests, tubCount, status }
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

    static toBankInformation({ _id, accountNo, regNo }: BankInformationDoc): BankInformation {
        return { _id, accountNo, regNo };
    }
}