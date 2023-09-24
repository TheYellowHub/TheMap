import { Form } from "react-bootstrap";
import { FocusEvent } from "react";

import { BooleanField } from "../../../utils/fields";

interface BooleanFormFieldProps<T> {
    field: BooleanField<T>;
    object: T;
    onChange?: (newObject: T) => void;
    withLabel: boolean;
}

export default function BooleanFormField<T>({
    field,
    object,
    onChange = undefined,
    withLabel = true,
}: BooleanFormFieldProps<T>) {
    return (
        <Form.Check
            type="switch"
            label={withLabel ? field.label : ""}
            defaultChecked={field.getter(object)}
            readOnly={field.setter === undefined}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
                if (field.setter !== undefined && e.target.checked != e.target.defaultChecked) {
                    object = field.setter(object, e.target.checked);
                    if (onChange !== undefined) {
                        onChange(object);
                    }
                }
            }}
        />
    );
}
