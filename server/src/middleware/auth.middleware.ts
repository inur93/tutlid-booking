import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import InvalidAuthenticationTokenException from '../exceptions/InvalidAuthenticationTokenException';
import MissingPermissionsException from '../exceptions/MissingPermissionsException';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { User, UserModel, UserRole } from '../models/user/user.entity';

function authMiddleware(requiredRoles: UserRole[] = []) {
    return async function (request: RequestWithUser, response: Response, next: NextFunction) {
        const cookies = request.cookies;
        console.log('cookies', cookies);
        if (cookies && cookies.Authorization) {
            const secret = process.env.JWT_SECRET;
            try {
                console.log('auth', requiredRoles, secret, cookies.Authorization);
                const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
                console.log('response', verificationResponse);
                const id = verificationResponse.id;
                const user = await UserModel.findOne({ _id: id }).exec();
                console.log('user', user);

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
                console.log('err', error);
                next(new InvalidAuthenticationTokenException());
            }
        } else {
            next(new AuthenticationTokenMissingException());
        }
    }
}
export default authMiddleware;