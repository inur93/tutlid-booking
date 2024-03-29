import { Button, Collapse, Grid, Tab, Tabs, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreatePriceMatrix as CreatePriceMatrixModel } from '../../../api';
import { usePriceMatrices } from '../../../hooks/usePriceMatrices';
import { formatDate } from '../../../utils/dateFunctions';
import { ButtonContainer } from '../../shared/ButtonContainer';
import { Spacer } from '../../shared/Spacer';
import CreatePriceMatrix from './CreatePriceMatrix';
import { PriceMatrixTable } from './PriceMatrixTable';

type PriceMatrixProps = {}
export default function PriceMatrix({ }: PriceMatrixProps) {
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
    return (<Grid>
        {!(priceMatrices?.length) && <Typography variant='body1'>{t('app:priceMatrix.emptyDescription')}</Typography>}
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
                </div>
            })
        }
        <Spacer />
        <Collapse in={show}>
            <CreatePriceMatrix onCancel={() => setShow(false)} onCreate={handleCreate} />
        </Collapse>
        <ButtonContainer>
            {!!(!show && priceMatrices?.length) &&
                <Button variant="contained" color="secondary" onClick={() => deletePm(priceMatrices[tab]._id)}>
                    {t('common:button.delete')}
                </Button>}
            {!show &&
                <Button variant={"contained"} color="primary" onClick={() => setShow(v => !v)}>
                    {t('common:button.add')}
                </Button>
            }
        </ButtonContainer>
    </Grid>);
}

