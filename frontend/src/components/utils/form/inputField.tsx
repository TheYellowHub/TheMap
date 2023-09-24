import { Form } from "react-bootstrap";
import { FocusEvent } from "react";

import { EmailField, NumberField, PhoneField, TextField, UrlField } from "../../../utils/fields";
import { urlValidation } from "../../../types/utils/url";
import { phoneValidation } from "../../../types/utils/phone";
import { emailValidation } from "../../../types/utils/email";

interface TextFormFieldProps<T> {
    field: TextField<T> | UrlField<T> | EmailField<T> | PhoneField<T> | NumberField<T>;
    object: T;
    onChange?: (newObject: T) => void;
}

export default function InputFormField<T>({ field, object, onChange = undefined }: TextFormFieldProps<T>) {
    const pattern = new Map([
        ["text", undefined],
        ["number", undefined],
        ["url", urlValidation],
        ["email", emailValidation],
        ["tel", phoneValidation],
    ]).get(field.type);

    return (
        <Form.Control
            type={field.type}
            defaultValue={field.getter(object)}
            readOnly={field.setter === undefined}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
                if (field.setter !== undefined && e.target.value != e.target.defaultValue) {
                    object =
                        field.type === "number"
                            ? field.setter(object, e.target.valueAsNumber)
                            : field.setter(object, e.target.value);
                    if (onChange !== undefined) {
                        onChange(object);
                    }
                }
            }}
            required={field.required}
            pattern={pattern}
        />
    );
}
