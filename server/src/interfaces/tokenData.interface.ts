import { UserLoginData } from "../models/user/UserModels";

export interface TokenContent {
  id: string,
  email: string,
  fullName: string
}
interface TokenData {
  token: string;
  expiresIn: number;
  user?: UserLoginData;
}

export default TokenData;
