import { Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Booking } from "../../api";
import { Spacer } from "../shared/Spacer";
import BookingReceipt from "./BookingReceipt";
import { CreateBookingForm } from "./CreateBookingForm";

type Props = {
    from?: Date,
    to?: Date,
    onClose: () => void
}
export function CreateBooking({ onClose, ...defaultValues }: Props) {
    const [booking, setBooking] = useState<Booking>();
    const { t } = useTranslation('app');
    const onComplete = (booking: Booking) => {
        setBooking(booking);
    }

    const handleClose = () => {
        setBooking(undefined);
        onClose();
    }

    return <div>
        <Typography variant='h1'>
            {!booking ? t('app:createBooking.title') : t('app:bookingReceipt.title')}
        </Typography>
        <Spacer />
        {!booking ?
            <CreateBookingForm onComplete={onComplete} {...defaultValues} /> :
            <BookingReceipt onClose={handleClose} booking={booking} />
        }
        <Spacer />
    </div>
}