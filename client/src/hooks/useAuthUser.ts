import { useCallback, useContext, useState } from "react";
import api, { LoginData, User } from "../api";
import UserContext from "../contexts/UserContext";


type UseAuthUserType = [
    User | undefined,
    (info: LoginData) => Promise<void>,
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
        } catch (e) {
            setError(e.message);
        }
    }, [user]);

    return [user, login, error];
}