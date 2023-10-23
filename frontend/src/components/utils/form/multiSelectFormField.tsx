import { MultiSelectField } from "../../../utils/fields";
import Select from "../Select";

interface MultiSelectFormFieldProps<T> {
    field: MultiSelectField<T>;
    object: T;
    placeHolder?: string;
    onChange?: (newObject: T) => void;
    allowEmptySelection?: boolean;
}

export default function MultiSelectFormField<T>({
    field,
    object,
    placeHolder,
    onChange = undefined,
    allowEmptySelection = true,
}: MultiSelectFormFieldProps<T>) {
    function onChangeImpl(newValues: string[]) {
        if (field.setter !== undefined) {
            object = field.setter(object, newValues);
            if (onChange !== undefined) {
                onChange(object);
            }
        }
    }

    return (
        <Select
            values={field.options}
            currentValue={field.getter(object)}
            isMulti={true}
            onChange={onChangeImpl}
            allowEmptySelection={allowEmptySelection}
            placeHolder={placeHolder}
            title={field.label}
        />
    );
}
