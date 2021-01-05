import { Button, Card, CardContent, createStyles, FormGroup, makeStyles, TextField, Theme } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import { Form, Formik, FormikHelpers } from 'formik';
import { Link } from "react-router-dom";
import * as yup from 'yup';
import { useAuthUser } from "../../hooks/useAuthUser";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            minHeight: '20rem',
            '& .MuiTextField-root,& .MuiButtonBase-root': {
                marginBottom: theme.spacing(2)
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

let schema = yup.object().shape({
    email: yup
        .string()
        .email()
        .required(),
    password: yup
        .string()
        .required()
})

export function Login() {
    const classes = useStyles();
    const [, login, error] = useAuthUser();

    const handleLogin = async (values: any, helpers: FormikHelpers<any>) => {
        await login(values);
        helpers.setSubmitting(false);
    }
    return (<Card className={classes.root}>
        <CardContent className={classes.content}>
            <Formik initialValues={{
                email: '',
                password: ''
            }}
                validationSchema={schema}
                onSubmit={handleLogin}>
                {({ isSubmitting, errors, touched, handleChange, values: { email, password } }) => (
                    <Form>
                        <FormGroup>
                            <TextField type="email"
                                name="email"
                                label='Email'
                                placeholder="Email"
                                variant='outlined'
                                value={email}
                                onChange={handleChange} />

                            <TextField type="password"
                                name="password"
                                label='Kodeord'
                                placeholder="Kodeord"
                                variant='outlined'
                                value={password}
                                onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
                                Login
                        </Button>
                            <Button component={Link} to='/register' variant='outlined' color='secondary'>
                                Register
                            </Button>
                                {error && <Alert severity='error'>{error}</Alert>}
                        </FormGroup>
                    </Form>)
                }
            </Formik>
        </CardContent>
    </Card>)
}