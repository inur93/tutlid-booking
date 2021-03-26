


import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import { BasePage } from '../../pages/BasePage';
import Carousel from './Carousel';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(2),
        },
        container: {
            height: 'calc(100vh - 130px)'
        }
    })
);

type Props = {
}
export function Gallery({ }: Props) {
    const classes = useStyles();

    return (<BasePage fullWidth>
        <Grid className={classes.root} container justify='center'>
            <Grid className={classes.container} item xs={12} lg={10}>
                <Carousel />
            </Grid>
        </Grid>
    </BasePage>)

}