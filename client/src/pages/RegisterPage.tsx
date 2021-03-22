import { createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import { useTranslation } from 'react-i18next';
import RegisterUser from "../components/register/Register";
import { BasePage } from "./BasePage";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            marginTop: '5rem'
        }
    }),
);

export function RegisterPage() {
    const classes = useStyles();
    const {t} = useTranslation('app');
    return <BasePage>
            <RegisterUser header={t('app:registerPage.header')}/>
        </BasePage>
}