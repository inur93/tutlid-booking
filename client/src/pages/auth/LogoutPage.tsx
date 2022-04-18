import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthUser } from '../../hooks/useAuthUser';

export function LogoutPage() {
    const [user, { logout }] = useAuthUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user.isLoggedIn) {
            navigate('/');
            logout();
        }
    }, [user]);
    return <p></p>
}