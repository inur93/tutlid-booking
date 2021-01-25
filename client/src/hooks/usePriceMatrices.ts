import { useEffect, useState } from 'react';
import api, { CreatePriceMatrix, PriceMatrix } from '../api/index';

type UsePriceMatricesProps = [
    {
        priceMatrices?: PriceMatrix[],
        current?: PriceMatrix,
        loading: boolean,
        error: string
    },
    {
        create: (priceMatrix: CreatePriceMatrix) => Promise<void>,
        delete: (id: string) => Promise<void>
    }

]
export function usePriceMatrices(): UsePriceMatricesProps {
    const [priceMatrices, setPriceMatrices] = useState<PriceMatrix[]>();
    const [current, setCurrent] = useState<PriceMatrix>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [from, setFrom] = useState(new Date());

    const load = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.PriceMatrixApi.getAll(from);
            setPriceMatrices(res.body || []);
        } catch (e) {
            console.log('could not load pricematrices', e);
            setError(e.message);
        }
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        var match = priceMatrices?.find(x => new Date(x.validFrom) < new Date()
            && (!x.validTo || new Date(x.validTo) > new Date()));
        setCurrent(match);
    }, [priceMatrices]);

    const create = async (priceMatrix: CreatePriceMatrix) => {
        await api.AdminApi.createPriceMatrix(priceMatrix);
        await load();
    }

    const del = async (id: string) => {
        await api.AdminApi.deletePriceMatrix(id);
        await load();
    }

    return [{ priceMatrices, current, loading, error }, { create, delete: del }]
}