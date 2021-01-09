import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
    ({
        'root': {
        }
}));

type ToolbarProps = {}
export default function Toolbar({}: ToolbarProps) {
    const classes = useStyles();
    return (<div/>);
}