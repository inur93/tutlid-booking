import { Button, Card, CardContent, FormGroup, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useBankInformation } from '../../hooks/useBankInformation';
import { Alert } from '../shared/Alert';

const useStyles = makeStyles((theme: Theme) =>
({
    root: {
        // display: 'flex',
        // minHeight: '20rem',
        '& .MuiTextField-root,& .MuiButtonBase-root': {
            marginBottom: theme.spacing(2)
        },
        '& h6': {
            marginBottom: theme.spacing(1)
        }
    },
}));

type BankInformationProps = {}

function getSchema(t: TFunction<string[]>) {
    return yup.object().shape({
        regNo: yup
            .string()
            .matches(/^\d{4}$/, t('validation:regNo'))
            .required(t('validation:required')),
        accountNo: yup
            .string()
            .matches(/^\d{10}$/, t('validation:accountNo'))
            .required(t('validation:required'))
    })
}
export default function BankInformation({ }: BankInformationProps) {
    const classes = useStyles();
    const { t } = useTranslation(['app', 'common']);
    const [{ error, loading, bankInformation }, update] = useBankInformation();
    const schema = getSchema(t);
    const handleUpdate = async (values: any, helpers: FormikHelpers<any>) => {
        if (bankInformation) {
            await update(bankInformation._id, values);
        }
        helpers.setSubmitting(false);
    }

    if (!bankInformation) return null;

    return (<Card elevation={0}>
        <CardContent className={classes.root}>
        <Typography variant='h6'>{t('app:bankInformation.header')}</Typography>
            <Formik initialValues={{
                regNo: bankInformation?.regNo,
                accountNo: bankInformation?.accountNo
            }}
                validationSchema={schema}
                onSubmit={handleUpdate}>
                {({ isSubmitting, errors, touched, handleChange, values: { regNo, accountNo } }) => (
                    <Form>
                        <FormGroup>
                            <TextField type="text"
                                name="regNo"
                                label={t('app:bankInformation.regNoLabel')}
                                placeholder={t('app:bankInformation.regNoPlaceholder')}
                                variant='outlined'
                                error={Boolean(errors.regNo)}
                                value={regNo}
                                helperText={errors.regNo ? errors.regNo : ''}
                                onChange={handleChange} />

                            <TextField type="text"
                                name="accountNo"
                                label={t('app:bankInformation.accountNoLabel')}
                                placeholder={t('app:bankInformation.accountNoPlaceholder')}
                                variant='outlined'
                                error={Boolean(errors.accountNo)}
                                value={accountNo}
                                helperText={errors.accountNo ? errors.accountNo : ''}
                                onChange={handleChange} />
                        </FormGroup>
                        <FormGroup>
                            <Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
                                {t('common:button.save')}
                            </Button>
                            {error && <Alert severity='error'>{error}</Alert>}
                        </FormGroup>
                    </Form>)
                }
            </Formik>

        </CardContent>
    </Card>);
}