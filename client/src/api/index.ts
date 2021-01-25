import { AdminApi } from "./adminApi";
import { AuthApi } from "./authApi";
import { BookingApi } from "./bookingApi";
import { PriceMatrixApi } from './priceMatrixApi';
import { UserApi } from "./userApi";

const isDummy = process.env.DUMMY === 'true';
export default {
    AuthApi: new AuthApi(),
    BookingApi: new BookingApi(),
    UserApi: new UserApi(),
    AdminApi: new AdminApi(),
    PriceMatrixApi: new PriceMatrixApi()
}


//models
export type LoginData = {
    email: string,
    password: string
}

export type RegisterData = LoginData & {
    fullName: string
}
export enum BookingStatus {
    reserved = "reserved",
    accepted = "accepted",
    declined = "declined"
}
export enum Role {
    read = 'read',
    basic = 'basic',
    admin = 'admin'
}

export enum UserStatus {
    pendingApproval = 'pendingApproval',
    approved = 'approved',
    rejected = 'rejected'
}
export type User = {
    _id: string,
    status: UserStatus,
    email: string,
    roles: Role[],
    fullName: string
}

export type CreateBooking = {
    pplCount: number,
    tubCount: number,
    from: Date,
    to: Date,
    comment: string
}

export type BookingPriceInfo = CreateBooking & {
    days: number,
    price: number,
    priceTotal: number,
    tubPrice: number,
    tubPriceTotal: number
}

export type UpdateBooking = {
    _id: string,
    pplCount: number,
    tubCount: number,
    from: Date,
    to: Date,
    comment: string,
    status: BookingStatus
}


export type Booking = CreateBooking & {
    _id: string,
    bookedBy: User
}

export type CreatePriceMatrix = {
    validFrom: Date,
    price: number,
    tubPrice: number
}

export type PriceMatrix = {
    _id: string,
    validFrom: string,
    validTo?: string,
    price: number,
    tubPrice: number
}

export type BankInformation = {
    _id: string,
    regNo: string,
    accountNo: string
}