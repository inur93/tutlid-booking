import { IconButton, ListItem, ListItemSecondaryAction, ListItemText, Theme } from "@mui/material";
import {makeStyles} from 'tss-react/mui';
import { green, red } from "@mui/material/colors";
import { User, UserStatus } from "../../../api";
import ApproveIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import RejectIcon from '@mui/icons-material/HighlightOffRounded';

const useStyles = makeStyles()((theme: Theme) =>
({
    'approve': {
        color: green[500]
    },
    'reject': {
        color: red[500]
    }
}));

type Props = {
    user: User,
    onClick: (id: string, status: UserStatus) => Promise<void>
}
export function UserRequest({ user, onClick }: Props) {
    const {classes} = useStyles();
    const handleAction = (status: UserStatus) => () => onClick(user._id, status);
    return <ListItem>
        <ListItemText primary={user.fullName} secondary={user.email} />
        <ListItemSecondaryAction>
            <IconButton edge='end' aria-label='approve' onClick={handleAction(UserStatus.approved)}>
                <ApproveIcon className={classes.approve} />
            </IconButton>
            <IconButton edge='end' aria-label='reject' onClick={handleAction(UserStatus.rejected)}>
                <RejectIcon className={classes.reject} />
            </IconButton>
        </ListItemSecondaryAction>
    </ListItem>
}