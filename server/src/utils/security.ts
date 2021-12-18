import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TokenContent } from '../models/auth/TokenContent';
import { TokenData } from '../models/auth/tokenData';
import { GetAdminUser } from '../models/user/GetAdminUser';

export function getJwtSecret() {
    return process.env.JWT_SECRET || 'secret';
}

export async function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

export function hashPasswordSync(password: string) {
    return bcrypt.hashSync(password, 10);
}
export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(password, hash, function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

export function decodeToken(token: string): TokenContent {
    if (!jwt.verify(token, getJwtSecret())) {
        throw new Error('The token is no longer valid');
    }
    return jwt.decode(token) as TokenContent;
}

export function createToken(user: GetAdminUser, expiration: number = 0): TokenData {
    const expiresIn = expiration || (60 * 60 * 12); // 12 hours
    const secret = getJwtSecret();
    const dataStoredInToken = {
        id: user._id,
        email: user.email,
        fullName: user.fullName
    };

    return {
        expiresIn,
        token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        user
    };
}