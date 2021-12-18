import { User } from "../api";

export type Token = {
    token: string,
    expiresIn: number,
    user: User
}