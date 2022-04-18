import LanguageIcon from '@mui/icons-material/Language';
import { ListItem, ListItemIcon, MenuItem, Select, SelectChangeEvent, Theme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { setCurrentLanguage } from '../../i18n';
const useStyles = makeStyles()((theme: Theme) =>
({
    root: {
        color: 'inherit',
        "& .MuiSelect-icon": {
            color: 'inherit'
        }
    }
}));

type LanguageSelectorProps = {
    listItem?: boolean,
    onSelect?: () => void
}
export default function LanguageSelector({ listItem, onSelect }: LanguageSelectorProps) {
    const { classes } = useStyles();
    const { t, i18n } = useTranslation('common');
    const options = [
        { key: 'da', value: t('common:languages.da') },
        { key: 'en', value: t('common:languages.en') }
    ];
    const changeLanguage = (event: SelectChangeEvent<string>) => {
        i18n.changeLanguage(event.target.value as string);
        setCurrentLanguage(event.target.value as string);
        onSelect && onSelect();
    }
    const Selector = () => (
        <Select
            variant='standard'
            id="language-selector"
            className={classes.root}
            value={i18n.language}
            onChange={changeLanguage}
            disableUnderline={true}
        >
            {options.map(x => <MenuItem key={x.key} value={x.key}>{x.value}</MenuItem>)}
        </Select>
    )
    if (listItem) {
        return (<ListItem>
            <ListItemIcon>
                <LanguageIcon />
            </ListItemIcon>
            <Selector />
        </ListItem>)
    }
    return (<Selector />);
}