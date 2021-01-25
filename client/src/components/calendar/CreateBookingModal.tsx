import { createStyles, Dialog, DialogTitle, makeStyles, Theme } from '@material-ui/core';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Booking } from '../../api';
import BookingReceipt from './BookingReceipt';
import { CreateBooking, CreateBookingProps } from './CreateBooking';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        }
    }),
);

type CreateBookingModalProps = CreateBookingProps & {
    onClose: () => void,
}
export function CreateBookingModal({ onClose, ...otherProps }: CreateBookingModalProps) {
    const classes = useStyles();
    const [booking, setBooking] = useState<Booking>();
    const { t } = useTranslation('app');
    const onComplete = (booking: Booking) => {
        setBooking(booking);
    }

    const handleClose = () => {
        setBooking(undefined);
        onClose();
    }
    return (<Dialog onClose={onClose} aria-labelledby="create-booking-title" open={true} fullWidth={true} maxWidth='sm'>
        <DialogTitle id="create-booking-title">
            {booking ?
                t('app:createBookingModal.receiptHeader') :
                t('app:createBookingModal.createHeader')
            }
        </DialogTitle>
        {!booking && <CreateBooking onComplete={onComplete} {...otherProps} />}
        {booking && <BookingReceipt onClose={handleClose} booking={booking} />}
    </Dialog>);
}