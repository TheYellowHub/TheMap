import { Form } from "react-bootstrap";
import { FocusEvent } from "react";

import { NumberField } from "../../../types/fields";

interface NumberFormFieldProps<T> {
    field: NumberField<T>;
    object: T;
    onChange?: (newObject: T) => void;
}

export default function NumberFormField<T>({ field, object, onChange = undefined }: NumberFormFieldProps<T>) {
    return (
        <Form.Control
            type="number"
            defaultValue={field.getter(object)}
            readOnly={field.setter === undefined}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
                if (field.setter !== undefined && e.target.value != e.target.defaultValue) {
                    object = field.setter(object, e.target.valueAsNumber);
                    if (onChange !== undefined) {
                        onChange(object);
                    }
                }
            }}
            required={field.required}
        />
    );
}
