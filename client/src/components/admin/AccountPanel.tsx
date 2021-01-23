import { Card, CardContent, List, makeStyles, Theme, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BankInformation from './BankInformation';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

type AccountPanelProps = {}
export default function AccountPanel({ }: AccountPanelProps) {
    const classes = useStyles();
    const { t } = useTranslation();
    return (<div>
        <BankInformation />
    </div>);
}