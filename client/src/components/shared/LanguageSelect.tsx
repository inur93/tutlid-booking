import { ListItem, ListItemIcon, makeStyles, MenuItem, Select, Theme } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguages, setCurrentLanguage } from '../../utils/dateFunctions';
import LanguageIcon from '@material-ui/icons/Language';
const useStyles = makeStyles((theme: Theme) =>
({
    root: {
        "& .MuiSelect-icon": {
            color: 'inherit'
        },
        color: 'inherit'
    }
}));

type LanguageSelectorProps = {
    listItem?: boolean,
    onSelect?: () => void
}
export default function LanguageSelector({ listItem, onSelect }: LanguageSelectorProps) {
    const classes = useStyles();
    const { t, i18n } = useTranslation('common');

    const changeLanguage = (event: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) => {
        i18n.changeLanguage(event.target.value as string);
        setCurrentLanguage(event.target.value as string);
        onSelect && onSelect();
    }
    const Selector = () => (
        <Select
            id="language-selector"
            className={classes.root}
            value={i18n.language}
            onChange={changeLanguage}
            disableUnderline={true}
        >
            {getLanguages(t).map(x => <MenuItem key={x.key} value={x.key}>{x.value}</MenuItem>)}
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