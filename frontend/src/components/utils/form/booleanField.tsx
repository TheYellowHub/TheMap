import { Form } from "react-bootstrap";
import { FocusEvent } from "react";

import { BooleanField } from "../../../utils/fields";

interface BooleanFormFieldProps<T> {
    field: BooleanField<T>;
    object: T;
    onChange?: (newObject: T) => void;
    withLabel?: boolean;
    label?: string;
}

export default function BooleanFormField<T>({
    field,
    object,
    onChange = undefined,
    withLabel = true,
    label = undefined,
}: BooleanFormFieldProps<T>) {
    return (
        <Form.Check
            type="switch"
            id={field.label}
            label={withLabel ? (label ? label : field.label) : ""}
            defaultChecked={field.getter(object)}
            readOnly={field.setter === undefined}
            onChange={(e: FocusEvent<HTMLInputElement>) => {
                if (field.setter !== undefined && e.target.checked != e.target.defaultChecked) {
                    object = field.setter(object, e.target.checked);
                    if (onChange !== undefined) {
                        onChange(object);
                    }
                }
            }}
            className={`d-flex align-items-center px-0 switch-${field.getter(object) ? "on" : "off"}`}
        />
    );
}
