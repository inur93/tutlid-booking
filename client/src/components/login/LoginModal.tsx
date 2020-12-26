import { Dialog, DialogTitle, List } from "@material-ui/core";
import { Login } from "./Login";


type LoginModalProps = {
    onClose: () => void
}
export function LoginModal({ onClose }: LoginModalProps) {

    return (
        <Dialog onClose={onClose} aria-labelledby="simple-dialog-title" open={true}>
            <DialogTitle id="simple-dialog-title">Login</DialogTitle>
            <Login />
        </Dialog>);
}