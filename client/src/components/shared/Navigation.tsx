import { AppBar, Button, Toolbar, Typography } from "@material-ui/core";
import React, { useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { LoginModal } from "../login/LoginModal";
import { useAuthUser } from "../../hooks/useAuthUser";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }),
);

export function Navigation() {
    const classes = useStyles();
    const [show, setShow] = useState(false);
    const [user, { logout }] = useAuthUser();
    return (<AppBar position="static" className={classes.root}>
        <Toolbar>
            <Typography variant="h6" className={classes.title}>
                Tutlið
            </Typography>
            {user &&
                <Typography>
                    Welcome {user.fullName}
                </Typography>
            }
            {user &&
                <Button color="inherit" onClick={logout}>Logout</Button>
            }
            {!user && <Button color="inherit" onClick={() => setShow(true)}>Login</Button>}
            {show && <LoginModal onClose={() => setShow(false)} />}
        </Toolbar>
    </AppBar>)
}