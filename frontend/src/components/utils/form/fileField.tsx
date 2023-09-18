import { Form } from "react-bootstrap";
import { FocusEvent } from "react";

import { FileField } from "../../../utils/fields";
import Button from "../Button";

interface FileFormFieldProps<T> {
    field: FileField<T>;
    object: T;
    onChange?: (newObject: T) => void;
}

export default function FileFormField<T>({ field, object, onChange = undefined }: FileFormFieldProps<T>) {
    const currentFileLink = field.getter(object) as any as string;
    return (
        <>
            <Form.Control
                type="file"
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
            {currentFileLink && <Button label="Download current" href={currentFileLink} target="_blank" />}
        </>
    );
}
