import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { Login } from "../components/login/Login";
import { useAuthUser } from "../hooks/useAuthUser";
import { useEffect } from 'react';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '5rem'
        }
    }),
);

export function LoginPage() {
    const classes = useStyles();
    const [user] = useAuthUser();
    const router = useHistory();
    useEffect(() => {
        if(user.isLoggedIn){
            router.push('/');
        }
    }, [user]);
    return <Grid className={classes.root} container justify='center'>
        <Grid item  xs={12} md={8} lg={6}>
            <Login />
        </Grid>
    </Grid>
}