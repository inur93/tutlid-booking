import { Button, FormGroup, TextField } from "@material-ui/core";
import { Form, Formik, FormikHelpers } from 'formik';
import { TFunction, useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import * as yup from 'yup';
import { useAuthUser } from "../../hooks/useAuthUser";
import { Alert } from '../shared/Alert';
import Panel from "../shared/Panel";

const getSchema = (t: TFunction<string[]>) => {

    return yup.object().shape({
        email: yup
            .string()
            .email(t('validation:email'))
            .required(t('validation:required')),
        password: yup
            .string()
            .required(t('validation:required'))
    })
}

type LoginProps = {
    onComplete?: () => void,
    header?: string
}
export function Login({ onComplete, header }: LoginProps) {
    const [, { login }, error] = useAuthUser();
    const { t } = useTranslation(['app', 'common']);
    const handleLogin = async (values: any, helpers: FormikHelpers<any>) => {
        const success = await login(values);
        helpers.setSubmitting(false);
        if (success && onComplete) onComplete();
    }
    return (<Panel header={header}>
        <Formik initialValues={{
            email: '',
            password: ''
        }}
            validationSchema={getSchema(t)}
            onSubmit={handleLogin}>
            {({ isSubmitting, errors, touched, handleChange, values: { email, password } }) => (
                <Form noValidate>
                    <FormGroup>
                        <TextField type="email"
                            name="email"
                            error={!!(errors.email && touched.email)}
                            helperText={touched.email ? errors.email : ''}
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

                    {error && <Alert severity='error'>{t(error)}</Alert>}
                    <FormGroup>

                        <Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
                            {t('common:button.login')}
                        </Button>
                        <Button component={Link} to='/register' variant='outlined' color='secondary' onClick={onComplete}>
                            {t('common:button.register')}
                        </Button>
                        <Link to='/reset-password'>{t('app:login.forgotPassword')}</Link>
                    </FormGroup>
                </Form>)
            }
        </Formik>
    </Panel>)
}