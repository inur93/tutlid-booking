import { Types } from "mongoose";
import { User } from "../models/user/User";
import faker from 'faker';
import { UserRole } from "../models/user/UserRole";
import { UserStatus } from "../models/user/UserStatus";
import { BankInformation } from "../models/bankinformation/BankInformation";
import { Booking } from "../models/booking/Booking";
import { startOfDay } from "date-fns";
import { ReservationStatus } from "../models/booking/ReservationStatus";
import { BookingItem } from "../models/booking/BookingItem";
import "../utils/extensions/ArrayExtensions";
export class TestData {

    static user(data?: Partial<User>): User {
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

    static bankInformation(data?: Partial<BankInformation>): BankInformation {
        return {
            _id: data?._id || Types.ObjectId(),
            accountNo: data?.accountNo || `${faker.datatype.number({ min: 1_000_000_000, max: 9_999_999_999 })}`,
            regNo: data?.regNo || `${faker.datatype.number({ min: 1_000, max: 9_999 })}`
        }
    }

    static booking(data?: Partial<Booking>): Booking {
        const from = startOfDay(data?.from || faker.date.past(1, data?.to));
        const to = startOfDay(data?.to || faker.date.soon(5, from));
        const items = data?.items || new Array(faker.datatype.number({ min: 1, max: 3 })).map(this.bookingItem);
        return {
            _id: data?._id || Types.ObjectId(),
            bookedBy: data?.bookedBy || TestData.user(),
            from,
            to,
            currency: data?.currency || 'dkk',
            guests: data?.guests || faker.datatype.number({ min: 1, max: 5 }),
            paidAmount: data?.paidAmount || 0,
            items,
            totalAmount: items.sum((x: BookingItem) => x.totalPrice),
            status: data?.status || ReservationStatus.Reserved,
        }
    }

    static bookingItem(data?: Partial<BookingItem>): BookingItem {

        const quantity = data?.quantity || faker.datatype.number({ min: 1, max: 3 });
        const unitPrice = data?.unitPrice || faker.datatype.number({ min: 100, max: 200 });
        return {
            quantity,
            unitPrice,
            discount: data?.discount || 0,
            unit: data?.unit || new Types.ObjectId(),
            totalPrice: quantity * unitPrice
        }
    }

}
