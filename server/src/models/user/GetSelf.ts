import { User } from "./User";

export type GetSelf = Pick<User, '_id' | 'fullName' | 'email'>