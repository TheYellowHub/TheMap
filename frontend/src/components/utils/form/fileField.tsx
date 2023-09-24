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
    const currentFileLink = field.getter(object);
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
            {typeof currentFileLink === "string" && (
                <Button
                    label={currentFileLink.substring(currentFileLink.lastIndexOf("/") + 1)}
                    variant="info"
                    href={currentFileLink}
                    target="_blank"
                />
            )}
        </>
    );
}
