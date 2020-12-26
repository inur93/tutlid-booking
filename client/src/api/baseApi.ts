
import superagent, { SuperAgentRequest, SuperAgentStatic } from 'superagent';
import prefix from 'superagent-prefix';

export abstract class BaseApi {
    secured: boolean;
    api: SuperAgentStatic;
    baseUrl: string;

    constructor(secured?: boolean, baseUrl?: string) {
        this.baseUrl = '';// baseUrl || ("development" === process.env.NODE_ENV) ? "http://localhost:8000" : "";
        this.secured = secured || false;
        this.api = superagent.agent()
            .use(prefix(this.baseUrl))
            .use(this.authPlugin);
    }

    get user() {
        const user = localStorage.getItem('token'); //TODO extract user from token
        return user;
    }

    get token() {
        return localStorage.getItem('token') || null;
    }

    authPlugin = (req: SuperAgentRequest) => {
        if (this.secured && this.token) {
            
            debugger;
            // req.set('Cookie', `Authorization=${this.token}`);
        }
    }

    del(url: string) {
        return this.api
            .del(url);
    }

    get(url: string) {
        return this.api
            .get(url);
    }
    put(url: string, body: object) {
        return this.api
            .put(url)
            .send(body);
    }

    post(url: string, body: object) {
        return this.api
            .post(url)
            .send(body);
    }
}