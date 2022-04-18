
import { Card, CardContent, Theme, Typography } from "@mui/material";
import { ReactNode } from "react";
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) =>
({
    root: {
        opacity: 0.9,
        display: 'flex',
        minHeight: '10rem',
        '& .MuiTextField-root,& .MuiButtonBase-root': {
            // marginBottom: theme.spacing(2)
        }
    },
    header: {
        marginBottom: theme.spacing(2)
    },
    content: {
        //if not max-width, the image gallery for example will go out of bounds
        maxWidth: '100%',
        flex: '1 1 auto',
    }
}),
);

type Props = {
    header?: string,
    children?: ReactNode,
    elevation?: number,
    smallHeader?: boolean,
    className?: string
}
export default function Panel({ header, children, elevation, smallHeader, className }: Props) {
    const { classes, cx } = useStyles();

    return (<Card className={classes.root} elevation={elevation || 0}>
        <CardContent className={cx(classes.content, className)}>
            {header && <Typography className={classes.header} variant={smallHeader ? "h2" : "h1"}>{header}</Typography>}
            {children}
        </CardContent>
    </Card>)
}