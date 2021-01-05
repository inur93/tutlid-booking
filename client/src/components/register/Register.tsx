import { Button, Card, CardContent, CardHeader, createStyles, Fade, FormGroup, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { useState } from 'react';
import { Link, useHistory } from "react-router-dom";
import * as yup from 'yup';
import api from '../../api';
import { useRegisterUser } from '../../hooks/useRegisterUser';

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
    fullName: yup
        .string()
        .required(),
    email: yup
        .string()
        .email()
        .required(),
    password: yup
        .string()
        .required()
})

type RegisterUserProps = {
    header?: string
}
export default function RegisterUser({ header }: RegisterUserProps) {
    const classes = useStyles();
    const [user, register, error] = useRegisterUser();

    const handleSubmit = async function (values: any, helpers: FormikHelpers<any>) {
        await register(values);
        helpers.setSubmitting(false);
    }
    return (<Card className={classes.root}>
        <CardHeader>
            <Typography variant='h2'>{header}</Typography>
        </CardHeader>
        <CardContent className={classes.content}>

            <Formik initialValues={{
                fullName: '',
                email: '',
                password: ''
            }}
                validationSchema={schema}
                onSubmit={handleSubmit}>
                {({ isSubmitting, errors, touched, handleChange, values: { fullName, email, password } }) => (
                    <Fade in={!user} >
                        <Form>

                            <FormGroup>
                                <TextField name='fullName'
                                    label='Full Name'
                                    placeholder='Full Name'
                                    variant='outlined'
                                    value={fullName}
                                    error={Boolean(errors.fullName)}
                                    helperText={touched.fullName ? errors.fullName : ''}
                                    onChange={handleChange} />

                                <TextField type="email"
                                    name="email"
                                    label='Email'
                                    placeholder="Email"
                                    variant='outlined'
                                    value={email}
                                    error={Boolean(errors.email)}
                                    helperText={touched.email ? errors.email : ''}
                                    onChange={handleChange} />

                                <TextField type="password"
                                    name="password"
                                    label='Kodeord'
                                    placeholder="Kodeord"
                                    variant='outlined'
                                    value={password}
                                    error={Boolean(errors.password)}
                                    helperText={touched.password ? errors.password : ''}
                                    onChange={handleChange} />
                            </FormGroup>
                            <FormGroup>
                                <Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
                                    Register
                        </Button>
                            </FormGroup>


                        </Form>
                    </Fade>)
                }
            </Formik>

            {error && <Alert severity='error'>{error}</Alert>}
            {!!user &&
                <Alert severity='success'>
                    Du er nu logget ind som {user && user.fullName}.
                    
                    {!user?.approvedByAdmin ? <p>Før du kan booke Tutlið skal en administrator have godkendt din bruger.</p> : ' '}
                    <Link to='/'>Gå til forside</Link>
                </Alert>
            }
        </CardContent>
    </Card>);
}