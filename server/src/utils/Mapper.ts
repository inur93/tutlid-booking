import { Booking, BasicBooking } from "../models/booking/BookingModels";
import { DetailedUser, User, BasicUser } from "../models/user/UserModels";


export default class Mapper {

    static toViewBasicBooking({ _id, from, to, bookedBy, pplCount, tubCount, status }: Booking): BasicBooking {
        return { _id, from, to, bookedBy, pplCount, tubCount, status }
    }

    static toViewBasicUser({ _id, fullName }: User): BasicUser {
        return { _id, fullName }
    }

    static toDetailedUser({ _id, fullName, email, roles, status, deleted }: User): DetailedUser {
        return { _id, fullName, email, roles, status, deleted }
    }

    static toAdminViewUser({ _id, fullName, status, email, deleted, roles }: User): DetailedUser {
        return { _id, fullName, status, email, deleted, roles }
    }
}