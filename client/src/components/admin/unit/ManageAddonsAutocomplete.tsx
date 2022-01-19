import { Checkbox, createStyles, Grid, makeStyles, TextField, Theme, Typography } from "@material-ui/core";
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { Autocomplete } from "@material-ui/lab";
import { observer } from "mobx-react-lite";
import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import { useContainer } from "../../../ioc";
import { UnitListStore } from "../../../stores/UnitListStore";
import { UnitStore } from "../../../stores/UnitStore";
import { ItemStatus } from "../../../types/enums/ItemStatus";
import { Period } from "../../../types/Period";
import { Unit } from "../../../types/Unit";
import { translate } from "../../../utils/stringFunctions";
import { UnitUiStore } from "./UnitUiStore";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({

    }));

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
type Props = {
    store: UnitUiStore,
}
export const ManageAddons = observer(({ store }: Props) => {
    const { t, i18n } = useTranslation(['app']);
    const handleAdd = () => {
        // setList(l => [...l, { from: undefined, to: undefined }])
    }
    const handleRemove = (index: number) => async () => {
        // setList(l => {
        //     const copy = l.slice();
        //     copy.splice(index, 1);
        //     return copy;
        // })
    }
    const handleChange = (index: number) => async (from?: Date, to?: Date) => {
        // setList(l => {
        //     const copy = l.slice();
        //     copy.splice(index, 1, { from, to });
        //     return copy;
        // })
    }
    return <Grid container>
        <Grid item xs={12}>
            <Typography variant='h6'>
                {t('app:ManageAddons.header')}
            </Typography>
        </Grid>
        <Grid item container xs={12}>
            <Autocomplete multiple
                id="addon-select"
                options={store.addOnOptions}
                loading={store.optionsLoading}
                disableCloseOnSelect
                onChange={(e, value) => store.addOns = value.map(x => x._id ?? '')}
                onOpen={() => store.loadOptions()}
                value={store.addOnOptions}
                defaultValue={store.addOnOptions}
                getOptionSelected={(option) => {
                    return true
                }}

                getOptionLabel={option => option.name}
                renderOption={(option, { selected }) => (
                    <React.Fragment>
                        <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                        />
                        {option.name}
                    </React.Fragment>
                )}
                style={{ width: '100%' }}
                renderInput={(params) => (
                    <TextField {...params} variant="outlined" label="Addons" placeholder="Search for addons..." />
                )} />
        </Grid>

    </Grid>
});