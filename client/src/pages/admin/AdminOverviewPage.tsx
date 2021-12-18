import { Grid, Typography, Card, CardContent, IconButton, makeStyles, Theme } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { UnitsOverview } from '../../components/admin/unit/UnitsOverview';
import { BasePage } from '../BasePage';
import AddIcon from '@material-ui/icons/Add';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
({
    'header': {
        marginBottom: theme.spacing(1)
    },
}));

export function AdminOverviewPage() {''
    const { t } = useTranslation('app');
    const classes = useStyles();

    return (<BasePage>
        <Grid container >
            <Grid item xs={12}>
                <Card >
                    <CardContent>
                        <Grid container>
                            <Grid item xs={11} className={classes.header}>
                                <Typography variant='h6'>{t('app:AdminOverview.unitsHeader')}</Typography>
                            </Grid>
                            <Grid item container xs={1} justify='flex-end'>
                                <Grid item>
                                    <IconButton component={Link} to="/admin/units/create" size='small'>
                                        <AddIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <UnitsOverview />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </BasePage>)

}