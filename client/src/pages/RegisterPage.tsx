import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import RegisterUser from "../components/register/Register";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '5rem'
        }
    }),
);

export function RegisterPage() {
    const classes = useStyles();
    return <Grid className={classes.root} container justify='center'>
        <Grid item xs={12} md={8} lg={6}>
            <RegisterUser header='Register new user'/>
        </Grid>
    </Grid>
}