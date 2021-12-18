import { useState } from 'react';
import { CircularProgress, Grid, IconButton } from "@material-ui/core"
import HiddenTextField from "../../shared/HiddenTextField"
import DeleteIcon from '@material-ui/icons/Delete'
import CancelIcon from '@material-ui/icons/Close'
import AcceptIcon from '@material-ui/icons/Check'
import { format } from 'date-fns';
import { formatFormDate } from '../../../utils/dateFunctions';
type Props = {
    from?: Date,
    to?: Date,
    onDelete: () => Promise<void>,
    onChange: (from?: Date, to?: Date) => Promise<void>
}

export default function ({ from, to, onDelete, onChange }: Props) {
    const [isFocused, setFocus] = useState(false);
    const [newFrom, setFrom] = useState(from);
    const [newTo, setTo] = useState(to);
    const [isSaving, setSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.focus();
        if (e.target.name === 'from') {
            setFrom(e.target.valueAsDate || undefined);
        } else {
            setTo(e.target.valueAsDate || undefined);
        }
    }
    const clearFocus = () => setFocus(false);
    const focus = () => setFocus(true);
    const handleCancel = () => {
        focus();
        setFrom(from);
        setTo(to);
        clearFocus();
    }
    const handleSave = async () => {
        setSaving(true);
        await onChange(newFrom, newTo);
        setSaving(false);
        clearFocus();
    }

    return <Grid item container xs={12}>
        <Grid item xs={4}>
            <HiddenTextField
                type='date'
                name='from'
                value={formatFormDate(isFocused ? newFrom : from)}
                onChange={handleChange}
                onFocus={focus}
                disabled={isSaving} />
        </Grid>
        <Grid item xs={1}>-</Grid>
        <Grid item xs={4}>
            <HiddenTextField
                type='date'
                name='to'
                value={formatFormDate(isFocused ? newTo : to)}
                onChange={handleChange}
                onFocus={focus}
                disabled={isSaving} />
        </Grid>
        {isSaving ?
            <Grid item container xs={3} justify='flex-end'>
                <Grid item style={{ margin: 'auto 0 auto 3px' }}>
                    <CircularProgress color='primary' size={20} thickness={5} />
                </Grid>
            </Grid> :
            <Grid item container xs={3} justify='flex-end'>
                {isFocused ?
                    <Grid item>
                        <IconButton size='small' onClick={handleCancel} >
                            <CancelIcon />
                        </IconButton>
                        <IconButton size='small' onClick={handleSave}>
                            <AcceptIcon />
                        </IconButton>
                    </Grid> :
                    <Grid item>
                        <IconButton size='small' onClick={onDelete} >
                            <DeleteIcon />
                        </IconButton>
                    </Grid>}
            </Grid>}
    </Grid>
}