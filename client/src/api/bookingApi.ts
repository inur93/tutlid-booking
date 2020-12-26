import { format } from "date-fns";
import { CreateBooking } from ".";
import { BaseApi } from "./baseApi";


export class BookingApi extends BaseApi {

    constructor() {
        super(true);
    }

    async getBookings(fromDate: Date, toDate: Date) {
        const from = format(fromDate, 'yyyy-MM-dd');
        const to = format(toDate, 'yyyy-MM-dd');
        return await super.get('/bookings').query({ from, to });
    }

    async create(booking: CreateBooking) {
        return await super.post('/bookings', booking);
    }
}