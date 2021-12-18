import { action, makeAutoObservable } from "mobx";
import { Role, User } from "../api";
import { AuthApi } from "../api/authApi";
import { UserApi } from "../api/userApi";
import { Token } from "../types/Token";

export class AuthStore {

    constructor(private service: AuthApi, private userApi: UserApi) {
        makeAutoObservable(this);
        userApi.self()
            .then(action(response => {
                this.user = response.body;
            }))
            .catch(action(() => {
                this.user = undefined
            }))
    }

    private user?: User;
    private token?: Token;
    error?: string;
    private loading: boolean = false;

    get isLoading() {
        return this.loading;
    }

    get email() {
        return this.user?.email ?? '';
    }

    get fullName() {
        return this.user?.fullName ?? '';
    }

    get loggedIn() {
        return Boolean(this.user)
    }

    get userId() {
        return this.user?._id;
    }

    hasRole(role: Role) {
        return this.user?.roles.includes(role) || false;
    }

    get isAdmin() {
        return this.user?.roles.includes(Role.admin) || false;
    }

    login(email: string, password: string): Promise<void> {
        this.loading = true;
        this.error = undefined;
        return this.service.login({ email, password })
            .then(action((response) => {
                const { user, token, expiresIn } = response.body;
                this.user = user;
                this.token = token;
            }))
            .catch(action((error) => {
                this.error = error.message;
            }))
            .finally(action(() => {
                this.loading = false;
            }))
    }

    logout(): Promise<void> {
        this.loading = true;
        this.error = undefined;
        return this.service.logout()
            .then(() => { })
            .finally(action(() => {
                this.loading = false;
                this.token = undefined;
                this.user = undefined;
            }))
    }

}
