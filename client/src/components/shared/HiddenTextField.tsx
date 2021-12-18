import { TextField, TextFieldProps, withStyles } from "@material-ui/core";

const CustomTextField = withStyles({
    root: {
        '& .MuiInput-underline:before': {
            display: 'none',
        },
        '& .MuiInput-underline:hover:before': {
            display: 'block',
        },
        '& .MuiInput-input::-webkit-calendar-picker-indicator': {
            display: "none",
        },
        '& .MuiInput-input:hover::-webkit-calendar-picker-indicator, & .MuiInput-input:focus::-webkit-calendar-picker-indicator': {
            display: "block",
        }
    }
})(TextField)
type Props = TextFieldProps
export default function ({ onChange, ...props }: Props) {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.target.focus(); //keep focus if date select
        onChange && onChange(event);
    }
    return <CustomTextField {...props} onChange={handleChange} />

}