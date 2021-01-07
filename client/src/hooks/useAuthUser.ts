import { useCallback, useContext, useState } from "react";
import api, { LoginData, User } from "../api";
import UserContext from "../contexts/UserContext";


type UseAuthUserType = [
    User | undefined,
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
            setUser(response.body);
            return true;
        } catch (e) {
            setError(e.message);
            return false;
        }
    }, [user]);

    const logout = useCallback(async function logout() {
        await api.AuthApi.logout();
        setUser(undefined);
    }, [])

    return [user, { login, logout }, error];
}