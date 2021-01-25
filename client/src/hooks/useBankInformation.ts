import { useEffect, useState } from 'react';
import api, { User, UserStatus, Role, BankInformation } from '../api/index';

type UseBankInformationProps = [
    {
        bankInformation?: BankInformation,
        loading: boolean,
        error: string
    },
    (id: string, update: BankInformation) => Promise<void>
]
export function useBankInformation(): UseBankInformationProps {
    const [bankInformation, setBankInformation] = useState<BankInformation>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.AdminApi.getBankInformation();
            setBankInformation(res.body || []);
        } catch (e) {
            console.log('could not load bankinformation', e);
            setError(e.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    const update = async (id: string, update: BankInformation) => {
        const result = await api.AdminApi.updateBankInformation(id, update);
        setBankInformation(result.body);
    }

    return [{ bankInformation, loading, error }, update]
}