import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow, Theme } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookingPriceInfo } from '../../api';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

type PriceTableProps = {
    priceInfo?: BookingPriceInfo
}
export default function PriceTable({ priceInfo }: PriceTableProps) {
    const classes = useStyles();
    const { t } = useTranslation('app');

    const priceQty = priceInfo ? `${priceInfo.pplCount} x ${priceInfo.days}` : '-';
    const priceUnit = priceInfo ? `${priceInfo.price} DKK` : '-';
    const priceTotal = priceInfo ? `${priceInfo.priceTotal} DKK` : '-';
    const tubPriceQty = priceInfo ? `${priceInfo.tubCount}` : '-';
    const tubPriceUnit = priceInfo ? `${priceInfo.tubPrice} DKK` : '-';
    const tubPriceTotal = priceInfo ? `${priceInfo.tubPriceTotal} DKK` : '-';
    const total = priceInfo ? `${priceInfo.tubPriceTotal + priceInfo.priceTotal} DKK` : '-'
    return (<Table size="small">
        <TableHead>
            <TableRow>
                <TableCell>
                    {t('app:priceTable.descriptionLabel')}
                </TableCell>
                <TableCell align="right">
                    {t('app:priceTable.quantityLabel')}
                </TableCell>
                <TableCell align="right">
                    {t('app:priceTable.unitLabel')}
                </TableCell>
                <TableCell align="right">
                    {t('app:priceTable.amountLabel')}
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell>{t('app:priceTable.priceLabel')}</TableCell>
                <TableCell align="right">{priceQty}</TableCell>
                <TableCell align="right">{priceUnit}</TableCell>
                <TableCell align="right">{priceTotal}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>{t('app:priceTable.tubPriceLabel')}</TableCell>
                <TableCell align="right">{tubPriceQty}</TableCell>
                <TableCell align="right">{tubPriceUnit}</TableCell>
                <TableCell align="right">{tubPriceTotal}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={3}>
                    <b>
                        {t('app:priceTable.totalLabel')}
                    </b>
                </TableCell>
                <TableCell align="right">
                    <b>
                        {total}
                    </b>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>);
}