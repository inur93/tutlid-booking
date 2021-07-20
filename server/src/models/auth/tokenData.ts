import { GetAdminUser } from "../user/GetAdminUser";


export interface TokenData {
  token: string;
  expiresIn: number;
  user?: GetAdminUser;
}
