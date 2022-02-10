import { ListItem, ListItemSecondaryAction, ListItemText } from "@mui/material";
import { Link } from "react-router-dom";
import { User } from "../../../api";
import UserRoles from "./UserRoles";


type Props = {
    user: User
}
export function UserListItem({ user }: Props) {
    return <ListItem component={Link} to={`/admin/users/${user._id}`} onClick={() => console.log('hello')}>
        <ListItemText primary={user.fullName} secondary={user.email} />
        <ListItemSecondaryAction>
            <UserRoles roles={user.roles} />
        </ListItemSecondaryAction>
    </ListItem>
}