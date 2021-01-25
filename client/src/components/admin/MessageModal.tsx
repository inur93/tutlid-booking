import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, TextField, Theme } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
    }
}));

type MessageModalProps = {
    onClose: () => void,
    onAccept: (msg: string) => Promise<void>,
    submitLabel: string,
    cancelLabel: string,
    fieldLabel: string,
    header?: string
}
export default function MessageModal({ header, fieldLabel, cancelLabel, submitLabel, onClose, onAccept }: MessageModalProps) {
    const classes = useStyles();
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAccept = async () => {
        setLoading(true);
        await onAccept(comment);
        setLoading(false);
    }
    return (<Dialog onClose={onClose} aria-labelledby="message-modal" open={true} fullWidth={true} maxWidth='sm'>
        {header && <DialogTitle id="message-modal">{header}</DialogTitle>}
        <DialogContent>
            <TextField type="text"
                fullWidth
                name="comment"
                label={fieldLabel}
                placeholder={fieldLabel}
                variant='outlined'
                multiline
                rows={5}
                onChange={(e) => setComment(e.target.value)}
                value={comment} />
        </DialogContent>
        <DialogActions>
            <Button disabled={loading} color='primary' onClick={onClose}>{cancelLabel}</Button>
            <Button disabled={loading} color='primary' variant='contained' onClick={handleAccept}>{submitLabel}</Button>
        </DialogActions>
    </Dialog>);
}