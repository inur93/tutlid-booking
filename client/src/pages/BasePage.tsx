import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import classNames from 'classnames';
import { ReactNode } from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        card: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
        },
        imageContainer: {
            position: 'absolute',
            height: '100%',
            width: '100vw',
            opacity: 0.6,
            top: 0,
            left: 0,
            margin: 0,
            zIndex: -1
        },
        image: {
            backgroundImage: 'url("/images/tutlid-view.jpg")',
            height: '100%',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
        }
    }),
);

type Props = {
    children: ReactNode,
    hideBackground?: boolean,
    fullWidth?: boolean,
    className?: string
}
export function BasePage({ className, children, hideBackground, fullWidth }: Props) {
    const classes = useStyles();

    return (<Grid className={classes.root} container justify='center'>
        {!hideBackground &&
            <div className={classes.imageContainer}>
                <div className={classes.image}></div>
            </div>
        }
        <Grid className={classNames(className, !fullWidth && classes.card)} item
            xs={fullWidth ? 12 : 11}
            md={fullWidth ? 12 : 10}
            lg={fullWidth ? 12 : 8}>
            {children}
        </Grid>
    </Grid>)

}