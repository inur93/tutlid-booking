import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PriceMatrix as PriceMatrixModel } from '../../../api';
import { formatDate } from '../../../utils/dateFunctions';

type Props = {
    priceMatrix: PriceMatrixModel
}
export function PriceMatrixTable({ priceMatrix }: Props) {
    const { t, i18n } = useTranslation('app');
    const d2s = (date: any) => formatDate(date, i18n.language);
    return (<Table size="small">
        <TableBody>
            <TableRow>
                <TableCell>
                    <b>
                        {t('app:priceMatrix.tablePriceLabel')}
                    </b>
                </TableCell>
                <TableCell align="right">{priceMatrix.price} DKK</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <b>
                        {t('app:priceMatrix.tablePriceTubLabel')}
                    </b>
                </TableCell>
                <TableCell align="right">{priceMatrix.tubPrice} DKK</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <b>
                        {t('app:priceMatrix.tableValidFromLabel')}
                    </b>
                </TableCell>
                <TableCell align="right">{d2s(priceMatrix.validFrom)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    <b>
                        {t('app:priceMatrix.tableValidToLabel')}
                    </b>
                </TableCell>
                <TableCell align="right">{priceMatrix.validTo ? d2s(priceMatrix.validTo) : '-'}</TableCell>
            </TableRow>
        </TableBody>
    </Table>)
}
