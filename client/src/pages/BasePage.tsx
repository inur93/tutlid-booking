import { createStyles, Grid, makeStyles, Theme } from '@material-ui/core';
import classNames from 'classnames';
import { ReactNode } from 'react';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            height: '100vh',
            overflow: 'hidden'
        },
        container: {
            marginTop: theme.spacing(10),
            maxHeight: `calc(100% - ${theme.spacing(10)}px)`,
            overflowY: 'auto',
            overflowX: 'hidden'
        },
        card: {
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2)
        },
        imageContainer: {
            position: 'absolute',
            height: '100vh',
            width: '100vw',
            opacity: 0.6,
            top: 0,
            left: 0,
            margin: 0,
            zIndex: -1
        },
        image: {
            backgroundImage: 'url("/images/tutlid-view.jpg")',
            height: '100vh',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover'
        }
    }),
);

type Props = {
    children: ReactNode,
    hideBackground?: boolean,
    className?: string
}
function BasePage({ className, children, hideBackground }: Props) {
    const classes = useStyles();

    return (<Grid className={classNames(classes.root, className)} container justify='center'>
        {!hideBackground &&
            <div className={classes.imageContainer}>
                <div className={classes.image}></div>
            </div>
        }
        <Grid item container justify='center' xs={12} className={classes.container}>
        {children}
        </Grid>
    </Grid>)
}

export function UltraWidePage({ children, ...props }: Props) {
    return <BasePage {...props}>
        <Grid item xs={11}>
            {children}
        </Grid>
    </BasePage>
}

export function WidePage({ children, ...props }: Props) {
    return <BasePage {...props}>
        <Grid item xs={11} md={8} lg={6}>
            {children}
        </Grid>
    </BasePage>
}

export function SlimPage({ children, ...props }: Props) {
    return <BasePage {...props}>
        <Grid item xs={11} sm={8} md={6} lg={4}>
            {children}
        </Grid>
    </BasePage>
}