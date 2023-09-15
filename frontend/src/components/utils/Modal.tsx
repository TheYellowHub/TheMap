import { Col, Container, Form, Modal as ReactModal, Row } from "react-bootstrap";
import { FocusEvent, useState } from "react";
import CheckboxGroup from "react-checkbox-group";

import LoadingWrapper from "./LoadingWrapper";
import Button from "./Button";

export type ModalFieldType = string | number | undefined | boolean;

interface Field<T, F> {
    type: string;
    label: string;
    getter: (t: T) => F;
    setter?: (t: T, newValue: F) => T;
}

export interface TextField<T> extends Field<T, string> {
    type: "text";
}

export interface NumberField<T> extends Field<T, number> {
    type: "number";
}

export interface BooleanField<T> extends Field<T, boolean> {
    type: "boolean";
}

export interface ComboboxField<T> extends Field<T, string> {
    type: "combobox";
    options: string[];
}

export interface CheckboxesGroupField<T> extends Field<T, string[]> {
    type: "checkboxesGroup";
    options: string[];
}

export type ModalField<T> =
    | TextField<T>
    | NumberField<T>
    | BooleanField<T>
    | ComboboxField<T>
    | CheckboxesGroupField<T>;

interface ModalProps<T> {
    t: T;
    fields: ModalField<T>[];
    getTitle: (t: T) => string;
    showModal: boolean;
    onCancel: () => void;
    onSave: (t: T) => void;
    isSaving: boolean;
    isSavingError: boolean;
    savingError: unknown; // TODO: change unknown ?
}

function Modal<T>({
    t,
    fields,
    getTitle,
    showModal,
    onCancel,
    onSave,
    isSaving,
    isSavingError,
    savingError,
}: ModalProps<T>) {
    const [dataChanged, setDataChanged] = useState(false);

    return (
        <ReactModal show={showModal} backdrop="static" onHide={onCancel} centered>
            <ReactModal.Header closeButton={true}>
                <ReactModal.Title>{getTitle(t)}</ReactModal.Title>
            </ReactModal.Header>
            <ReactModal.Body>
                <Form>
                    {fields.map((field) => {
                        switch (field.type) {
                            case "text":
                                return (
                                    <Form.Group as={Row}>
                                        <Form.Label column>{field.label}</Form.Label>
                                        <Col sm={9}>
                                            <Form.Control
                                                type="text"
                                                defaultValue={field.getter(t)}
                                                readOnly={field.setter === undefined}
                                                onChange={() => setDataChanged(true)}
                                                onBlur={(e: FocusEvent<HTMLInputElement>) => {
                                                    if (field.setter !== undefined) {
                                                        t = field.setter(t, e.target.value);
                                                    }
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                );
                                break;
                            case "number":
                                return (
                                    <Form.Group as={Row}>
                                        <Form.Label column>{field.label}</Form.Label>
                                        <Col sm={9}>
                                            <Form.Control
                                                type="number"
                                                defaultValue={field.getter(t)}
                                                readOnly={field.setter === undefined}
                                                onChange={() => setDataChanged(true)}
                                                onBlur={(e: FocusEvent<HTMLInputElement>) => {
                                                    if (field.setter !== undefined) {
                                                        t = field.setter(t, e.target.valueAsNumber);
                                                    }
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                );
                                break;
                            case "boolean":
                                return (
                                    <Form.Group as={Row}>
                                        <Col className="col-form-label">
                                            <Form.Check
                                                type="switch"
                                                label={field.label}
                                                defaultChecked={field.getter(t)}
                                                readOnly={field.setter === undefined}
                                                onChange={() => setDataChanged(true)}
                                                onBlur={(e: FocusEvent<HTMLInputElement>) => {
                                                    if (field.setter !== undefined) {
                                                        t = field.setter(t, e.target.checked);
                                                    }
                                                }}
                                            />
                                        </Col>
                                    </Form.Group>
                                );
                                break;
                            case "combobox":
                                return (
                                    <Form.Group as={Row}>
                                        <Form.Label column>{field.label}</Form.Label>
                                        <Col sm={9}>
                                            <Form.Select
                                                value={field.getter(t)}
                                                disabled={field.setter === undefined}
                                                onChange={(e) => {
                                                    if (field.setter !== undefined) {
                                                        setDataChanged(true);
                                                        t = field.setter(t, e.target.value);
                                                    }
                                                }}
                                            >
                                                {field.options.map((option: string) => (
                                                    <option value={option} key={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Col>
                                    </Form.Group>
                                );
                                break;
                            case "checkboxesGroup":
                                return (
                                    <Form.Group as={Row}>
                                        <Form.Label column>{field.label}</Form.Label>
                                        <Col sm={9}>
                                            <Container className="formControl">
                                                <CheckboxGroup
                                                    name={field.label}
                                                    key={field.label}
                                                    value={field.getter(t)}
                                                    onChange={(values) => {
                                                        if (field.setter !== undefined) {
                                                            setDataChanged(true);
                                                            t = field.setter(t, values);
                                                        }
                                                    }}
                                                >
                                                    {(Checkbox) => (
                                                        <>
                                                            {field.options.map((option: string) => (
                                                                <Checkbox
                                                                    key={option}
                                                                    value={option}
                                                                    disabled={
                                                                        field.setter === undefined
                                                                    }
                                                                />
                                                            ))}
                                                        </>
                                                    )}
                                                </CheckboxGroup>
                                            </Container>
                                        </Col>
                                    </Form.Group>
                                );
                                break;
                        }
                    })}
                </Form>
            </ReactModal.Body>
            <ReactModal.Footer>
                <Button label="Cancel" variant="dark" onClick={onCancel} />
                <Button
                    label="Save"
                    variant="success"
                    disabled={!dataChanged}
                    onClick={() => {
                        onSave(t);
                    }}
                />
                <LoadingWrapper isLoading={isSaving} isError={isSavingError} error={savingError} />
            </ReactModal.Footer>
        </ReactModal>
    );
}

export default Modal;
