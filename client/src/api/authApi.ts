import { ResponseError } from "superagent";
import { LoginData, UpdatePasswordData } from ".";
import { BaseApi } from "./baseApi";
import { RegisterData } from './index';

export class AuthApi extends BaseApi {

    constructor() {
        super(false);
    }

    async login(loginData: LoginData) {
        try {
            return await super.post('/auth/login', loginData);
        } catch (e: any) {
            const { status } = e.response.body;
            switch (status) {
                case 401:
                    throw new Error('common:error.invalidCredentials')
                default:
                    throw super.handleError(e);

            }
        }
    }

    async logout() {
        try {
            return await super.get('/auth/logout');
        } catch (e) {
            throw super.handleError(e);
        }
    }

    async register(userData: RegisterData) {
        try {
            return await super.post('/auth/register', userData);
        } catch (e) {
            throw super.handleError(e);
        }
    }

    async resetPassword(email: string) {
        try {
            return await super.post('/auth/reset-password', { email });
        } catch (e) {
            throw super.handleError(e);
        }
    }

    async updatePassword(data: UpdatePasswordData) {
        try {
            return await super.post('/auth/update-password', data);
        } catch (e) {
            throw super.handleError(e);
        }
    }
}
