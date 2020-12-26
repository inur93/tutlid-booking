import { Button, Card, CardContent, createStyles, FormGroup, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import { useState } from 'react';
import api, { CreateBooking as Booking } from '../../api';
import { getFormdataById } from '../../utils/formFunctions';

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

export function CreateBooking() {
    const classes = useStyles();
    const [isLoading, setLoading] = useState(false);
    const handleCreate = (e: React.FormEvent) => {
        const data = getFormdataById<Booking>('create-booking-form');
        api.BookingApi.create(data);
        e.preventDefault();
    }
    return (<Card className={classes.root}>
        <CardContent className={classes.content}>
            <form id='create-booking-form' className={classes.form} onSubmit={handleCreate}>
                <FormGroup>
                    <TextField type="date" name="from" label="From" variant='outlined' required />
                    <TextField type="date" name="to" label="To" variant='outlined' required />
                    <TextField type="number" name="pplCount" label='Number of people' placeholder="Number of people" variant='outlined' required defaultValue={0} />
                    <TextField type="number" name="tubCount" label='Number of people using tub' placeholder="Number of people using tub" variant='outlined' required defaultValue={0} />
                    <TextField type="text" name="comment" label="Comment" placeholder="Comment" variant='outlined' multiline rows={5} />
                </FormGroup>
                <FormGroup>
                    <Button variant='contained' color='primary' type='submit' disabled={isLoading}>
                        Create booking
                    </Button>
                </FormGroup>
            </form>
        </CardContent>
    </Card>)
}