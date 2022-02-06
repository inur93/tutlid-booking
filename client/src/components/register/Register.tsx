import { Button, Fade, TextField, Typography } from '@material-ui/core';
import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import * as yup from 'yup';
import { useRegisterUser } from '../../hooks/useRegisterUser';
import { Alert } from '../shared/Alert';
import { ButtonContainer } from '../shared/ButtonContainer';
import Panel from '../shared/Panel';
import { Spacer } from '../shared/Spacer';

function getSchema(t: TFunction<string[]>) {
    return yup.object().shape({
        fullName: yup
            .string()
            .required(t('validation:required')),
        email: yup
            .string()
            .email(t('validation:email'))
            .required(t('validation:required')),
        password: yup
            .string()
            .required(t('validation:required'))
    })
}

type RegisterUserProps = {
    header?: string
}
export default function RegisterUser({ header }: RegisterUserProps) {
    const [user, register, error] = useRegisterUser();
    const { t } = useTranslation(['validation', 'common', 'app']);
    const handleSubmit = async function (values: any, helpers: FormikHelpers<any>) {
        await register(values);
        helpers.setSubmitting(false);
    }
    return (<Panel header={header}>
        <Typography variant='body1'>{t('app:register.description')}</Typography>
        <Spacer />
        <Fade in={!user.isLoggedIn} >
            <Formik initialValues={{
                fullName: '',
                email: '',
                password: ''
            }}
                validationSchema={getSchema(t)}
                onSubmit={handleSubmit}>
                {({ isSubmitting, errors, touched, handleChange, values: { fullName, email, password } }) => (
                    <Form>
                        <TextField name='fullName'
                            fullWidth
                            label={t('app:register.fullNameLabel')}
                            placeholder={t('app:register.fullNamePlaceholder')}
                            variant='outlined'
                            value={fullName}
                            error={Boolean(errors.fullName)}
                            helperText={touched.fullName ? errors.fullName : ''}
                            onChange={handleChange} />

                        <TextField type="email"
                            fullWidth
                            name="email"
                            label={t('app:register.emailLabel')}
                            placeholder={t('app:register.emailLabel')}
                            variant='outlined'
                            value={email}
                            error={Boolean(errors.email)}
                            helperText={touched.email ? errors.email : ''}
                            onChange={handleChange} />

                        <TextField type="password"
                            fullWidth
                            name="password"
                            label={t('app:register.passwordLabel')}
                            placeholder={t('app:register.passwordPlaceholder')}
                            variant='outlined'
                            value={password}
                            error={Boolean(errors.password)}
                            helperText={touched.password ? errors.password : ''}
                            onChange={handleChange} />

                        <ButtonContainer>
                            <Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
                                {t('common:button.register')}
                            </Button>
                        </ButtonContainer>

                    </Form>
                )
                }
            </Formik>
        </Fade>

        {error && <Alert severity='error'>{error}</Alert>}
        {
            user.isLoggedIn &&
            <Alert severity='success'>
                {t('app:register.loggedinMsg', { name: user.fullName })}

                {!user.approvedByAdmin ? <p>{t('app:register.missingAdminApproval')}</p> : ' '}
                <Link to='/'>{t('app:register.gotoHomePage')}</Link>
            </Alert>
        }
    </Panel >);
}