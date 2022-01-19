import { Checkbox, createStyles, FormControl, Grid, InputLabel, ListItemText, makeStyles, MenuItem, OutlinedInput, Select, TextField, Theme, Typography } from "@material-ui/core";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { Autocomplete } from "@material-ui/lab";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useContainer } from "../../../ioc";
import { UnitListStore } from "../../../stores/UnitListStore";
import { UnitStore } from "../../../stores/UnitStore";
import { ItemStatus } from "../../../types/enums/ItemStatus";
import { Period } from "../../../types/Period";
import { LocalizedUnit, Unit } from "../../../types/Unit";
import { translate } from "../../../utils/stringFunctions";
import { UnitUiStore } from "./UnitUiStore";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }));

type Props = {
    store: UnitUiStore,
}
export const ManageAddons = observer(({ store }: Props) => {
    const { t } = useTranslation(['app']);
    useEffect(() => {
        store.loadOptions();
    }, [])
    return <Grid container>
        <Grid item xs={12}>
            <Typography variant='h6'>
                {t('app:ManageAddons.header')}
            </Typography>
        </Grid>
        <Grid item container xs={12}>
            <FormControl fullWidth>
                <InputLabel id="addon-dropdown-label">{t('app:ManageAddons.dropdownLabel')}</InputLabel>
                <Select
                    labelId="addon-dropdown-label"
                    disabled={store.optionsLoading}
                    id="addon-dropdown-select"
                    multiple
                    value={store.selectedAddOns}
                    onChange={(e) => {
                        store.addOns = e.target.value as string[];
                    }}
                    MenuProps={MenuProps}
                    input={<OutlinedInput style={{border: 0}} label={t('app:ManageAddons.dropdownLabel')} />}
                    renderValue={(selected) => (selected as LocalizedUnit[]).map(x => x.name).join(', ')}
                >
                    {store.addOnOptions.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                            <Checkbox checked={store.addOns.indexOf(option._id ?? '') > -1} />
                            <ListItemText primary={option.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Grid>
    </Grid>
});