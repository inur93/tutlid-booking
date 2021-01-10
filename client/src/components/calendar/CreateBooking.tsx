import { Button, Card, CardContent, createStyles, FormGroup, makeStyles, TextField, Theme } from '@material-ui/core';
import { startOfToday } from 'date-fns';
import { Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import api, { Booking } from '../../api';
import { formatDate, str2isoDate } from '../../utils/formFunctions';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    let schema = yup.object().shape({
        from: yup
            .date()
            .min(startOfToday(), t('validation.fromMin'))
            .max(yup.ref('to'), t('validation.fromMax'))
            .required()
            .default(() => new Date()),
        to: yup.date()
            .min(yup.ref('from'), t('validation.toMin'))
            .required()
            .default(() => new Date()),
        pplCount: yup.number()
            .integer()
            // .when(['pplCount', 'tubCount'], {
            //     is: (pplCount: number, tubCount: number) => !pplCount && !tubCount,
            //     then: (s) => s.positive()
            // })
            .min(0, t('validation.positiveNumber'))
            .required()
            .default(() => 0),
        tubCount: yup.number()
            .integer()
            .min(0, t('validation.positiveNumber'))
            .required()
            .default(() => 0),
        comment: yup.string()
            .notRequired()
            .default('')
    })
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
    return (<Card className={classes.root}>
        <CardContent className={classes.content}>
            <Formik
                initialValues={{
                    from: formatDate(from || new Date()),
                    to: formatDate(to || new Date()),
                    pplCount: 0,
                    tubCount: 0,
                    comment: ""
                }}
                validationSchema={schema}
                onSubmit={handleCreate}>
                {({ isSubmitting, errors, touched, handleChange, values: { from, to, pplCount, tubCount, comment } }) => (
                    <Form>
                        <FormGroup>
                            <TextField type="date"
                                name="from"
                                label={t('shared.from')}
                                variant="outlined"
                                required
                                error={Boolean(errors.from)}
                                onChange={handleChange}
                                value={from}
                                helperText={errors.from ? errors.from : ''} />

                            <TextField type="date"
                                name="to"
                                label={t('shared.to')}
                                variant='outlined'
                                required
                                error={Boolean(errors.to)}
                                onChange={handleChange}
                                value={to}
                                helperText={errors.to ? errors.to : ''} />

                            <TextField type="number"
                                name="pplCount"
                                label={t('shared.numPeople')}
                                placeholder={t('shared.numPeople')}
                                variant='outlined'
                                required
                                defaultValue={0}
                                error={Boolean(errors.pplCount)}
                                onChange={handleChange}
                                value={pplCount}
                                helperText={errors.pplCount ? errors.pplCount : ''} />

                            <TextField type="number"
                                name="tubCount"
                                label={t('shared.numTubPeople')}
                                placeholder={t('shared.numTubPeople')}
                                variant='outlined'
                                required
                                error={Boolean(errors.tubCount)}
                                onChange={handleChange}
                                value={tubCount}
                                helperText={errors.tubCount ? errors.tubCount : ''}
                                defaultValue={0} />

                            <TextField type="text"
                                name="comment"
                                label={t('shared.comment')}
                                placeholder={t('shared.comment')}
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
                                {t('calendar.createBooking')}
                    </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </CardContent>
    </Card>)
}