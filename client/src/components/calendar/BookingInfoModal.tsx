import { Dialog, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BookingInfo, { BookingInfoProps } from './BookingInfo';

type BookingInfoModalProps = BookingInfoProps & {
    onClose: (reload: boolean) => void
}
export function BookingInfoModal({ onClose, ...otherProps }: BookingInfoModalProps) {
    const { t } = useTranslation('app');

    return (<Dialog onClose={onClose} aria-labelledby="booking-info" open={true}>
        <DialogTitle id="booking-info">{t('app:bookingInfoModal.header')}</DialogTitle>
        <BookingInfo onClose={onClose} {...otherProps} />
    </Dialog>);
}