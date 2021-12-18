import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import InvalidAuthenticationTokenException from '../exceptions/InvalidAuthenticationTokenException';
import MissingPermissionsException from '../exceptions/MissingPermissionsException';
import { DataStoredInToken } from '../models/auth/dataStoredInToken';
import UserModel from '../models/user/User';
import { UserRole } from '../models/user/UserRole';
import { getJwtSecret } from '../utils/security';

function authMiddleware(requiredRoles: UserRole[] = []): RequestHandler {
    return async function (request: Request, _: Response, next: NextFunction): Promise<void> {

        const cookies = request.cookies;
        if (cookies && cookies.Authorization) {
            const secret = getJwtSecret();
            try {
                const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
                const id = verificationResponse.id;
                const user = await UserModel.findOne({ _id: id }).exec();

                if (user) {
                    if (null != requiredRoles.find(x => !(user.roles || []).includes(x))) {
                        next(new MissingPermissionsException());
                    } else {
                        request.user = user;
                        next();
                    }
                } else {
                    next(new InvalidAuthenticationTokenException());
                }
            } catch (error) {
                next(new InvalidAuthenticationTokenException());
            }
        } else {
            next(new AuthenticationTokenMissingException());
        }
    }
}
export default authMiddleware;
