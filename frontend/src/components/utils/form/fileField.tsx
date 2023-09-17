import { Form } from "react-bootstrap";
import { FocusEvent } from "react";

import { FileField } from "../../../types/fields";

interface FileFormFieldProps<T> {
    field: FileField<T>;
    object: T;
    onChange?: (newObject: T) => void;
    pattern?: string;
}

export default function FileFormField<T>({ field, object, onChange = undefined }: FileFormFieldProps<T>) {
    return (
        <Form.Control
            type="file"
            // value={[field.getter(object)]}   // TODO
            readOnly={field.setter === undefined}
            onChange={(e: FocusEvent<HTMLInputElement>) => {
                if (field.setter !== undefined && e.target.files !== null) {
                    object = field.setter(object, e.target.files[0]);
                    if (onChange !== undefined) {
                        onChange(object);
                    }
                }
            }}
            required={field.required}
        />
    );
}
