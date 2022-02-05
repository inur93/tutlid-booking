import { Dialog, DialogTitle, Typography } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { Login } from "./Login";


type LoginModalProps = {
    onClose: () => void
}
export function LoginModal({ onClose }: LoginModalProps) {
    const { t } = useTranslation('app');
    return (
        <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={true}>
            <DialogTitle id="simple-dialog-title">
                <Typography variant="h1">{t('app:loginModal.header')}</Typography>
                </DialogTitle>
            <Login onComplete={onClose} />
        </Dialog>);
}