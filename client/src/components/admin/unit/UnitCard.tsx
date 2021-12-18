import { Card, CardContent, CardHeader, IconButton, makeStyles, Theme, Typography } from "@material-ui/core";
import EditIcon from '@material-ui/icons/Edit';
import { Link } from "react-router-dom";
import { Unit } from "../../../types/Unit";
import Translation from "../../shared/Translation";

const useStyles = makeStyles((theme: Theme) =>
({
    'root': {
        width: '100%',
        height: "100%"
    },
}));

type Props = {
    unit: Unit
}

export default function ({ unit }: Props) {
    const classes = useStyles();

    return (<Card className={classes.root}>
        <CardHeader
            title={<Translation translations={unit.name} />}
            subheader={unit.status}
            action={
                <IconButton component={Link} to={`/admin/units/${unit._id}`}>
                    <EditIcon />
                </IconButton>
            }
        />
        <CardContent>
            <Typography variant="body2" color="textPrimary" component="p">
                <Translation translations={unit.description} />
            </Typography>
        </CardContent>
    </Card>)
}