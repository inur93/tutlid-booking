import { CircularProgress, Grid, IconButton } from "@material-ui/core"

type Props = {
    show?: boolean
}
export default function ({ show }: Props) {
    if (!show) return null;
    return <CircularProgress color='primary' size={40} thickness={3.6} />
}