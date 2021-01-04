import { Button, Card, CardContent, createStyles, FormGroup, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import { useState } from 'react';
import api, { CreateBooking as Booking } from '../../api';
import { getFormdataById } from '../../utils/formFunctions';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { startOfToday } from 'date-fns';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                margin: theme.spacing(1)
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

type CreateBookingProps = {
    onComplete?: () => void
}

let schema = yup.object().shape({
    from: yup
        .date()
        .min(startOfToday(), "'From' should be today or later")
        .max(yup.ref('to'), "'From' cannot be after 'To' date")
        .required()
        .default(() => new Date()),
    to: yup.date()
        .min(yup.ref('from'), "'To' should be after 'from' date")
        .required()
        .default(() => new Date()),
    pplCount: yup.number()
        .integer()
        // .when(['pplCount', 'tubCount'], {
        //     is: (pplCount: number, tubCount: number) => !pplCount && !tubCount,
        //     then: (s) => s.positive()
        // })
        .min(0, "The number should be positive")
        .required()
        .default(() => 0),
    tubCount: yup.number()
        .integer()
        .min(0, "The number should be positive")
        .required()
        .default(() => 0),
    comment: yup.string()
        .notRequired()
        .default('')
})
export function CreateBooking({ onComplete }: CreateBookingProps) {
    const classes = useStyles();
    const handleCreate = async (values: any, { setSubmitting }: FormikHelpers<any>) => {
        const data = getFormdataById<Booking>('create-booking-form');
        try {
            await api.BookingApi.create(data);
        } catch (e) {

        }

        setSubmitting(false);
        if (onComplete) onComplete();
    }
    return (<Card className={classes.root}>
        <CardContent className={classes.content}>
            <Formik
                initialValues={{
                    from: new Date(),
                    to: new Date(),
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
                                label="From"
                                variant="outlined"
                                required
                                error={Boolean(errors.from)}
                                onChange={handleChange}
                                value={from}
                                helperText={errors.from ? errors.from : ''} />

                            <TextField type="date"
                                name="to"
                                label="To"
                                variant='outlined'
                                required
                                error={Boolean(errors.to)}
                                onChange={handleChange}
                                value={to}
                                helperText={errors.to ? errors.to : ''} />

                            <TextField type="number"
                                name="pplCount"
                                label='Number of people'
                                placeholder="Number of people"
                                variant='outlined'
                                required
                                defaultValue={0}
                                error={Boolean(errors.pplCount)}
                                onChange={handleChange}
                                value={pplCount}
                                helperText={errors.pplCount ? errors.pplCount : ''} />

                            <TextField type="number"
                                name="tubCount"
                                label='Number of people using tub'
                                placeholder="Number of people using tub"
                                variant='outlined'
                                required
                                error={Boolean(errors.tubCount)}
                                onChange={handleChange}
                                value={tubCount}
                                helperText={errors.tubCount ? errors.tubCount : ''}
                                defaultValue={0} />

                            <TextField type="text"
                                name="comment"
                                label="Comment"
                                placeholder="Comment"
                                variant='outlined'
                                multiline
                                rows={5}
                                error={Boolean(errors.comment)}
                                onChange={handleChange}
                                value={pplCount}
                                helperText={errors.comment ? errors.comment : ''} />
                        </FormGroup>
                        <FormGroup>
                            <Button variant='contained' color='primary' type='submit' disabled={isSubmitting}>
                                Create booking
                    </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </CardContent>
    </Card>)
}