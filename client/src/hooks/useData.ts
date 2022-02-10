import { Response } from "superagent";
import { useEffect, useState } from "react";

type DataType<T> = {
    data?: T,
    loading: boolean,
    error: string
}

type DataActions<T> = (data?: T) => Promise<void>

export function useData<T>(loader: () => Promise<Response>): [DataType<T>, DataActions<T>] {
    const [data, setData] = useState<T>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const reload = async (cached?: T) => {
        if (cached) {
            setData(cached);
            return;
        }
        console.log('loading...');
        setLoading(true);
        setError('');
        try {
            const response = await loader();
            setData(response.body);
        } catch (e: any) {
            console.log('error', e);
            setError(e.message);
        }
        setLoading(false);
    }
    useEffect(() => {
        reload();
    }, [])
    return [{ data, error, loading }, reload];
}