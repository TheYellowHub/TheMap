import { Col, Form, Modal as ReactModal, Row } from "react-bootstrap";
import { ReactNode, useState } from "react";

import LoadingWrapper from "./LoadingWrapper";
import Button from "./Button";
import { ListField, ModalField } from "../../types/fields";
import TextFormField from "./form/textField";
import UrlFormField from "./form/urlField";
import NumberFormField from "./form/numberField";
import DateTimeFormField from "./form/datetimeField";
import BooleanFormField from "./form/booleanField";
import CheckboxesGroupFormField from "./form/checkboxesGroupField";
import ComboboxFormField from "./form/comboboxField";
import Icon from "./Icon";
import FileFormField from "./form/fileField";

interface ModalProps<T> {
    t: T;
    fields: (ModalField<T> | ListField<T, any>)[]; // TODO: change any ?
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
    const [dataObject, setDataObject] = useState({ ...t });

    // TODO: stylish evalidaition error messages

    function fieldToComponent<O>(
        field: ModalField<O>,
        object: O,
        wrapAsFormRow: boolean = true,
        onChange: (newObject: O) => void
    ): ReactNode {
        if (field.setter === undefined && field.getter(object) === undefined) {
            return <></>;
        }

        const reacteNodeWrapperSingleColumn = (reacteNode: ReactNode, wrap: boolean = true) => {
            if (wrap) {
                return (
                    <Form.Group as={Row}>
                        <Col className="col-form-label">{reacteNode}</Col>
                    </Form.Group>
                );
            } else {
                return reacteNode;
            }
        };

        const reacteNodeWrapperTwoColumns = (reacteNode: ReactNode, wrap: boolean = true) => {
            if (wrap) {
                return (
                    <Form.Group as={Row}>
                        <Form.Label column>{field.label}</Form.Label>
                        <Col sm={9}>{reacteNode}</Col>
                    </Form.Group>
                );
            } else {
                return reacteNode;
            }
        };

        switch (field.type) {
            case "text":
                return reacteNodeWrapperTwoColumns(
                    <TextFormField<O> field={field} object={object} onChange={onChange} />,
                    wrapAsFormRow
                );
                break;
            case "url":
                return reacteNodeWrapperTwoColumns(
                    <UrlFormField<O> field={field} object={object} onChange={onChange} />,
                    wrapAsFormRow
                );
                break;
            case "number":
                return reacteNodeWrapperTwoColumns(
                    <NumberFormField<O> field={field} object={object} onChange={onChange} />,
                    wrapAsFormRow
                );
                break;
            case "datetime":
                return reacteNodeWrapperTwoColumns(
                    <DateTimeFormField<O> field={field} object={object} onChange={onChange} />,
                    wrapAsFormRow
                );
                break;
            case "boolean":
                return reacteNodeWrapperSingleColumn(
                    <BooleanFormField<O> field={field} object={object} onChange={onChange} withLabel={wrapAsFormRow} />,
                    wrapAsFormRow
                );
                break;
            case "combobox":
                return reacteNodeWrapperTwoColumns(
                    <ComboboxFormField<O> field={field} object={object} onChange={onChange} />,
                    wrapAsFormRow
                );
                break;
            case "checkboxesGroup":
                return reacteNodeWrapperTwoColumns(
                    <CheckboxesGroupFormField<O> field={field} object={object} onChange={onChange} />,
                    wrapAsFormRow
                );
                break;
            case "file":
                return reacteNodeWrapperTwoColumns(
                    <FileFormField<O> field={field} object={object} onChange={onChange} />,
                    wrapAsFormRow
                );
                break;
        }
    }

    return (
        <ReactModal show={showModal} backdrop="static" onHide={onCancel} centered>
            <Form
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.currentTarget.checkValidity() === true) {
                        onSave(dataObject);
                    }
                }}
            >
                <ReactModal.Header closeButton={true}>
                    <ReactModal.Title>{getTitle(dataObject)}</ReactModal.Title>
                </ReactModal.Header>
                <ReactModal.Body>
                    {fields.map((field) => {
                        if (field.type === "list") {
                            const records = [...field.getter(dataObject)];
                            const emptyLastRecord = field.newRecordProvider !== undefined;
                            if (emptyLastRecord) {
                                records.push(field.newRecordProvider!());
                            }
                            return (
                                <Form.Group as={Row} key={field.label}>
                                    <Form.Label column>{field.label}</Form.Label>
                                    <Col sm={9}>
                                        <table className="formTable table">
                                            <thead>
                                                <tr>
                                                    {field.fields.map((field) => (
                                                        <th key={`${field.label}-th`}>{field.label}</th>
                                                    ))}
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {records.map((record, index) => (
                                                    <tr key={`${field.label}-${index}`}>
                                                        {field.fields.map((subfield) => (
                                                            <td key={`${subfield.label}-${index}`}>
                                                                {fieldToComponent(
                                                                    subfield,
                                                                    record,
                                                                    false,
                                                                    (newElement) => {
                                                                        if (field.setter !== undefined) {
                                                                            const listBefore = field.getter(dataObject);
                                                                            setDataChanged(true);
                                                                            setDataObject(
                                                                                field.setter(
                                                                                    dataObject,
                                                                                    emptyLastRecord &&
                                                                                        index + 1 === records.length
                                                                                        ? [...listBefore, newElement]
                                                                                        : [
                                                                                              ...listBefore.slice(
                                                                                                  0,
                                                                                                  index
                                                                                              ),
                                                                                              newElement,
                                                                                              ...listBefore.slice(
                                                                                                  index + 1
                                                                                              ),
                                                                                          ]
                                                                                )
                                                                            );
                                                                        }
                                                                    }
                                                                )}
                                                            </td>
                                                        ))}
                                                        <td>
                                                            {emptyLastRecord && index + 1 === records.length ? (
                                                                <></>
                                                            ) : (
                                                                <Icon
                                                                    icon="fa-trash"
                                                                    onClick={() => {
                                                                        if (field.setter !== undefined) {
                                                                            const listBefore = field.getter(dataObject);
                                                                            setDataChanged(true);
                                                                            setDataObject(
                                                                                field.setter(dataObject, [
                                                                                    ...listBefore.slice(0, index),
                                                                                    ...listBefore.slice(index + 1),
                                                                                ])
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </Col>
                                </Form.Group>
                            );
                        } else {
                            return fieldToComponent<T>(field, dataObject, true, (newObject) => {
                                setDataChanged(true);
                                setDataObject(newObject);
                            });
                        }
                    })}
                </ReactModal.Body>
                <ReactModal.Footer>
                    <Button label="Cancel" variant="dark" onClick={onCancel} />
                    <Button type="submit" label="Save" variant="success" disabled={!dataChanged} />
                    <LoadingWrapper isLoading={isSaving} isError={isSavingError} error={savingError} />
                </ReactModal.Footer>
            </Form>
        </ReactModal>
    );
}

export default Modal;
