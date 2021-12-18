
import superagent, { SuperAgentStatic } from 'superagent';
import prefix from 'superagent-prefix';


export abstract class BaseApi {
    secured: boolean;
    api: SuperAgentStatic;
    baseUrl: string;

    constructor() {
        this.baseUrl = '';// baseUrl || ("development" === process.env.NODE_ENV) ? "http://localhost:8000" : "";
        this.secured = false;
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

    patch(url: string, body: object) {
        return this.api
            .patch(url)
            .send(body)
    }

    handleError(e: any) {
        if (!e || !e.response || !e.response.body) {
            return new Error('an unknown error occurred');
        }
        const { message, status } = e.response.body;
        console.error(status, message);
        return new Error(message);
    }
}