import { Form } from "react-bootstrap";
import { FocusEvent } from "react";

import { TextField } from "../../../types/fields";

interface TextFormFieldProps<T> {
    field: TextField<T>;
    object: T;
    onChange?: (newObject: T) => void;
    pattern?: string;
}

export default function TextFormField<T>({ field, object, onChange = undefined, pattern }: TextFormFieldProps<T>) {
    return (
        <Form.Control
            type="text"
            defaultValue={field.getter(object)}
            readOnly={field.setter === undefined}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
                if (field.setter !== undefined && e.target.value != e.target.defaultValue) {
                    object = field.setter(object, e.target.value);
                    if (onChange !== undefined) {
                        onChange(object);
                    }
                }
            }}
            pattern={pattern}
            required={field.required}
        />
    );
}
