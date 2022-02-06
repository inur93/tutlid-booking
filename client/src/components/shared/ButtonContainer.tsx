import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        pullLeft: {
            "& > .MuiButtonBase-root": {
                marginRight: theme.spacing(1)
            }
        },
        pullRight: {
            display: 'flex',
            justifyContent: 'end',
            "& > .MuiButtonBase-root": {
                marginLeft: theme.spacing(1)
            }
        }
    }),
);

type Props = {
    right?: boolean,
    children: React.ReactNode
}
export function ButtonContainer({ children, right }: Props) {
    const classes = useStyles();
    return (<div className={right ? classes.pullRight : classes.pullLeft}>
        {children}
    </div>)
}