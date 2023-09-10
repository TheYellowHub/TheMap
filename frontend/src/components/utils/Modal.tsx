import { Col, Form, Modal as ReactModal, Row } from "react-bootstrap";
import { useState } from "react";

import LoadingWrapper from "./LoadingWrapper";
import Button from "./Button";

export type ModalFieldType = string | number | undefined | boolean;

// TODO: support comboboxes and multiple checkboxes & maybe split to different types of fields

interface EditableModalField<T> {
    label: string;
    getter: (t: T) => ModalFieldType;
    setter: (t: T, newValue: ModalFieldType) => T;
    readonly: false;
}

interface ReadonlyModalField<T> {
    label: string;
    getter: (t: T) => ModalFieldType;
    setter: undefined;
    readonly: true;
}

export type ModalField<T> = EditableModalField<T> | ReadonlyModalField<T>;

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
                        const currentValue = field.getter(t);
                        switch (typeof currentValue) {
                            case "string":
                            case "number":
                            case "undefined":
                                return (
                                    <Form.Group as={Row}>
                                        <Form.Label column>{field.label}</Form.Label>
                                        <Col sm={9}>
                                            <Form.Control
                                                type={
                                                    typeof currentValue === "string"
                                                        ? "text"
                                                        : "number"
                                                }
                                                defaultValue={currentValue}
                                                readOnly={field.readonly}
                                                onChange={() => setDataChanged(true)}
                                                onBlur={(e) => {
                                                    if (field.setter !== undefined) {
                                                        t = field.setter(t, e.target.value);
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
                                                defaultChecked={currentValue}
                                                readOnly={field.readonly}
                                                onChange={() => setDataChanged(true)}
                                                onBlur={(e) => {
                                                    if (field.setter !== undefined) {
                                                        t = field.setter(t, e.target.value);
                                                    }
                                                }}
                                            />
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
