import { format } from "date-fns";
import { BookingStatus, CreatePriceMatrix, Role, UserStatus } from ".";
import { BaseApi } from "./baseApi";
import { BankInformation } from './index';
export class AdminApi extends BaseApi {

    constructor() {
        super(true);
    }
    async getUsers(status?: UserStatus) {
        return await super.get(`/admin/users`).query({ status })
    }

    async getUser(id: string) {
        return await super.get(`/admin/users/${id}`);
    }

    async changeUserStatus(id: string, status: UserStatus) {
        return await super.put(`/admin/users/${id}/status`, { status });
    }

    async addUserRole(id: string, role: Role) {
        return await super.post(`/admin/users/${id}/roles`, { role });
    }

    async removeUserRole(id: string, role: Role) {
        return await super.del(`/admin/users/${id}/roles/${role}`);
    }

    async getBookings(fromDate: Date, count: number) {
        const from = fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined;
        return await super.get(`/admin/bookings`).query({
            from, count
        })
    }

    async changeBookingStatus(id: string, update: { status: BookingStatus, messageFromAdmin?: string }) {
        return await super.put(`/admin/bookings/${id}/status`, update);
    }

    async createPriceMatrix(priceMatrix: CreatePriceMatrix) {
        return await super.post(`/admin/pricematrix`, priceMatrix);
    }

    async deletePriceMatrix(id: string) {
        return await super.del(`/admin/pricematrix/${id}`);
    }

    async getBankInformation() {
        return await super.get(`/admin/bankinformation`);
    }

    async updateBankInformation(id: string, update: BankInformation) {
        return await super.put(`/admin/bankinformation/${id}`, update);
    }
}