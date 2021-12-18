import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
    open: boolean,
    onClose: () => void,
    onAccept: () => any,
    message: string,
    submitLabel?: string,
    cancelLabel?: string,
    header?: string,
    loading?: boolean
}
export default function Prompt({ open, header, message, cancelLabel, submitLabel, onClose, onAccept, loading }: Props) {
    const { t } = useTranslation('common');
    return (
        <Dialog
            onClose={onClose}
            aria-labelledby="prompt-modal"
            open={open}
            fullWidth={true}
            maxWidth='sm'>

            {header && <DialogTitle id="prompt-modal">{header}</DialogTitle>}
            <DialogContent>
                <DialogContentText id="prompt-modal-description">
                    {message}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button disabled={loading} color='primary' onClick={onClose}>
                    {cancelLabel || t('common:button.no')}
                </Button>
                <Button disabled={loading} color='primary' variant='contained' onClick={onAccept} autoFocus>
                    {submitLabel || t('common:button.yes')}
                </Button>
            </DialogActions>
        </Dialog>
    );
}