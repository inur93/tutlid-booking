import { Alert as MuiAlert } from '@mui/material';
import React from 'react';

type AlertProps = {
    children: React.ReactNode,
    severity: 'success' | 'info' | 'warning' | 'error'
}
export function Alert({ children, severity }: AlertProps) {
    return (<MuiAlert severity={severity}>
        {children}
    </MuiAlert>);
}