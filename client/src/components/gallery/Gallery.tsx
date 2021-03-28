


import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import { BasePage } from '../../pages/BasePage';
import Carousel from './Carousel';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: theme.spacing(2),
        },
        carousel: {
            maxHeight: 'calc(100vh - 110px)'
        }
    })
);

type Props = {
}
export function Gallery({ }: Props) {
    const classes = useStyles();
    
    return (<BasePage fullWidth>
        <Grid className={classes.root} container justify='center'>
            <Grid item xs={12} lg={10}>
                <Carousel className={classes.carousel}/>
            </Grid>
        </Grid>
    </BasePage>)

}