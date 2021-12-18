import { Button as MuiButton } from "@material-ui/core"


type Props = {
    primary?: boolean,
    secondary?: boolean,
    disabled?: boolean,
    icon?: React.ReactNode,
    children?: React.ReactNode,
    onClick?: () => void
}
export function Button({ primary, secondary, icon, onClick, ...otherProps }: Props) {

    const props = {
        ...otherProps,
        type: Boolean(onClick) ? 'button' : 'submit',
        startIcon: icon,
        href: ""
    }
    return <MuiButton {...props} />
}

/*
<Button type="submit" variant="contained" color="primary" >
<Button variant='contained' color='primary' type='submit' disabled={isSubmitting || loading}>
<Button type="submit" variant="contained" color="primary" startIcon={<SaveIcon />}>
<Button variant='outlined' color='primary' onClick={onClose}>
<Button component={Link} to='/register' variant='outlined' color='secondary' onClick={onComplete}>

*/