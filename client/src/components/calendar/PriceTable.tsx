import { Table, TableBody, TableCell as MuiCell, TableCellProps, TableHead, TableRow, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BookingPriceInfo } from '../../api';

type PriceTableProps = {
    priceInfo?: BookingPriceInfo
}

function TableCell(props: TableCellProps) {

    return <MuiCell {...props} padding='none' />
}
export default function PriceTable({ priceInfo }: PriceTableProps) {
    const { t } = useTranslation('app');
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const priceQty = priceInfo ? `${priceInfo.days || 0}` : '-';
    const priceUnit = priceInfo ? `${priceInfo.price} DKK` : '-';
    const priceTotal = priceInfo ? `${priceInfo.priceTotal} DKK` : '-';
    const tubPriceQty = priceInfo ? `${priceInfo.tubCount || 0}` : '-';
    const tubPriceUnit = priceInfo ? `${priceInfo.tubPrice} DKK` : '-';
    const tubPriceTotal = priceInfo ? `${priceInfo.tubPriceTotal} DKK` : '-';
    const total = priceInfo ? `${priceInfo.tubPriceTotal + priceInfo.priceTotal} DKK` : '-'
    
    return (<Table size="small" >
        <TableHead>
            <TableRow>
                <TableCell>
                    {t('app:priceTable.descriptionLabel')}
                </TableCell>
                <TableCell align="right" >
                    {t('app:priceTable.quantityLabel')}
                </TableCell>
                {!isSmall && <TableCell align="right">
                    {t('app:priceTable.unitLabel')}
                </TableCell>}
                <TableCell align="right" >
                    {t('app:priceTable.amountLabel')}
                </TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell >{t('app:priceTable.priceLabel')}</TableCell>
                <TableCell align="right" >{priceQty}</TableCell>
                {!isSmall && <TableCell align="right">{priceUnit}</TableCell>}
                <TableCell align="right" >{priceTotal}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>{t('app:priceTable.tubPriceLabel')}</TableCell>
                <TableCell align="right" >{tubPriceQty}</TableCell>
                {!isSmall && <TableCell align="right">{tubPriceUnit}</TableCell>}
                <TableCell align="right" >{tubPriceTotal}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={isSmall ? 2 : 3} >
                    <b>
                        {t('app:priceTable.totalLabel')}
                    </b>
                </TableCell>
                <TableCell align="right" >
                    <b>
                        {total}
                    </b>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>);
}
