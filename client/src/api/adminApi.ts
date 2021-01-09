import { BookingStatus, UserStatus } from ".";
import { BaseApi } from "./baseApi";

export class AdminApi extends BaseApi {

    constructor() {
        super(true);
    }

    async getUsersPendingApproval() {
        return await super.get('/admin/users/pending');
    }

    async getBookingsPendingApproval() {
        return await super.get('/admin/bookings/pending');
    }

    async respondPendingUser(id: string, response: UserStatus) {
        return await super.put(`/admin/users/${id}/respond`, {
            status: response
        })
    }

    async respondPendingBooking(id: string, response: BookingStatus) {
        return await super.put(`/admin/bookings/${id}/respond`, {
            status: response
        })
    }

}