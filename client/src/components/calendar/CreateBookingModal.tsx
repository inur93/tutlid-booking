import { createStyles, Dialog, DialogTitle, Grid, makeStyles, Theme } from '@material-ui/core';
import { useState } from 'react';
import { CreateBooking } from './CreateBooking';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        }
    }),
);

type CreateBookingModalProps = {
    onClose: () => void
}
export function CreateBookingModal({ onClose }: CreateBookingModalProps) {
    const classes = useStyles();
    
    return (<Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={true}>
        <DialogTitle id="create-booking">Create booking</DialogTitle>
        <CreateBooking />
    </Dialog>);
}