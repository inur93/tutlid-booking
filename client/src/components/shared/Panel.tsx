
import { Card, CardContent, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import { ReactNode } from "react";
import classnames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            opacity: 0.9,
            display: 'flex',
            minHeight: '10rem',
            '& .MuiTextField-root,& .MuiButtonBase-root': {
                marginBottom: theme.spacing(2)
            }
        },
        header: {
            marginBottom: theme.spacing(2)
        },
        content: {
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
    const classes = useStyles();

    return (<Card className={classes.root} elevation={elevation}>
        <CardContent className={classnames(classes.content, className)}>
            {header && <Typography className={classes.header} variant={smallHeader ? "h6" : "h2"}>{header}</Typography>}
            {children}
        </CardContent>
    </Card>)
}