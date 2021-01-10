import { useEffect, useState } from 'react';
import api, { User, UserStatus } from '../api/index';



type UseUsersPendingApprovalProps = [
    {
        users: User[],
        loading: boolean
    },
    (id: string, status: UserStatus) => Promise<void>
]
export function useUsersPendingApproval(): UseUsersPendingApprovalProps {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.AdminApi.getUsersPendingApproval();
            setUsers(res.body || []);
        } catch (e) {
            console.log('could not load users', e);
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    const respond = async (id: string, status: UserStatus) => {
        await api.AdminApi.respondPendingUser(id, status);
        await load();
    }
    return [{users, loading}, respond]
}