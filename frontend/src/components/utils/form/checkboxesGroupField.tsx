import { Col, Container } from "react-bootstrap";
import CheckboxGroup from "react-checkbox-group/lib/CheckboxGroup";

import { MultiSelectField, SelectOption } from "../../../utils/fields";

interface CheckboxesGroupFormFieldProps<T> {
    field: MultiSelectField<T>;
    object: T;
    onChange?: (newObject: T) => void;
}

export default function CheckboxesGroupFormField<T>({
    field,
    object,
    onChange = undefined,
}: CheckboxesGroupFormFieldProps<T>) {
    return (
        <Container className="form-control checkboxesGroup">
            <CheckboxGroup
                name={field.label}
                key={field.label}
                value={field.getter(object)}
                onChange={(values) => {
                    if (field.setter !== undefined) {
                        object = field.setter(object, values);
                        if (onChange !== undefined) {
                            onChange(object);
                        }
                    }
                }}
            >
                {(Checkbox) => (
                    <>
                        {field.options.map((option: SelectOption) => (
                            <Col key={option.key}>
                                <Checkbox key={option.key} value={option.key} disabled={field.setter === undefined} />
                                {option.value}
                            </Col>
                        ))}
                    </>
                )}
            </CheckboxGroup>
        </Container>
    );
}
