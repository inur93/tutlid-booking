import { Checkbox, FormControlLabel } from "@material-ui/core";
import { ReactNode } from "react";

type Props = {
    checked: boolean,
    name: string,
    label: ReactNode,
    onChange: (name: string, value: boolean) => void
}
export function CheckboxField({ name, label, checked, onChange }: Props) {
    return <FormControlLabel
        control={
            <Checkbox
                checked={checked}
                onChange={(_, checked) => onChange(name, checked)}
                name={name}
                color="primary"
            />
        }
        label={label}
    />
}