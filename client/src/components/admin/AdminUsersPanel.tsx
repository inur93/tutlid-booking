import { Card, CardContent, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core';
import { green, red } from '@material-ui/core/colors';
import ApproveIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import RejectIcon from '@material-ui/icons/HighlightOffRounded';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { User, UserStatus } from '../../api/index';
import { useUsers } from '../../hooks/useUsers';

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

type AdminUsersPanelProps = {}
export default function AdminUsersPanel({ }: AdminUsersPanelProps) {
    const classes = useStyles();
    const [{ users }, reply] = useUsers(UserStatus.pendingApproval);
    const { t } = useTranslation('app');
    if (!users.length) return null;
    return (<Card>
        <CardContent>
            <Typography variant='h6'>{t('AdminUserPanel.header')}</Typography>
            <List dense>
                {users.map(x => <UserRequest key={x._id} user={x} onClick={reply} />)}
            </List>
        </CardContent>

    </Card>);
}