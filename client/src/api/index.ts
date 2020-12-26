import { AuthApi, DummyAuthApi } from "./authApi"
import { BookingApi } from "./bookingApi";
import { UserApi } from "./userApi";

const isDummy = process.env.DUMMY === 'true';
export default {
    AuthApi: new AuthApi(),
    BookingApi: new BookingApi(),
    UserApi: new UserApi()
}


//models
export type LoginData = {
    email: string,
    password: string
}

export type User = {
    _id: string,
    fullName: string
}

export type CreateBooking = {
    pplCount: number,
    tubCount: number,
    from: Date,
    to: Date,
    comment: string
}


export type Booking = CreateBooking & {
    _id: string,
    bookedBy: User
}