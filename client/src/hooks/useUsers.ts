import { useEffect, useState } from 'react';
import api, { User, UserStatus, Role } from '../api/index';



type UseUsersProps = [
    {
        users: User[],
        loading: boolean
    },
    (id: string, status: UserStatus) => Promise<void>
]
export function useUsers(status: UserStatus): UseUsersProps {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.AdminApi.getUsers(status);
            setUsers(res.body || []);
        } catch (e) {
            console.log('could not load users', e);
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    const changeStatus = async (id: string, status: UserStatus) => {
        await api.AdminApi.changeUserStatus(id, status);
        await load();
    }

    const addRole = async (id: string, role: Role) => {
        
    }
    return [{ users, loading }, changeStatus]
}