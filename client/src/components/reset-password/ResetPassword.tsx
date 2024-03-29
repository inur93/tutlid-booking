

import { Button, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Form, Formik, FormikHelpers } from 'formik';
import queryString from 'query-string';
import { useState } from "react";
import { TFunction, useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import * as yup from 'yup';
import api from "../../api";
import { Alert } from '../shared/Alert';
import { ButtonContainer } from "../shared/ButtonContainer";
import Panel from "../shared/Panel";

let resetFormSchema = yup.object().shape({
    email: yup
        .string()
        .email()
        .required()
})

let updateFormSchema = yup.object().shape({
    password: yup
        .string()
        .required()
})

type ResetPasswordProps = {
    t: TFunction<string[]>,
    prompt: 'email' | 'password',
    error: string,
    complete: boolean,
    handleResetPassword: (values: any, helpers: FormikHelpers<any>) => Promise<void>
    handleUpdatePassword: (values: any, helpers: FormikHelpers<any>) => Promise<void>
}

type ResetPasswordFormProps = Omit<ResetPasswordProps, 'handleUpdatePassword' | 'prompt'>;
type UpdatePasswordFormProps = Omit<ResetPasswordProps, 'handleResetPassword' | 'prompt'>;

export function UpdatePasswordForm({ t, error, complete, handleUpdatePassword }: UpdatePasswordFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    return <Formik initialValues={{ password: '' }}
        validationSchema={updateFormSchema}
        onSubmit={handleUpdatePassword}>
        {({ isSubmitting, errors, touched, handleChange, values: { password } }) => (
            <Form>
                <TextField type={showPassword ? "text" : "password"}
                    fullWidth
                    name="password"
                    label={t('app:resetPassword.passwordLabel')}
                    placeholder={t('app:resetPassword.passwordPlaceholder')}
                    variant='outlined'
                    error={Boolean(errors.password)}
                    helperText={errors.password ? errors.password : ''}
                    value={password}
                    onChange={handleChange}
                    InputProps={{ // <-- This is where the toggle button is added.
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(val => !val)}
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }} />
                <ButtonContainer>
                    <Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
                        {t('common:button.updatePassword')}
                    </Button>
                </ButtonContainer>
                {error && <Alert severity='error'>{error}</Alert>}
                {complete && <Alert severity='success' >{t('app:resetPassword.passwordUpdateMessage')}</Alert>}
            </Form>)
        }
    </Formik>
}

export function ResetPasswordForm({ handleResetPassword, error, complete, t }: ResetPasswordFormProps) {
    return <Formik initialValues={{ email: '' }}
        validationSchema={resetFormSchema}
        onSubmit={handleResetPassword}>
        {({ isSubmitting, errors, touched, handleChange, values: { email } }) => (
            <Form>
                <TextField type="email"
                    fullWidth
                    name="email"
                    label={t('app:resetPassword.emailLabel')}
                    placeholder={t('app:resetPassword.emailPlaceholder')}
                    variant='outlined'
                    value={email}
                    error={Boolean(errors.email)}
                    helperText={errors.email ? errors.email : ''}
                    onChange={handleChange} />

                <ButtonContainer>
                    <Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
                        {t('common:button.resetPassword')}
                    </Button>
                </ButtonContainer>
                {error && <Alert severity='error'>{error}</Alert>}
                {complete && <Alert severity='success' >{t('app:resetPassword.completeMessage')}</Alert>}

            </Form>)
        }
    </Formik>
}
export function ResetPassword({ prompt, ...props }: ResetPasswordProps) {
    return (<Panel header={props.t('app:resetPassword.header')}>
        <Typography variant='body1'>{props.t('app:resetPassword.description')}</Typography>
        <p />
        {prompt === 'email' && <ResetPasswordForm {...props} />}
        {prompt === 'password' && <UpdatePasswordForm {...props} />}
    </Panel>)
}

export default function IResetPassword() {
    const { t } = useTranslation(['app', 'common']);
    const [error, setError] = useState('');
    const [complete, setComplete] = useState(false);
    const location = useLocation();
    const { token } = queryString.parse(location.search);

    const handleResetPassword = async (values: any, helpers: FormikHelpers<any>) => {
        try {
            await api.AuthApi.resetPassword(values.email);
            setComplete(true);
        } catch (e: any) {
            setError(e.message);
        }
        helpers.setSubmitting(false);
    }

    const handleUpdatePassword = async (values: any, helpers: FormikHelpers<any>) => {
        try {
            await api.AuthApi.updatePassword({
                password: values.password,
                token: token as string
            });
            setComplete(true);
        } catch (e: any) {
            setError(e.message);
        }
        helpers.setSubmitting(false);
    }

    return <ResetPassword {...{
        prompt: token ? 'password' : 'email',
        handleResetPassword,
        handleUpdatePassword,
        error, complete, t
    }} />
}