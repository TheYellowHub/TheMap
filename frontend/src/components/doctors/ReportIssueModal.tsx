// TODO

import { Col, Row, Modal, Form } from "react-bootstrap";
import { useEffect, useRef, useState } from "react";

import LoadingWrapper from "../utils/LoadingWrapper";
import { ResponseError } from "../../hooks/useApiRequest";
import { TextField } from "../../utils/fields";
import useUser from "../../hooks/auth/useUsers";
import { UserInfo, userInfoFieldsMap } from "../../auth/userInfo";
import { User } from "@auth0/auth0-react";
import Button from "../utils/Button";
import InputFormField from "../utils/form/inputField";
import useFormValidation from "../../hooks/useFormValidation";
import { Doctor } from "../../types/doctors/doctor";
import DoctorSmallCard from "./doctors/DoctorSmallCard";

interface ReportIssueModalProps {
    doctor: Doctor;
    show: boolean;
    onHide: () => void;
}

export default function ReportIssueModal({ doctor, show, onHide }: ReportIssueModalProps) {
    // const { 
    //     userInfo: originalUserInfo, 
    //     mutateUsername, 
    //     isUsernameMutationLoading,
    //     isUsernameMutationSuccess,
    //     isUsernameMutationError,
    //     usernameMutationError, 
    // } = useUser(user);
    
    // const [userInfo, setUserInfo] = useState<UserInfo | undefined>();
    const [issueDescription, setIssueDescription] = useState<string>();

    const formRef = useRef<HTMLFormElement>(null);
    const { reportValidity, isFormValid } = useFormValidation(formRef);

    // useEffect(() => {
    //     setUserInfo({
    //         ...originalUserInfo, 
    //         username: originalUserInfo?.username ? originalUserInfo?.username : user?.nickname
    //     } as UserInfo);
    // }, [originalUserInfo]);

    // useEffect(() => {
    //     onHide();
    // }, [isUsernameMutationSuccess])

    return (        
        <Modal show={show} backdrop="static" onHide={onHide} className="user-modal modal-white" centered>
            <Modal.Header className="d-flex justify-content-center text-center xxl-font strong border-0"> 
                Reort an issue
            </Modal.Header>
            <Modal.Body className="pb-0 d-flex justify-content-center">
                <DoctorSmallCard doctor={doctor} onClick={undefined} />
            </Modal.Body>
            <Modal.Body>
                <Form ref={formRef}>
                    {/* <Row><Col className="text-center my-2"><strong>Set a public username</strong></Col></Row> */}
                    {/* <Row><Col className="text-center my-2">This will be the default name for your reviews and public comments</Col></Row> */}
                    <Row>
                        <Col className="d-flex justify-content-center my-3">
                            <Form.Control
                                type="textarea"
                                value={issueDescription}
                                onChange={(e) => setIssueDescription(e.target.value)}
                                required={true}
                                autoComplete="off"
                                // placeholder={placeHolder}
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
                                    // if (isFormValid() && userInfo?.username !== originalUserInfo?.username) {
                                    //     mutateUsername(userInfo!.username!);
                                    // }
                                }}
                                className="w-max-content"
                            />
                        </Col>
                    </Row>
                    <Row>
                        {/* <LoadingWrapper
                            isLoading={isUsernameMutationLoading}
                            isError={isUsernameMutationError}
                            error={usernameMutationError as ResponseError}
                            loaderSize={20}
                            loaderText="Submitting..."
                        /> */}
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
