import { Dialog, DialogTitle } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import { Login } from "./Login";


type LoginModalProps = {
    onClose: () => void
}
export function LoginModal({ onClose }: LoginModalProps) {
    const { t } = useTranslation();
    return (
        <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={true}>
            <DialogTitle id="simple-dialog-title">{t('shared.login')}</DialogTitle>
            <Login onComplete={onClose} />
        </Dialog>);
}