import { Theme } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme: Theme) =>
({
    left: {
        "& > .MuiButtonBase-root": {
            marginRight: theme.spacing(1)
        }
    },
    right: {
        display: 'flex',
        justifyContent: 'end',
        "& > .MuiButtonBase-root": {
            marginLeft: theme.spacing(1)
        }
    }
}),
);

type Props = {
    left?: boolean,
    children: React.ReactNode
}
export function ButtonContainer({ children, left }: Props) {
    const { classes } = useStyles();
    return (<div className={left ? classes.left : classes.right}>
        {children}
    </div>)
}