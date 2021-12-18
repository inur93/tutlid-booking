import { Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useContainer } from '../../../ioc';
import { Alert } from '../../shared/Alert';
import Spinner from '../../shared/Spinner';
import UnitCard from './UnitCard';

type Props = {

}

const useStyles = makeStyles((theme: Theme) =>
({
    'card': {
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '50%',
        },
        [theme.breakpoints.up('md')]: {
            width: '33%',
        },
        [theme.breakpoints.up('lg')]: {
            width: '25%',
        }
    },
}));
const UnitsOverview = observer(({ }: Props) => {
    const { unitListStore: list } = useContainer();
    const classes = useStyles();
    useEffect(() => {
        list?.load();
    }, [])
    return (<Grid container spacing={2}>
        <Spinner show={list?.loading} />
        <Alert show={!!list?.error} severity='error'>{list?.error}</Alert>
        <Grid container item alignItems='stretch' spacing={2}>
            {list?.units.map(x => <Grid item key={x._id} className={classes.card}>
                <UnitCard key={x._id} unit={x} />
            </Grid>)}
        </Grid>
    </Grid>)
});

export {
    UnitsOverview
};

