import { Button, TextField, Typography } from "@material-ui/core";
import { Form, Formik, FormikHelpers } from 'formik';
import { TFunction, Trans, useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import * as yup from 'yup';
import { useAuthUser } from "../../hooks/useAuthUser";
import { Alert } from '../shared/Alert';
import { ButtonContainer } from "../shared/ButtonContainer";
import Panel from "../shared/Panel";
import { Spacer } from "../shared/Spacer";

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
                    <Typography variant='body1'>
                        <Trans i18nKey="app:login.register" components={[<Link to='/register'></Link>]}></Trans>
                    </Typography>
                    <Spacer />
                    <TextField type="email"
                        fullWidth
                        name="email"
                        error={!!(errors.email && touched.email)}
                        helperText={touched.email ? errors.email : ''}
                        label={t('app:login.emailLabel')}
                        placeholder={t('app:login.emailPlaceholder')}
                        variant='outlined'
                        value={email}
                        onChange={handleChange} />

                    <TextField type="password"
                        fullWidth
                        name="password"
                        label={t('app:login.passwordLabel')}
                        placeholder={t('app:login.passwordPlaceholder')}
                        variant='outlined'
                        value={password}
                        onChange={handleChange} />

                    <Link to='/reset-password'>{t('app:login.forgotPassword')}</Link>
                    {error && <Alert severity='error'>{t(error)}</Alert>}
                    <ButtonContainer>
                        <Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
                            {t('common:button.login')}
                        </Button>
                    </ButtonContainer>
                </Form>)
            }
        </Formik>
    </Panel>)
}