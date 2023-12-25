import { Col, Row, Modal, Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

import LoadingWrapper from "../utils/LoadingWrapper";
import { ResponseError } from "../../hooks/useApiRequest";
import useUser from "../../hooks/auth/useUsers";
import Button from "../utils/Button";
import useFormValidation from "../../hooks/useFormValidation";
import { Doctor } from "../../types/doctors/doctor";
import DoctorSmallCard from "../doctors/doctors/DoctorSmallCard";
import { useIssues } from "../../hooks/doctors/useIssues";
import { getNewIssue } from "../../types/doctors/issue";

interface ReportIssueModalProps {
    doctor: Doctor;
    show: boolean;
    onHide: () => void;
}

export default function ReportIssueModal({ doctor, show, onHide }: ReportIssueModalProps) {
    const { userInfo } = useUser();

    const { 
        mutateItem, 
        isMutateLoading,
        isMutateSuccess,
        isMutateError,
        mutateError, 
    } = useIssues();
    
    const [issueDescription, setIssueDescription] = useState<string>();

    const formRef = useRef<HTMLFormElement>(null);
    const { reportValidity, isFormValid } = useFormValidation(formRef);

    useEffect(() => {
        onHide();
    }, [isMutateSuccess]);

    return (        
        <Modal show={show} backdrop="static" onHide={onHide} className="user-modal modal-white" centered>
            <Modal.Header className="d-flex justify-content-center text-center xxl-font strong border-0"> 
                Report an issue
            </Modal.Header>
            <Modal.Body className="pb-0 d-flex justify-content-center">
                <DoctorSmallCard doctor={doctor} onClick={undefined} />
            </Modal.Body>
            <Modal.Body>
                <Form ref={formRef}>
                    <Row>
                        <Col className="d-flex justify-content-center my-3">
                            <Form.Control
                                as={"textarea"}
                                value={issueDescription}
                                onChange={(e) => setIssueDescription(e.target.value)}
                                required={true}
                                autoComplete="off"
                                placeholder={`Address change? Provider retired? Should this provider be removed?\nLet us know in detail`}
                                className="blue-border round-border textarea"
                            />
                        </Col>
                    </Row>
                    <Row className="d-flex justify-content-center gap-3 mt-3">
                        <Col className="m-0 p-0 d-flex flex-grow-0 justify-content-center">
                            <Button
                                variant="secondary"
                                label="Cancel"
                                type="button"
                                onClick={onHide}
                                className="w-max-content"
                            />
                        </Col>
                        <Col className="m-0 p-0 d-flex flex-grow-0 justify-content-center">
                            <Button
                                variant="primary"
                                label="Save"
                                type="button"
                                onClick={() => {
                                    reportValidity();
                                    if (isFormValid()) {
                                        mutateItem({...getNewIssue(doctor, userInfo!), description: issueDescription});
                                    }
                                }}
                                className="w-max-content"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <LoadingWrapper
                            isLoading={isMutateLoading}
                            isError={isMutateError}
                            error={mutateError as ResponseError}
                            loaderSize={20}
                            loaderText="Submitting..."
                        />
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
