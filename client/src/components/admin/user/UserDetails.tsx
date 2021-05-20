import { Avatar, CardContent, CardHeader, createStyles, Grid, makeStyles, Theme, Card, Typography, CardActions } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { useState } from 'react';
import api, { User } from '../../../api';
import { AdminApi } from '../../../api/adminApi';
import { useData } from '../../../hooks/useData';
import UserRoles from './UserRoles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 345,
        },
        media: {
            height: 0,
            paddingTop: '56.25%', // 16:9
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        avatar: {
            backgroundColor: red[500],
        },
    }),
);

type Props = {
    userId: string
}

function getInitials(name: string) {
    if(!name) return '';
    const parts = name.split(' ');
    if(parts.length < 2) return '';
    return `${parts[0][0].toUpperCase()}${parts[parts.length - 1][0].toUpperCase()}`;
}
export function UserDetails({ userId }: Props) {
    const classes = useStyles();
    const [{ data: user }] = useData<User>(() => api.AdminApi.getUser(userId));
    const initials = getInitials(user?.fullName || '');

    return (<Card className={classes.root}>
        <CardHeader
            avatar={
                <Avatar aria-label="recipe" className={classes.avatar}>
                    {initials}
                </Avatar>
            }
            title={user?.fullName}
            subheader={user?.email}
        />
        <CardContent>
            <Typography variant="body2" color="textSecondary" component="p">
            </Typography>
        </CardContent>
        <CardActions disableSpacing>
            <UserRoles roles={user?.roles || []} />
        </CardActions>

    </Card>)
}