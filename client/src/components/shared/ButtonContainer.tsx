import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            "& > .MuiButtonBase-root": {

                marginRight: theme.spacing(1)
            }
        }
    }),
);

type Props = {
    children: React.ReactNode
}
export function ButtonContainer({ children }: Props) {
    const classes = useStyles();
    return (<div className={classes.root}>
        {children}
    </div>)
}