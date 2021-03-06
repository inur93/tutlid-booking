import { Button, Card, CardContent, createStyles, FormGroup, makeStyles, TextField, Theme } from '@material-ui/core';
import { startOfToday } from 'date-fns';
import { Form, Formik, FormikHelpers } from 'formik';
import { FocusEvent } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import * as yup from 'yup';
import api, { Booking } from '../../api';
import { usePrice } from '../../hooks/usePrice';
import { formatFormDate } from '../../utils/dateFunctions';
import { getFormdataById, str2isoDate } from '../../utils/formFunctions';
import PriceTable from './PriceTable';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                marginBottom: theme.spacing(1)
            }
        },
        form: {
            marginTop: theme.spacing(2)
        },
        content: {
            flex: '1 0 auto',
        },
    }),
);

export type CreateBookingProps = {
    onComplete?: (booking: Booking) => void,
    from?: Date,
    to?: Date
}



export function CreateBooking({ onComplete, from, to }: CreateBookingProps) {
    const classes = useStyles();
    const { t } = useTranslation(['app', 'validation', 'common']);
    let schema = getSchema(t);
    const [price, calcPrice] = usePrice();
    const handleCreate = async (values: any, { setSubmitting }: FormikHelpers<any>) => {

        try {
            values.from = str2isoDate(values.from);
            values.to = str2isoDate(values.to);
            const response = await api.BookingApi.create(values);
            if (onComplete) onComplete(response.body);
        } catch (e) {

        }

        setSubmitting(false);
    }

    const calculatePrice = async (evt: FocusEvent<HTMLFormElement>) => {
        const data = getFormdataById('create-booking') as any;
        await calcPrice(data);
    }

    return (<Card className={classes.root}>
        <CardContent className={classes.content}>
            <Formik
                initialValues={{
                    from: formatFormDate(from || new Date()),
                    to: formatFormDate(to || new Date()),
                    pplCount: 0,
                    tubCount: 0,
                    comment: ""
                }}
                validationSchema={schema}

                onSubmit={handleCreate}>
                {({ isSubmitting, errors, touched, handleChange, values: { from, to, pplCount, tubCount, comment } }) => (
                    <Form onBlur={calculatePrice} id='create-booking'>
                        <FormGroup>
                            <TextField type="date"
                                name="from"
                                label={t('app:createBooking.fromLabel')}
                                variant="outlined"
                                required
                                error={Boolean(errors.from)}
                                onChange={handleChange}
                                value={from}
                                helperText={errors.from ? errors.from : ''} />

                            <TextField type="date"
                                name="to"
                                label={t('app:createBooking.toLabel')}
                                variant='outlined'
                                required
                                error={Boolean(errors.to)}
                                onChange={handleChange}
                                value={to}
                                helperText={errors.to ? errors.to : ''} />

                            <TextField type="number"
                                name="pplCount"
                                label={t('app:createBooking.pplCountLabel')}
                                placeholder={t('app:createBooking.pplCountPlaceholder')}
                                variant='outlined'
                                required
                                error={Boolean(errors.pplCount)}
                                onChange={handleChange}
                                value={pplCount}
                                helperText={errors.pplCount ? errors.pplCount : ''} />

                            <TextField type="number"
                                name="tubCount"
                                label={t('app:createBooking.tubCountLabel')}
                                placeholder={t('app:createBooking.tubCountPlaceholder')}
                                variant='outlined'
                                required
                                error={Boolean(errors.tubCount)}
                                onChange={handleChange}
                                value={tubCount}
                                helperText={errors.tubCount ? errors.tubCount : ''} />

                            <TextField type="text"
                                name="comment"
                                label={t('app:createBooking.commentLabel')}
                                placeholder={t('app:createBooking.commentPlaceholder')}
                                variant='outlined'
                                multiline
                                rows={5}
                                error={Boolean(errors.comment)}
                                onChange={handleChange}
                                value={comment}
                                helperText={errors.comment ? errors.comment : ''} />
                        </FormGroup>
                        <FormGroup>
                            <Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
                                {t('common:button.create')}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
            <PriceTable priceInfo={price.priceMatrix} />
        </CardContent>
    </Card>)
}

function getSchema(t: TFunction<string[]>) {
    return yup.object().shape({
        from: yup
            .date()
            .min(startOfToday(), t('validation:date.afterToday'))
            .max(yup.ref('to'), t('validation:date.notAfter', {field: t('app:createBooking.toLabel')}))
            .required()
            .default(() => new Date()),
        to: yup.date()
            .min(yup.ref('from'), t('validation:date.notBefore', {field: t('app:createBooking.fromLabel')}))
            .required()
            .default(() => new Date()),
        pplCount: yup.number()
            .integer()
            // .when(['pplCount', 'tubCount'], {
            //     is: (pplCount: number, tubCount: number) => !pplCount && !tubCount,
            //     then: (s) => s.positive()
            // })
            .min(0, t('validation:number.positive'))
            .required()
            .default(() => 0),
        tubCount: yup.number()
            .integer()
            .min(0, t('validation:number.positive'))
            .required()
            .default(() => 0),
        comment: yup.string()
            .notRequired()
            .default('')
    })
}