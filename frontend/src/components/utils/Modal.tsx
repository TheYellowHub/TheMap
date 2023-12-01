import { Col, Form, Modal as ReactModal, Row } from "react-bootstrap";
import { ReactNode, useState } from "react";

import LoadingWrapper from "./LoadingWrapper";
import Button from "./Button";
import { ListField, ModalField } from "../../utils/fields";
import InputFormField from "./form/inputField";
import DateTimeFormField from "./form/datetimeField";
import BooleanFormField from "./form/booleanField";
import SingleSelectField from "./form/singleSelectField";
import Icon from "./Icon";
import ImageFormField from "./form/imageField";
import { ResponseError } from "../../hooks/useApiRequest";
import AddressInputFormField from "./form/addressField";
import MultiSelectField from "./form/multiSelectFormField";

interface ModalProps<T> extends React.PropsWithChildren {
    t: T;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fields: (ModalField<T> | ListField<T, any>)[];
    getTitle: (t: T) => string;
    showModal: boolean;
    onCancel: () => void;
    onSave: (t: T) => void;
    isSaving: boolean;
    isSavingError: boolean;
    savingError: ResponseError;
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
    children,
}: ModalProps<T>) {
    const [dataChanged, setDataChanged] = useState(false);
    const [dataObject, setDataObject] = useState({ ...t });

    // TODO: stylish validaition error messages

    function fieldToComponent<O>(
        field: ModalField<O>,
        object: O,
        wrapAsFormRow: boolean = true,
        onChange: (newObject: O) => void,
        index?: number
    ): ReactNode {
        const fieldOrConstLabel = (field: ModalField<O>, reacteNode: ReactNode) => {
            if (field.setter === undefined && (field.getter(object) === undefined || field.type === "number")) {
                return <p className="form-label">{field.getter(object) as string}</p>;
            } else {
                return reacteNode;
            }
        };

        const reacteNodeWrapper = (reacteNode: ReactNode, key: string, wrap: boolean = true) => {
            if (wrap) {
                return (
                    <Form.Group as={Row} key={key}>
                        <Form.Label column htmlFor={field.label}>
                            {field.label}
                        </Form.Label>
                        <Col sm={10} className="d-flex align-items-center">
                            {fieldOrConstLabel(field, reacteNode)}
                        </Col>
                    </Form.Group>
                );
            } else {
                return fieldOrConstLabel(field, reacteNode);
            }
        };

        if (index !== undefined) {
            field = { ...field, label: `${field.label}-${index}` };
        }

        switch (field.type) {
            case "text":
            case "url":
            case "email":
            case "tel":
                return reacteNodeWrapper(
                    <InputFormField<O> field={field} object={object} onChange={onChange} />,
                    field.label,
                    wrapAsFormRow
                );
                break;
            case "number":
                return reacteNodeWrapper(
                    <InputFormField<O> field={field} object={object} onChange={onChange} />,
                    field.label,
                    wrapAsFormRow
                );
                break;
            case "address":
                return reacteNodeWrapper(
                    <AddressInputFormField<O> field={field} object={object} onChange={onChange} />,
                    field.label,
                    wrapAsFormRow
                );
                break;
            case "datetime":
                return field.setter || field.getter(object) ? (
                    reacteNodeWrapper(
                        <DateTimeFormField<O> field={field} object={object} onChange={onChange} />,
                        field.label,
                        wrapAsFormRow
                    )
                ) : (
                    <></>
                );
                break;
            case "boolean":
                return reacteNodeWrapper(
                    <BooleanFormField<O> field={field} object={object} onChange={onChange} withLabel={false} />,
                    field.label,
                    wrapAsFormRow
                );
                break;
            case "singleSelect":
                return reacteNodeWrapper(
                    <SingleSelectField<O>
                        field={field}
                        object={object}
                        onChange={onChange}
                        allowEmptySelection={!field.required}
                    />,
                    field.label,
                    wrapAsFormRow
                );
                break;
            case "multiSelect":
                return reacteNodeWrapper(
                    <MultiSelectField<O> field={field} object={object} onChange={onChange} />,
                    field.label,
                    wrapAsFormRow
                );
                break;
            case "image":
                return reacteNodeWrapper(
                    <ImageFormField<O> field={field} object={object} onChange={onChange} />,
                    field.label,
                    wrapAsFormRow
                );
                break;
        }
    }

    return (
        <ReactModal key={getTitle(t)} show={showModal} backdrop="static" onHide={onCancel} centered>
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
                <ReactModal.Body>{children}</ReactModal.Body>
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
                                    <Col sm={10}>
                                        <table className="formTable text-nowrap">
                                            {1 < field.fields.length && (
                                                <thead>
                                                    <tr>
                                                        {field.fields.map((field) => (
                                                            <th key={`${field.label}-th`}>{field.label}</th>
                                                        ))}
                                                        <th></th>
                                                    </tr>
                                                </thead>
                                            )}
                                            <tbody>
                                                {records.map((record, index) => (
                                                    <tr key={`${field.label}-${index}`}>
                                                        {field.fields.map((subfield) => (
                                                            <td
                                                                key={`${subfield.label}-${index}-${subfield.getter(
                                                                    record
                                                                )}`}
                                                                className="px-0 py-0"
                                                            >
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
                                                                    },
                                                                    index
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
                    <Button type="button" label="Cancel" variant="secondary" onClick={onCancel} />
                    <Button type="submit" label="Save" variant="primary" disabled={!dataChanged} />
                    <LoadingWrapper
                        isLoading={isSaving}
                        isError={isSavingError}
                        error={savingError}
                        errorClassName=""
                    />
                </ReactModal.Footer>
            </Form>
        </ReactModal>
    );
}

export default Modal;
