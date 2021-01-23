import { createStyles, Dialog, DialogTitle, Grid, makeStyles, Theme } from '@material-ui/core';
import { useState } from 'react';
import { Booking } from '../../api';
import BookingReceipt from './BookingReceipt';
import { CreateBooking, CreateBookingProps } from './CreateBooking';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const onComplete = (booking: Booking) => {
        setBooking(booking);
    }

    const handleClose = () => {
        setBooking(undefined);
        onClose();
    }
    return (<Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={true}>
        <DialogTitle id="create-booking">
            {booking ?
                t('components.calendar.createbookingmodal.receiptHeader') :
                t('components.calendar.createbookingmodal.createHeader')
            }
        </DialogTitle>
        {!booking && <CreateBooking onComplete={onComplete} {...otherProps} />}
        {booking && <BookingReceipt onClose={handleClose} booking={booking} />}
    </Dialog>);
}