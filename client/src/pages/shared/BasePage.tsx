import { Grid, Theme } from '@mui/material';
import { ReactNode } from 'react';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) =>
({
    root: {
        height: '100vh',
        overflow: 'hidden',
    },
    container: {
        paddingTop: theme.spacing(2),
        maxHeight: `calc(100vh - 56px)`,
        paddingBottom: theme.spacing(2),
        overflowY: 'auto',
        overflowX: 'hidden',
        [theme.breakpoints.up(600)]: {
            maxHeight: `calc(100vh - 64px)`,
        }
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
    const { classes, cx } = useStyles();

    return (<Grid className={cx(classes.root, className)} container justifyContent='center'>
        {!hideBackground &&
            <div className={classes.imageContainer}>
                <div className={classes.image}></div>
            </div>
        }
        <Grid item container justifyContent='center' xs={12} className={classes.container}>
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