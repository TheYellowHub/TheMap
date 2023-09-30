import { Form } from "react-bootstrap";
import { FocusEvent } from "react";
import { urlValidation } from "../../../types/utils/url";
import { emailValidation } from "../../../types/utils/email";
import { phoneValidation } from "../../../types/utils/phone";
import { AddressField, EmailField, NumberField, PhoneField, TextField, UrlField } from "../../../utils/fields";

export interface TextInputFormFieldProps<T> {
    field: TextField<T> | UrlField<T> | EmailField<T> | PhoneField<T> | AddressField<T>;
    object: T;
    onChange?: (newObject: T) => void;
    isInvalid?: boolean;
}

export interface NumberInputFormFieldProps<T> {
    field: NumberField<T>;
    object: T;
    onChange?: (newObject: T) => void;
    isInvalid?: boolean;
}

export default function InputFormField<T>({
    field,
    object,
    onChange = undefined,
    isInvalid = false,
}: TextInputFormFieldProps<T> | NumberInputFormFieldProps<T>) {
    const pattern = new Map([
        ["text", undefined],
        ["number", undefined],
        ["url", urlValidation],
        ["email", emailValidation],
        ["tel", phoneValidation],
    ]).get(field.type);

    return (
        <Form.Control
            id={field.label}
            type={field.type}
            defaultValue={field.getter(object)}
            readOnly={field.setter === undefined}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
                if (field.setter !== undefined && e.target.value != e.target.defaultValue) {
                    const newObjectOrPromise =
                        field.type === "number"
                            ? field.setter(object, e.target.valueAsNumber)
                            : field.setter(object, e.target.value);
                    if (onChange !== undefined) {
                        if (newObjectOrPromise instanceof Promise) {
                            const promise = newObjectOrPromise;
                            promise.then((newObject) => onChange(newObject));
                        } else {
                            const newObject = newObjectOrPromise;
                            onChange(newObject);
                        }
                    }
                }
            }}
            required={field.required}
            pattern={pattern}
            isInvalid={isInvalid}
            autoComplete="off" // TODO: get as another field property, if needed
        />
    );
}
