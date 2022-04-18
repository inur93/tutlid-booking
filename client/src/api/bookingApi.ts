import { format } from "date-fns";
import { BookingStatus, CreateBooking, UpdateBooking } from ".";
import { BaseApi } from "./baseApi";


export class BookingApi extends BaseApi {

    constructor() {
        super(true);
    }

    async getBookings({ fromDate, toDate, status }: { fromDate?: Date, toDate?: Date, status?: BookingStatus }) {
        try {
            const from = fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined;
            const to = toDate ? format(toDate, 'yyyy-MM-dd') : undefined;

            return await super.get('/bookings').query({ from, to, status });
        } catch (e: any) {
            if (!e.response.body) throw e;
            const { message, status } = e.response.body;
            if (status >= 400 && status < 500)
                throw new Error('Your user has not been approved by an admin. You will get an email when the user has been approved.');
            throw new Error('An unknown error occurred: ' + message);
        }
    }

    async create(booking: CreateBooking) {
        try {
            return await super.post('/bookings', booking);
        } catch (e: any) {
            if (!e.response.body) throw e;
            const { message, status } = e.response.body;
            if (status >= 400 && status < 500)
                throw new Error('Your user has not been approved by an admin. You will get an email when the user has been approved.');
            throw new Error('An unknown error occurred: ' + message);
        }
    }

    async update({ _id, ...booking }: UpdateBooking) {
        try {
            return await super.put(`/bookings/${_id}`, booking);
        } catch (e: any) {
            if (!e.response.body) throw e;
            const { message, status } = e.response.body;
            if (status >= 401)
                throw new Error('Your user has not been approved by an admin. You will get an email when the user has been approved.');
            throw new Error('An unknown error occurred: ' + message);
        }
    }

    async delete(id: string) {
        try {
            return await super.del(`/bookings/${id}`);
        } catch (e: any) {
            if (!e.response.body) throw e;
            const { message, status } = e.response.body;
            if (status === 401)
                throw new Error('You do not have permission to delete this booking.');
            throw new Error('An unknown error occurred: ' + message);
        }
    }
}