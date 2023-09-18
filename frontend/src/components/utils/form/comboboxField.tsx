import { Form } from "react-bootstrap";

import { ComboboxField, SelectOption } from "../../../utils/fields";

interface ComboboxFormFieldProps<T> {
    field: ComboboxField<T>;
    object: T;
    onChange?: (newObject: T) => void;
}

export default function ComboboxFormField<T>({ field, object, onChange = undefined }: ComboboxFormFieldProps<T>) {
    return (
        <Form.Select
            value={field.getter(object)}
            disabled={field.setter === undefined}
            onChange={(e) => {
                if (field.setter !== undefined) {
                    object = field.setter(object, e.target.value);
                    if (onChange !== undefined) {
                        onChange(object);
                    }
                }
            }}
        >
            {field.options.map((option: SelectOption) => (
                <option value={option.key} key={option.key}>
                    {option.value}
                </option>
            ))}
        </Form.Select>
    );
}
