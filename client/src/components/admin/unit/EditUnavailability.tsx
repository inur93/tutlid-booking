import { createStyles, Grid, IconButton, makeStyles, Theme, Typography } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { Period } from "../../../types/Period";
import Help from "../../shared/Help";
import UnavailableRow from "./UnavailableRow";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }));

type Props = {
    rows?: Period[]
}
export default function ({ }: Props) {
    const classes = useStyles();
    const { t } = useTranslation(['app']);
    const [list, setList] = useState<Period[]>([]);
    const handleAdd = () => {
        setList(l => [...l, { from: undefined, to: undefined }])
    }
    const handleRemove = (index: number) => async () => {
        setList(l => {
            const copy = l.slice();
            copy.splice(index, 1);
            return copy;
        })
    }
    const handleChange = (index: number) => async (from?: Date, to?: Date) => {
        setList(l => {
            const copy = l.slice();
            copy.splice(index, 1, { from, to });
            return copy;
        })
    }
    return <Grid container>
        <Grid item xs={11}>
            <Typography variant='h6'>
                {t('app:CreateUnit.unavailabilityLabel')}<Help title={t('app:CreateUnit.unavailabilityLabelHelp')} />
            </Typography>
        </Grid>
        <Grid item container xs={1} justify='flex-end'>
            <Grid item>
                <IconButton size='small' onClick={handleAdd}>
                    <AddIcon />
                </IconButton>
            </Grid>
        </Grid>
        {
            list.map((x, i) => <UnavailableRow key={i}
                from={x.from}
                to={x.to}
                onChange={handleChange(i)}
                onDelete={handleRemove(i)} />)
        }

    </Grid>
}