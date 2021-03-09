import { Types } from "mongoose";
import { User, UserRole, UserStatus } from '../src/models/user/UserModels';
import faker from 'faker';
import { BankInformation } from "../src/models/bankinformation/BankInformationModels";
import { Booking, BookingStatus } from "../src/models/booking/BookingModels";
import { startOfDay } from "date-fns";
import { PriceMatrix } from "../src/models/pricematrix/PriceMatrixModels";

type UserData = {
    _id?: Types.ObjectId,
    email?: string,
    fullName?: string,
    password?: string,
    roles?: UserRole[],
    status?: UserStatus,
    deleted?: boolean
}

type BankInformationData = {
    _id?: Types.ObjectId,
    accountNo?: string,
    regNo?: string
}

type BookingData = {
    _id?: Types.ObjectId,
    bookedBy?: User,
    from?: Date,
    to?: Date,
    pplCount?: number,
    tubCount?: number,
    pricePpl?: number,
    priceTub?: number,
    status?: BookingStatus,
    paid?: boolean,
    comment?: string,
    messageFromAdmin?: string
}

type PriceMatrixData = {
    _id?: Types.ObjectId,
    price?: number,
    tubPrice?: number,
    validFrom?: Date,
    validTo?: Date
}
export class TestData {

    static user(data?: UserData): User {
        return {
            _id: data?._id || Types.ObjectId(),
            deleted: data?.deleted || false,
            email: data?.email || faker.internet.email(),
            fullName: data?.fullName || faker.name.firstName(),
            password: data?.password || faker.internet.password(),
            roles: data?.roles || [UserRole.basic],
            status: data?.status || UserStatus.approved,
        }
    }

    static bankInformation(data?: BankInformationData): BankInformation {
        return {
            _id: data?._id || Types.ObjectId(),
            accountNo: data?.accountNo || `${faker.random.number({ min: 1_000_000_000, max: 9_999_999_999 })}`,
            regNo: data?.regNo || `${faker.random.number({ min: 1_000, max: 9_999 })}`
        }
    }

    static booking(data?: BookingData): Booking {
        const from = startOfDay(data?.from || faker.date.past(1, data?.to));
        const to = startOfDay(data?.to || faker.date.soon(5, from));
        return {
            _id: data?._id || Types.ObjectId(),
            bookedBy: data?.bookedBy || TestData.user(),
            from,
            to,
            paid: data?.paid || false,
            pplCount: data?.pplCount || faker.random.number({ min: 1, max: 5 }),
            tubCount: data?.tubCount || faker.random.number({ min: 1, max: 5 }),
            pricePpl: data?.pricePpl || 0,
            priceTub: data?.priceTub || 0,
            status: data?.status || BookingStatus.reserved,
            comment: data?.comment || faker.random.words(20),
            messageFromAdmin: data?.messageFromAdmin || faker.random.words(20),
        }
    }

    static priceMatrix(data?: PriceMatrixData): PriceMatrix {
        return {
            _id: data?._id || Types.ObjectId(),
            price: data?.price || faker.random.number({ min: 100, max: 1000 }),
            tubPrice: data?.tubPrice || faker.random.number({ min: 100, max: 500 }),
            validFrom: data?.validFrom || faker.date.future(2),
            validTo: data?.validTo || faker.date.past(1),

        }
    }
}
