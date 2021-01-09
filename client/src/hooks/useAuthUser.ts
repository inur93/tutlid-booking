import { useCallback, useContext, useState } from "react";
import api, { LoginData, Role, User } from "../api";
import UserContext from "../contexts/UserContext";
import { AuthUser } from '../contexts/UserContext';


type UseAuthUserType = [
    AuthUser,
    {
        login: (info: LoginData) => Promise<boolean>,
        logout: () => Promise<void>,
    },
    string | undefined //error
]


export function useAuthUser(): UseAuthUserType {
    const [user, setUser] = useContext(UserContext);
    const [error, setError] = useState('');

    const login = useCallback(async function login(loginInfo: LoginData) {
        try {
            setError('');
            const response = await api.AuthApi.login(loginInfo);
            setUser(new AuthUser(response.body));
            return true;
        } catch (e) {
            setError(e.message);
            return false;
        }
    }, [user]);

    const logout = useCallback(async function logout() {
        await api.AuthApi.logout();
        setUser(new AuthUser());
    }, [])

    return [user, { login, logout }, error];
}