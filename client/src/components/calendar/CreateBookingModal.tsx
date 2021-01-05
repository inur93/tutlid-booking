import { createStyles, Dialog, DialogTitle, Grid, makeStyles, Theme } from '@material-ui/core';
import { useState } from 'react';
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

    return (<Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={true}>
        <DialogTitle id="create-booking">Create booking</DialogTitle>
        <CreateBooking onComplete={onClose} {...otherProps} />
    </Dialog>);
}