import { useCallback, useContext, useState } from "react";
import api from "../api";
import { RegisterData } from '../api/index';
import UserContext, { AuthUser } from "../contexts/UserContext";


type UseRegisterUserType = [
    AuthUser,
    (info: RegisterData) => Promise<void>,
    string | undefined //error
]
export function useRegisterUser(): UseRegisterUserType {
    const [user, setUser] = useContext(UserContext);
    const [error, setError] = useState('');

    const register = useCallback(async function login(userData: RegisterData) {
        try {
            setError('');
            const response = await api.AuthApi.register(userData);
            setUser(new AuthUser(response.body));
        } catch (e) {
            setError(e.message);
        }
    }, [user]);

    return [user, register, error];
}