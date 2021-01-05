import { format } from "date-fns";
import { CreateBooking } from ".";
import { BaseApi } from "./baseApi";


export class BookingApi extends BaseApi {

    constructor() {
        super(true);
    }

    async getBookings(fromDate: Date, toDate: Date) {
        try {
            const from = format(fromDate, 'yyyy-MM-dd');
            const to = format(toDate, 'yyyy-MM-dd');
            return await super.get('/bookings').query({ from, to });
        } catch (e) {
            if (!e.response.body) throw e;
            const { message, status } = e.response.body;
            if (status >= 400 && status < 500)
                throw new Error('Your user has not been approved by an admin. You will get an email when the user has been approved.');
            throw new Error('An unknown error occurred: ' + message);
        }
    }

    async create(booking: CreateBooking) {
        return await super.post('/bookings', booking);
    }
}