import { List } from '@mui/material';
import React from 'react';
import { User } from '../../../api';
import { UserListItem } from './UserListItem';


type Props = {
    users: User[]
}

export default function UserList({ users }: Props) {
    if (!users.length) return null;
    return (<List dense>
        {users.map(x => <UserListItem key={x._id} user={x} />)}
    </List>);
}