import { createStyles, makeStyles, Theme, Tooltip } from "@material-ui/core"
import QuestionMark from '@material-ui/icons/HelpOutline';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            fontSize: 'inherit',
            margin: '0 0 -2px 2px'
        }
    }));

type Props = {
    title: string | React.ReactFragment
}
export default function ({ title }: Props) {
    const classes = useStyles();
    return <Tooltip title={title} placement='top' arrow>
        <QuestionMark className={classes.root} />
    </Tooltip>
}