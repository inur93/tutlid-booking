import { createContext } from "react";
import { Role, User, UserStatus } from "../api";

export class AuthUser {

    private user?: User;
    constructor(user?: User) {
        this.user = user;
    }

    hasRole = (role: Role) => {
        return (this.user?.roles || []).includes(role);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    get _id() {
        return this.user?._id;
    }

    get fullName() {
        return this.user?.fullName;
    }

    get approvedByAdmin() {
        return this.user?.status === UserStatus.approved;
    }
}

type UserContextType = [
    AuthUser,
    (user: AuthUser) => void
]

const UserContext = createContext<UserContextType>([new AuthUser(), () => { }]);

export default UserContext;

