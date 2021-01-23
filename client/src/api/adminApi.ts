import { BookingStatus, UserStatus, Role, CreatePriceMatrix } from ".";
import { BaseApi } from "./baseApi";
import { BankInformation } from './index';
export class AdminApi extends BaseApi {

    constructor() {
        super(true);
    }
    async getUsers(status?: UserStatus) {
        return await super.get(`/admin/users`).query({ status })
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

    async changeBookingStatus(id: string, status: BookingStatus) {
        return await super.put(`/admin/bookings/${id}/status`, { status });
    }

    async createPriceMatrix(priceMatrix: CreatePriceMatrix) {
        return await super.post(`/admin/pricematrix`, priceMatrix);
    }

    async getBankInformation() {
        return await super.get(`/admin/bankinformation`);
    }

    async updateBankInformation(id: string, update: BankInformation) {
        return await super.put(`/admin/bankinformation/${id}`, update);
    }
}