import { createStyles, Dialog, DialogTitle, makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import BookingInfo, { BookingInfoProps } from './BookingInfo';

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
    const { t } = useTranslation();

    return (<Dialog onClose={onClose} aria-labelledby="booking-info" open={true}>
        <DialogTitle id="booking-info">{t('calendar.booking')}</DialogTitle>
        <BookingInfo onClose={onClose} {...otherProps} />
    </Dialog>);
}