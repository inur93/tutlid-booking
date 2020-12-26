import { createContext } from "react";
import { User } from "../api";


type UserContextType = [
    User | undefined,
    (user: User | undefined) => void
]
const UserContext = createContext<UserContextType>([undefined, () => {}]);

export default UserContext;

