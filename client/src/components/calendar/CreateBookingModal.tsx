import { Dialog, DialogContent } from '@material-ui/core';
import { CreateBooking } from './CreateBooking';
import { CreateBookingProps } from './CreateBookingForm';

type CreateBookingModalProps = CreateBookingProps & {
    onClose: () => void,
}
export function CreateBookingModal({ onClose, ...defaultValues }: CreateBookingModalProps) {
    
    return (<Dialog onClose={onClose} aria-labelledby="create-booking-title" open={true} fullWidth={true} maxWidth='sm'>
        <DialogContent>
            <CreateBooking onClose={onClose} {...defaultValues} />
        </DialogContent>
    </Dialog>);
}