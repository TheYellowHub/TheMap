import { Form } from "react-bootstrap";

import { ComboboxField, SelectOption } from "../../../utils/fields";

interface ComboboxFormFieldProps<T> {
    field: ComboboxField<T>;
    object: T;
    placeHolder?: string;
    onChange?: (newObject: T) => void;
    allowEmptySelection?: boolean;
}

export default function ComboboxFormField<T>({
    field,
    object,
    placeHolder,
    onChange = undefined,
    allowEmptySelection = false,
}: ComboboxFormFieldProps<T>) {
    return (
        <Form.Select
            id={field.label}
            value={field.getter(object)}
            disabled={field.setter === undefined}
            onChange={(e) => {
                if (field.setter !== undefined) {
                    object = field.setter(object, e.target.value === "" ? undefined : e.target.value);
                    if (onChange !== undefined) {
                        onChange(object);
                    }
                }
            }}
        >
            {allowEmptySelection && (
                <option value={undefined} key={undefined}>
                    {placeHolder}
                </option>
            )}
            {field.options.map((option: SelectOption) => (
                <option value={option.key} key={option.key}>
                    {option.value}
                </option>
            ))}
        </Form.Select>
    );
}
