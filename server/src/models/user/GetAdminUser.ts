import { User } from "./User";


export type GetAdminUser = Omit<User, 'password'>