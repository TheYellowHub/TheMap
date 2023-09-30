import { FocusEvent } from "react";
import DateTimePicker from "react-datetime-picker";

import { DateTimeField } from "../../../utils/fields";

interface DateTimeFormFieldProps<T> {
    field: DateTimeField<T>;
    object: T;
    onChange?: (newObject: T) => void;
}

export default function DateTimeFormField<T>({ field, object, onChange = undefined }: DateTimeFormFieldProps<T>) {
    return (
        <DateTimePicker
            id={field.label}
            key={field.label}
            className="form-control"
            value={field.getter(object)}
            disabled={field.setter === undefined}
            disableCalendar={field.setter === undefined}
            disableClock={field.setter === undefined}
            onBlur={(e: FocusEvent<HTMLInputElement>) => {
                if (field.setter !== undefined) {
                    object = field.setter(object, e.target.value);
                    if (onChange !== undefined) {
                        onChange(object);
                    }
                }
            }}
            required={field.required}
        />
    );
}
