import { Button, TextField } from '@mui/material';
import { startOfToday } from 'date-fns';
import { Form, Formik, FormikHelpers } from 'formik';
import React from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { CreatePriceMatrix as CreatePriceMatrixModel } from '../../../api';
import { formatFormDate } from '../../../utils/dateFunctions';

type CreatePriceMatrixProps = {
    onCancel: () => void,
    onCreate: (priceMatrix: CreatePriceMatrixModel) => Promise<void>
}
export default function CreatePriceMatrix({ onCancel, onCreate }: CreatePriceMatrixProps) {
    const { t } = useTranslation(['app', 'common', 'validation']);
    const schema = getSchema(t);

    const submit = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
        const data = {
            ...values,
            validFrom: new Date(values.validFrom)
        }
        await onCreate(data);
        setSubmitting(false);
    }
    return (<Formik
        initialValues={{
            validFrom: formatFormDate(startOfToday()),
            price: undefined,
            tubPrice: undefined
        }}
        validationSchema={schema}
        onSubmit={submit}>
        {({ isSubmitting, errors, touched, handleChange, values: { validFrom, price, tubPrice } }) => (
            <Form>
                <TextField type="date"
                    fullWidth
                    name="validFrom"
                    label={t('app:createPriceMatrix.validFromLabel')}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    required
                    error={Boolean(errors.validFrom)}
                    onChange={handleChange}
                    value={validFrom}
                    helperText={errors.validFrom ? errors.validFrom : ''} />
                <TextField type="number"
                    fullWidth
                    name="price"
                    label={t('app:createPriceMatrix.priceLabel')}
                    variant="outlined"
                    required
                    error={Boolean(errors.price)}
                    onChange={handleChange}
                    value={price}
                    helperText={errors.price ? errors.price : ''} />
                <TextField type="number"
                    fullWidth
                    name="tubPrice"
                    label={t('app:createPriceMatrix.tubPriceLabel')}
                    variant="outlined"
                    required
                    error={Boolean(errors.tubPrice)}
                    onChange={handleChange}
                    value={tubPrice}
                    helperText={errors.tubPrice ? errors.tubPrice : ''} />

                <Button variant={"text"} color="primary" onClick={onCancel}>
                    {t('common:button.cancel')}
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                    {t('common:button.create')}
                </Button>
            </Form>)}
    </Formik>);
}


function getSchema(t: TFunction<string[]>) {
    return yup.object().shape({
        validFrom: yup
            .date()
            .min(startOfToday(), t('validation:date.afterToday'))
            .required()
            .default(() => new Date()),
        price: yup.number()
            .required()
            .min(0, t('validation:number.positive'))
            .default(() => 0),
        tubPrice: yup.number()
            .required()
            .min(0, t('validation:number.positive'))
            .default(() => 0)
    })
}
