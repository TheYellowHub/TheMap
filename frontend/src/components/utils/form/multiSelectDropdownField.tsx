import { Col, Container } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";

import { MultiSelectField as MultiSelectField, SelectOption } from "../../../utils/fields";

interface MultiSelectDropdownFieldProps<T> {
    field: MultiSelectField<T>;
    object: T;
    placeHolder?: string;
    onChange?: (newObject: T) => void;
}

export default function MultiSelectDropdownField<T>({
    field,
    object,
    placeHolder,
    onChange = undefined,
}: MultiSelectDropdownFieldProps<T>) {
    function onSelectOrRemove(selectedValues: []) {
        if (field.setter !== undefined) {
            object = field.setter(object, selectedValues);
            if (onChange !== undefined) {
                onChange(object);
            }
        }
    }

    return (
        <Multiselect
            className="form-control"
            options={field.options.map((option: SelectOption) => {
                return {
                    id: option.key,
                    value: option.value,
                };
            })}
            selectedValues={field.getter(object)}
            onSelect={(selectedList: [], _) => onSelectOrRemove(selectedList)}
            onRemove={(selectedList: [], _) => onSelectOrRemove(selectedList)}
            displayValue="value"
            placeholder={field.getter(object).length == 0 ? placeHolder : ""}
        />
    );
}
