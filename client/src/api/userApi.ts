import { BaseApi } from "./baseApi";

export class UserApi extends BaseApi {

    constructor() {
        super();
        super.secured = true;
    }

    async self() {
        return await super.get('/users/self');
    }

}