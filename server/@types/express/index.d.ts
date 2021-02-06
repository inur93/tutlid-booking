import { User } from "models/user/user.entity";
import { Request } from 'express';
/**
 * declaration merging to expose user on the request
 * https://www.typescriptlang.org/docs/handbook/declaration-merging.html
 */
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}
