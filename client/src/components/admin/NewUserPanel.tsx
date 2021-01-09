import React from 'react';
import { Card, CardContent, CardHeader, createStyles, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core';
import clsx from 'clsx';
import { useUsersPendingApproval } from '../../hooks/useUsersPendingApproval';
import { User } from '../../api';
import RejectIcon from '@material-ui/icons/HighlightOffRounded';
import ApproveIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import { green, red } from '@material-ui/core/colors';
import { UserStatus } from '../../api/index';
const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

const useRequestStyles = makeStyles((theme: Theme) =>
({
    'approve': {
        color: green[500]
    },
    'reject': {
        color: red[500]
    }
}));
type NewUserPanelProps = {}

type UserRequestProps = {
    user: User,
    onClick: (id: string, status: UserStatus) => Promise<void>
}
function UserRequest({ user, onClick }: UserRequestProps) {
    const classes = useRequestStyles();
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

export default function NewUserPanel({ }: NewUserPanelProps) {
    const classes = useStyles();
    const [{ users }, reply] = useUsersPendingApproval();
    if(!users.length) return null;
    return (<Card>
        <CardContent>
            <Typography variant='h6'>Users pending admin approval</Typography>
            <List dense>
                {users.map(x => <UserRequest key={x._id} user={x} onClick={reply} />)}
            </List>
        </CardContent>

    </Card>);
}