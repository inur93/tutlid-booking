import { Button, Collapse, createStyles, makeStyles, Tab, Table, TableBody, TableCell, TableRow, Tabs, Theme } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreatePriceMatrix as CreatePriceMatrixModel, PriceMatrix as PriceMatrixModel } from '../../api';
import { usePriceMatrices } from '../../hooks/usePriceMatrices';
import { formatDate } from '../../utils/dateFunctions';
import CardLayout from '../layouts/CardLayout';
import CreatePriceMatrix from './CreatePriceMatrix';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiTextField-root': {
                marginBottom: theme.spacing(1)
            }
        },
        button: {
            marginTop: theme.spacing(2)
        },
        form: {
            marginTop: theme.spacing(2)
        },
        content: {
            flex: '1 0 auto',
        },
    }));

type PriceMatrixProps = {}
export default function PriceMatrix({ }: PriceMatrixProps) {
    const classes = useStyles();
    const { t, i18n } = useTranslation(['common', 'app']);
    const [{ priceMatrices, current }, { create, delete: deletePm }] = usePriceMatrices();
    const [tab, setTab] = useState(0);
    const [show, setShow] = useState(false);
    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setTab(newValue);
    };
    useEffect(() => {
        const i = (current ? priceMatrices?.indexOf(current) : 0) || 0;
        setTab(i > -1 ? i : 0);
    }, [priceMatrices, current])

    const handleCreate = async (pm: CreatePriceMatrixModel) => {
        await create(pm);
        setShow(false);
    }
    return (<CardLayout>
        <Tabs
            value={tab}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="price matrix tabs">
            {
                priceMatrices?.map((x, i) => {
                    return <Tab key={i} label={x._id === current?._id ?
                        `${t('app:priceMatrix.currentPriceMatrixTabLabel')} ` :
                        `${formatDate(x.validFrom, i18n.language)}`} />
                })
            }
        </Tabs>
        {
            priceMatrices?.map((pm, i) => {
                return <div role="tabpanel" hidden={i !== tab} key={i}>
                    <PriceMatrixTable priceMatrix={pm} />
                    <Button className={classes.button} variant="contained" color="secondary" onClick={() => deletePm(pm._id)}>
                        {t('common:button.delete')}
                    </Button>
                </div>
            })
        }
        <Collapse in={show}>
            <CreatePriceMatrix onCancel={() => setShow(false)} onCreate={handleCreate} />
        </Collapse>
        {!show &&
            <Button className={classes.button} variant={"contained"} color="primary" onClick={() => setShow(v => !v)}>
                {t('common:button.add')}
            </Button>
        }
    </CardLayout>);
}

type PriceMatrixTableProps = {
    priceMatrix: PriceMatrixModel
}
function PriceMatrixTable({ priceMatrix }: PriceMatrixTableProps) {
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