import { Button, Card, CardContent, CardMedia, createStyles, FormGroup, FormHelperText, makeStyles, TextField, Theme, Typography } from "@material-ui/core";
import { useState } from "react";
import { LoginData } from "../../api";
import { useAuthUser } from "../../hooks/useAuthUser";
import { getFormdataById } from "../../utils/formFunctions";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            minHeight: '20rem',
            '& .MuiTextField-root': {
                margin: theme.spacing(1)
            }
        },
        form: {
            marginTop: theme.spacing(2)
        },
        details: {
            display: 'flex',
            flexDirection: 'column',
            width: '50%'
        },
        content: {
            flex: '1 0 auto',
        },
        cover: {
            width: '50%',
        }
    }),
);

export function Login() {
    const classes = useStyles();
    const [isLoading, setLoading] = useState(false);
    const [, login] = useAuthUser();

    const handleLogin = (e: React.FormEvent) => {
        const data = getFormdataById<LoginData>('login-form');
        e.preventDefault();
        login(data);
    }
    return (<Card className={classes.root}>
        <CardContent className={classes.content}>
            <form id='login-form' className={classes.form} onSubmit={handleLogin}>
                <FormGroup>
                    <TextField type="email" name="email" label='Email' placeholder="Email" variant='outlined' required />
                    <TextField type="password" name="password" label='Kodeord' placeholder="Kodeord" variant='outlined' required />
                </FormGroup>
                <FormGroup>
                    <Button variant='contained' color='primary' type='submit' disabled={isLoading}>
                        Login
                        </Button>
                </FormGroup>
            </form>
        </CardContent>
    </Card>)
}