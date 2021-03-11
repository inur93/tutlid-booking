import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import ResetPassword from "../components/reset-password/ResetPassword";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '5rem'
        }
    }),
);

export function ResetPasswordPage() {
    const classes = useStyles();
    return <Grid className={classes.root} container justify='center'>
        <Grid item xs={12} md={8} lg={6}>
            <ResetPassword />
        </Grid>
    </Grid>
}