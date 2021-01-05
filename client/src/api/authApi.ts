import { LoginData } from ".";
import { BaseApi } from "./baseApi";
import { RegisterData } from './index';

export class AuthApi extends BaseApi {

    constructor() {
        super(false);
    }

    async login(loginData: LoginData) {
        try {
            return await super.post('/auth/login', loginData);
        } catch (e) {
            const { message, status } = e.response.body;
            switch (status) {
                case 401:
                    throw new Error('Wrong username or password was provided.');
                default:
                    throw new Error(`An unknown error occurred: ${message}`);
            }
        }
    }

    async register(userData: RegisterData) {
        try {
            return await super.post('/auth/register', userData);
        } catch (e) {
            if(!e.response.body) throw new Error(e.message);
            const { message, status } = e.response.body;
            throw new Error(message);
        }
    }
}

export class DummyAuthApi extends BaseApi {

    constructor() {
        super(false);
    }

    async login(loginData: LoginData) {
        return {
            id: '1',
            username: 'dummy-user',
            token: ''
        }
    }
}