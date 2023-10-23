import { SingleSelectField } from "../../../utils/fields";
import Select from "../Select";

interface SingleSelectFormFieldProps<T> {
    field: SingleSelectField<T>;
    object: T;
    placeHolder?: string;
    onChange?: (newObject: T) => void;
    allowEmptySelection?: boolean;
}

export default function SingleSelectFormField<T>({
    field,
    object,
    placeHolder,
    onChange = undefined,
    allowEmptySelection = false,
}: SingleSelectFormFieldProps<T>) {
    function onChangeImpl(newValue: string | undefined) {
        if (field.setter !== undefined) {
            object = field.setter(object, newValue === "" ? undefined : newValue);
            if (onChange !== undefined) {
                onChange(object);
            }
        }
    }

    return (
        <Select
            id={field.label}
            values={field.options}
            currentValue={field.getter(object)}
            isMulti={false}
            onChange={onChangeImpl}
            placeHolder={placeHolder}
            allowEmptySelection={allowEmptySelection}
            disabled={field.setter === undefined}
        />
    );
}
