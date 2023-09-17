import { UrlField } from "../../../types/fields";
import TextFormField from "./textField";

interface UrlFormFieldProps<T> {
    field: UrlField<T>;
    object: T;
    onChange?: (newObject: T) => void;
}

export default function UrlFormField<T>({ field, object, onChange = undefined }: UrlFormFieldProps<T>) {
    return (
        <TextFormField field={{ ...field, type: "text" }} object={object} onChange={onChange} pattern={"https?://.+"} />
    );
}
