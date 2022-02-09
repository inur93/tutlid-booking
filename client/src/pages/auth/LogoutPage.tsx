import { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { useAuthUser } from '../../hooks/useAuthUser';

export function LogoutPage() {
    const [user, { logout }] = useAuthUser();
    const router = useHistory();

    useEffect(() => {
        if (user.isLoggedIn) {
            router.replace('/');
            logout();
        }
    }, [user]);
    return <p></p>
}