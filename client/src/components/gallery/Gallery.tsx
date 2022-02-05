


import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { UltraWidePage } from '../../pages/BasePage';
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

    return (<UltraWidePage>
        <Carousel className={classes.carousel} />
    </UltraWidePage>)

}