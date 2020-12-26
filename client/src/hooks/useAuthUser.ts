import { useCallback, useContext, useState } from "react";
import api, { LoginData, User } from "../api";
import UserContext from "../contexts/UserContext";


type UseAuthUserType = [
    User | undefined, (info: LoginData) => void
]
export function useAuthUser(): UseAuthUserType {
    const [user, setUser] = useContext(UserContext);

    const login = useCallback(async function login(loginInfo: LoginData) {
        const response = await api.AuthApi.login(loginInfo);
        setUser(response.body);
    }, [user]);

    return [user, login];
}