import { UserLoginData } from "../models/user/UserModels";

interface TokenData {
  token: string;
  expiresIn: number;
  user?: UserLoginData;
}

export default TokenData;
