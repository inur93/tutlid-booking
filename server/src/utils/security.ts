import * as bcrypt from 'bcrypt';


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
