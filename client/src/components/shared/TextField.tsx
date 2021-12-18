import { TextField as MuiTextField } from '@material-ui/core'

type Props = {
    name: string,
    required?: boolean,
    label: string,
    placeholder?: string,
    onChange: (value: string, event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void
    value: string,
    multiline?: boolean
}
export function TextField({ onChange, ...props }: Props) {
    return <MuiTextField {...props}
        type="text"
        variant="filled"
        rows={props.multiline ? 5 : 1}
        onChange={(e) => onChange(e.target.value, e)}
    />
}
