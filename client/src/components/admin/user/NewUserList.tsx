import { Grid, List } from '@material-ui/core';
import React from 'react';
import { User } from '../../../api';
import { UserStatus } from '../../../api/index';
import { UserRequest } from './UserRequest';


type Props = {
    users: User[],
    changeStatus: (id: string, status: UserStatus) => Promise<void>
}

export default function NewUserList({ users, changeStatus }: Props) {
    if (!users.length) return null;
    return (<Grid>
        <List dense>
            {users.map(x => <UserRequest key={x._id} user={x} onClick={changeStatus} />)}
        </List>
    </Grid>);
}