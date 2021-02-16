import { UserLoginData } from "../models/user/user.entity";

interface TokenData {
  token: string;
  expiresIn: number;
  user?: UserLoginData;
}

export default TokenData;
