import { Button, Card, CardContent, createStyles, FormGroup, makeStyles, TextField, Theme, Typography } from "@material-ui/core";
import { Form, Formik, FormikHelpers } from 'formik';
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import * as yup from 'yup';
import { useAuthUser } from "../../hooks/useAuthUser";
import { Alert } from '../shared/Alert';

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

type LoginProps = {
    onComplete?: () => void
}
export function Login({ onComplete }: LoginProps) {
    const classes = useStyles();
    const [, { login }, error] = useAuthUser();
    const { t } = useTranslation(['app', 'common']);
    const handleLogin = async (values: any, helpers: FormikHelpers<any>) => {
        const success = await login(values);
        helpers.setSubmitting(false);
        if (success && onComplete) onComplete();
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
                                label={t('app:login.emailLabel')}
                                placeholder={t('app:login.emailPlaceholder')}
                                variant='outlined'
                                value={email}
                                onChange={handleChange} />

                            <TextField type="password"
                                name="password"
                                label={t('app:login.passwordLabel')}
                                placeholder={t('app:login.passwordPlaceholder')}
                                variant='outlined'
                                value={password}
                                onChange={handleChange} />
                        </FormGroup>

                        <Typography variant="body1" style={{display: 'inline'}}>{t('app:login.forgotPasswordDescription')}</Typography>
                        <Link to='/reset-password'>{t('app:login.forgotPasswordLink')}</Link>
                        {error && <Alert severity='error'>{error}</Alert>}
                        <FormGroup>
                            <Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
                                {t('common:button.login')}
                            </Button>
                            <Button component={Link} to='/register' variant='outlined' color='secondary' onClick={onComplete}>
                                {t('common:button.register')}
                            </Button>
                        </FormGroup>
                    </Form>)
                }
            </Formik>
        </CardContent>
    </Card>)
}