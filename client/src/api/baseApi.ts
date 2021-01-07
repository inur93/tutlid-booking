
import superagent, { SuperAgentStatic } from 'superagent';
import prefix from 'superagent-prefix';

export abstract class BaseApi {
    secured: boolean;
    api: SuperAgentStatic;
    baseUrl: string;

    constructor(secured?: boolean, baseUrl?: string) {
        this.baseUrl = '';// baseUrl || ("development" === process.env.NODE_ENV) ? "http://localhost:8000" : "";
        this.secured = secured || false;
        this.api = superagent.agent()
            .use(prefix(this.baseUrl));
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