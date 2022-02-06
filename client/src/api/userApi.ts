import { format } from "date-fns";
import { BaseApi } from "./baseApi";

export class UserApi extends BaseApi {

    constructor() {
        super(true);
    }

    async self() {
        return await super.get('/users/self');
    }

    async myBookings(fromDate?: Date, toDate?: Date) {
        const from = fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined;
        const to = toDate ? format(toDate, 'yyyy-MM-dd') : undefined;
        return await super.get('/users/self/bookings').query({ from, to });
    }

}