import { IconButton, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Theme } from "@material-ui/core";
import { green, red } from "@material-ui/core/colors";
import { User, UserStatus } from "../../../api";
import ApproveIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import RejectIcon from '@material-ui/icons/HighlightOffRounded';

const useStyles = makeStyles((theme: Theme) =>
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
    const classes = useStyles();
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