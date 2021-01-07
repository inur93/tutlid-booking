import { createStyles, Dialog, DialogTitle, Grid, makeStyles, Theme } from '@material-ui/core';
import { useState } from 'react';
import { Booking } from '../../api';
import BookingInfo, { BookingInfoProps } from './BookingInfo';
import BookingReceipt from './BookingReceipt';
import { CreateBooking, CreateBookingProps } from './CreateBooking';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        }
    }),
);

type BookingInfoModalProps = BookingInfoProps & {
    onClose: (reload: boolean) => void
}
export function BookingInfoModal({ onClose, ...otherProps }: BookingInfoModalProps) {
    const classes = useStyles();

    return (<Dialog onClose={onClose} aria-labelledby="booking-info" open={true}>
        <DialogTitle id="booking-info">Booking</DialogTitle>
        <BookingInfo onClose={onClose} {...otherProps} />
    </Dialog>);
}