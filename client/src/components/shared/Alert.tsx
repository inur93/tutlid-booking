import { Alert as MuiAlert } from '@material-ui/lab';

import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

type AlertProps = {
    children: React.ReactNode,
    severity: 'success' | 'info' | 'warning' | 'error'
}
export function Alert({ children, severity }: AlertProps) {
    const classes = useStyles();
    return (<MuiAlert severity={severity}>
        {children}
    </MuiAlert>);
}