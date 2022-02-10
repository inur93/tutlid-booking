import { Chip, Theme } from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import { Role } from "../../../api";
const useStyles = makeStyles()((theme: Theme) =>
    ({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
    }),
);

type Props = {
    roles: Role[]
}
export default function ({ roles }: Props) {
    const {classes} = useStyles();

    const handleDelete = () => {
        console.info('You clicked the delete icon.');
    };

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };

    const primaryRole = roles.slice(roles.length - 1);
    return (
        <div className={classes.root}>
            {primaryRole.map(x => <Chip key={x} size="small" label={x} color="primary" />)}
        </div>
    );
}