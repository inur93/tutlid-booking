import { Card, CardContent, makeStyles, Theme } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

type CardLayoutProps = {
    children?: React.ReactNode
}
export default function CardLayout({ children }: CardLayoutProps) {
    const classes = useStyles();
    return (<Card className={classes.root}>
        <CardContent>
            {children}
        </CardContent>
    </Card>);
}