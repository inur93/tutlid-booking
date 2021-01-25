import { isSameDay } from 'date-fns';
import { useState } from "react";
import api, { BookingPriceInfo, CreateBooking } from "../api";


type ReturnType = [
    {
        priceMatrix?: BookingPriceInfo,
        loading: boolean
    },
    (booking: CreateBooking) => Promise<void>
]
export function usePrice(): ReturnType {
    const [priceMatrix, setPriceMatrix] = useState<BookingPriceInfo>();
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState<CreateBooking>();
    const calculate = async (booking: CreateBooking) => {
        //avoid unecessary calculations
        if (current?.from && isSameDay(booking.from, current.from)
            && current?.to && isSameDay(booking.to, current.to)
            && booking.pplCount === current?.pplCount
            && booking.tubCount === current?.tubCount) {
            return;
        }
        setLoading(true);
        setCurrent(booking);
        const response = await api.PriceMatrixApi.calculatePrice(booking);
        setPriceMatrix(response.body);
        setLoading(false);
    }
    return [{ priceMatrix, loading }, calculate]
}