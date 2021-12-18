import { ListItem, ListItemIcon, makeStyles, MenuItem, Select, Theme } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageIcon from '@material-ui/icons/Language';
import { setCurrentLanguage } from '../../i18n';
import { observer } from 'mobx-react-lite';
import { useLanguage } from '../../hooks/useLanguage';
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
    onSelect?: (lang: string) => void,
    local?: boolean,
    language?: string
}
const LanguageSelector = observer(({ language, listItem, onSelect, local }: LanguageSelectorProps) => {
    const classes = useStyles();
    const { t } = useTranslation('common');
    const [globalLanguage, setLanguage] = useLanguage();
    const options = [
        { key: 'da', value: t('common:languages.da') },
        { key: 'en', value: t('common:languages.en') }
    ];
    const changeLanguage = (event: React.ChangeEvent<{
        name?: string | undefined;
        value: unknown;
    }>) => {
        const lang = event.target.value as string;
        if (!local) {
            setLanguage(lang);
            setCurrentLanguage(lang);
        }
        onSelect && onSelect(lang);
    }
    const Selector = observer(() => (
        <Select
            id="language-selector"
            className={classes.root}
            value={local ? language : globalLanguage}
            onChange={changeLanguage}
            disableUnderline={true}
        >
            {options.map(x => <MenuItem key={x.key} value={x.key}>{x.value}</MenuItem>)}
        </Select>
    ));
    if (listItem) {
        return (<ListItem>
            <ListItemIcon>
                <LanguageIcon />
            </ListItemIcon>
            <Selector />
        </ListItem>)
    }
    return (<Selector />);
})

export default LanguageSelector;