import { LoginData } from ".";
import { BaseApi } from "./baseApi";

export class AuthApi extends BaseApi {

    constructor() {
        super(false);
    }

    async login(loginData: LoginData) {
        return await super.post('/auth/login', loginData);
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