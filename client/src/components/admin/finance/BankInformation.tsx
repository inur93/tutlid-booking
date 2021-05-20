import { Button, FormGroup, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import * as yup from 'yup';
import api, { BankInformation } from '../../../api';
import { useData } from '../../../hooks/useData';
import { Alert } from '../../shared/Alert';

const useStyles = makeStyles((theme: Theme) =>
({
    root: {
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
export default function BankInformationForm({ }: BankInformationProps) {
    const classes = useStyles();
    const { t } = useTranslation(['app', 'common']);
    const [{ error, loading, data: bankInformation }, reload] = useData<BankInformation>(() => api.AdminApi.getBankInformation());
    const schema = getSchema(t);
    const handleUpdate = async (values: any, helpers: FormikHelpers<any>) => {
        if (bankInformation) {
            await api.AdminApi.updateBankInformation(bankInformation._id, values);
            await reload();
        }
        helpers.setSubmitting(false);
    }

    if(error) return <p>{error}</p>
    if (!bankInformation) return null;

    return (<Grid className={classes.root}>
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
                        <Button variant='contained' color='primary' type='submit' disabled={isSubmitting || loading}>
                            {t('common:button.save')}
                        </Button>
                        {error && <Alert severity='error'>{error}</Alert>}
                    </FormGroup>
                </Form>)
            }
        </Formik>
    </Grid>);
}