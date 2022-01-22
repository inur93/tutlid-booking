import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import InvalidAuthenticationTokenException from '../exceptions/InvalidAuthenticationTokenException';
import MissingPermissionsException from '../exceptions/MissingPermissionsException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import { UserModel, UserRole } from '../models/user/UserModels';

function authMiddleware(requiredRoles: UserRole[] = []): RequestHandler {
    return async function (request: Request, _: Response, next: NextFunction): Promise<void> {

        const cookies = request.cookies;
        if (cookies && cookies.Authorization) {
            const secret = process.env.JWT_SECRET || 'no_secret';
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
