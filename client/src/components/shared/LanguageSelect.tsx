import { makeStyles, MenuItem, Select, Theme } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguages, setCurrentLanguage } from '../../utils/dateFunctions';

const useStyles = makeStyles((theme: Theme) =>
({
    root: {
        "& .MuiSelect-icon": {
            color: 'white'
        },
        color: 'white'
    }
}));

type LanguageSelectorProps = {}
export default function LanguageSelector({ }: LanguageSelectorProps) {
    const classes = useStyles();
    const { t, i18n } = useTranslation('common');

    const changeLanguage = (event: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) => {
        i18n.changeLanguage(event.target.value as string);
        setCurrentLanguage(event.target.value as string);
    }

    return (<Select
        id="language-selector"
        className={classes.root}
        value={i18n.language}
        onChange={changeLanguage}
        disableUnderline={true}
    >
        {getLanguages(t).map(x => <MenuItem key={x.key} value={x.key}>{x.value}</MenuItem>)}
    </Select>);
}